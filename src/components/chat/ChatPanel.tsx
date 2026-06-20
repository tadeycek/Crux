import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { TutorAvatarIcon, SparkIcon, TestTubeIcon, SendIcon, BranchIcon, MoreIcon } from '../icons'
import { api } from '../../lib/api'
import type { ApiMessage, ApiRunResult } from '../../lib/api'
import { LANGUAGE_META, type Language } from '../editor/CodeEditor'
import { useBilling } from '../../lib/useBilling'

type TutorMode = 'Socratic' | 'Hint' | 'Review'

const MODE_PLACEHOLDER: Record<TutorMode, string> = {
  Socratic: 'Tell the tutor what you tried, or ask a question…',
  Hint: 'Ask for a nudge — not the answer.',
  Review: 'Paste code or a paragraph to review…',
}

function fmtTime(iso: string) {
  const d = new Date(iso)
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}

interface ChatPanelProps {
  sessionId?: string
  messages?: ApiMessage[]
  code?: string
  language?: Language
  runResult?: ApiRunResult | null
  onLimitReached?: () => void
}

export function ChatPanel({ sessionId, messages: initialMessages, code, language = 'python', runResult, onLimitReached }: ChatPanelProps = {}) {
  const [messages, setMessages] = useState<ApiMessage[]>([])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const [mode, setMode] = useState<TutorMode>('Socratic')
  const [showMore, setShowMore] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const hasSession = !!sessionId
  const { billing } = useBilling()

  useEffect(() => {
    if (!showMore) return
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setShowMore(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showMore])

  function exportChat() {
    const text = messages
      .map(m => `[${m.role === 'assistant' ? 'Tutor' : 'You'}] ${m.content}`)
      .join('\n\n')
    navigator.clipboard.writeText(text)
    setShowMore(false)
  }

  // Sync messages from session detail when they arrive / change
  useEffect(() => {
    if (initialMessages) setMessages(initialMessages)
  }, [initialMessages?.length])

  useLayoutEffect(() => {
    const el = scrollerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing])

  const sendMutation = useMutation({
    mutationFn: ({ content }: { content: string }) => api.chat.send(sessionId!, content, mode, language),
    onMutate: ({ content }) => {
      const optimistic: ApiMessage = {
        id: `opt-${Date.now()}`,
        sessionId: sessionId!,
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      }
      setMessages(m => [...m, optimistic])
      setTyping(true)
    },
    onSuccess: (data) => {
      setTyping(false)
      setMessages(m => {
        // replace optimistic user message with real one, then add assistant
        const withoutOpt = m.filter(msg => !msg.id.startsWith('opt-'))
        return [...withoutOpt, data.userMessage, data.assistantMessage]
      })
    },
    onError: (err) => {
      setTyping(false)
      setMessages(m => m.filter(msg => !msg.id.startsWith('opt-')))
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('Daily limit') || msg.includes('daily limit') || msg.includes('limit reached')) {
        onLimitReached?.()
      }
    },
  })

  const send = (text: string) => {
    if (!text.trim() || !hasSession || sendMutation.isPending) return
    setDraft('')
    sendMutation.mutate({ content: text.trim() })
  }

  return (
    <section style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: 'var(--bg-1)' }}>
      {/* header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px',
        borderBottom: '1px solid var(--border-soft)',
        background: 'var(--bg-2)',
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: hasSession ? 'var(--accent)' : 'var(--fg-4)',
            boxShadow: hasSession ? '0 0 0 3px oklch(0.48 0.14 278 / 0.18)' : 'none',
          }} />
          <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--fg)' }}>Socratic tutor</span>
          <span style={{ color: 'var(--fg-4)', fontSize: 12 }}>— guides, never gives</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {!billing.isPro && (
            <span style={{
              fontSize: 11, fontFamily: 'var(--mono)',
              color: billing.aiMessagesRemaining === 0 ? 'var(--danger)' : 'var(--fg-4)',
              padding: '2px 7px',
              background: 'var(--bg-2)',
              border: '1px solid var(--border-soft)',
              borderRadius: 20, marginRight: 4,
            }}>
              {billing.aiMessagesRemaining ?? 10} / {billing.aiMessagesLimit ?? 10} left
            </span>
          )}
          <ModeSwitch mode={mode} onChange={setMode} />
          <GhostBtn title="New thread" onClick={() => setMessages([])}><BranchIcon /></GhostBtn>
          <div ref={moreRef} style={{ position: 'relative' }}>
            <GhostBtn title="More" onClick={() => setShowMore(v => !v)}><MoreIcon /></GhostBtn>
            {showMore && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: 4,
                background: 'var(--bg-2)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '4px', zIndex: 100, minWidth: 140,
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}>
                <button
                  onClick={exportChat}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    background: 'transparent', border: 0, cursor: 'pointer',
                    color: 'var(--fg-2)', fontSize: 12.5, padding: '6px 10px',
                    borderRadius: 5,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-3)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  Export chat
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* message list */}
      <div
        ref={scrollerRef}
        style={{
          flex: 1, minHeight: 0, overflowY: 'auto',
          padding: '18px 18px 14px',
          display: 'flex', flexDirection: 'column', gap: 18,
        }}
      >
        {!hasSession && (
          <div style={{ textAlign: 'center', color: 'var(--fg-4)', fontSize: 13, marginTop: 24 }}>
            Select a problem to start a session.
          </div>
        )}
        {hasSession && messages.length === 0 && !typing && (
          <div style={{ textAlign: 'center', color: 'var(--fg-4)', fontSize: 13, marginTop: 24 }}>
            Ask a question or paste your code — the tutor will guide you.
          </div>
        )}
        {messages.map((msg) => (
          <Message key={msg.id} msg={msg} onChip={send} />
        ))}
        {typing && <TypingIndicator />}
      </div>

      {/* composer */}
      <div style={{ padding: '10px 14px 14px', borderTop: '1px solid var(--border-soft)', background: 'var(--bg-1)' }}>
        <ComposerShell
          value={draft}
          onChange={setDraft}
          onSend={send}
          placeholder={hasSession ? MODE_PLACEHOLDER[mode] : 'Select a problem to chat…'}
          disabled={!hasSession || sendMutation.isPending}
          code={code}
          language={language}
          runResult={runResult}
        />
      </div>
    </section>
  )
}

function ModeSwitch({ mode, onChange }: { mode: TutorMode; onChange: (m: TutorMode) => void }) {
  const modes: TutorMode[] = ['Socratic', 'Hint', 'Review']
  return (
    <div style={{
      display: 'inline-flex',
      background: 'var(--bg-2)', border: '1px solid var(--border-soft)',
      borderRadius: 7, padding: 2, marginRight: 4,
    }}>
      {modes.map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          style={{
            background: mode === m ? 'var(--bg-3)' : 'transparent',
            border: 0, cursor: 'pointer',
            color: mode === m ? 'var(--fg)' : 'var(--fg-3)',
            fontSize: 11.5, fontWeight: 500,
            padding: '3px 9px', borderRadius: 5,
            boxShadow: mode === m ? 'inset 0 1px 0 var(--border-strong)' : 'none',
          }}
        >
          {m}
        </button>
      ))}
    </div>
  )
}

function Message({ msg }: { msg: ApiMessage; onChip: (text: string) => void }) {
  const isTutor = msg.role === 'assistant'
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '26px 1fr', gap: 10, maxWidth: 760 }}>
      <Avatar role={msg.role} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <span style={{
            fontSize: 12, fontWeight: 600,
            color: isTutor ? 'var(--accent-fg)' : 'var(--fg)',
            letterSpacing: '-0.005em',
          }}>
            {isTutor ? 'Telery tutor' : 'You'}
          </span>
          <span style={{ fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--mono)' }}>
            {fmtTime(msg.createdAt)}
          </span>
        </div>
        <Bubble isTutor={isTutor}>
          <MessageContent content={msg.content} isTutor={isTutor} />
        </Bubble>
      </div>
    </div>
  )
}

function MessageContent({ content, isTutor }: { content: string; isTutor: boolean }) {
  const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const code = part.replace(/^```\w*\n?/, '').replace(/```$/, '')
          return (
            <pre key={i} style={{
              margin: '8px 0', padding: '8px 10px',
              background: 'var(--bg-inset)', borderRadius: 7,
              fontFamily: 'var(--mono)', fontSize: 12,
              color: 'var(--fg)', overflowX: 'auto',
            }}>
              <code>{code}</code>
            </pre>
          )
        }
        if (part.startsWith('`')) {
          return <code key={i} style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--accent-fg)' }}>{part.slice(1, -1)}</code>
        }
        return <span key={i} style={{ color: isTutor ? 'var(--fg)' : 'var(--fg-2)', whiteSpace: 'pre-wrap' }}>{part}</span>
      })}
    </>
  )
}

function Avatar({ role }: { role: 'user' | 'assistant' }) {
  if (role === 'assistant') {
    return (
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, oklch(0.38 0.13 278), oklch(0.30 0.10 245))',
        color: 'oklch(0.95 0.06 278)',
        border: '1px solid oklch(0.55 0.13 278 / 0.5)',
        flexShrink: 0,
      }}>
        <TutorAvatarIcon />
      </div>
    )
  }
  return (
    <div style={{
      width: 22, height: 22, borderRadius: '50%',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 600, flexShrink: 0,
      background: 'linear-gradient(135deg, oklch(0.55 0.12 30), oklch(0.45 0.13 350))',
      color: 'white',
    }}>
      Y
    </div>
  )
}

function Bubble({ children, isTutor }: { children: React.ReactNode; isTutor: boolean }) {
  return (
    <div style={{
      background: isTutor
        ? 'var(--tutor-bubble-overlay), var(--bg-2)'
        : 'var(--bg-2)',
      border: `1px solid ${isTutor ? 'var(--tutor-bubble-border)' : 'var(--border-soft)'}`,
      borderRadius: 10, padding: '9px 12px',
      fontSize: 13, lineHeight: 1.55,
    }}>
      {children}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '26px 1fr', gap: 10 }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, oklch(0.38 0.13 278), oklch(0.30 0.10 245))',
        color: 'oklch(0.95 0.06 278)',
        border: '1px solid oklch(0.55 0.13 278 / 0.5)',
        flexShrink: 0,
      }}>
        <TutorAvatarIcon />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-fg)' }}>Telery tutor</span>
          <span style={{ fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--mono)' }}>now</span>
        </div>
        <div style={{
          display: 'inline-flex', gap: 4,
          background: 'var(--tutor-bubble-overlay), var(--bg-2)',
          border: '1px solid var(--tutor-bubble-border)',
          borderRadius: 10, padding: '11px 12px',
        }}>
          <BounceDot delay={0} />
          <BounceDot delay={0.15} />
          <BounceDot delay={0.30} />
        </div>
      </div>
    </div>
  )
}

function BounceDot({ delay }: { delay: number }) {
  return (
    <span style={{
      width: 6, height: 6, borderRadius: '50%',
      background: 'var(--fg-3)',
      display: 'inline-block',
      animation: `tdBounce 1.1s ${delay}s infinite ease-in-out`,
    }} />
  )
}

function ComposerShell({
  value, onChange, onSend, placeholder, disabled, code, language = 'python', runResult,
}: {
  value: string
  onChange: (v: string) => void
  onSend: (v: string) => void
  placeholder: string
  disabled?: boolean
  code?: string
  language?: Language
  runResult?: ApiRunResult | null
}) {
  function attachCode() {
    if (!code) return
    const fence = LANGUAGE_META[language].fence
    onChange(value + (value ? '\n' : '') + '```' + fence + '\n' + code + '\n```')
  }

  function attachTestCase() {
    const snippet = runResult?.stdout || runResult?.stderr || '(no output yet)'
    onChange(value + (value ? '\n' : '') + 'Output:\n```\n' + snippet + '\n```')
  }
  return (
    <div style={{
      background: 'var(--bg-2)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '8px 10px 6px',
      opacity: disabled ? 0.6 : 1,
    }}>
      <textarea
        rows={1}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSend(value)
          }
        }}
        style={{
          width: '100%', background: 'transparent', border: 0, outline: 'none',
          resize: 'none', fontFamily: 'var(--sans)', fontSize: 13,
          color: 'var(--fg)', lineHeight: 1.5, minHeight: 22, maxHeight: 160,
          padding: '2px 0', cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <CompChip onClick={attachCode}><SparkIcon /> Attach code</CompChip>
          <CompChip onClick={attachTestCase}><TestTubeIcon /> Test case</CompChip>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'var(--fg-4)', fontSize: 11, fontFamily: 'var(--mono)' }}>
            Enter to send · ⇧Enter for newline
          </span>
          <button
            onClick={() => onSend(value)}
            disabled={!value.trim() || disabled}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: 7,
              border: value.trim() && !disabled ? '1px solid oklch(0.55 0.15 278 / 0.5)' : '1px solid var(--border)',
              background: value.trim() && !disabled
                ? 'linear-gradient(180deg, oklch(0.5 0.16 278), oklch(0.43 0.15 278))'
                : 'var(--bg-3)',
              color: value.trim() && !disabled ? 'white' : 'var(--fg-4)',
              cursor: value.trim() && !disabled ? 'pointer' : 'not-allowed',
            }}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

function CompChip({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent', border: '1px solid var(--border-soft)',
      color: 'var(--fg-3)', fontSize: 11.5, padding: '3px 8px',
      borderRadius: 6, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 5,
      opacity: 0.65,
    }}>
      {children}
    </button>
  )
}

function GhostBtn({ children, title, onClick }: { children: React.ReactNode; title: string; onClick?: () => void }) {
  return (
    <button title={title} onClick={onClick} style={{
      background: 'transparent', border: '1px solid transparent',
      color: 'var(--fg-2)', borderRadius: 7, padding: 5,
      display: 'inline-flex', alignItems: 'center', cursor: 'pointer', opacity: 0.7,
    }}>
      {children}
    </button>
  )
}
