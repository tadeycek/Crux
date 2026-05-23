import { Router } from 'express'
import { db } from '../db/client'
import { sessions, messages, problems } from '../db/schema'
import { eq, and, asc } from 'drizzle-orm'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { getAIResponse } from '../services/ai'
import { z } from 'zod'

export const chatRouter = Router()
chatRouter.use(requireAuth)

const sendSchema = z.object({
  content: z.string().min(1).max(4000),
})

// POST /api/chat/:sessionId — send a message and get AI reply
chatRouter.post('/:sessionId', async (req: AuthRequest, res) => {
  const parsed = sendSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request' })
    return
  }

  const session = await db.select().from(sessions)
    .where(and(eq(sessions.id, req.params.sessionId), eq(sessions.userId, req.userId!)))
    .limit(1)

  if (!session.length) {
    res.status(404).json({ error: 'Session not found' })
    return
  }

  if (session[0].status !== 'active') {
    res.status(400).json({ error: 'Session is not active' })
    return
  }

  const problem = await db.select().from(problems).where(eq(problems.id, session[0].problemId)).limit(1)

  // Save user message
  const [userMsg] = await db.insert(messages).values({
    sessionId: req.params.sessionId,
    role: 'user',
    content: parsed.data.content,
  }).returning()

  // Build history for AI (last 20 messages for context window)
  const history = await db.select().from(messages)
    .where(eq(messages.sessionId, req.params.sessionId))
    .orderBy(asc(messages.createdAt))
    .limit(20)

  const aiHistory = history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  const aiContent = await getAIResponse(
    aiHistory,
    problem[0].title,
    problem[0].description,
    session[0].currentCode,
  )

  const [assistantMsg] = await db.insert(messages).values({
    sessionId: req.params.sessionId,
    role: 'assistant',
    content: aiContent,
  }).returning()

  res.json({ userMessage: userMsg, assistantMessage: assistantMsg })
})
