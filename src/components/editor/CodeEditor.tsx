import { useEffect, useRef, useState } from 'react'
import { Compartment, EditorState } from '@codemirror/state'
import { EditorView, lineNumbers, highlightActiveLine, highlightActiveLineGutter, keymap } from '@codemirror/view'
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { cpp } from '@codemirror/lang-cpp'
import { bracketMatching, indentOnInput, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'
import { cruxTheme, cruxHighlight } from './editorTheme'
import { PlayIcon, RefreshIcon, CopyIcon, ChevronDownIcon } from '../icons'

export type Language = 'python' | 'javascript' | 'java' | 'cpp'

export const LANGUAGE_META: Record<Language, { label: string; version: string; ext: string; fence: string }> = {
  python:     { label: 'Python',     version: '3.10',    ext: 'py',   fence: 'python'     },
  javascript: { label: 'JavaScript', version: 'Node 18', ext: 'js',   fence: 'javascript' },
  java:       { label: 'Java',       version: '15',      ext: 'java', fence: 'java'       },
  cpp:        { label: 'C++',        version: 'GCC 10',  ext: 'cpp',  fence: 'cpp'        },
}

function getLangExtension(lang: Language) {
  switch (lang) {
    case 'python':     return python()
    case 'javascript': return javascript()
    case 'java':       return javascript()
    case 'cpp':        return cpp()
  }
}

type TabId = 'solution' | 'scratch'

interface CodeEditorProps {
  code: string
  language: Language
  onLanguageChange: (lang: Language) => void
  onChange: (code: string) => void
  onRun?: () => void
  onReset?: () => void
  isRunning?: boolean
}

export function CodeEditor({ code, language, onLanguageChange, onChange, onRun, onReset, isRunning }: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState<TabId>('solution')
  // scratch content is local — it's a personal notepad, not saved to session
  const [scratchCode, setScratchCode] = useState('')
  const [showLangMenu, setShowLangMenu] = useState(false)

  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const langCompartment = useRef(new Compartment())
  const langBtnRef = useRef<HTMLDivElement>(null)
  // track which tab the current EditorView instance is showing
  const activeTabRef = useRef<TabId>('solution')

  const meta = LANGUAGE_META[language]

  // Current content for the active tab
  const activeCode = activeTab === 'solution' ? code : scratchCode

  // Build a fresh EditorView whenever the tab switches
  useEffect(() => {
    if (!editorRef.current) return

    // destroy previous instance
    if (viewRef.current) {
      viewRef.current.destroy()
      viewRef.current = null
    }

    activeTabRef.current = activeTab

    const updateListener = EditorView.updateListener.of((update) => {
      if (!update.docChanged) return
      const value = update.state.doc.toString()
      if (activeTabRef.current === 'solution') {
        onChange(value)
      } else {
        setScratchCode(value)
      }
    })

    const state = EditorState.create({
      doc: activeTab === 'solution' ? code : scratchCode,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        bracketMatching(),
        indentOnInput(),
        langCompartment.current.of(getLangExtension(language)),
        cruxTheme,
        cruxHighlight,
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        updateListener,
        EditorView.lineWrapping,
      ],
    })

    viewRef.current = new EditorView({ state, parent: editorRef.current })

    return () => {
      viewRef.current?.destroy()
      viewRef.current = null
    }
  // Intentionally only re-run when the tab changes — content syncs via the effect below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  // Sync external code changes into the solution editor without rebuilding
  useEffect(() => {
    if (activeTab !== 'solution') return
    const view = viewRef.current
    if (!view) return
    const current = view.state.doc.toString()
    if (current !== code) {
      view.dispatch({ changes: { from: 0, to: current.length, insert: code } })
    }
  }, [code, activeTab])

  // Swap language extension without rebuilding
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    view.dispatch({ effects: langCompartment.current.reconfigure(getLangExtension(language)) })
  }, [language])

  // Close lang menu on outside click
  useEffect(() => {
    if (!showLangMenu) return
    function handle(e: MouseEvent) {
      if (langBtnRef.current && !langBtnRef.current.contains(e.target as Node)) {
        setShowLangMenu(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [showLangMenu])

  const solutionUnsaved = activeTab === 'solution' // dot indicator on active tab

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: 'var(--bg-1)' }}>
      {/* tab bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-2)',
        borderBottom: '1px solid var(--border-soft)',
        padding: '0 8px 0 0',
      }}>
        {/* tabs */}
        <div style={{ display: 'flex' }}>
          <Tab
            active={activeTab === 'solution'}
            label={`solution.${meta.ext}`}
            unsaved={activeTab === 'solution' && solutionUnsaved}
            onClick={() => setActiveTab('solution')}
          />
          <Tab
            active={activeTab === 'scratch'}
            label={`scratch.${meta.ext}`}
            onClick={() => setActiveTab('scratch')}
          />
        </div>

        {/* right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingRight: 4 }}>
          {/* language picker */}
          <div ref={langBtnRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLangMenu(v => !v)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--fg-2)',
                background: 'var(--bg-2)', border: '1px solid var(--border-soft)',
                borderRadius: 6, padding: '3px 8px', cursor: 'pointer',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c-builtin)', flexShrink: 0 }} />
              {meta.label} {meta.version}
              <span style={{ opacity: 0.5, marginLeft: 2, display: 'inline-flex' }}><ChevronDownIcon /></span>
            </button>
            {showLangMenu && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, marginTop: 4,
                background: 'var(--bg-2)', border: '1px solid var(--border)',
                borderRadius: 8, padding: 4, zIndex: 100, minWidth: 160,
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}>
                {(Object.keys(LANGUAGE_META) as Language[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => { onLanguageChange(lang); setShowLangMenu(false) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      width: '100%', textAlign: 'left',
                      background: lang === language ? 'var(--bg-3)' : 'transparent',
                      border: 0, cursor: 'pointer',
                      color: 'var(--fg-2)', fontSize: 12.5,
                      padding: '6px 10px', borderRadius: 5,
                      fontFamily: 'var(--mono)',
                    }}
                    onMouseEnter={e => { if (lang !== language) e.currentTarget.style.background = 'var(--bg-3)' }}
                    onMouseLeave={e => { if (lang !== language) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span style={{ flex: 1 }}>{LANGUAGE_META[lang].label}</span>
                    <span style={{ color: 'var(--fg-4)', fontSize: 11 }}>{LANGUAGE_META[lang].version}</span>
                    {lang === language && <span style={{ color: 'var(--accent)', fontSize: 11 }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <GhostBtn title="Reset" onClick={onReset ?? (() => {})}>
            <RefreshIcon />
          </GhostBtn>
          <GhostBtn title="Copy" onClick={() => navigator.clipboard.writeText(activeCode)}>
            <CopyIcon />
          </GhostBtn>

          <button
            onClick={activeTab === 'solution' ? onRun : undefined}
            disabled={isRunning || activeTab === 'scratch'}
            title={activeTab === 'scratch' ? 'Switch to solution tab to run' : undefined}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: (isRunning || activeTab === 'scratch')
                ? 'var(--bg-3)'
                : 'linear-gradient(180deg, oklch(0.52 0.16 278), oklch(0.46 0.16 278))',
              color: (isRunning || activeTab === 'scratch') ? 'var(--fg-4)' : 'white',
              border: (isRunning || activeTab === 'scratch')
                ? '1px solid var(--border)'
                : '1px solid oklch(0.62 0.16 278 / 0.6)',
              borderRadius: 7, padding: '5px 11px 5px 10px',
              fontSize: 12.5, fontWeight: 500,
              cursor: (isRunning || activeTab === 'scratch') ? 'not-allowed' : 'pointer',
              boxShadow: (isRunning || activeTab === 'scratch') ? 'none' : '0 1px 0 oklch(0.7 0.15 278 / 0.3) inset, 0 1px 2px rgba(0,0,0,0.4)',
            }}
          >
            <PlayIcon />
            <span>{isRunning ? 'Running…' : 'Run'}</span>
            {!isRunning && activeTab === 'solution' && (
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

      {/* scratch tab hint */}
      {activeTab === 'scratch' && (
        <div style={{
          fontSize: 11.5, color: 'var(--fg-4)', padding: '5px 14px',
          background: 'var(--bg-inset)', borderBottom: '1px solid var(--border-soft)',
          fontFamily: 'var(--mono)',
        }}>
          Scratch pad — not saved to session. Use freely for notes or experiments.
        </div>
      )}

      {/* CodeMirror mount point */}
      <div ref={editorRef} style={{ flex: 1, minHeight: 0, overflow: 'hidden' }} />
    </div>
  )
}

function Tab({ active, label, unsaved, onClick }: { active?: boolean; label: string; unsaved?: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '8px 12px 9px',
        fontSize: 12.5,
        color: active ? 'var(--fg)' : 'var(--fg-4)',
        background: active ? 'var(--bg-1)' : 'transparent',
        borderRight: '1px solid var(--border-soft)',
        cursor: 'pointer',
        position: 'relative',
        userSelect: 'none',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-2)' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
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
        cursor: 'pointer', fontSize: 13, opacity: 0.7,
      }}
    >
      {children}
    </button>
  )
}
