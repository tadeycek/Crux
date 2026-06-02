import { Router } from 'express'
import { db } from '../db/client'
import { profiles } from '../db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth, AuthRequest } from '../middleware/auth'

export const billingRouter = Router()
billingRouter.use(requireAuth)

const FREE_DAILY_LIMIT = 10

// GET /api/billing/status — current plan + usage
billingRouter.get('/status', async (req: AuthRequest, res) => {
  const profile = await db.select().from(profiles).where(eq(profiles.id, req.userId!)).limit(1)
  if (!profile.length) { res.status(404).json({ error: 'Profile not found' }); return }

  const p = profile[0]
  const isPro = p.subscriptionStatus === 'pro'

  // Reset counter if stale so the status reflects today accurately
  const now = new Date()
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const resetAt = new Date(p.aiMessagesResetAt)
  let aiMessagesToday = p.aiMessagesToday
  if (!isPro && resetAt < todayUTC) {
    await db.update(profiles)
      .set({ aiMessagesToday: 0, aiMessagesResetAt: todayUTC })
      .where(eq(profiles.id, req.userId!))
    aiMessagesToday = 0
  }

  res.json({
    subscriptionStatus: p.subscriptionStatus,
    isPro,
    aiMessagesToday,
    aiMessagesLimit: isPro ? null : FREE_DAILY_LIMIT,
    aiMessagesRemaining: isPro ? null : Math.max(0, FREE_DAILY_LIMIT - aiMessagesToday),
  })
})

// POST /api/billing/checkout — creates a Stripe Checkout Session
// Stub: returns a clear error until STRIPE_SECRET_KEY is configured
billingRouter.post('/checkout', async (req: AuthRequest, res) => {
  const { plan = 'monthly' } = req.body as { plan?: 'monthly' | 'yearly' }

  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(503).json({ error: 'Billing not yet configured', code: 'STRIPE_NOT_CONFIGURED' })
    return
  }

  // TODO: implement when Stripe is configured
  // 1. Create or retrieve Stripe customer for req.userId
  // 2. Create Checkout Session with monthly ($12) or yearly ($99) price ID
  // 3. Return { url: checkoutSession.url }
  void plan
  res.status(501).json({ error: 'Not implemented' })
})

// POST /api/billing/portal — Stripe Customer Portal link for managing subscription
billingRouter.post('/portal', async (_req: AuthRequest, res) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(503).json({ error: 'Billing not yet configured', code: 'STRIPE_NOT_CONFIGURED' })
    return
  }
  res.status(501).json({ error: 'Not implemented' })
})

// POST /api/webhooks/stripe — receives Stripe events (no auth middleware)
export async function stripeWebhookHandler(req: import('express').Request, res: import('express').Response) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    res.status(503).json({ error: 'Webhook not configured' }); return
  }
  // TODO: verify Stripe-Signature header, handle events:
  //   checkout.session.completed  → set subscription_status = 'pro'
  //   customer.subscription.updated → sync status
  //   customer.subscription.deleted → set status back to 'free'
  res.json({ received: true })
}
