import 'dotenv/config'

const REQUIRED_ENV = ['DATABASE_URL', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'OPENAI_API_KEY'] as const
const missing = REQUIRED_ENV.filter((k) => !process.env[k])
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`)
  process.exit(1)
}

import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import path from 'path'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { authRouter } from './routes/auth'
import { problemsRouter } from './routes/problems'
import { sessionsRouter } from './routes/sessions'
import { chatRouter } from './routes/chat'
import { progressRouter } from './routes/progress'
import { conceptsRouter } from './routes/concepts'
import { playlistsRouter } from './routes/playlists'
import { billingRouter, stripeWebhookHandler } from './routes/billing'

const app = express()
const port = process.env.PORT ?? 3001
const isProd = process.env.NODE_ENV === 'production'

const FRONTEND_DIST = path.resolve(__dirname, '../client')

app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: isProd ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: [
        "'self'",
        'https://*.supabase.co',
        'https://emkc.org',
        'https://api.openai.com',
      ],
    },
  } : false,
}))

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    if (!isProd && origin.startsWith('http://localhost')) return cb(null, true)
    const allowed = (process.env.FRONTEND_URL ?? '').split(',').map(o => o.trim()).filter(Boolean)
    if (allowed.length === 0) {
      if (!isProd) return cb(null, true)
      return cb(new Error('CORS: FRONTEND_URL not configured'))
    }
    if (allowed.includes(origin)) return cb(null, true)
    cb(new Error(`CORS: ${origin} not allowed`))
  },
}))

// Stripe webhook must receive raw body for signature verification — register BEFORE express.json()
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhookHandler)

app.use(express.json({ limit: '200kb' }))

// Global limiter — prevents broad abuse
const globalLimiter = rateLimit({
  windowMs: 60_000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests' },
})
app.use('/api', globalLimiter)

app.get('/health', (_req, res) => res.json({ ok: true }))

app.use('/api/auth', authRouter)
app.use('/api/problems', problemsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/chat', chatRouter)
app.use('/api/progress', progressRouter)
app.use('/api/concepts', conceptsRouter)
app.use('/api/playlists', playlistsRouter)
app.use('/api/billing', billingRouter)

// Serve built React app in production — must come after API routes
if (isProd) {
  app.use(express.static(FRONTEND_DIST))
  // SPA fallback: any non-API route returns index.html
  app.get('/{*path}', (_req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'))
  })
}

// Global error handler — never leak internal details to clients
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  const isCors = err.message?.startsWith('CORS:')
  if (isCors) { res.status(403).json({ error: err.message }); return }
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(port, () => {
  console.log(`Telery backend running on :${port}`)
})
