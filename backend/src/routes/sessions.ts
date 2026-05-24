import { Router } from 'express'
import { db } from '../db/client'
import { sessions, messages, problems, profiles } from '../db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { requireAuth, AuthRequest } from '../middleware/auth'

async function ensureProfile(userId: string) {
  await db.insert(profiles).values({ id: userId }).onConflictDoNothing()
}

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

  await ensureProfile(req.userId!)

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

const PISTON_LANGUAGES: Record<string, { language: string; version: string }> = {
  python:     { language: 'python',     version: '3.10.0' },
  javascript: { language: 'javascript', version: '18.15.0' },
  java:       { language: 'java',       version: '15.0.2' },
}

// POST /api/sessions/:id/run — execute code via Piston
sessionsRouter.post('/:id/run', async (req: AuthRequest, res) => {
  const { code, language = 'python' } = req.body as { code: string; language?: string }

  if (!code) {
    res.status(400).json({ error: 'code required' })
    return
  }

  const lang = PISTON_LANGUAGES[language]
  if (!lang) {
    res.status(400).json({ error: `Unsupported language: ${language}` })
    return
  }

  // Verify session belongs to user
  const session = await db.select().from(sessions)
    .where(and(eq(sessions.id, req.params.id), eq(sessions.userId, req.userId!)))
    .limit(1)
  if (!session.length) {
    res.status(404).json({ error: 'Session not found' })
    return
  }

  const pistonRes = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: lang.language,
      version: lang.version,
      files: [{ content: code }],
    }),
  })

  if (!pistonRes.ok) {
    res.status(502).json({ error: 'Code execution service unavailable' })
    return
  }

  const result = await pistonRes.json() as {
    run: { stdout: string; stderr: string; code: number }
  }

  res.json({
    stdout: result.run.stdout,
    stderr: result.run.stderr,
    exitCode: result.run.code,
  })
})
