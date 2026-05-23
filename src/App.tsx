import { useState, useEffect } from 'react'
import { TopBar } from './components/layout/TopBar'
import { StatusBar } from './components/layout/StatusBar'
import { ProblemPanel } from './components/problem/ProblemPanel'
import { CodeEditor } from './components/editor/CodeEditor'
import { ChatPanel } from './components/chat/ChatPanel'

const INITIAL_CODE = `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # brute force — check every substring
        longest = 0
        for i in range(len(s)):
            for j in range(i, len(s)):
                window = s[i:j+1]
                if len(set(window)) == len(window):
                    longest = max(longest, j - i + 1)
        return longest

# TODO: there has to be a faster way…`

function App() {
  const [code, setCode] = useState(INITIAL_CODE)
  const [activeLine, setActiveLine] = useState(8)
  const [runState, setRunState] = useState('Last run: 142ms · 6/6 tests passed')

  useEffect(() => {
    const seq = [8, 9, 6, 12, 8]
    let i = 0
    const id = setInterval(() => {
      i = (i + 1) % seq.length
      setActiveLine(seq[i])
    }, 2400)
    return () => clearInterval(id)
  }, [])

  const handleRun = () => {
    setRunState('Running tests…')
    setTimeout(() => setRunState('Last run: 138ms · 6/6 tests passed · brute force'), 900)
  }

  return (
    <div style={{
      height: '100vh',
      display: 'grid',
      gridTemplateRows: '48px 1fr 28px',
      background: 'var(--bg-0)',
    }}>
      <TopBar />

      {/* main content grid — panels will be filled in subsequent PRs */}
      <main style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(360px, 420px) 1fr',
        minHeight: 0,
        borderTop: '1px solid var(--border-soft)',
      }}>
        <ProblemPanel />

        {/* right column: editor top + chat bottom */}
        <div style={{
          display: 'grid',
          gridTemplateRows: 'minmax(0, 1.15fr) 1px minmax(0, 1fr)',
          minHeight: 0,
          minWidth: 0,
        }}>
          <CodeEditor code={code} onChange={setCode} onRun={handleRun} />
          <div style={{ background: 'var(--border-soft)' }} />
          <ChatPanel />
        </div>
      </main>

      <StatusBar
        activeLine={activeLine}
        totalLines={code.split('\n').length}
        savedAt="just now"
        runState={runState}
      />
    </div>
  )
}

export default App
