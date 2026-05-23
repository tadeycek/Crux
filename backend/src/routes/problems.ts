import { Router } from 'express'
import { db } from '../db/client'
import { problems, topics, problemTopics } from '../db/schema'
import { eq, inArray } from 'drizzle-orm'

export const problemsRouter = Router()

problemsRouter.get('/', async (req, res) => {
  const { topic, difficulty } = req.query

  let rows = await db.select().from(problems)

  if (difficulty && typeof difficulty === 'string') {
    rows = await db.select().from(problems).where(eq(problems.difficulty, difficulty as 'easy' | 'medium' | 'hard'))
  }

  if (topic && typeof topic === 'string') {
    const topicRow = await db.select().from(topics).where(eq(topics.slug, topic)).limit(1)
    if (!topicRow.length) {
      res.json([])
      return
    }
    const links = await db.select().from(problemTopics).where(eq(problemTopics.topicId, topicRow[0].id))
    const ids = links.map(l => l.problemId)
    rows = ids.length ? await db.select().from(problems).where(inArray(problems.id, ids)) : []
  }

  res.json(rows)
})

problemsRouter.get('/:slug', async (req, res) => {
  const row = await db.select().from(problems).where(eq(problems.slug, req.params.slug)).limit(1)
  if (!row.length) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  const topicLinks = await db
    .select({ name: topics.name, slug: topics.slug })
    .from(problemTopics)
    .innerJoin(topics, eq(topics.id, problemTopics.topicId))
    .where(eq(problemTopics.problemId, row[0].id))

  res.json({ ...row[0], topics: topicLinks })
})

problemsRouter.get('/all/topics', async (_req, res) => {
  const rows = await db.select().from(topics).orderBy(topics.name)
  res.json(rows)
})
