import { LogoIcon, SearchIcon } from '../icons'

const NAV_ITEMS = ['Practice', 'Concepts', 'Playlists', 'Progress'] as const

interface TopBarProps {
  userEmail?: string
  onSignOut?: () => void
}

export function TopBar({ userEmail, onSignOut }: TopBarProps) {
  return (
    <header style={{
      display: 'grid',
      gridTemplateColumns: '1fr minmax(280px, 460px) 1fr',
      alignItems: 'center',
      padding: '0 14px',
      gap: '16px',
      background: 'linear-gradient(180deg, #1a1d23 0%, #181a20 100%)',
      borderBottom: '1px solid var(--border-soft)',
      userSelect: 'none',
    }}>
      {/* left: brand + nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, minWidth: 0 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          color: 'var(--fg)', fontWeight: 600, letterSpacing: '-0.01em', fontSize: 14,
        }}>
          <span style={{ display: 'inline-flex', color: 'var(--accent-2)' }}>
            <LogoIcon size={18} />
          </span>
          <span style={{ fontFamily: 'var(--sans)' }}>
            think<span style={{ color: 'var(--accent)' }}>.</span>dev
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              style={{
                background: item === 'Practice' ? 'var(--bg-2)' : 'transparent',
                border: item === 'Practice' ? '1px solid var(--border)' : '1px solid transparent',
                cursor: 'pointer',
                color: item === 'Practice' ? 'var(--fg)' : 'var(--fg-3)',
                padding: '6px 10px',
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 500,
                boxShadow: item === 'Practice' ? 'inset 0 0 0 0' : 'none',
              }}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* center: search */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '100%', maxWidth: 460,
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--bg-1)',
          border: '1px solid var(--border-soft)',
          borderRadius: 9,
          padding: '6px 10px',
          color: 'var(--fg-3)',
          fontSize: 13,
          cursor: 'text',
        }}>
          <span style={{ opacity: 0.55, display: 'inline-flex' }}><SearchIcon /></span>
          <span style={{ flex: 1 }}>Jump to problem, concept, or session…</span>
          <kbd style={{
            fontFamily: 'var(--mono)', fontSize: 11,
            background: '#2a2d36', color: 'var(--fg-2)',
            padding: '1px 6px', borderRadius: 5,
            border: '1px solid var(--border)', borderBottomWidth: 2,
          }}>⌘K</kbd>
        </div>
      </div>

      {/* right: streak + share + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--bg-1)', border: '1px solid var(--border-soft)',
          padding: '4px 9px', borderRadius: 999, fontSize: 12,
        }}>
          <span style={{ color: 'var(--warn)', fontSize: 10 }}>▲</span>
          <span style={{ color: 'var(--fg)', fontWeight: 600 }}>12</span>
          <span style={{ color: 'var(--fg-3)' }}>day streak</span>
        </div>

        <button style={{
          background: 'transparent', border: '1px solid transparent',
          color: 'var(--fg-2)', borderRadius: 7, padding: '5px 10px',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          cursor: 'pointer', fontSize: 13,
        }}>
          Share session
        </button>

        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 600,
          background: 'linear-gradient(135deg, oklch(0.55 0.12 30), oklch(0.45 0.13 350))',
          color: 'white', flexShrink: 0,
          cursor: onSignOut ? 'pointer' : 'default',
          title: userEmail,
        }}
          onClick={onSignOut}
        >
          {userEmail ? userEmail[0].toUpperCase() : 'M'}
        </div>
      </div>
    </header>
  )
}
