import { BrainIcon, DotIcon } from '../icons'
import type { Problem } from '../../types'

const SAMPLE_PROBLEM: Problem = {
  number: '0142',
  title: 'Longest Substring Without Repeating Characters',
  difficulty: 'Medium',
  topics: ['Hash Table', 'String', 'Sliding Window'],
  description: [
    'Given a string s, find the length of the longest substring without repeating characters.',
    'A substring is a contiguous, non-empty sequence of characters within s. Return the length of the longest one that contains all distinct characters.',
  ],
  constraints: [
    '0 ≤ s.length ≤ 5 × 10⁴',
    's consists of English letters, digits, symbols and spaces.',
  ],
  examples: [
    {
      input: 's = "abcabcbb"',
      output: '3',
      explain: 'The answer is "abc", with length 3.',
    },
    {
      input: 's = "pwwkew"',
      output: '3',
      explain: 'The answer is "wke". Note "pwke" is a subsequence, not a substring.',
    },
  ],
}

const DIFFICULTY_STYLES = {
  Easy:   { color: 'var(--ok)',     bg: 'oklch(0.34 0.07 155 / 0.35)',  border: 'oklch(0.74 0.13 155 / 0.27)' },
  Medium: { color: 'var(--warn)',   bg: 'oklch(0.36 0.08 75 / 0.35)',   border: 'oklch(0.78 0.13 75 / 0.27)'  },
  Hard:   { color: 'var(--danger)', bg: 'oklch(0.34 0.09 25 / 0.35)',   border: 'oklch(0.71 0.15 25 / 0.27)'  },
}

function DifficultyBadge({ level }: { level: Problem['difficulty'] }) {
  const s = DIFFICULTY_STYLES[level]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '2px 8px 2px 6px', borderRadius: 999,
      fontSize: 11.5, fontWeight: 500,
      color: s.color, background: s.bg,
      border: `1px solid ${s.border}`,
    }}>
      <span style={{ display: 'inline-flex', color: s.color }}><DotIcon /></span>
      {level}
    </span>
  )
}

const TABS = ['Description', 'Editorial', 'Solutions', 'Submissions'] as const

interface ProblemPanelProps {
  problem?: Problem
}

export function ProblemPanel({ problem = SAMPLE_PROBLEM }: ProblemPanelProps) {
  return (
    <aside style={{
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg-1)', minHeight: 0,
    }}>
      {/* tabs */}
      <div style={{
        display: 'flex', gap: 2, padding: '4px 8px 0',
        borderBottom: '1px solid var(--border-soft)',
        background: 'var(--bg-1)',
      }}>
        {TABS.map((tab) => {
          const isActive = tab === 'Description'
          return (
            <button key={tab} style={{
              background: 'transparent', border: 0, cursor: 'pointer',
              color: isActive ? 'var(--fg)' : 'var(--fg-3)',
              padding: '8px 10px',
              fontSize: 12.5, fontWeight: 500,
              borderBottom: isActive ? '1.5px solid var(--accent)' : '1.5px solid transparent',
              marginBottom: -1,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {tab}
              {tab === 'Editorial' && (
                <span style={{ color: 'var(--fg-4)', fontSize: 10 }}>🞊</span>
              )}
              {tab === 'Solutions' && (
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--fg-4)',
                  background: 'var(--bg-2)', padding: '1px 5px', borderRadius: 4,
                }}>3.4k</span>
              )}
            </button>
          )
        })}
      </div>

      {/* scrollable content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 22px 28px' }}>
        {/* header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--fg-4)',
            letterSpacing: '0.04em',
          }}>
            <span>
              <span style={{ opacity: 0.6 }}>#</span>{problem.number}
            </span>
            <span style={{ flex: '0 0 24px', height: 1, background: 'var(--border)' }} />
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: 'var(--fg-3)', textTransform: 'uppercase',
              letterSpacing: '0.07em', fontSize: 10.5,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--accent)',
                boxShadow: '0 0 0 3px oklch(0.5 0.14 278 / 0.18)',
              }} />
              In progress
            </span>
          </div>

          <h1 style={{
            margin: '4px 0 6px', fontSize: 22, fontWeight: 600,
            letterSpacing: '-0.02em', color: 'var(--fg)', lineHeight: 1.2,
          }}>
            {problem.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
            <DifficultyBadge level={problem.difficulty} />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {problem.topics.map((t) => (
                <span key={t} style={{
                  fontSize: 11.5, fontWeight: 500, color: 'var(--fg-2)',
                  background: 'var(--bg-2)', border: '1px solid var(--border-soft)',
                  padding: '2px 8px', borderRadius: 999,
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 20 }}>
          {/* description paragraphs */}
          {problem.description.map((para, i) => (
            <p key={i} style={{ margin: 0, color: 'var(--fg-2)', fontSize: 13.5, lineHeight: 1.65 }}>
              {para.split(/(`[^`]+`|substring|distinct)/g).map((seg, k) => {
                if (seg.startsWith('`') && seg.endsWith('`')) {
                  return <InlineCode key={k}>{seg.slice(1, -1)}</InlineCode>
                }
                if (seg === 'substring' || seg === 'distinct') {
                  return <em key={k} style={{ color: 'var(--fg)', fontStyle: 'normal', fontWeight: 500 }}>{seg}</em>
                }
                return <span key={k}>{seg}</span>
              })}
            </p>
          ))}

          {/* examples */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {problem.examples.map((ex, i) => (
              <div key={i} style={{
                background: 'var(--bg-inset)', border: '1px solid var(--border-soft)',
                borderRadius: 9, padding: '12px 13px',
              }}>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: 10.5,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'var(--fg-4)', marginBottom: 8,
                }}>
                  Example {i + 1}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[
                    { key: 'Input', val: ex.input, mono: true },
                    { key: 'Output', val: ex.output, mono: true },
                    { key: 'Explanation', val: ex.explain, mono: false },
                  ].map(({ key, val, mono }) => (
                    <div key={key} style={{
                      display: 'grid', gridTemplateColumns: '84px 1fr',
                      alignItems: 'baseline', gap: 8,
                    }}>
                      <span style={{ fontSize: 11.5, color: 'var(--fg-4)', fontWeight: 500 }}>{key}</span>
                      {mono ? (
                        <code style={{ fontFamily: 'var(--mono)', fontSize: 12.5, color: 'var(--fg)' }}>{val}</code>
                      ) : (
                        <span style={{ fontSize: 12.5, color: 'var(--fg-2)', lineHeight: 1.55 }}>{val}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* constraints */}
          <div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 10.5,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--fg-4)', marginBottom: 6,
            }}>
              Constraints
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {problem.constraints.map((c, i) => (
                <li key={i} style={{ color: 'var(--fg-2)', fontSize: 12.5 }}>
                  <InlineCode>{c}</InlineCode>
                </li>
              ))}
            </ul>
          </div>

          {/* tutor mode callout */}
          <div style={{
            marginTop: 4,
            border: '1px solid oklch(0.42 0.10 278 / 0.5)',
            background: 'radial-gradient(120% 100% at 0% 0%, oklch(0.32 0.10 278 / 0.4) 0%, transparent 60%), var(--bg-1)',
            borderRadius: 10, padding: '12px 14px',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontWeight: 600, color: 'var(--accent-fg)',
              fontSize: 12.5, marginBottom: 4, letterSpacing: '-0.005em',
            }}>
              <span style={{ color: 'var(--accent)' }}><BrainIcon /></span>
              Tutor mode is on
            </div>
            <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 12.5, lineHeight: 1.55 }}>
              think.dev won't show you the solution. Ask away — it'll question you back until{' '}
              <em style={{ color: 'var(--fg)', fontStyle: 'italic' }}>you</em> see the answer.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      fontFamily: 'var(--mono)', fontSize: 12,
      background: 'var(--bg-2)', border: '1px solid var(--border-soft)',
      padding: '1px 6px', borderRadius: 5, color: 'var(--fg)',
    }}>
      {children}
    </code>
  )
}
