import { Router } from 'express'
import { db } from '../db/client'
import { conceptProgress } from '../db/schema'
import { eq, and } from 'drizzle-orm'
import { requireAuth, AuthRequest } from '../middleware/auth'

export const conceptsRouter = Router()
conceptsRouter.use(requireAuth)

// GET /api/concepts/progress
conceptsRouter.get('/progress', async (req: AuthRequest, res) => {
  const rows = await db.select().from(conceptProgress)
    .where(eq(conceptProgress.userId, req.userId!))
  const result: Record<string, string> = {}
  for (const row of rows) {
    result[row.conceptSlug] = row.status
  }
  res.json(result)
})

// POST /api/concepts/progress/:slug
conceptsRouter.post('/progress/:slug', async (req: AuthRequest, res) => {
  const { status } = req.body as { status: string }
  const slug = String(req.params.slug)

  if (!slug) { res.status(400).json({ error: 'slug required' }); return }
  if (!['completed', 'in-progress'].includes(status)) {
    res.status(400).json({ error: 'status must be "completed" or "in-progress"' }); return
  }

  // Delete-then-insert avoids composite-key upsert type complexity
  await db.delete(conceptProgress).where(and(
    eq(conceptProgress.userId, req.userId!),
    eq(conceptProgress.conceptSlug, slug),
  ))
  await db.insert(conceptProgress).values({
    userId: req.userId!,
    conceptSlug: slug,
    status,
    updatedAt: new Date(),
  })

  res.json({ ok: true })
})

// DELETE /api/concepts/progress/:slug
conceptsRouter.delete('/progress/:slug', async (req: AuthRequest, res) => {
  const slug = String(req.params.slug)
  await db.delete(conceptProgress).where(and(
    eq(conceptProgress.userId, req.userId!),
    eq(conceptProgress.conceptSlug, slug),
  ))
  res.json({ ok: true })
})
