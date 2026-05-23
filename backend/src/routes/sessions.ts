import { Router } from 'express'
import { db } from '../db/client'
import { sessions, messages, problems } from '../db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { requireAuth, AuthRequest } from '../middleware/auth'

export const sessionsRouter = Router()
sessionsRouter.use(requireAuth)

// GET /api/sessions — list active sessions for the user
sessionsRouter.get('/', async (req: AuthRequest, res) => {
  const rows = await db.select().from(sessions)
    .where(eq(sessions.userId, req.userId!))
    .orderBy(desc(sessions.startedAt))
  res.json(rows)
})

// POST /api/sessions — start or resume a session for a problem
sessionsRouter.post('/', async (req: AuthRequest, res) => {
  const { problemId } = req.body as { problemId: number }
  if (!problemId) {
    res.status(400).json({ error: 'problemId required' })
    return
  }

  const existing = await db.select().from(sessions)
    .where(and(
      eq(sessions.userId, req.userId!),
      eq(sessions.problemId, problemId),
      eq(sessions.status, 'active'),
    )).limit(1)

  if (existing.length) {
    res.json(existing[0])
    return
  }

  const problem = await db.select().from(problems).where(eq(problems.id, problemId)).limit(1)
  if (!problem.length) {
    res.status(404).json({ error: 'Problem not found' })
    return
  }

  const [session] = await db.insert(sessions).values({
    userId: req.userId!,
    problemId,
    currentCode: problem[0].starterCode,
  }).returning()

  res.status(201).json(session)
})

// GET /api/sessions/:id — get session with messages
sessionsRouter.get('/:id', async (req: AuthRequest, res) => {
  const session = await db.select().from(sessions)
    .where(and(eq(sessions.id, req.params.id), eq(sessions.userId, req.userId!)))
    .limit(1)

  if (!session.length) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  const msgs = await db.select().from(messages)
    .where(eq(messages.sessionId, req.params.id))
    .orderBy(messages.createdAt)

  res.json({ ...session[0], messages: msgs })
})

// PATCH /api/sessions/:id/code — save current editor code
sessionsRouter.patch('/:id/code', async (req: AuthRequest, res) => {
  const { code } = req.body as { code: string }
  await db.update(sessions)
    .set({ currentCode: code })
    .where(and(eq(sessions.id, req.params.id), eq(sessions.userId, req.userId!)))
  res.json({ ok: true })
})

// POST /api/sessions/:id/complete — mark session completed
sessionsRouter.post('/:id/complete', async (req: AuthRequest, res) => {
  await db.update(sessions)
    .set({ status: 'completed', endedAt: new Date() })
    .where(and(eq(sessions.id, req.params.id), eq(sessions.userId, req.userId!)))
  res.json({ ok: true })
})
