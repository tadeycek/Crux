import { Router } from 'express'
import { db } from '../db/client'
import { problems, topics, problemTopics } from '../db/schema'
import { eq, inArray, and } from 'drizzle-orm'

export const problemsRouter = Router()

// Must come before /:slug to avoid "all" being matched as a slug
problemsRouter.get('/all/topics', async (_req, res) => {
  const rows = await db.select().from(topics).orderBy(topics.name)
  res.json(rows)
})

problemsRouter.get('/', async (req, res) => {
  const { topic, difficulty } = req.query

  // If topic filter, get matching problem IDs first
  let allowedIds: number[] | null = null
  if (topic && typeof topic === 'string') {
    const topicRow = await db.select().from(topics).where(eq(topics.slug, topic)).limit(1)
    if (!topicRow.length) { res.json([]); return }
    const links = await db.select().from(problemTopics).where(eq(problemTopics.topicId, topicRow[0].id))
    allowedIds = links.map(l => l.problemId)
    if (!allowedIds.length) { res.json([]); return }
  }

  // Build query with both filters combined
  const difficultyFilter = difficulty && typeof difficulty === 'string'
    ? eq(problems.difficulty, difficulty as 'easy' | 'medium' | 'hard')
    : undefined
  const topicFilter = allowedIds ? inArray(problems.id, allowedIds) : undefined

  let rows
  if (difficultyFilter && topicFilter) {
    rows = await db.select().from(problems).where(and(difficultyFilter, topicFilter))
  } else if (difficultyFilter) {
    rows = await db.select().from(problems).where(difficultyFilter)
  } else if (topicFilter) {
    rows = await db.select().from(problems).where(topicFilter)
  } else {
    rows = await db.select().from(problems)
  }

  res.json(rows)
})

problemsRouter.get('/:slug', async (req, res) => {
  const row = await db.select().from(problems).where(eq(problems.slug, req.params.slug)).limit(1)
  if (!row.length) { res.status(404).json({ error: 'Not found' }); return }

  const topicLinks = await db
    .select({ name: topics.name, slug: topics.slug })
    .from(problemTopics)
    .innerJoin(topics, eq(topics.id, problemTopics.topicId))
    .where(eq(problemTopics.problemId, row[0].id))

  res.json({ ...row[0], topics: topicLinks })
})
