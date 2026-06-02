import { useState } from 'react'
import { CONCEPTS, type ConceptCategory, type ConceptSection } from '../../data/concepts'
import { useConceptProgress } from '../../lib/useConceptProgress'
import { useLanguage } from '../../lib/useLanguage'
import { LANGUAGE_META } from '../editor/CodeEditor'

interface Props {
  slug: string
  onBack: () => void
  onPractice?: (slug: string) => void
}

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner:     'var(--ok)',
  intermediate: 'var(--warn)',
  advanced:     'var(--danger)',
}

const CAT_VARS: Record<ConceptCategory, { bg: string; fg: string }> = {
  'foundations':      { bg: 'oklch(0.55 0.14 55 / 0.12)',  fg: 'oklch(0.72 0.14 55)'  },
  'arrays':           { bg: 'var(--cat-array-bg)',          fg: 'var(--cat-array-fg)'  },
  'hash-maps':        { bg: 'var(--cat-hashmap-bg)',        fg: 'var(--cat-hashmap-fg)' },
  'trees':            { bg: 'var(--cat-tree-bg)',           fg: 'var(--cat-tree-fg)'   },
  'graphs':           { bg: 'var(--cat-graph-bg)',          fg: 'var(--cat-graph-fg)'  },
  'sorting':          { bg: 'var(--cat-sort-bg)',           fg: 'var(--cat-sort-fg)'   },
  'recursion':        { bg: 'var(--cat-recurse-bg)',        fg: 'var(--cat-recurse-fg)' },
  'heaps':            { bg: 'oklch(0.68 0.16 120 / 0.12)', fg: 'oklch(0.68 0.16 120)' },
  'tries':            { bg: 'oklch(0.68 0.16 180 / 0.12)', fg: 'oklch(0.68 0.16 180)' },
  'greedy':           { bg: 'oklch(0.68 0.16 220 / 0.12)', fg: 'oklch(0.68 0.16 220)' },
  'bit-manipulation': { bg: 'oklch(0.68 0.16 250 / 0.12)', fg: 'oklch(0.68 0.16 250)' },
  'union-find':       { bg: 'oklch(0.68 0.16 290 / 0.12)', fg: 'oklch(0.68 0.16 290)' },
  'oop':              { bg: 'oklch(0.68 0.16 330 / 0.12)', fg: 'oklch(0.68 0.16 330)' },
  'operating-systems':{ bg: 'oklch(0.68 0.16 15 / 0.12)',  fg: 'oklch(0.68 0.16 15)'  },
  'databases':        { bg: 'oklch(0.68 0.16 90 / 0.12)',  fg: 'oklch(0.68 0.16 90)'  },
  'networks':         { bg: 'oklch(0.68 0.16 160 / 0.12)', fg: 'oklch(0.68 0.16 160)' },
  'system-design':    { bg: 'oklch(0.68 0.16 45 / 0.12)',  fg: 'oklch(0.68 0.16 45)'  },
  'paradigms':        { bg: 'oklch(0.68 0.16 205 / 0.12)', fg: 'oklch(0.68 0.16 205)' },
}

export function ConceptDetail({ slug, onBack, onPractice }: Props) {
  const concept = CONCEPTS.find(c => c.slug === slug)
  const { getStatus, markComplete, markInProgress } = useConceptProgress()
  const { language } = useLanguage()
  const [activeSection, setActiveSection] = useState(0)

  if (!concept) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: 'var(--bg-0)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--fg-4)', fontSize: 14,
      }}>
        Concept not found.{' '}
        <button onClick={onBack} style={{ background: 'none', border: 0, color: 'var(--accent)', cursor: 'pointer', fontSize: 14 }}>
          Go back
        </button>
      </div>
    )
  }

  const status = getStatus(concept.slug)
  const cat = CAT_VARS[concept.category]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: 'var(--bg-0)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* top bar */}
      <div style={{
        height: 48, flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '0 20px',
        borderBottom: '1px solid var(--border-soft)',
        background: 'var(--bg-1)',
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            color: 'var(--fg-3)', display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, padding: '4px 6px', borderRadius: 6,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-3)')}
        >
          ← Back
        </button>
        <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {concept.title}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 500,
            background: cat.bg, color: cat.fg,
            padding: '2px 8px', borderRadius: 999, whiteSpace: 'nowrap',
          }}>
            {concept.categoryLabel}
          </span>
          <span style={{ fontSize: 12, color: DIFFICULTY_COLOR[concept.difficulty], whiteSpace: 'nowrap', textTransform: 'capitalize' }}>
            {concept.difficulty}
          </span>
        </div>
      </div>

      {/* body */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {/* sidebar */}
        <aside style={{
          width: 220, flexShrink: 0,
          borderRight: '1px solid var(--border-soft)',
          padding: '24px 12px',
          display: 'flex', flexDirection: 'column', gap: 6,
          overflowY: 'auto',
          background: 'var(--bg-0)',
        }}>
          {/* progress */}
          <div style={{ padding: '0 8px 16px', borderBottom: '1px solid var(--border-soft)', marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Progress
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: status === 'completed'
                  ? 'var(--ok)'
                  : status === 'in-progress'
                    ? 'var(--accent)'
                    : 'var(--fg-4)',
              }} />
              <span style={{ fontSize: 12.5, color: 'var(--fg-2)', textTransform: 'capitalize' }}>
                {status ?? 'Not started'}
              </span>
            </div>

            {status !== 'completed' && (
              <button
                onClick={() => markComplete(concept.slug)}
                style={{
                  width: '100%', padding: '7px 0',
                  background: 'var(--ok)',
                  border: 'none', borderRadius: 7,
                  color: '#fff', fontSize: 12.5, fontWeight: 500,
                  cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                ✓ Mark complete
              </button>
            )}
            {status === 'completed' && (
              <div style={{
                width: '100%', padding: '7px 0', textAlign: 'center',
                background: 'oklch(0.34 0.07 155 / 0.25)',
                border: '1px solid oklch(0.74 0.13 155 / 0.35)',
                borderRadius: 7, color: 'var(--ok)', fontSize: 12.5, fontWeight: 500,
              }}>
                ✓ Completed
              </div>
            )}
            {status !== 'in-progress' && status !== 'completed' && (
              <button
                onClick={() => markInProgress(concept.slug)}
                style={{
                  width: '100%', padding: '6px 0', marginTop: 6,
                  background: 'transparent',
                  border: '1px solid var(--border-soft)', borderRadius: 7,
                  color: 'var(--fg-3)', fontSize: 12, cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg-2)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-3)')}
              >
                Start studying
              </button>
            )}
          </div>

          {/* contents */}
          <div style={{ padding: '0 8px 4px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Contents
            </div>
            {concept.content.map((section, i) => (
              <button
                key={i}
                onClick={() => setActiveSection(i)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: activeSection === i ? 'var(--bg-2)' : 'transparent',
                  border: activeSection === i ? '1px solid var(--border-soft)' : '1px solid transparent',
                  color: activeSection === i ? 'var(--fg)' : 'var(--fg-3)',
                  fontSize: 12.5, padding: '6px 9px', borderRadius: 6,
                  cursor: 'pointer', marginBottom: 2,
                }}
                onMouseEnter={e => { if (activeSection !== i) e.currentTarget.style.color = 'var(--fg-2)' }}
                onMouseLeave={e => { if (activeSection !== i) e.currentTarget.style.color = 'var(--fg-3)' }}
              >
                {section.heading}
              </button>
            ))}
          </div>

          {/* related problems */}
          {concept.relatedProblems.length > 0 && (
            <div style={{ padding: '16px 8px 0', borderTop: '1px solid var(--border-soft)', marginTop: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Practice
              </div>
              {concept.relatedProblems.map(slug => (
                <button
                  key={slug}
                  onClick={() => onPractice?.(slug)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    background: 'transparent', border: 0, cursor: 'pointer',
                    color: 'var(--accent-fg)', fontSize: 12,
                    padding: '4px 2px', fontFamily: 'var(--mono)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                >
                  → {slug.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          )}
        </aside>

        {/* main content */}
        <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '40px 52px 60px' }}>
          <div style={{ maxWidth: 720 }}>
            {/* concept header */}
            <div style={{ marginBottom: 32 }}>
              <h1 style={{
                margin: '0 0 12px', fontSize: 28, fontWeight: 700,
                color: 'var(--fg)', letterSpacing: '-0.025em',
              }}>
                {concept.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: 12, fontWeight: 500,
                  background: cat.bg, color: cat.fg,
                  padding: '3px 10px', borderRadius: 999,
                }}>
                  {concept.categoryLabel}
                </span>
                <span style={{
                  fontSize: 12, fontWeight: 500,
                  color: DIFFICULTY_COLOR[concept.difficulty],
                  textTransform: 'capitalize',
                }}>
                  {concept.difficulty}
                </span>
                <span style={{ fontSize: 12, color: 'var(--fg-4)', fontFamily: 'var(--mono)' }}>
                  ~{concept.timeEstimate} min
                </span>
              </div>
            </div>

            {/* sections */}
            {concept.content.map((section, i) => (
              <div key={i} style={{ marginBottom: 36 }}>
                <SectionContent section={section} language={language} />
              </div>
            ))}

            {/* practice CTA */}
            {concept.relatedProblems.length > 0 && onPractice && (
              <div style={{
                marginTop: 16, padding: '16px 20px',
                background: 'var(--bg-2)', border: '1px solid var(--border-soft)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
              }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg)' }}>
                    Ready to practice?
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--fg-3)', marginTop: 3 }}>
                    {concept.relatedProblems.length} problem{concept.relatedProblems.length > 1 ? 's' : ''} selected for this concept.
                  </div>
                </div>
                <button
                  onClick={() => onPractice(concept.relatedProblems[0])}
                  style={{
                    padding: '8px 16px', whiteSpace: 'nowrap',
                    background: 'linear-gradient(180deg, oklch(0.52 0.16 278), oklch(0.46 0.16 278))',
                    color: 'white', border: '1px solid oklch(0.62 0.16 278 / 0.6)',
                    borderRadius: 8, fontSize: 13, fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Practice →
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function SectionContent({ section, language }: { section: ConceptSection; language: string }) {
  const parts = section.body.split(/(```[\s\S]*?```)/g)
  let codeIndex = 0

  return (
    <div>
      <h2 style={{
        margin: '0 0 14px', fontSize: 15.5, fontWeight: 600,
        color: 'var(--fg)', letterSpacing: '-0.01em',
        paddingBottom: 10, borderBottom: '1px solid var(--border-soft)',
      }}>
        {section.heading}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {parts.map((part, i) => {
          if (part.startsWith('```')) {
            const idx = codeIndex++
            const firstNewline = part.indexOf('\n')
            const defaultCode = part.slice(firstNewline + 1, -3)
            const langCode = section.codeByLang?.[idx]?.[language as keyof typeof section.codeByLang[0]]
            const code = langCode ?? defaultCode
            const langMeta = LANGUAGE_META[language as keyof typeof LANGUAGE_META]
            return (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: 8, right: 10,
                  fontFamily: 'var(--mono)', fontSize: 10.5,
                  color: 'var(--fg-4)', letterSpacing: '0.04em',
                  pointerEvents: 'none',
                }}>
                  {langMeta?.label ?? language}
                </div>
                <pre style={{
                  margin: 0, padding: '14px 16px',
                  background: 'var(--bg-inset)',
                  border: '1px solid var(--border-soft)',
                  borderRadius: 9,
                  fontFamily: 'var(--mono)', fontSize: 12.5,
                  color: 'var(--fg)', lineHeight: 1.65,
                  overflowX: 'auto', whiteSpace: 'pre',
                }}>
                  <code>{code}</code>
                </pre>
              </div>
            )
          }
          const trimmed = part.trim()
          if (!trimmed) return null
          return (
            <p key={i} style={{
              margin: 0, fontSize: 13.5,
              color: 'var(--fg-2)', lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
            }}>
              {trimmed}
            </p>
          )
        })}
      </div>
    </div>
  )
}
