import { useTheme, type Theme } from '../../lib/theme'

interface Props {
  onClose: () => void
}

const OPTIONS: { value: Theme; label: string; desc: string; icon: string }[] = [
  { value: 'dark',   label: 'Dark',   desc: 'Always dark',          icon: '🌙' },
  { value: 'light',  label: 'Light',  desc: 'Always light',         icon: '☀️' },
  { value: 'system', label: 'System', desc: 'Follows OS preference', icon: '💻' },
]

export function AppearanceModal({ onClose }: Props) {
  const { theme, setTheme } = useTheme()

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
        width: 400, background: 'var(--bg-1)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        padding: '24px 28px 28px',
      }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg)' }}>Appearance</div>
          <button onClick={onClose} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            color: 'var(--fg-3)', fontSize: 18, lineHeight: 1, padding: 4,
          }}>×</button>
        </div>

        <div style={{ fontSize: 12, color: 'var(--fg-4)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>
          Theme
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {OPTIONS.map(opt => {
            const active = theme === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 8, padding: '14px 10px',
                  background: active ? 'var(--accent-bg)' : 'var(--bg-2)',
                  border: active ? '1.5px solid var(--accent)' : '1.5px solid var(--border-soft)',
                  borderRadius: 10, cursor: 'pointer',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                <span style={{ fontSize: 22 }}>{opt.icon}</span>
                <span style={{ fontSize: 12.5, fontWeight: active ? 600 : 400, color: active ? 'var(--accent-fg)' : 'var(--fg-2)' }}>
                  {opt.label}
                </span>
                <span style={{ fontSize: 11, color: 'var(--fg-4)', textAlign: 'center' }}>{opt.desc}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
