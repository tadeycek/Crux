import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { TopBar } from './components/layout/TopBar'
import { StatusBar } from './components/layout/StatusBar'
import { ProblemPanel } from './components/problem/ProblemPanel'
import { ProblemList } from './components/problem/ProblemList'
import { CodeEditor } from './components/editor/CodeEditor'
import { OutputPanel } from './components/editor/OutputPanel'
import { ChatPanel } from './components/chat/ChatPanel'
import { AuthScreen } from './components/auth/AuthScreen'
import { useAuth, signOut } from './lib/auth'
import { useSession } from './lib/useSession'
import { api } from './lib/api'
import type { ApiProblemDetail, ApiRunResult } from './lib/api'

function App() {
  const { user, loading } = useAuth()
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [runResult, setRunResult] = useState<ApiRunResult | null>(null)

  const { data: problem } = useQuery<ApiProblemDetail>({
    queryKey: ['problem', selectedSlug],
    queryFn: () => api.problems.bySlug(selectedSlug!),
    enabled: !!selectedSlug,
  })

  const { session, sessionDetail, saveCode, isSaving } = useSession(problem?.id ?? null)

  // When session loads, initialise editor with saved code (or starter code)
  useEffect(() => {
    if (session) {
      setCode(session.currentCode || problem?.starterCode || '')
    }
  }, [session?.id])

  function handleSelectProblem(slug: string) {
    setSelectedSlug(slug)
    setCode('')
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
    mutationFn: () => api.sessions.run(session!.id, code, 'python'),
    onSuccess: (data) => setRunResult(data),
  })

  const handleRun = () => {
    if (!session) return
    runMutation.mutate()
  }

  const displayCode = code || problem?.starterCode || ''
  const activeLine = 1

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
      <TopBar userEmail={user.email} onSignOut={signOut} />

      <main style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(360px, 420px) 1fr',
        minHeight: 0,
        borderTop: '1px solid var(--border-soft)',
      }}>
        {problem && selectedSlug ? (
          <ProblemPanel problem={problem} onBack={handleBack} />
        ) : (
          <ProblemList onSelect={handleSelectProblem} />
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
              onChange={handleCodeChange}
              onRun={handleRun}
              isRunning={runMutation.isPending}
            />
            <div style={{ background: 'var(--border-soft)' }} />
            <OutputPanel result={runResult} isRunning={runMutation.isPending} />
          </div>

          <div style={{ background: 'var(--border-soft)' }} />
          <ChatPanel sessionId={session?.id} messages={sessionDetail?.messages} />
        </div>
      </main>

      <StatusBar
        activeLine={activeLine}
        totalLines={displayCode.split('\n').length}
        savedAt={isSaving ? 'Saving…' : 'Saved'}
        isRunning={runMutation.isPending}
      />
    </div>
  )
}

export default App
