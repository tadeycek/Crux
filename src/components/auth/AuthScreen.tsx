import { useState } from 'react'
import type { FormEvent } from 'react'
import { signIn, signUp, resetPassword } from '../../lib/auth'

type Mode = 'login' | 'signup' | 'forgot'

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>('login')
  const [identifier, setIdentifier] = useState('')   // email or username on login
  const [email, setEmail] = useState('')              // signup only
  const [username, setUsername] = useState('')        // signup only
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setInfo(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (mode === 'signup') {
      if (!username.trim()) { setError('Username is required'); return }
      if (username.includes('@')) { setError('Username cannot contain @'); return }
      if (password !== confirmPassword) { setError('Passwords do not match'); return }
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(identifier, password)
      } else if (mode === 'signup') {
        await signUp(email, password, username.trim())
        setInfo('Check your email to confirm your account, then log in.')
        switchMode('login')
      } else {
        await resetPassword(email)
        setInfo('Password reset email sent — check your inbox.')
        switchMode('login')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-0)',
    }}>
      <div style={{
        width: 360,
        background: 'var(--bg-1)',
        border: '1px solid var(--border-soft)',
        borderRadius: 12,
        padding: '36px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 22, fontWeight: 700, color: 'var(--fg)',
            letterSpacing: '-0.5px',
          }}>
            <span style={{ color: 'var(--accent)' }}>✦</span> Telery
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: 'var(--fg-3)' }}>
            {mode === 'login' ? 'Sign in to continue' : mode === 'signup' ? 'Create your account' : 'Reset your password'}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'login' ? (
            <input
              type="text"
              placeholder="Email or username"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              required
              autoComplete="username"
              style={inputStyle}
            />
          ) : (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          )}

          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoComplete="username"
              style={inputStyle}
            />
          )}

          {(mode === 'login' || mode === 'signup') && (
            <>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                style={inputStyle}
              />
              {mode === 'login' && (
                <div style={{ textAlign: 'right', marginTop: -4 }}>
                  <button type="button" onClick={() => switchMode('forgot')} style={{ ...linkStyle, fontSize: 12 }}>
                    Forgot password?
                  </button>
                </div>
              )}
            </>
          )}

          {mode === 'signup' && (
            <input
              type="password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              style={inputStyle}
            />
          )}

          {error && (
            <div style={{ fontSize: 12, color: 'var(--danger)', padding: '6px 0' }}>
              {error}
            </div>
          )}
          {info && (
            <div style={{ fontSize: 12, color: 'var(--ok)', padding: '6px 0' }}>
              {info}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              padding: '10px 0',
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontFamily: 'inherit',
            }}
          >
            {loading ? '…' : mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Sign up' : 'Send reset email'}
          </button>
        </form>

        {/* Toggle */}
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--fg-3)' }}>
          {mode === 'login' ? (
            <>No account?{' '}
              <button onClick={() => switchMode('signup')} style={linkStyle}>Sign up</button>
            </>
          ) : (
            <>
              <button onClick={() => switchMode('login')} style={linkStyle}>Back to sign in</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  background: 'var(--bg-inset)',
  border: '1px solid var(--border-soft)',
  borderRadius: 8,
  color: 'var(--fg)',
  fontSize: 14,
  fontFamily: 'inherit',
  outline: 'none',
}

const linkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--accent)',
  cursor: 'pointer',
  fontSize: 13,
  fontFamily: 'inherit',
  padding: 0,
}
