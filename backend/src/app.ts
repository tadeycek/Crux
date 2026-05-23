import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { problemsRouter } from './routes/problems'
import { sessionsRouter } from './routes/sessions'
import { chatRouter } from './routes/chat'

const app = express()
const port = process.env.PORT ?? 3001

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (_req, res) => res.json({ ok: true }))

app.use('/api/problems', problemsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/chat', chatRouter)

app.listen(port, () => {
  console.log(`Crux backend running on :${port}`)
})
