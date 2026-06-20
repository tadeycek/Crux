import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LogoIcon, SearchIcon } from '../icons'
import { AvatarMenu } from './AvatarMenu'
import { api } from '../../lib/api'
import type { SettingsSection } from '../settings/SettingsPage'

const NAV_ITEMS = ['Practice', 'Concepts', 'Playlists', 'Progress'] as const

interface TopBarProps {
  userEmail?: string
  onOpenSettings?: (section: SettingsSection) => void
  activeView?: string
  onNavChange?: (view: string) => void
  searchQuery?: string
  onSearchChange?: (q: string) => void
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPod|iPad/.test(navigator.platform)

export function TopBar({ userEmail, onOpenSettings, activeView = 'practice', onNavChange, searchQuery = '', onSearchChange }: TopBarProps) {
  const [copied, setCopied] = useState(false)
  const { data: progressSummary } = useQuery({
    queryKey: ['progress-summary'],
    queryFn: () => api.progress.summary(),
    staleTime: 5 * 60_000,
  })

  function handleShare() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <header style={{
      display: 'grid',
      gridTemplateColumns: '1fr minmax(280px, 460px) 1fr',
      alignItems: 'center',
      padding: '0 14px',
      gap: '16px',
      background: 'var(--bg-1)',
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
            telery<span style={{ color: 'var(--accent)' }}>.</span>dev
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.toLowerCase()
            return (
              <button
                key={item}
                onClick={() => onNavChange?.(item.toLowerCase())}
                style={{
                  background: isActive ? 'var(--bg-2)' : 'transparent',
                  border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                  cursor: 'pointer',
                  color: isActive ? 'var(--fg)' : 'var(--fg-3)',
                  padding: '6px 10px',
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {item}
              </button>
            )
          })}
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
        }}>
          <span style={{ opacity: 0.55, display: 'inline-flex', flexShrink: 0 }}><SearchIcon /></span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange?.(e.target.value)}
            placeholder="Jump to problem, concept, or session…"
            style={{
              flex: 1, background: 'transparent', border: 0, outline: 'none',
              color: 'var(--fg)', fontSize: 13, fontFamily: 'inherit',
            }}
          />
          {!searchQuery && (
            <kbd style={{
              fontFamily: 'var(--mono)', fontSize: 11,
              background: 'var(--bg-3)', color: 'var(--fg-2)',
              padding: '1px 6px', borderRadius: 5,
              border: '1px solid var(--border)', borderBottomWidth: 2,
              flexShrink: 0,
            }}>{isMac ? '⌘K' : 'Ctrl+K'}</kbd>
          )}
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
          <span style={{ color: 'var(--fg)', fontWeight: 600 }}>{progressSummary?.streak ?? 0}</span>
          <span style={{ color: 'var(--fg-3)' }}>day streak</span>
        </div>

        <button
          onClick={handleShare}
          style={{
            background: 'transparent', border: '1px solid transparent',
            color: copied ? 'var(--ok)' : 'var(--fg-2)', borderRadius: 7, padding: '5px 10px',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            cursor: 'pointer', fontSize: 13, transition: 'color 0.2s',
          }}
        >
          {copied ? 'Copied!' : 'Share session'}
        </button>

        <AvatarMenu
          userEmail={userEmail}
          onOpenSettings={onOpenSettings ?? (() => {})}
        />
      </div>
    </header>
  )
}
