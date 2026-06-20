import { Router } from 'express'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Stripe = require('stripe')
import { db } from '../db/client'
import { profiles } from '../db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth, AuthRequest } from '../middleware/auth'

export const billingRouter = Router()
billingRouter.use(requireAuth)

// Set these in your .env:
//   STRIPE_SECRET_KEY=sk_live_...
//   STRIPE_WEBHOOK_SECRET=whsec_...
//   STRIPE_MONTHLY_PRICE_ID=price_...   (e.g. $12/month)
//   STRIPE_YEARLY_PRICE_ID=price_...    (e.g. $99/year)

const FREE_DAILY_LIMIT = 10

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

// GET /api/billing/status — current plan + usage
billingRouter.get('/status', async (req: AuthRequest, res) => {
  const profile = await db.select().from(profiles).where(eq(profiles.id, req.userId!)).limit(1)
  if (!profile.length) { res.status(404).json({ error: 'Profile not found' }); return }

  const p = profile[0]
  const isPro = p.subscriptionStatus === 'pro'

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
billingRouter.post('/checkout', async (req: AuthRequest, res) => {
  const stripe = getStripe()
  if (!stripe) {
    res.status(503).json({ error: 'Billing not configured', code: 'STRIPE_NOT_CONFIGURED' })
    return
  }

  const { plan = 'monthly' } = req.body as { plan?: 'monthly' | 'yearly' }
  const priceId = plan === 'yearly'
    ? process.env.STRIPE_YEARLY_PRICE_ID
    : process.env.STRIPE_MONTHLY_PRICE_ID

  if (!priceId) {
    res.status(503).json({ error: 'Price ID not configured for this plan', code: 'PRICE_NOT_CONFIGURED' })
    return
  }

  const profile = await db.select().from(profiles).where(eq(profiles.id, req.userId!)).limit(1)
  if (!profile.length) { res.status(404).json({ error: 'Profile not found' }); return }

  let customerId = profile[0].stripeCustomerId

  if (!customerId) {
    const customer = await stripe.customers.create({
      metadata: { userId: req.userId! },
    })
    customerId = customer.id
    await db.update(profiles)
      .set({ stripeCustomerId: customerId })
      .where(eq(profiles.id, req.userId!))
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/?checkout=success`,
    cancel_url: `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/?checkout=cancelled`,
  })

  res.json({ url: session.url })
})

// POST /api/billing/portal — Stripe Customer Portal link
billingRouter.post('/portal', async (req: AuthRequest, res) => {
  const stripe = getStripe()
  if (!stripe) {
    res.status(503).json({ error: 'Billing not configured', code: 'STRIPE_NOT_CONFIGURED' })
    return
  }

  const profile = await db.select().from(profiles).where(eq(profiles.id, req.userId!)).limit(1)
  if (!profile.length) { res.status(404).json({ error: 'Profile not found' }); return }

  const customerId = profile[0].stripeCustomerId
  if (!customerId) {
    res.status(400).json({ error: 'No billing account found' }); return
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/`,
  })

  res.json({ url: session.url })
})

// POST /api/webhooks/stripe — receives Stripe events (no auth middleware)
export async function stripeWebhookHandler(req: import('express').Request, res: import('express').Response) {
  const stripe = getStripe()
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    res.status(503).json({ error: 'Webhook not configured' }); return
  }

  const sig = req.headers['stripe-signature'] as string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any

  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    res.status(400).json({ error: `Webhook signature verification failed: ${err instanceof Error ? err.message : err}` })
    return
  }

  if (event.type === 'checkout.session.completed') {
    const obj = event.data.object
    // Only grant pro when payment has actually cleared (not for deferred methods)
    if (obj?.payment_status === 'paid' && obj?.customer) {
      await db.update(profiles)
        .set({ subscriptionStatus: 'pro' })
        .where(eq(profiles.stripeCustomerId, obj.customer as string))
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object
    const status = (sub?.status === 'active' || sub?.status === 'trialing') ? 'pro' : 'free'
    if (sub?.customer) {
      await db.update(profiles)
        .set({ subscriptionStatus: status })
        .where(eq(profiles.stripeCustomerId, sub.customer as string))
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const customerId = event.data.object?.customer as string | null
    if (customerId) {
      await db.update(profiles)
        .set({ subscriptionStatus: 'free' })
        .where(eq(profiles.stripeCustomerId, customerId))
    }
  }

  res.json({ received: true })
}
