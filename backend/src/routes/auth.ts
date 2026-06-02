import { Router } from 'express'
import { db } from '../db/client'
import { profiles } from '../db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { supabaseAdmin as supabase } from '../lib/supabaseAdmin'

export const authRouter = Router()

// GET /api/auth/lookup?username=foo  (public — used for username login)
authRouter.get('/lookup', async (req, res) => {
  const username = (req.query.username as string)?.trim()
  if (!username) { res.status(400).json({ error: 'username required' }); return }

  const rows = await db.select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.username, username))
    .limit(1)

  if (!rows.length) { res.status(404).json({ error: 'User not found' }); return }

  const { data, error } = await supabase.auth.admin.getUserById(rows[0].id)
  if (error || !data.user?.email) { res.status(404).json({ error: 'User not found' }); return }

  res.json({ email: data.user.email })
})

// GET /api/auth/profile  — return current user's profile
authRouter.get('/profile', requireAuth, async (req: AuthRequest, res) => {
  const rows = await db.select().from(profiles)
    .where(eq(profiles.id, req.userId!))
    .limit(1)

  if (!rows.length) { res.status(404).json({ error: 'Profile not found' }); return }
  res.json(rows[0])
})

// PATCH /api/auth/profile  — update username
authRouter.patch('/profile', requireAuth, async (req: AuthRequest, res) => {
  const { username } = req.body as { username?: string }
  if (!username?.trim()) { res.status(400).json({ error: 'username required' }); return }
  if (username.includes('@')) { res.status(400).json({ error: 'Username cannot contain @' }); return }

  // Check uniqueness
  const existing = await db.select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.username, username.trim()))
    .limit(1)
  if (existing.length && existing[0].id !== req.userId) {
    res.status(409).json({ error: 'Username already taken' }); return
  }

  await db.update(profiles)
    .set({ username: username.trim() })
    .where(eq(profiles.id, req.userId!))

  res.json({ ok: true, username: username.trim() })
})
