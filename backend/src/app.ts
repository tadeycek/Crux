import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { problemsRouter } from './routes/problems'
import { sessionsRouter } from './routes/sessions'
import { chatRouter } from './routes/chat'

const app = express()
const port = process.env.PORT ?? 3001

const allowedOrigins = (process.env.FRONTEND_URL ?? 'http://localhost:5173')
  .split(',')
  .map(o => o.trim())

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    if (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost')) return cb(null, true)
    if (allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error(`CORS: ${origin} not allowed`))
  },
}))
app.use(express.json())

app.get('/health', (_req, res) => res.json({ ok: true }))

app.use('/api/problems', problemsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/chat', chatRouter)

app.listen(port, () => {
  console.log(`Crux backend running on :${port}`)
})
