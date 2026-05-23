import { useState, FormEvent } from 'react'
import { signIn, signUp } from '../../lib/auth'

type Mode = 'login' | 'signup'

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
        setInfo('Check your email to confirm your account, then log in.')
        setMode('login')
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
            <span style={{ color: 'var(--accent)' }}>✦</span> Crux
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: 'var(--fg-3)' }}>
            {mode === 'login' ? 'Sign in to continue' : 'Create your account'}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            style={inputStyle}
          />

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
            {loading ? '…' : mode === 'login' ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        {/* Toggle */}
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--fg-3)' }}>
          {mode === 'login' ? (
            <>No account?{' '}
              <button onClick={() => { setMode('signup'); setError(null); setInfo(null) }} style={linkStyle}>
                Sign up
              </button>
            </>
          ) : (
            <>Already have one?{' '}
              <button onClick={() => { setMode('login'); setError(null); setInfo(null) }} style={linkStyle}>
                Sign in
              </button>
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
