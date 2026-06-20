import { Router } from 'express'
import { db } from '../db/client'
import { sessions, messages, problems, profiles } from '../db/schema'
import { eq, and, asc, count, lt, sql } from 'drizzle-orm'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { getAIResponse } from '../services/ai'
import { z } from 'zod'
import rateLimit from 'express-rate-limit'

export const chatRouter = Router()
chatRouter.use(requireAuth)

const chatLimiter = rateLimit({
  windowMs: 5 * 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages — wait a few minutes.' },
  keyGenerator: (req) => (req as AuthRequest).userId ?? req.ip ?? 'unknown',
})

const MAX_MESSAGES_PER_SESSION = 150
const FREE_DAILY_LIMIT = 10

const sendSchema = z.object({
  content: z.string().min(1).max(4000),
  mode: z.enum(['Socratic', 'Hint', 'Review']).optional().default('Socratic'),
  language: z.string().optional().default('python'),
})

chatRouter.post('/:sessionId', chatLimiter, async (req: AuthRequest, res) => {
  const parsed = sendSchema.safeParse(req.body)
  if (!parsed.success) { res.status(400).json({ error: 'Invalid request' }); return }

  const session = await db.select().from(sessions)
    .where(and(eq(sessions.id, req.params.sessionId as string), eq(sessions.userId, req.userId!)))
    .limit(1)
  if (!session.length) { res.status(404).json({ error: 'Session not found' }); return }
  if (session[0].status !== 'active') { res.status(400).json({ error: 'Session is not active' }); return }

  // ── Daily AI message limit for free users ──────────────────────────────────
  const profile = await db.select().from(profiles).where(eq(profiles.id, req.userId!)).limit(1)
  if (!profile.length) { res.status(404).json({ error: 'Profile not found' }); return }

  const p = profile[0]
  const isPro = p.subscriptionStatus === 'pro'

  if (!isPro) {
    const now = new Date()
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    const resetAt = new Date(p.aiMessagesResetAt)

    // Reset stale counter first (non-atomic is safe here — worst case is a redundant reset)
    if (resetAt < todayUTC) {
      await db.update(profiles)
        .set({ aiMessagesToday: 0, aiMessagesResetAt: todayUTC })
        .where(eq(profiles.id, req.userId!))
    }

    // Atomic increment — only succeeds if still below the limit after the reset above
    const incremented = await db.update(profiles)
      .set({ aiMessagesToday: sql`${profiles.aiMessagesToday} + 1` })
      .where(and(eq(profiles.id, req.userId!), lt(profiles.aiMessagesToday, FREE_DAILY_LIMIT)))
      .returning({ used: profiles.aiMessagesToday })

    if (!incremented.length) {
      const current = await db.select({ used: profiles.aiMessagesToday }).from(profiles).where(eq(profiles.id, req.userId!)).limit(1)
      res.status(429).json({
        error: `Daily limit of ${FREE_DAILY_LIMIT} AI messages reached. Upgrade to Pro for unlimited access.`,
        code: 'AI_LIMIT_REACHED',
        limit: FREE_DAILY_LIMIT,
        used: current[0]?.used ?? FREE_DAILY_LIMIT,
      })
      return
    }
  }

  // ── Per-session message cap ────────────────────────────────────────────────
  const [{ value: msgCount }] = await db.select({ value: count() })
    .from(messages)
    .where(eq(messages.sessionId, req.params.sessionId as string))
  if (msgCount >= MAX_MESSAGES_PER_SESSION) {
    res.status(429).json({ error: 'Message limit reached for this session.' }); return
  }

  const problem = await db.select().from(problems).where(eq(problems.id, session[0].problemId)).limit(1)

  const [userMsg] = await db.insert(messages).values({
    sessionId: req.params.sessionId as string,
    role: 'user',
    content: parsed.data.content,
  }).returning()

  const history = await db.select().from(messages)
    .where(eq(messages.sessionId, req.params.sessionId as string))
    .orderBy(asc(messages.createdAt))
    .limit(20)

  const aiHistory = history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  const aiContent = await getAIResponse(
    aiHistory,
    problem[0].title,
    problem[0].description,
    session[0].currentCode,
    parsed.data.mode,
    parsed.data.language,
  )

  const [assistantMsg] = await db.insert(messages).values({
    sessionId: req.params.sessionId as string,
    role: 'assistant',
    content: aiContent,
  }).returning()

  res.json({ userMessage: userMsg, assistantMessage: assistantMsg })
})
