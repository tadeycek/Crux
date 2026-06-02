import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import { updatePassword, updateUsername, fetchProfile } from '../../lib/auth'

interface Props {
  user: User
  onClose: () => void
}

type Section = 'account' | 'password'

export function AccountSettingsModal({ user, onClose }: Props) {
  const [section, setSection] = useState<Section>('account')

  // account section
  const [username, setUsername] = useState('')
  const [usernameLoading, setUsernameLoading] = useState(false)
  const [usernameMsg, setUsernameMsg] = useState<{ text: string; ok: boolean } | null>(null)

  // password section
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; ok: boolean } | null>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) return
      try {
        const profile = await fetchProfile(token)
        setUsername(profile.username ?? '')
      } catch { /* ignore */ }
    }
    load()
  }, [])

  async function handleUpdateUsername() {
    if (!username.trim()) return
    setUsernameLoading(true)
    setUsernameMsg(null)
    try {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token!
      await updateUsername(username.trim(), token)
      setUsernameMsg({ text: 'Username updated', ok: true })
    } catch (err) {
      setUsernameMsg({ text: err instanceof Error ? err.message : 'Failed', ok: false })
    } finally {
      setUsernameLoading(false)
    }
  }

  async function handleUpdatePassword() {
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'Passwords do not match', ok: false }); return
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ text: 'Password must be at least 6 characters', ok: false }); return
    }
    setPasswordLoading(true)
    setPasswordMsg(null)
    try {
      await updatePassword(newPassword)
      setPasswordMsg({ text: 'Password updated', ok: true })
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordMsg({ text: err instanceof Error ? err.message : 'Failed', ok: false })
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)',
        }}
      />

      {/* panel */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 201,
        width: 480, background: 'var(--bg-1)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--border-soft)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700,
              background: 'linear-gradient(135deg, oklch(0.55 0.12 30), oklch(0.45 0.13 350))',
              color: 'white', flexShrink: 0,
            }}>
              {user.email?.[0].toUpperCase() ?? '?'}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>{username || '—'}</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-4)', marginTop: 1 }}>{user.email}</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            color: 'var(--fg-3)', fontSize: 18, lineHeight: 1, padding: 4,
          }}>×</button>
        </div>

        <div style={{ display: 'flex', minHeight: 0 }}>
          {/* sidebar */}
          <nav style={{
            width: 140, flexShrink: 0,
            borderRight: '1px solid var(--border-soft)',
            padding: '12px 8px',
            display: 'flex', flexDirection: 'column', gap: 2,
          }}>
            {(['account', 'password'] as Section[]).map(s => (
              <button key={s} onClick={() => setSection(s)} style={{
                background: section === s ? 'var(--bg-2)' : 'transparent',
                border: 0, cursor: 'pointer', textAlign: 'left',
                color: section === s ? 'var(--fg)' : 'var(--fg-3)',
                fontSize: 12.5, fontWeight: section === s ? 500 : 400,
                padding: '7px 10px', borderRadius: 7,
                textTransform: 'capitalize',
              }}>
                {s === 'account' ? 'Account' : 'Password'}
              </button>
            ))}

          </nav>

          {/* content */}
          <div style={{ flex: 1, padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {section === 'account' && (
              <>
                <SectionTitle>Account</SectionTitle>

                <Field label="Email">
                  <input value={user.email ?? ''} disabled style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
                </Field>

                <Field label="Username">
                  <input
                    value={username}
                    onChange={e => { setUsername(e.target.value); setUsernameMsg(null) }}
                    placeholder="your_username"
                    style={inputStyle}
                  />
                </Field>

                {usernameMsg && <Msg ok={usernameMsg.ok}>{usernameMsg.text}</Msg>}

                <SaveBtn loading={usernameLoading} onClick={handleUpdateUsername}>
                  Save username
                </SaveBtn>
              </>
            )}

            {section === 'password' && (
              <>
                <SectionTitle>Change password</SectionTitle>

                <Field label="New password">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setPasswordMsg(null) }}
                    placeholder="Min. 6 characters"
                    autoComplete="new-password"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Confirm password">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setPasswordMsg(null) }}
                    placeholder="Repeat new password"
                    autoComplete="new-password"
                    style={inputStyle}
                  />
                </Field>

                {passwordMsg && <Msg ok={passwordMsg.ok}>{passwordMsg.text}</Msg>}

                <SaveBtn loading={passwordLoading} onClick={handleUpdatePassword}>
                  Update password
                </SaveBtn>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)', marginBottom: -4 }}>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11.5, color: 'var(--fg-3)', fontWeight: 500, letterSpacing: '0.03em' }}>
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  )
}

function Msg({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, color: ok ? 'var(--ok)' : 'var(--danger)' }}>{children}</div>
  )
}

function SaveBtn({ loading, onClick, children }: { loading: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        alignSelf: 'flex-start',
        padding: '8px 16px',
        background: 'linear-gradient(180deg, oklch(0.52 0.16 278), oklch(0.46 0.16 278))',
        color: 'white', border: '1px solid oklch(0.62 0.16 278 / 0.6)',
        borderRadius: 8, fontSize: 13, fontWeight: 500,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1, fontFamily: 'inherit',
      }}
    >
      {loading ? 'Saving…' : children}
    </button>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '9px 11px',
  background: 'var(--bg-inset)',
  border: '1px solid var(--border-soft)',
  borderRadius: 8,
  color: 'var(--fg)',
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}
