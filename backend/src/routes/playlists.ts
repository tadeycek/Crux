import { Router } from 'express'
import { db } from '../db/client'
import { playlists, playlistProblems, problems } from '../db/schema'
import { eq, asc } from 'drizzle-orm'

export const playlistsRouter = Router()

// GET /api/playlists — all playlists with their problems
playlistsRouter.get('/', async (_req, res) => {
  const allPlaylists = await db.select().from(playlists).orderBy(asc(playlists.position))

  const result = await Promise.all(
    allPlaylists.map(async (pl) => {
      const rows = await db
        .select({ problem: problems, position: playlistProblems.position })
        .from(playlistProblems)
        .innerJoin(problems, eq(playlistProblems.problemId, problems.id))
        .where(eq(playlistProblems.playlistId, pl.id))
        .orderBy(asc(playlistProblems.position))

      return {
        ...pl,
        problems: rows.map(r => ({
          id: r.problem.id,
          title: r.problem.title,
          slug: r.problem.slug,
          difficulty: r.problem.difficulty,
          description: r.problem.description,
        })),
      }
    })
  )

  res.json(result)
})
