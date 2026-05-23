import { useState, useRef, useLayoutEffect } from 'react'
import { TutorAvatarIcon, SparkIcon, TestTubeIcon, SendIcon, BranchIcon, MoreIcon } from '../icons'
import type { ChatMessage, MessagePart } from '../../types'

const SEED_MESSAGES: ChatMessage[] = [
  {
    role: 'tutor',
    time: '9:41',
    body: [
      { type: 'text', text: 'Welcome back. I read your brute-force draft on the right.' },
      { type: 'text', text: "Before you optimize — let's make sure you can describe what it costs. If `s` has length n, how many substrings does your outer + inner loop visit?" },
      { type: 'chips', items: ['About n', 'About n²', 'About n³', 'Not sure'] },
    ],
  },
  {
    role: 'user',
    time: '9:42',
    body: [{ type: 'text', text: 'n² substrings I think.' }],
  },
  {
    role: 'tutor',
    time: '9:42',
    body: [
      { type: 'text', text: 'Right. And inside the loop, what does `len(set(window)) == len(window)` actually do for a window of size k?' },
      { type: 'text', text: 'Talk me through the work, not the syntax.' },
    ],
  },
  {
    role: 'user',
    time: '9:43',
    body: [{ type: 'text', text: 'Builds a set of size k → O(k). So total is O(n³)?' }],
  },
  {
    role: 'tutor',
    time: '9:43',
    body: [
      { type: 'text', text: "Yes. So the real question isn't \"can I write this faster in Python\" — it's:" },
      { type: 'quote', text: 'Why am I recomputing the set for every (i, j) pair, when (i, j+1) is just one character more than (i, j)?' },
      { type: 'text', text: 'What information from the previous window could survive into the next one?' },
    ],
  },
]

const MOCK_FOLLOW_UP: ChatMessage = {
  role: 'tutor',
  time: '',
  body: [
    { type: 'text', text: 'Good. Hold onto that intuition.' },
    { type: 'text', text: 'If you slide the window forward by one and the new character was already inside, which index do you have to jump `i` to — and how do you know it in O(1)?' },
  ],
}

type TutorMode = 'Socratic' | 'Hint' | 'Review'

const MODE_PLACEHOLDER: Record<TutorMode, string> = {
  Socratic: 'Tell the tutor what you tried, or ask a question…',
  Hint: 'Ask for a nudge — not the answer.',
  Review: 'Paste code or a paragraph to review…',
}

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES)
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const [mode, setMode] = useState<TutorMode>('Socratic')
  const scrollerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = scrollerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing])

  const send = (text: string) => {
    if (!text.trim()) return
    const t = new Date()
    const stamp = `${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')}`

    setMessages((m) => [...m, { role: 'user', time: stamp, body: [{ type: 'text', text }] }])
    setDraft('')
    setTyping(true)

    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { ...MOCK_FOLLOW_UP, time: stamp }])
    }, 1100)
  }

  return (
    <section style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: 'var(--bg-1)' }}>
      {/* header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px',
        borderBottom: '1px solid var(--border-soft)',
        background: 'linear-gradient(180deg, #1c1e25 0%, #191b21 100%)',
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--accent)',
            boxShadow: '0 0 0 3px oklch(0.48 0.14 278 / 0.18)',
          }} />
          <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--fg)' }}>Socratic tutor</span>
          <span style={{ color: 'var(--fg-4)', fontSize: 12 }}>— guides, never gives</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ModeSwitch mode={mode} onChange={setMode} />
          <GhostBtn title="New thread"><BranchIcon /></GhostBtn>
          <GhostBtn title="More"><MoreIcon /></GhostBtn>
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
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} onChip={send} />
        ))}
        {typing && <TypingIndicator />}
      </div>

      {/* composer */}
      <div style={{ padding: '10px 14px 14px', borderTop: '1px solid var(--border-soft)', background: 'var(--bg-1)' }}>
        <ComposerShell
          value={draft}
          onChange={setDraft}
          onSend={send}
          placeholder={MODE_PLACEHOLDER[mode]}
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

function Message({ msg, onChip }: { msg: ChatMessage; onChip: (text: string) => void }) {
  const isTutor = msg.role === 'tutor'
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
            {isTutor ? 'think · tutor' : 'You'}
          </span>
          <span style={{ fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--mono)' }}>{msg.time}</span>
        </div>
        <Bubble isTutor={isTutor}>
          {msg.body.map((part, i) => (
            <MessagePart key={i} part={part} onChip={onChip} isTutor={isTutor} />
          ))}
        </Bubble>
      </div>
    </div>
  )
}

function Avatar({ role }: { role: 'tutor' | 'user' }) {
  if (role === 'tutor') {
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
      M
    </div>
  )
}

function Bubble({ children, isTutor }: { children: React.ReactNode; isTutor: boolean }) {
  return (
    <div style={{
      background: isTutor
        ? 'linear-gradient(180deg, oklch(0.25 0.06 278 / 0.25), oklch(0.22 0.04 278 / 0.15)), var(--bg-2)'
        : 'var(--bg-2)',
      border: `1px solid ${isTutor ? 'oklch(0.40 0.08 278 / 0.45)' : 'var(--border-soft)'}`,
      borderRadius: 10, padding: '9px 12px',
      fontSize: 13, lineHeight: 1.55,
    }}>
      {children}
    </div>
  )
}

function MessagePart({ part, onChip, isTutor }: { part: MessagePart; onChip: (t: string) => void; isTutor: boolean }) {
  if (part.type === 'text') {
    return (
      <p style={{
        margin: 0, marginTop: 0,
        color: isTutor ? 'var(--fg)' : 'var(--fg-2)',
      }}
        className="msg-p"
      >
        {part.text}
      </p>
    )
  }
  if (part.type === 'quote') {
    return (
      <blockquote style={{
        margin: '8px 0', padding: '8px 11px',
        borderLeft: '2px solid var(--accent)',
        background: 'oklch(0.30 0.06 278 / 0.20)',
        borderRadius: '0 6px 6px 0',
        fontStyle: 'italic', color: 'var(--fg)', fontSize: 13,
      }}>
        {part.text}
      </blockquote>
    )
  }
  if (part.type === 'chips') {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
        {part.items.map((item) => (
          <button
            key={item}
            onClick={() => onChip(item)}
            style={{
              background: 'var(--bg-3)', border: '1px solid var(--border)',
              color: 'var(--fg-2)', fontSize: 11.5,
              padding: '4px 10px', borderRadius: 999,
              cursor: 'pointer',
            }}
          >
            {item}
          </button>
        ))}
      </div>
    )
  }
  return null
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
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-fg)' }}>think · tutor</span>
          <span style={{ fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--mono)' }}>now</span>
        </div>
        <div style={{
          display: 'inline-flex', gap: 4,
          background: 'linear-gradient(180deg, oklch(0.25 0.06 278 / 0.25), oklch(0.22 0.04 278 / 0.15)), var(--bg-2)',
          border: '1px solid oklch(0.40 0.08 278 / 0.45)',
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
  value, onChange, onSend, placeholder,
}: {
  value: string
  onChange: (v: string) => void
  onSend: (v: string) => void
  placeholder: string
}) {
  return (
    <div style={{
      background: 'var(--bg-2)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '8px 10px 6px',
    }}>
      <textarea
        rows={1}
        placeholder={placeholder}
        value={value}
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
          padding: '2px 0',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <CompChip><SparkIcon /> Attach code</CompChip>
          <CompChip><TestTubeIcon /> Test case</CompChip>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'var(--fg-4)', fontSize: 11, fontFamily: 'var(--mono)' }}>
            Enter to send · ⇧Enter for newline
          </span>
          <button
            onClick={() => onSend(value)}
            disabled={!value.trim()}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: 7,
              border: value.trim() ? '1px solid oklch(0.55 0.15 278 / 0.5)' : '1px solid var(--border)',
              background: value.trim()
                ? 'linear-gradient(180deg, oklch(0.5 0.16 278), oklch(0.43 0.15 278))'
                : 'var(--bg-3)',
              color: value.trim() ? 'white' : 'var(--fg-4)',
              cursor: value.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

function CompChip({ children }: { children: React.ReactNode }) {
  return (
    <button style={{
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

function GhostBtn({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <button title={title} style={{
      background: 'transparent', border: '1px solid transparent',
      color: 'var(--fg-2)', borderRadius: 7, padding: 5,
      display: 'inline-flex', alignItems: 'center', cursor: 'pointer', opacity: 0.7,
    }}>
      {children}
    </button>
  )
}
