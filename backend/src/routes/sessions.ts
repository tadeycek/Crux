import { Router } from 'express'
import { db } from '../db/client'
import { sessions, messages, problems, profiles } from '../db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { supabaseAdmin } from '../lib/supabaseAdmin'
import { getTestRunnerCode } from '../testRunners'
import rateLimit from 'express-rate-limit'

const runLimiter = rateLimit({
  windowMs: 60_000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many run requests — wait a minute.' },
  keyGenerator: (req) => (req as AuthRequest).userId ?? req.ip ?? 'unknown',
})

async function ensureProfile(userId: string) {
  const { data } = await supabaseAdmin.auth.admin.getUserById(userId)
  const username = (data?.user?.user_metadata?.username as string | undefined) ?? null
  await db.insert(profiles)
    .values({ id: userId, username })
    .onConflictDoNothing()
}

export const sessionsRouter = Router()
sessionsRouter.use(requireAuth)

sessionsRouter.get('/', async (req: AuthRequest, res) => {
  const rows = await db.select().from(sessions)
    .where(eq(sessions.userId, req.userId!))
    .orderBy(desc(sessions.startedAt))
  res.json(rows)
})

sessionsRouter.post('/', async (req: AuthRequest, res) => {
  const { problemId } = req.body as { problemId: number }
  if (!problemId) { res.status(400).json({ error: 'problemId required' }); return }

  await ensureProfile(req.userId!)

  const existing = await db.select().from(sessions)
    .where(and(eq(sessions.userId, req.userId!), eq(sessions.problemId, problemId), eq(sessions.status, 'active')))
    .limit(1)
  if (existing.length) { res.json(existing[0]); return }

  const problem = await db.select().from(problems).where(eq(problems.id, problemId)).limit(1)
  if (!problem.length) { res.status(404).json({ error: 'Problem not found' }); return }

  const [session] = await db.insert(sessions)
    .values({ userId: req.userId!, problemId, currentCode: problem[0].starterCode })
    .returning()
  res.status(201).json(session)
})

sessionsRouter.get('/:id', async (req: AuthRequest, res) => {
  const session = await db.select().from(sessions)
    .where(and(eq(sessions.id, req.params.id as string), eq(sessions.userId, req.userId!)))
    .limit(1)
  if (!session.length) { res.status(404).json({ error: 'Not found' }); return }

  const msgs = await db.select().from(messages)
    .where(eq(messages.sessionId, req.params.id as string))
    .orderBy(messages.createdAt)
  res.json({ ...session[0], messages: msgs })
})

sessionsRouter.patch('/:id/code', async (req: AuthRequest, res) => {
  const { code } = req.body as { code: string }
  if (typeof code !== 'string' || code.length > 100_000) {
    res.status(400).json({ error: 'Code exceeds maximum allowed size' }); return
  }
  await db.update(sessions)
    .set({ currentCode: code })
    .where(and(eq(sessions.id, req.params.id as string), eq(sessions.userId, req.userId!)))
  res.json({ ok: true })
})

sessionsRouter.post('/:id/complete', async (req: AuthRequest, res) => {
  await db.update(sessions)
    .set({ status: 'completed', endedAt: new Date() })
    .where(and(eq(sessions.id, req.params.id as string), eq(sessions.userId, req.userId!)))
  res.json({ ok: true })
})

// ─── Code execution ────────────────────────────────────────────────────────────

const PISTON_LANGUAGES: Record<string, { language: string; version: string }> = {
  python:     { language: 'python',     version: '3.10.0' },
  javascript: { language: 'javascript', version: '18.15.0' },
  java:       { language: 'java',       version: '15.0.2' },
  cpp:        { language: 'c++',        version: '10.2.0' },
}

// POST /api/sessions/:id/run — execute code
sessionsRouter.post('/:id/run', runLimiter, async (req: AuthRequest, res) => {
  const { code, language = 'python' } = req.body as { code: string; language?: string }

  if (!code) { res.status(400).json({ error: 'code required' }); return }
  if (typeof code !== 'string' || code.length > 100_000) {
    res.status(400).json({ error: 'Code exceeds maximum allowed size' }); return
  }

  const lang = PISTON_LANGUAGES[language]
  if (!lang) { res.status(400).json({ error: `Unsupported language: ${language}` }); return }

  // Fetch session and problem upfront so test runner is available for all paths
  const session = await db.select().from(sessions)
    .where(and(eq(sessions.id, req.params.id as string), eq(sessions.userId, req.userId!)))
    .limit(1)
  if (!session.length) { res.status(404).json({ error: 'Session not found' }); return }

  const problem = await db.select().from(problems)
    .where(eq(problems.id, session[0].problemId))
    .limit(1)
  const problemSlug = problem.length ? problem[0].slug : ''
  const problemTitle = problem.length ? problem[0].title : 'Unknown Problem'

  const runner = getTestRunnerCode(problemSlug, language)
  const fullCode = runner ? code + '\n' + runner : code

  let stdout = ''
  let stderr = 'Code execution service is temporarily unavailable. Please try again in a moment.'
  let exitCode = 1

  try {
    const pistonAbort = new AbortController()
    const pistonTimeout = setTimeout(() => pistonAbort.abort(), 15_000)
    const pistonRes = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: pistonAbort.signal,
      body: JSON.stringify({
        language: lang.language,
        version: lang.version,
        files: [{ content: fullCode }],
      }),
    })
    clearTimeout(pistonTimeout)

    if (pistonRes.ok) {
      const result = await pistonRes.json() as {
        run: { stdout: string; stderr: string; code: number }
      }
      stdout = result.run.stdout
      stderr = result.run.stderr
      exitCode = result.run.code
    }
  } catch (err) {
    console.error('Piston API error:', err)
  }

  res.json({ stdout, stderr, exitCode })
})
