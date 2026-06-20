import { Component } from 'react'
import type { ReactNode } from 'react'

interface Props {
  label: string
  children: ReactNode
}

export class PanelErrorBoundary extends Component<Props, { error: Error | null }> {
  state = { error: null }

  static getDerivedStateFromError(error: Error) { return { error } }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          flex: 1, gap: 10, padding: 24, background: 'var(--bg-1)',
        }}>
          <div style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 600 }}>
            {this.props.label} failed to load
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--fg-4)', fontFamily: 'var(--mono)' }}>
            {(this.state.error as Error).message}
          </div>
          <button
            onClick={() => this.setState({ error: null })}
            style={{
              padding: '6px 14px', background: 'var(--bg-2)', color: 'var(--fg)',
              border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', fontSize: 12,
            }}
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
