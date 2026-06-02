export function ComingSoonView({ label }: { label: string }) {
  const title = label.charAt(0).toUpperCase() + label.slice(1)
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-0)', gap: 10,
    }}>
      <span style={{ fontSize: 32, opacity: 0.15 }}>🚧</span>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg-2)', letterSpacing: '-0.01em' }}>
        {title}
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--fg-4)' }}>Coming soon</div>
    </div>
  )
}
