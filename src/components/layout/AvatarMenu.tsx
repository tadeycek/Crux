import { useState, useEffect, useRef } from 'react'
import { signOut, fetchProfile } from '../../lib/auth'
import { supabase } from '../../lib/supabase'
import type { SettingsSection } from '../settings/SettingsPage'

interface Props {
  userEmail?: string
  onOpenSettings: (section: SettingsSection) => void
}

export function AvatarMenu({ userEmail, onOpenSettings }: Props) {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) return
      try {
        const profile = await fetchProfile(token)
        setUsername(profile.username)
      } catch { /* ignore */ }
    }
    load()
  }, [])

  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const initial = userEmail?.[0].toUpperCase() ?? '?'

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      {/* avatar button */}
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          width: 26, height: 26, borderRadius: '50%',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 600,
          background: 'linear-gradient(135deg, oklch(0.55 0.12 30), oklch(0.45 0.13 350))',
          color: 'white', flexShrink: 0, cursor: 'pointer',
          outline: open ? '2px solid var(--accent)' : 'none',
          outlineOffset: 1,
        }}
      >
        {initial}
      </div>

      {/* dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          zIndex: 300, minWidth: 220,
          background: 'var(--bg-2)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}>
          {/* user info header */}
          <div style={{
            padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
            borderBottom: '1px solid var(--border-soft)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700,
              background: 'linear-gradient(135deg, oklch(0.55 0.12 30), oklch(0.45 0.13 350))',
              color: 'white',
            }}>
              {initial}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {username ?? '—'}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userEmail}
              </div>
            </div>
          </div>

          {/* menu items */}
          <div style={{ padding: '4px' }}>
            <MenuItem onClick={() => { onOpenSettings('profile'); setOpen(false) }}>
              <ItemIcon>⚙</ItemIcon> Profile &amp; Settings
            </MenuItem>
            <MenuItem onClick={() => { onOpenSettings('appearance'); setOpen(false) }}>
              <ItemIcon>◑</ItemIcon> Appearance
            </MenuItem>
          </div>

          <div style={{ borderTop: '1px solid var(--border-soft)', padding: '4px' }}>
            <MenuItem onClick={signOut} danger>
              <ItemIcon>↪</ItemIcon> Sign out
            </MenuItem>
          </div>
        </div>
      )}
    </div>
  )
}

function MenuItem({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        width: '100%', textAlign: 'left',
        background: hovered ? (danger ? 'oklch(0.34 0.09 25 / 0.25)' : 'var(--bg-3)') : 'transparent',
        border: 0, cursor: 'pointer',
        color: danger ? 'var(--danger)' : 'var(--fg-2)',
        fontSize: 13, padding: '7px 10px', borderRadius: 6,
      }}
    >
      {children}
    </button>
  )
}

function ItemIcon({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 13, opacity: 0.7, width: 16, textAlign: 'center', flexShrink: 0 }}>
      {children}
    </span>
  )
}
