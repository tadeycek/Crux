import { pgTable, uuid, text, integer, timestamp, pgEnum, jsonb, primaryKey } from 'drizzle-orm/pg-core'

export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard'])
export const sessionStatusEnum = pgEnum('session_status', ['active', 'completed', 'abandoned'])
export const messageRoleEnum = pgEnum('message_role', ['user', 'assistant'])

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  username: text('username').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  subscriptionStatus: text('subscription_status').notNull().default('free'),
  aiMessagesToday: integer('ai_messages_today').notNull().default(0),
  aiMessagesResetAt: timestamp('ai_messages_reset_at', { withTimezone: true }).defaultNow().notNull(),
})

export const topics = pgTable('topics', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
})

export const problems = pgTable('problems', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  difficulty: difficultyEnum('difficulty').notNull(),
  starterCode: text('starter_code').notNull(),
  constraints: text('constraints').notNull(),
  examples: jsonb('examples').notNull().$type<{ input: string; output: string; explain: string }[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const problemTopics = pgTable('problem_topics', {
  problemId: integer('problem_id').notNull().references(() => problems.id, { onDelete: 'cascade' }),
  topicId: integer('topic_id').notNull().references(() => topics.id, { onDelete: 'cascade' }),
}, (t) => [primaryKey({ columns: [t.problemId, t.topicId] })])

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  problemId: integer('problem_id').notNull().references(() => problems.id),
  currentCode: text('current_code').notNull().default(''),
  status: sessionStatusEnum('status').notNull().default('active'),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  endedAt: timestamp('ended_at'),
})

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => sessions.id, { onDelete: 'cascade' }),
  role: messageRoleEnum('role').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const conceptProgress = pgTable('concept_progress', {
  userId: uuid('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  conceptSlug: text('concept_slug').notNull(),
  status: text('status').notNull().default('in-progress'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [primaryKey({ columns: [t.userId, t.conceptSlug] })])

export const playlists = pgTable('playlists', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  badge: text('badge').notNull(),
  difficulty: text('difficulty').notNull(),
  position: integer('position').notNull().default(0),
})

export const playlistProblems = pgTable('playlist_problems', {
  playlistId: integer('playlist_id').notNull().references(() => playlists.id, { onDelete: 'cascade' }),
  problemId: integer('problem_id').notNull().references(() => problems.id, { onDelete: 'cascade' }),
  position: integer('position').notNull().default(0),
}, (t) => [primaryKey({ columns: [t.playlistId, t.problemId] })])
