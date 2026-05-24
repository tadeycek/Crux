import { useEffect, useRef } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, lineNumbers, highlightActiveLine, highlightActiveLineGutter, keymap } from '@codemirror/view'
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands'
import { python } from '@codemirror/lang-python'
import { bracketMatching, indentOnInput, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'
import { cruxTheme, cruxHighlight } from './editorTheme'
import { PlayIcon, RefreshIcon, CopyIcon, ChevronDownIcon } from '../icons'

interface CodeEditorProps {
  code: string
  onChange: (code: string) => void
  onRun?: () => void
  isRunning?: boolean
}

export function CodeEditor({ code, onChange, onRun, isRunning }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChange(update.state.doc.toString())
      }
    })

    const state = EditorState.create({
      doc: code,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        bracketMatching(),
        indentOnInput(),
        python(),
        cruxTheme,
        cruxHighlight,
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        updateListener,
        EditorView.lineWrapping,
      ],
    })

    const view = new EditorView({ state, parent: editorRef.current })
    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // sync external code changes without rebuilding the editor
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const current = view.state.doc.toString()
    if (current !== code) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: code },
      })
    }
  }, [code])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: 'var(--bg-1)' }}>
      {/* tab bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(180deg, #1d2026 0%, #191b21 100%)',
        borderBottom: '1px solid var(--border-soft)',
        padding: '0 8px 0 0',
      }}>
        {/* tabs */}
        <div style={{ display: 'flex' }}>
          <Tab active label="solution.py" unsaved />
          <Tab label="scratch.py" />
        </div>

        {/* right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingRight: 4 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--fg-2)',
            background: 'var(--bg-2)', border: '1px solid var(--border-soft)',
            borderRadius: 6, padding: '3px 8px',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c-builtin)', flexShrink: 0 }} />
            Python 3.11
            <span style={{ opacity: 0.5, marginLeft: 2, display: 'inline-flex' }}><ChevronDownIcon /></span>
          </span>

          <GhostBtn title="Reset" onClick={() => {}}>
            <RefreshIcon />
          </GhostBtn>
          <GhostBtn title="Copy" onClick={() => navigator.clipboard.writeText(code)}>
            <CopyIcon />
          </GhostBtn>

          <button
            onClick={onRun}
            disabled={isRunning}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: isRunning
                ? 'var(--bg-3)'
                : 'linear-gradient(180deg, oklch(0.52 0.16 278), oklch(0.46 0.16 278))',
              color: isRunning ? 'var(--fg-4)' : 'white',
              border: isRunning ? '1px solid var(--border)' : '1px solid oklch(0.62 0.16 278 / 0.6)',
              borderRadius: 7, padding: '5px 11px 5px 10px',
              fontSize: 12.5, fontWeight: 500,
              cursor: isRunning ? 'not-allowed' : 'pointer',
              boxShadow: isRunning ? 'none' : '0 1px 0 oklch(0.7 0.15 278 / 0.3) inset, 0 1px 2px rgba(0,0,0,0.4)',
            }}
          >
            <PlayIcon />
            <span>{isRunning ? 'Running…' : 'Run'}</span>
            {!isRunning && (
              <kbd style={{
                fontFamily: 'var(--mono)', fontSize: 10.5,
                background: 'rgba(255,255,255,0.13)',
                borderRadius: 4, padding: '1px 5px',
                color: 'oklch(0.95 0.05 278)',
              }}>⌘↵</kbd>
            )}
          </button>
        </div>
      </div>

      {/* CodeMirror mount point */}
      <div ref={editorRef} style={{ flex: 1, minHeight: 0, overflow: 'hidden' }} />
    </div>
  )
}

function Tab({ active, label, unsaved }: { active?: boolean; label: string; unsaved?: boolean }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '8px 12px 9px',
      fontSize: 12.5,
      color: active ? 'var(--fg)' : 'var(--fg-4)',
      background: active ? 'var(--bg-1)' : 'transparent',
      borderRight: '1px solid var(--border-soft)',
      cursor: 'pointer',
      position: 'relative',
    }}>
      {active && (
        <span style={{
          position: 'absolute', left: 0, right: 0, top: -1,
          height: 1.5, background: 'var(--accent)',
        }} />
      )}
      {unsaved && (
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--warn)',
          boxShadow: '0 0 0 3px oklch(0.45 0.11 75 / 0.18)',
        }} />
      )}
      <span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{label}</span>
      {active && <span style={{ color: 'var(--fg-4)', fontSize: 13 }}>×</span>}
    </div>
  )
}

function GhostBtn({ children, title, onClick }: { children: React.ReactNode; title: string; onClick: () => void }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        background: 'transparent', border: '1px solid transparent',
        color: 'var(--fg-2)', borderRadius: 7, padding: 5,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        cursor: 'pointer', fontSize: 13,
        opacity: 0.7,
      }}
    >
      {children}
    </button>
  )
}
