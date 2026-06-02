import type { ApiRunResult } from '../../lib/api'

interface OutputPanelProps {
  result: ApiRunResult | null
  isRunning: boolean
  error?: Error | null
}

export function OutputPanel({ result, isRunning, error }: OutputPanelProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--bg-0)', fontFamily: 'var(--mono)', fontSize: 12.5,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 12px',
        background: 'var(--bg-2)',
        borderBottom: '1px solid var(--border-soft)',
        fontSize: 12, color: 'var(--fg-3)',
      }}>
        <span style={{ fontWeight: 600, color: 'var(--fg-2)' }}>Output</span>
        {result && !isRunning && !error && (
          <span style={{
            marginLeft: 'auto',
            color: result.exitCode === 0 ? 'var(--ok)' : 'var(--danger)',
            fontSize: 11,
          }}>
            exit {result.exitCode}
          </span>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '10px 14px' }}>
        {isRunning ? (
          <span style={{ color: 'var(--fg-4)' }}>Running…</span>
        ) : error ? (
          <div style={{ color: 'var(--danger)', fontSize: 13, lineHeight: 1.5 }}>
            <strong>Execution Failed:</strong>
            <pre style={{ margin: '6px 0 0', whiteSpace: 'pre-wrap', fontFamily: 'var(--mono)', fontSize: 12 }}>{error.message}</pre>
          </div>
        ) : !result ? (
          <span style={{ color: 'var(--fg-4)' }}>Press Run to execute your code.</span>
        ) : (
          <>
            {result.stdout && (
              <pre style={{ margin: 0, color: 'var(--fg)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {result.stdout}
              </pre>
            )}
            {result.stderr && (
              <pre style={{ margin: result.stdout ? '8px 0 0' : 0, color: 'var(--danger)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {result.stderr}
              </pre>
            )}
            {!result.stdout && !result.stderr && (
              <span style={{ color: 'var(--fg-4)' }}>No output.</span>
            )}
          </>
        )}
      </div>
    </div>
  )
}
