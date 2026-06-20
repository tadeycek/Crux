import { useState, useEffect, Component } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { TopBar } from './components/layout/TopBar'
import { StatusBar } from './components/layout/StatusBar'
import { ComingSoonView } from './components/layout/ComingSoonView'
import { ProblemPanel } from './components/problem/ProblemPanel'
import { ProblemList } from './components/problem/ProblemList'
import { CodeEditor } from './components/editor/CodeEditor'
import { OutputPanel } from './components/editor/OutputPanel'
import { ChatPanel } from './components/chat/ChatPanel'
import { AuthScreen } from './components/auth/AuthScreen'
import { SettingsPage, type SettingsSection } from './components/settings/SettingsPage'
import { UpgradeModal } from './components/billing/UpgradeModal'
import { ConceptsDashboard } from './components/concepts/ConceptsDashboard'
import { ConceptDetail } from './components/concepts/ConceptDetail'
import { PlaylistsView } from './components/layout/PlaylistsView'
import { ProgressView } from './components/layout/ProgressView'
import { PanelErrorBoundary } from './components/layout/PanelErrorBoundary'
import { useAuth } from './lib/auth'
import { useSession } from './lib/useSession'
import { useLanguage } from './lib/useLanguage'
import { api } from './lib/api'
import type { ApiProblemDetail, ApiRunResult } from './lib/api'
import { getStarterCode } from './data/starterCode'
import { LANGUAGE_META } from './components/editor/CodeEditor'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('Uncaught error:', error, info.componentStack)
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          height: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-0)', gap: 16,
        }}>
          <div style={{ fontSize: 15, color: 'var(--fg)', fontWeight: 600 }}>Something went wrong</div>
          <div style={{ fontSize: 12, color: 'var(--fg-4)', fontFamily: 'var(--mono)' }}>
            {(this.state.error as Error).message}
          </div>
          <button
            onClick={() => this.setState({ error: null })}
            style={{
              padding: '8px 18px', background: 'var(--accent)', color: '#fff',
              border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 13,
            }}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function parseLocation(pathname: string): { view: string; slug: string | null; conceptSlug: string | null } {
  const [, seg1, seg2] = pathname.split('/')
  if (seg1 === 'practice') return { view: 'practice', slug: seg2 ?? null, conceptSlug: null }
  if (seg1 === 'concepts') return { view: 'concepts', slug: null, conceptSlug: seg2 ?? null }
  if (seg1 === 'playlists') return { view: 'playlists', slug: null, conceptSlug: null }
  if (seg1 === 'progress') return { view: 'progress', slug: null, conceptSlug: null }
  return { view: 'concepts', slug: null, conceptSlug: null }
}

function App() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const initial = parseLocation(location.pathname)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initial.slug)
  const [code, setCode] = useState('')
  const [runResult, setRunResult] = useState<ApiRunResult | null>(null)
  const [activeView, setActiveView] = useState(initial.view)
  const [activeConceptSlug, setActiveConceptSlug] = useState<string | null>(initial.conceptSlug)
  const [searchQuery, setSearchQuery] = useState('')
  const { language, setLanguage } = useLanguage()
  const [settingsSection, setSettingsSection] = useState<SettingsSection | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const { data: problem } = useQuery<ApiProblemDetail>({
    queryKey: ['problem', selectedSlug],
    queryFn: () => api.problems.bySlug(selectedSlug!),
    enabled: !!selectedSlug,
  })

  const { session, sessionDetail, saveCode, isSaving, saveError } = useSession(problem?.id ?? null)

  // When session loads, initialise editor with saved code (or language-appropriate starter)
  useEffect(() => {
    if (!session || !problem) return
    const pythonStarter = problem.starterCode
    const savedCode = session.currentCode

    // If the session code is the unchanged Python default and the user wants another
    // language, replace it with the appropriate starter for that language.
    const isDefaultStarter = !savedCode || savedCode === pythonStarter
    const starter = isDefaultStarter
      ? getStarterCode(problem.slug, language, pythonStarter)
      : savedCode

    setCode(starter)
  }, [session?.id])

  // Keep URL in sync with app state
  useEffect(() => {
    let path = '/'
    if (activeView === 'practice') path = selectedSlug ? `/practice/${selectedSlug}` : '/practice'
    else if (activeView === 'concepts') path = activeConceptSlug ? `/concepts/${activeConceptSlug}` : '/concepts'
    else if (activeView === 'playlists') path = '/playlists'
    else if (activeView === 'progress') path = '/progress'
    if (location.pathname !== path) navigate(path, { replace: true })
  }, [activeView, selectedSlug, activeConceptSlug]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelectProblem(slug: string) {
    setSelectedSlug(slug)
    setCode('')
    setActiveView('practice')
  }

  function handleSearchChange(q: string) {
    setSearchQuery(q)
    if (q.trim()) setActiveView('practice')
  }

  function handleBack() {
    setSelectedSlug(null)
    setCode('')
  }

  function handleCodeChange(newCode: string) {
    setCode(newCode)
    saveCode(newCode)
  }

  const runMutation = useMutation({
    mutationFn: () => api.sessions.run(session!.id, code, language),
    onSuccess: (data) => setRunResult(data),
  })

  const handleRun = () => {
    if (!session) return
    runMutation.mutate()
  }

  const displayCode = code || problem?.starterCode || ''
  const [cursorLine, setCursorLine] = useState(1)
  const [cursorCol, setCursorCol] = useState(1)

  if (loading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-0)', color: 'var(--fg-3)', fontSize: 13,
      }}>
        Loading…
      </div>
    )
  }

  if (!user) return <AuthScreen />

  return (
    <div style={{
      height: '100vh',
      display: 'grid',
      gridTemplateRows: '48px 1fr 28px',
      background: 'var(--bg-0)',
    }}>
      <TopBar
        userEmail={user.email}
        onOpenSettings={setSettingsSection}
        activeView={activeView}
        onNavChange={(view) => {
          setActiveView(view)
          if (view !== 'concepts') setActiveConceptSlug(null)
        }}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <main style={{
        display: 'grid',
        gridTemplateColumns: activeView === 'practice' ? 'minmax(360px, 420px) 1fr' : '1fr',
        minHeight: 0,
        borderTop: '1px solid var(--border-soft)',
      }}>
        {activeView === 'concepts' && (
          <PanelErrorBoundary label="Concepts">
            {activeConceptSlug
              ? <ConceptDetail
                  slug={activeConceptSlug}
                  onBack={() => setActiveConceptSlug(null)}
                  onPractice={(problemSlug) => {
                    setActiveView('practice')
                    setActiveConceptSlug(null)
                    setSelectedSlug(problemSlug)
                  }}
                />
              : <ConceptsDashboard onOpen={setActiveConceptSlug} />
            }
          </PanelErrorBoundary>
        )}
        {activeView === 'playlists' && (
          <PanelErrorBoundary label="Playlists">
            <PlaylistsView
              onSelectProblem={(slug) => {
                setActiveView('practice')
                handleSelectProblem(slug)
              }}
            />
          </PanelErrorBoundary>
        )}
        {activeView === 'progress' && (
          <PanelErrorBoundary label="Progress">
            <ProgressView
              onResumeProblem={(slug) => {
                setActiveView('practice')
                handleSelectProblem(slug)
              }}
            />
          </PanelErrorBoundary>
        )}
        {activeView !== 'practice' && activeView !== 'concepts' && activeView !== 'playlists' && activeView !== 'progress' && (
          <ComingSoonView label={activeView} />
        )}
        {activeView === 'practice' && (
          <>
            {problem && selectedSlug ? (
              <ProblemPanel problem={problem} onBack={handleBack} />
            ) : (
              <ProblemList onSelect={handleSelectProblem} searchQuery={searchQuery} />
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 1px minmax(280px, 380px)',
              minHeight: 0,
              minWidth: 0,
            }}>
              {/* editor + output stacked */}
              <div style={{ display: 'grid', gridTemplateRows: 'minmax(0, 1.4fr) 1px minmax(120px, 220px)', minHeight: 0 }}>
                <CodeEditor
                  code={displayCode}
                  language={language}
                  onLanguageChange={setLanguage}
                  onChange={handleCodeChange}
                  onRun={handleRun}
                  onReset={() => setCode(getStarterCode(problem?.slug ?? '', language, problem?.starterCode ?? ''))}
                  onCursorChange={(line, col) => { setCursorLine(line); setCursorCol(col) }}
                  isRunning={runMutation.isPending}
                />
                <div style={{ background: 'var(--border-soft)' }} />
                <OutputPanel result={runResult} isRunning={runMutation.isPending} error={runMutation.error} />
              </div>

              <div style={{ background: 'var(--border-soft)' }} />
              <PanelErrorBoundary label="AI Tutor">
                <ChatPanel
                  sessionId={session?.id}
                  messages={sessionDetail?.messages}
                  code={displayCode}
                  language={language}
                  runResult={runResult}
                  onLimitReached={() => setShowUpgradeModal(true)}
                />
              </PanelErrorBoundary>
            </div>
          </>
        )}
      </main>

      <StatusBar
        activeLine={cursorLine}
        activeCol={cursorCol}
        totalLines={displayCode.split('\n').length}
        savedAt={saveError ? 'Save failed' : isSaving ? 'Saving…' : 'Saved'}
        isRunning={runMutation.isPending}
        language={activeView === 'practice' ? `${LANGUAGE_META[language].label} ${LANGUAGE_META[language].version}` : undefined}
        problemSlug={selectedSlug}
      />

      {settingsSection && user && (
        <SettingsPage
          user={user}
          initialSection={settingsSection}
          onClose={() => setSettingsSection(null)}
        />
      )}

      {showUpgradeModal && (
        <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
      )}
    </div>
  )
}

function AppWithBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  )
}

export default AppWithBoundary
