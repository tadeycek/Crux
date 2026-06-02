import { DotIcon, BranchIcon } from '../icons'

interface StatusBarProps {
  activeLine: number
  totalLines: number
  savedAt: string
  isRunning?: boolean
}

export function StatusBar({ activeLine, totalLines, savedAt, isRunning }: StatusBarProps) {
  return (
    <footer style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'var(--bg-1)',
      borderTop: '1px solid var(--border-soft)',
      padding: '0 12px',
      fontFamily: 'var(--mono)',
      fontSize: 11,
      color: 'var(--fg-3)',
      userSelect: 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <span style={{ color: 'var(--ok)', display: 'inline-flex' }}><DotIcon /></span>
          Connected
        </span>
        <Divider />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <span style={{ opacity: 0.65, display: 'inline-flex' }}><BranchIcon /></span>
          session/two-pointer-warmup
        </span>
        <Divider />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          Python 3.11.6 · pypy off
        </span>
        <Divider />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          Tutor: gpt-4o-mini · Socratic
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ whiteSpace: 'nowrap', color: isRunning ? 'var(--warn)' : 'var(--fg-3)' }}>
          {isRunning ? 'Running…' : 'Ready'}
        </span>
        <Divider />
        <span style={{ whiteSpace: 'nowrap' }}>Ln {activeLine}, Col 1 · {totalLines} lines</span>
        <Divider />
        <span style={{ whiteSpace: 'nowrap' }}>UTF-8 · LF · 4 spaces</span>
        <Divider />
        <span style={{ whiteSpace: 'nowrap', color: savedAt === 'Save failed' ? 'var(--danger)' : 'inherit' }}>{savedAt}</span>
      </div>
    </footer>
  )
}

function Divider() {
  return (
    <span style={{ width: 1, height: 12, background: 'var(--border)', flexShrink: 0 }} />
  )
}
