import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { updatePassword, updateUsername, fetchProfile } from '../../lib/auth'
import { useTheme, type Theme } from '../../lib/theme'
import { useLanguage } from '../../lib/useLanguage'
import { LANGUAGE_META, type Language } from '../editor/CodeEditor'
import { api } from '../../lib/api'

export type SettingsSection = 'profile' | 'account' | 'appearance' | 'coding' | 'billing'

interface Props {
  user: User
  initialSection?: SettingsSection
  onClose: () => void
}

const NAV: { id: SettingsSection; label: string }[] = [
  { id: 'profile',    label: 'Profile' },
  { id: 'account',    label: 'Account' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'coding',     label: 'Coding' },
  { id: 'billing',    label: 'Plan & Billing' },
]

export function SettingsPage({ user, initialSection = 'profile', onClose }: Props) {
  const [section, setSection] = useState<SettingsSection>(initialSection)

  // keep section in sync if parent changes it (e.g. re-opening from a different dropdown item)
  useEffect(() => { setSection(initialSection) }, [initialSection])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: 'var(--bg-0)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* top bar */}
      <div style={{
        height: 48, flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '0 20px',
        borderBottom: '1px solid var(--border-soft)',
        background: 'var(--bg-1)',
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            color: 'var(--fg-3)', display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, padding: '4px 6px', borderRadius: 6,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-3)')}
        >
          ← Back
        </button>
        <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>Settings</span>
      </div>

      {/* body */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {/* sidebar */}
        <aside style={{
          width: 220, flexShrink: 0,
          borderRight: '1px solid var(--border-soft)',
          padding: '24px 12px',
          display: 'flex', flexDirection: 'column', gap: 2,
          overflowY: 'auto',
        }}>
          {/* user info */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '0 8px 16px',
            borderBottom: '1px solid var(--border-soft)',
            marginBottom: 8,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700,
              background: 'linear-gradient(135deg, oklch(0.55 0.12 30), oklch(0.45 0.13 350))',
              color: 'white',
            }}>
              {user.email?.[0].toUpperCase() ?? '?'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg-4)' }}>Personal account</div>
            </div>
          </div>

          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              style={{
                background: section === item.id ? 'var(--bg-2)' : 'transparent',
                border: section === item.id ? '1px solid var(--border-soft)' : '1px solid transparent',
                cursor: 'pointer', textAlign: 'left',
                color: section === item.id ? 'var(--fg)' : 'var(--fg-3)',
                fontSize: 13, fontWeight: section === item.id ? 500 : 400,
                padding: '7px 10px', borderRadius: 7,
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e => { if (section !== item.id) e.currentTarget.style.color = 'var(--fg-2)' }}
              onMouseLeave={e => { if (section !== item.id) e.currentTarget.style.color = 'var(--fg-3)' }}
            >
              {ICONS[item.id]}
              {item.label}
            </button>
          ))}
        </aside>

        {/* content */}
        <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '40px 48px' }}>
          <div style={{ maxWidth: 640 }}>
            {section === 'profile'    && <ProfileSection user={user} />}
            {section === 'account'    && <AccountSection />}
            {section === 'appearance' && <AppearanceSection />}
            {section === 'coding'     && <CodingSection />}
            {section === 'billing'    && <BillingSection />}
          </div>
        </main>
      </div>
    </div>
  )
}

// ─── Section: Profile ──────────────────────────────────────────────────────────

function ProfileSection({ user }: { user: User }) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) return
      try {
        const p = await fetchProfile(token)
        setUsername(p.username ?? '')
      } catch { /* ignore */ }
    }
    load()
  }, [])

  async function save() {
    if (!username.trim()) return
    setLoading(true); setMsg(null)
    try {
      const { data } = await supabase.auth.getSession()
      await updateUsername(username.trim(), data.session!.access_token!)
      setMsg({ text: 'Username saved', ok: true })
    } catch (e) {
      setMsg({ text: e instanceof Error ? e.message : 'Failed', ok: false })
    } finally { setLoading(false) }
  }

  return (
    <>
      <SectionHeader title="Profile" subtitle="This information will be visible to other users." />
      <Divider />

      <FieldRow label="Username" hint="Used to log in and identify you.">
        <Input value={username} onChange={v => { setUsername(v); setMsg(null) }} placeholder="your_username" />
      </FieldRow>
      <Divider />

      <FieldRow label="Email" hint="Your account email. Cannot be changed here.">
        <Input value={user.email ?? ''} disabled />
      </FieldRow>
      <Divider />

      {msg && <Msg ok={msg.ok}>{msg.text}</Msg>}
      <SaveButton loading={loading} onClick={save}>Save profile</SaveButton>
    </>
  )
}

// ─── Section: Account ─────────────────────────────────────────────────────────

function AccountSection() {
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)

  async function save() {
    if (newPw !== confirmPw) { setMsg({ text: 'Passwords do not match', ok: false }); return }
    if (newPw.length < 6)   { setMsg({ text: 'Minimum 6 characters', ok: false }); return }
    setLoading(true); setMsg(null)
    try {
      await updatePassword(newPw)
      setMsg({ text: 'Password updated', ok: true })
      setNewPw(''); setConfirmPw('')
    } catch (e) {
      setMsg({ text: e instanceof Error ? e.message : 'Failed', ok: false })
    } finally { setLoading(false) }
  }

  return (
    <>
      <SectionHeader title="Account" subtitle="Manage your password and security settings." />
      <Divider />

      <FieldRow label="New password" hint="Must be at least 6 characters.">
        <Input type="password" value={newPw} onChange={v => { setNewPw(v); setMsg(null) }} placeholder="New password" autoComplete="new-password" />
      </FieldRow>
      <Divider />

      <FieldRow label="Confirm new password">
        <Input type="password" value={confirmPw} onChange={v => { setConfirmPw(v); setMsg(null) }} placeholder="Repeat new password" autoComplete="new-password" />
      </FieldRow>
      <Divider />

      {msg && <Msg ok={msg.ok}>{msg.text}</Msg>}
      <SaveButton loading={loading} onClick={save}>Update password</SaveButton>
    </>
  )
}

// ─── Section: Appearance ──────────────────────────────────────────────────────

const THEME_OPTIONS: { value: Theme; label: string; desc: string; icon: string }[] = [
  { value: 'dark',   label: 'Dark',   desc: 'Always dark',           icon: '🌙' },
  { value: 'light',  label: 'Light',  desc: 'Always light',          icon: '☀️' },
  { value: 'system', label: 'System', desc: 'Follows OS preference',  icon: '💻' },
]

function AppearanceSection() {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <SectionHeader title="Appearance" subtitle="Customise how Crux looks for you." />
      <Divider />

      <div style={{ marginBottom: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>Theme</label>
        <p style={{ margin: '4px 0 16px', fontSize: 12.5, color: 'var(--fg-3)' }}>
          Choose your preferred colour scheme.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          {THEME_OPTIONS.map(opt => {
            const active = theme === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 8, padding: '18px 10px',
                  background: active ? 'var(--accent-bg)' : 'var(--bg-2)',
                  border: active ? '1.5px solid var(--accent)' : '1.5px solid var(--border-soft)',
                  borderRadius: 10, cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 24 }}>{opt.icon}</span>
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? 'var(--accent-fg)' : 'var(--fg-2)' }}>
                  {opt.label}
                </span>
                <span style={{ fontSize: 11.5, color: 'var(--fg-4)', textAlign: 'center' }}>{opt.desc}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

// ─── Section: Coding ──────────────────────────────────────────────────────────

const LANG_ICONS: Record<Language, string> = {
  python:     '🐍',
  javascript: 'JS',
  java:       '☕',
  cpp:        'C+',
}

function CodingSection() {
  const { language, setLanguage } = useLanguage()

  return (
    <>
      <SectionHeader title="Coding" subtitle="Set your preferred programming language across the whole app." />
      <Divider />

      <div style={{ marginBottom: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>Preferred language</label>
        <p style={{ margin: '4px 0 16px', fontSize: 12.5, color: 'var(--fg-3)' }}>
          Used as the default in the editor, study plans, and problem starters.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {(Object.keys(LANGUAGE_META) as Language[]).map(lang => {
            const active = language === lang
            const meta = LANGUAGE_META[lang]
            return (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 8, padding: '18px 10px',
                  background: active ? 'var(--accent-bg)' : 'var(--bg-2)',
                  border: active ? '1.5px solid var(--accent)' : '1.5px solid var(--border-soft)',
                  borderRadius: 10, cursor: 'pointer',
                }}
              >
                <span style={{
                  fontSize: 20, fontFamily: 'var(--mono)', fontWeight: 700,
                  color: active ? 'var(--accent-fg)' : 'var(--fg-3)',
                  letterSpacing: '-0.03em',
                }}>
                  {LANG_ICONS[lang]}
                </span>
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? 'var(--accent-fg)' : 'var(--fg-2)' }}>
                  {meta.label}
                </span>
                <span style={{ fontSize: 11, color: 'var(--fg-4)' }}>{meta.version}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.02em' }}>{title}</h2>
      {subtitle && <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--fg-3)' }}>{subtitle}</p>}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--border-soft)', margin: '20px 0' }} />
}

function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 24, alignItems: 'start' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)', lineHeight: 1.4 }}>{label}</div>
        {hint && <div style={{ fontSize: 12, color: 'var(--fg-4)', marginTop: 4, lineHeight: 1.45 }}>{hint}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}

function Input({ value, onChange, placeholder, disabled, type = 'text', autoComplete }: {
  value: string; onChange?: (v: string) => void; placeholder?: string
  disabled?: boolean; type?: string; autoComplete?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autoComplete}
      style={{
        width: '100%', padding: '8px 11px',
        background: disabled ? 'var(--bg-2)' : 'var(--bg-inset)',
        border: '1px solid var(--border-soft)',
        borderRadius: 8, color: disabled ? 'var(--fg-3)' : 'var(--fg)',
        fontSize: 13, fontFamily: 'inherit', outline: 'none',
        boxSizing: 'border-box',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'text',
      }}
    />
  )
}

function Msg({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return <div style={{ fontSize: 12.5, color: ok ? 'var(--ok)' : 'var(--danger)', marginBottom: 14 }}>{children}</div>
}

function SaveButton({ loading, onClick, children }: { loading: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      padding: '8px 18px',
      background: 'linear-gradient(180deg, oklch(0.52 0.16 278), oklch(0.46 0.16 278))',
      color: 'white', border: '1px solid oklch(0.62 0.16 278 / 0.6)',
      borderRadius: 8, fontSize: 13, fontWeight: 500,
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.6 : 1, fontFamily: 'inherit',
    }}>
      {loading ? 'Saving…' : children}
    </button>
  )
}

// ─── Section: Billing ─────────────────────────────────────────────────────────

function BillingSection() {
  const { data: billing, isLoading } = useQuery({
    queryKey: ['billing-status'],
    queryFn: () => api.billing.status(),
    staleTime: 30_000,
  })

  if (isLoading) {
    return (
      <>
        <SectionHeader title="Plan & Billing" subtitle="Manage your subscription and usage." />
        <div style={{ color: 'var(--fg-4)', fontSize: 13 }}>Loading…</div>
      </>
    )
  }

  const isPro = billing?.isPro ?? false
  const used = billing?.aiMessagesToday ?? 0
  const limit = billing?.aiMessagesLimit ?? 10
  const pct = isPro ? 0 : Math.min(100, (used / limit) * 100)

  return (
    <>
      <SectionHeader title="Plan & Billing" subtitle="Manage your subscription and usage." />
      <Divider />

      {/* current plan */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 18px',
        background: isPro
          ? 'oklch(0.52 0.16 278 / 0.08)'
          : 'var(--bg-2)',
        border: isPro
          ? '1px solid oklch(0.52 0.16 278 / 0.3)'
          : '1px solid var(--border-soft)',
        borderRadius: 10, marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 22 }}>{isPro ? '✦' : '○'}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: isPro ? 'var(--accent-fg)' : 'var(--fg)' }}>
              {isPro ? 'Crux Pro' : 'Free plan'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--fg-4)', marginTop: 2 }}>
              {isPro ? 'Unlimited AI messages · All features' : '10 AI messages per day · Core features'}
            </div>
          </div>
        </div>
        {!isPro && (
          <div style={{
            fontSize: 12, fontWeight: 600, padding: '5px 12px',
            background: 'linear-gradient(180deg, oklch(0.52 0.16 278), oklch(0.44 0.16 278))',
            color: 'white', borderRadius: 7, cursor: 'default',
            border: '1px solid oklch(0.62 0.16 278 / 0.5)',
          }}>
            Upgrade coming soon
          </div>
        )}
      </div>

      {/* usage meter (free only) */}
      {!isPro && (
        <>
          <FieldRow label="AI messages today" hint="Resets at midnight UTC.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--fg-3)' }}>
                <span>{used} used</span>
                <span>{limit - used} remaining</span>
              </div>
              <div style={{
                height: 6, background: 'var(--bg-2)', borderRadius: 4,
                border: '1px solid var(--border-soft)', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: pct >= 100
                    ? 'var(--danger)'
                    : pct >= 70
                      ? 'oklch(0.72 0.18 60)'
                      : 'var(--accent)',
                  borderRadius: 4,
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          </FieldRow>
          <Divider />

          <div style={{
            padding: '16px 18px',
            background: 'var(--bg-2)',
            border: '1px solid var(--border-soft)',
            borderRadius: 10,
            fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.6,
          }}>
            Crux Pro unlocks unlimited AI tutoring, all languages, and every future problem.
            Pricing: <strong style={{ color: 'var(--fg)' }}>$12/month</strong> or{' '}
            <strong style={{ color: 'var(--fg)' }}>$99/year</strong> (2 months free).
            <br />
            <span style={{ fontSize: 12, color: 'var(--fg-4)' }}>Payments via Stripe — launching soon.</span>
          </div>
        </>
      )}

      {isPro && (
        <>
          <FieldRow label="AI messages" hint="Pro users have no daily limit.">
            <span style={{ fontSize: 13, color: 'var(--accent-fg)', fontWeight: 500 }}>Unlimited ✓</span>
          </FieldRow>
          <Divider />
          <div style={{ fontSize: 13, color: 'var(--fg-4)' }}>
            To manage your subscription or cancel, visit your billing portal once Stripe is configured.
          </div>
        </>
      )}
    </>
  )
}

const ICONS: Record<SettingsSection, React.ReactNode> = {
  profile:    <span style={{ fontSize: 13, opacity: 0.6 }}>👤</span>,
  account:    <span style={{ fontSize: 13, opacity: 0.6 }}>🔒</span>,
  appearance: <span style={{ fontSize: 13, opacity: 0.6 }}>🎨</span>,
  coding:     <span style={{ fontSize: 13, opacity: 0.6 }}>⌨️</span>,
  billing:    <span style={{ fontSize: 13, opacity: 0.6 }}>💳</span>,
}
