import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '../../lib/api'

interface Props {
  onClose: () => void
}

const FEATURES = [
  'Unlimited AI tutor messages',
  'All 4 programming languages',
  'Full problem library (all future problems too)',
  'Progress analytics & streaks',
  'All playlists & curated tracks',
]

export function UpgradeModal({ onClose }: Props) {
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('yearly')

  const checkoutMutation = useMutation({
    mutationFn: () => api.billing.checkout(plan),
    onSuccess: (data) => { window.location.href = data.url },
  })

  // VITE_BILLING_ENABLED is set to "false" in render.yaml until Stripe secrets are configured.
  // Once Stripe is live, flip it to "true" and redeploy.
  const billingEnabled = import.meta.env.VITE_BILLING_ENABLED === 'true'
  const isStripeReady = billingEnabled && !checkoutMutation.error?.message?.includes('STRIPE_NOT_CONFIGURED')

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        width: 420, maxWidth: '95vw',
        background: 'var(--bg-1)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '32px 28px',
        display: 'flex', flexDirection: 'column', gap: 0,
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>
        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ color: 'var(--accent)', fontSize: 18 }}>✦</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--fg)', letterSpacing: '-0.03em' }}>
                Telery Pro
              </span>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 8px',
                background: 'oklch(0.52 0.16 278 / 0.15)',
                color: 'var(--accent-fg)',
                border: '1px solid oklch(0.52 0.16 278 / 0.3)',
                borderRadius: 20,
              }}>
                UPGRADE
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.5 }}>
              You've hit the daily AI message limit.<br />
              Upgrade for unlimited tutoring.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 0, cursor: 'pointer',
              color: 'var(--fg-4)', fontSize: 18, lineHeight: 1, padding: 4,
              borderRadius: 6, flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* plan toggle */}
        <div style={{
          display: 'flex', gap: 8, marginBottom: 20,
          background: 'var(--bg-2)', borderRadius: 10, padding: 4,
          border: '1px solid var(--border-soft)',
        }}>
          {(['monthly', 'yearly'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 7,
                border: plan === p ? '1px solid oklch(0.52 0.16 278 / 0.4)' : '1px solid transparent',
                background: plan === p ? 'var(--accent-bg)' : 'transparent',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: plan === p ? 'var(--accent-fg)' : 'var(--fg-2)' }}>
                {p === 'monthly' ? '$12 / month' : '$99 / year'}
              </span>
              <span style={{ fontSize: 11, color: plan === p ? 'var(--accent-fg)' : 'var(--fg-4)' }}>
                {p === 'monthly' ? 'Billed monthly' : 'Save 31% · 2 months free'}
              </span>
            </button>
          ))}
        </div>

        {/* feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {FEATURES.map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                background: 'oklch(0.52 0.16 278 / 0.15)',
                color: 'var(--accent-fg)', fontSize: 11, fontWeight: 700,
              }}>✓</span>
              <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>{f}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        {isStripeReady ? (
          <button
            onClick={() => checkoutMutation.mutate()}
            disabled={checkoutMutation.isPending}
            style={{
              width: '100%', padding: '12px 0',
              background: 'linear-gradient(180deg, oklch(0.52 0.16 278), oklch(0.44 0.16 278))',
              color: 'white', border: '1px solid oklch(0.62 0.16 278 / 0.5)',
              borderRadius: 9, fontSize: 14, fontWeight: 600,
              cursor: checkoutMutation.isPending ? 'not-allowed' : 'pointer',
              opacity: checkoutMutation.isPending ? 0.7 : 1,
              fontFamily: 'inherit',
            }}
          >
            {checkoutMutation.isPending ? 'Redirecting…' : `Upgrade to Pro — ${plan === 'monthly' ? '$12/mo' : '$99/yr'}`}
          </button>
        ) : (
          <div style={{
            width: '100%', padding: '12px 0',
            background: 'var(--bg-2)', border: '1px solid var(--border-soft)',
            borderRadius: 9, textAlign: 'center',
            fontSize: 13, color: 'var(--fg-3)', fontFamily: 'inherit',
          }}>
            Billing coming soon — stay tuned
          </div>
        )}

        <p style={{ margin: '12px 0 0', fontSize: 11.5, color: 'var(--fg-4)', textAlign: 'center' }}>
          Cancel anytime · Secure payment via Stripe
        </p>
      </div>
    </div>
  )
}
