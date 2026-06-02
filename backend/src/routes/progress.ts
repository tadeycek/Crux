import { Router } from 'express'
import { db } from '../db/client'
import { sessions, problems } from '../db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAuth, AuthRequest } from '../middleware/auth'

export const progressRouter = Router()
progressRouter.use(requireAuth)

// GET /api/progress/summary — streak, contribution grid, solved count
progressRouter.get('/summary', async (req: AuthRequest, res) => {
  const allSessions = await db.select({
    startedAt: sessions.startedAt,
    status: sessions.status,
    problemId: sessions.problemId,
  }).from(sessions)
    .where(eq(sessions.userId, req.userId!))
    .orderBy(desc(sessions.startedAt))

  // Build set of unique dates (YYYY-MM-DD in UTC) that had any session
  const activeDateSet = new Set<string>()
  for (const s of allSessions) {
    const d = s.startedAt.toISOString().slice(0, 10)
    activeDateSet.add(d)
  }

  // Compute streak — consecutive days ending today or yesterday
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  let streak = 0
  const check = new Date(today)
  // Allow today or yesterday as the streak anchor
  const todayStr = today.toISOString().slice(0, 10)
  const yesterdayStr = new Date(today.getTime() - 86400000).toISOString().slice(0, 10)
  if (!activeDateSet.has(todayStr) && !activeDateSet.has(yesterdayStr)) {
    streak = 0
  } else {
    // Start from today; if today has no session, start from yesterday
    if (!activeDateSet.has(todayStr)) {
      check.setUTCDate(check.getUTCDate() - 1)
    }
    while (activeDateSet.has(check.toISOString().slice(0, 10))) {
      streak++
      check.setUTCDate(check.getUTCDate() - 1)
    }
  }

  // Build last 98 days activity grid (0 = none, 1 = light, 2 = medium, 3 = heavy)
  const grid: number[] = []
  for (let i = 97; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000)
    const dateStr = d.toISOString().slice(0, 10)
    const count = allSessions.filter(s => s.startedAt.toISOString().slice(0, 10) === dateStr).length
    grid.push(count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : 3)
  }

  const problemsSolved = new Set(
    allSessions.filter(s => s.status === 'completed').map(s => s.problemId)
  ).size

  const activeDates = Array.from(activeDateSet).sort()

  res.json({
    streak,
    activeDates,
    grid,
    problemsSolved,
    totalSessions: allSessions.length,
  })
})
