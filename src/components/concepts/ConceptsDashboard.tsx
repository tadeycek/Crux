import { useState } from 'react'
import { CONCEPTS, TRACKS, type Concept, type ConceptTrack } from '../../data/concepts'
import { useConceptProgress } from '../../lib/useConceptProgress'

interface Props {
  onOpen: (slug: string) => void
}

type View = 'roadmap' | 'browse'

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner:     'var(--ok)',
  intermediate: 'var(--warn)',
  advanced:     'var(--danger)',
}

const TRACK_ACCENT: Record<ConceptTrack, { dot: string; bar: string; bg: string }> = {
  foundations:     { dot: 'oklch(0.72 0.14 55)',  bar: 'oklch(0.55 0.14 55)',  bg: 'oklch(0.55 0.14 55 / 0.08)'  },
  'data-structures': { dot: 'oklch(0.68 0.15 278)', bar: 'oklch(0.52 0.16 278)', bg: 'oklch(0.52 0.16 278 / 0.08)' },
  algorithms:      { dot: 'oklch(0.72 0.15 155)', bar: 'oklch(0.56 0.14 155)', bg: 'oklch(0.56 0.14 155 / 0.08)' },
  advanced:        { dot: 'oklch(0.68 0.16 320)', bar: 'oklch(0.52 0.16 320)', bg: 'oklch(0.52 0.16 320 / 0.08)' },
  'core-cs':       { dot: 'oklch(0.70 0.16 200)', bar: 'oklch(0.54 0.15 200)', bg: 'oklch(0.54 0.15 200 / 0.08)' },
}

export function ConceptsDashboard({ onOpen }: Props) {
  const [view, setView] = useState<View>('roadmap')
  const { getStatus, progress } = useConceptProgress()
  const completedCount = Object.values(progress).filter(s => s === 'completed').length

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: 'var(--bg-0)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 860, width: '100%', margin: '0 auto', padding: '40px 40px 80px' }}>

        {/* header */}
        <div style={{ marginBottom: 32, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: 'var(--fg)', letterSpacing: '-0.025em' }}>
              Learn Algorithms
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 13.5, color: 'var(--fg-3)' }}>
              A structured path from first principles to advanced patterns.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--bg-2)', border: '1px solid var(--border-soft)',
              borderRadius: 999, padding: '5px 14px', fontSize: 12.5,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: completedCount > 0 ? 'var(--ok)' : 'var(--fg-4)', flexShrink: 0 }} />
              <span style={{ color: 'var(--fg-2)' }}>
                <span style={{ fontWeight: 600, color: 'var(--fg)' }}>{completedCount}</span>{' / '}{CONCEPTS.length}
              </span>
            </div>
            {/* view toggle */}
            <div style={{
              display: 'inline-flex',
              background: 'var(--bg-2)', border: '1px solid var(--border-soft)',
              borderRadius: 8, padding: 3, gap: 2,
            }}>
              {(['roadmap', 'browse'] as View[]).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    background: view === v ? 'var(--bg-0)' : 'transparent',
                    border: view === v ? '1px solid var(--border-soft)' : '1px solid transparent',
                    color: view === v ? 'var(--fg)' : 'var(--fg-3)',
                    borderRadius: 6, padding: '4px 12px',
                    fontSize: 12.5, fontWeight: view === v ? 500 : 400,
                    cursor: 'pointer', textTransform: 'capitalize',
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {view === 'roadmap'
          ? <RoadmapView onOpen={onOpen} getStatus={getStatus} />
          : <BrowseView onOpen={onOpen} getStatus={getStatus} />
        }
      </div>
    </div>
  )
}

// ── Roadmap View ──────────────────────────────────────────────────────────────

function RoadmapView({ onOpen, getStatus }: {
  onOpen: (slug: string) => void
  getStatus: (slug: string) => 'completed' | 'in-progress' | null
}) {
  let globalStep = 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      {TRACKS.map(track => {
        const concepts = CONCEPTS
          .filter(c => c.track === track.id)
          .sort((a, b) => a.trackOrder - b.trackOrder)
        const completedInTrack = concepts.filter(c => getStatus(c.slug) === 'completed').length
        const accent = TRACK_ACCENT[track.id]

        return (
          <div key={track.id}>
            {/* track header */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ height: 1, width: 20, background: accent.bar, flexShrink: 0 }} />
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: accent.dot,
                }}>
                  {track.label}
                </span>
                <div style={{ flex: 1, height: 1, background: 'var(--border-soft)' }} />
                <span style={{ fontSize: 11.5, color: 'var(--fg-4)', whiteSpace: 'nowrap' }}>
                  {completedInTrack}/{concepts.length}
                </span>
              </div>
              <p style={{ margin: '0 0 0 32px', fontSize: 12.5, color: 'var(--fg-4)', lineHeight: 1.5 }}>
                {track.description}
              </p>
              {/* progress bar */}
              <div style={{ margin: '10px 0 0 32px', height: 3, background: 'var(--bg-3)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${concepts.length > 0 ? (completedInTrack / concepts.length) * 100 : 0}%`,
                  background: accent.bar,
                  borderRadius: 2,
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>

            {/* concept rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {concepts.map((concept, idx) => {
                globalStep++
                const step = globalStep
                const status = getStatus(concept.slug)
                const isLast = idx === concepts.length - 1
                return (
                  <RoadmapRow
                    key={concept.slug}
                    concept={concept}
                    step={step}
                    status={status}
                    accent={accent}
                    isLast={isLast}
                    onClick={() => onOpen(concept.slug)}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function RoadmapRow({ concept, step, status, accent, isLast, onClick }: {
  concept: Concept
  step: number
  status: 'completed' | 'in-progress' | null
  accent: { dot: string; bar: string; bg: string }
  isLast: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const isCompleted = status === 'completed'
  const isInProgress = status === 'in-progress'

  return (
    <div style={{ display: 'flex', gap: 0 }}>
      {/* step indicator column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32, flexShrink: 0, marginLeft: 0 }}>
        {/* dot */}
        <div style={{
          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isCompleted ? accent.dot : isInProgress ? accent.bg : 'var(--bg-2)',
          border: `2px solid ${isCompleted ? accent.dot : isInProgress ? accent.dot : 'var(--border)'}`,
          zIndex: 1,
          transition: 'background 0.2s, border-color 0.2s',
        }}>
          {isCompleted ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <span style={{ fontSize: 9, fontWeight: 700, color: isInProgress ? accent.dot : 'var(--fg-4)', fontFamily: 'var(--mono)' }}>
              {step}
            </span>
          )}
        </div>
        {/* connector line */}
        {!isLast && (
          <div style={{
            flex: 1, width: 2,
            background: isCompleted ? accent.bar : 'var(--border-soft)',
            minHeight: 16,
            transition: 'background 0.2s',
          }} />
        )}
      </div>

      {/* card */}
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 14,
          padding: '12px 16px',
          marginLeft: 12, marginBottom: isLast ? 0 : 6,
          background: hovered ? 'var(--bg-2)' : 'var(--bg-1)',
          border: `1px solid ${hovered ? 'var(--border)' : 'var(--border-soft)'}`,
          borderRadius: 10, cursor: 'pointer', textAlign: 'left',
          transition: 'background 0.12s, border-color 0.12s',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.3 }}>
            {concept.title}
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-4)', marginTop: 3, lineHeight: 1.4 }}>
            {concept.summary}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: DIFFICULTY_COLOR[concept.difficulty], textTransform: 'capitalize' }}>
            {concept.difficulty}
          </span>
          <span style={{ fontSize: 11, color: 'var(--fg-4)', fontFamily: 'var(--mono)' }}>
            ~{concept.timeEstimate}m
          </span>
          {isCompleted && (
            <span style={{ fontSize: 11, color: 'var(--ok)', fontWeight: 600 }}>Done</span>
          )}
          {isInProgress && (
            <span style={{ fontSize: 11, color: accent.dot, fontWeight: 600 }}>In progress</span>
          )}
          <span style={{ color: 'var(--fg-4)', fontSize: 14, opacity: hovered ? 1 : 0.4, transition: 'opacity 0.15s' }}>→</span>
        </div>
      </button>
    </div>
  )
}

// ── Browse View ───────────────────────────────────────────────────────────────

function BrowseView({ onOpen, getStatus }: {
  onOpen: (slug: string) => void
  getStatus: (slug: string) => 'completed' | 'in-progress' | null
}) {
  const [activeTrack, setActiveTrack] = useState<ConceptTrack | 'all'>('all')

  const filtered = activeTrack === 'all'
    ? CONCEPTS
    : CONCEPTS.filter(c => c.track === activeTrack)

  return (
    <>
      {/* track filter pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        <FilterPill active={activeTrack === 'all'} onClick={() => setActiveTrack('all')}>All</FilterPill>
        {TRACKS.map(t => (
          <FilterPill key={t.id} active={activeTrack === t.id} onClick={() => setActiveTrack(t.id)}>
            {t.label}
          </FilterPill>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {filtered.map(concept => (
          <BrowseCard
            key={concept.slug}
            concept={concept}
            status={getStatus(concept.slug)}
            onClick={() => onOpen(concept.slug)}
          />
        ))}
      </div>
    </>
  )
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? 'var(--accent-bg)' : 'var(--bg-2)',
        border: active ? '1px solid var(--accent)' : '1px solid var(--border-soft)',
        color: active ? 'var(--accent-fg)' : 'var(--fg-3)',
        borderRadius: 999, padding: '5px 14px',
        fontSize: 12.5, fontWeight: active ? 500 : 400, cursor: 'pointer',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--fg-2)' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--fg-3)' }}
    >
      {children}
    </button>
  )
}

function BrowseCard({ concept, status, onClick }: { concept: Concept; status: 'completed' | 'in-progress' | null; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const isCompleted = status === 'completed'
  const isInProgress = status === 'in-progress'
  const accent = TRACK_ACCENT[concept.track]

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: 10,
        padding: '16px 16px 14px',
        background: hovered ? 'var(--bg-2)' : 'var(--bg-1)',
        border: `1px solid ${hovered ? 'var(--border)' : 'var(--border-soft)'}`,
        borderLeft: isCompleted
          ? '3px solid var(--ok)'
          : isInProgress
            ? `3px solid ${accent.dot}`
            : '3px solid transparent',
        borderRadius: 10, cursor: 'pointer', textAlign: 'left',
        transition: 'background 0.12s, border-color 0.12s',
        position: 'relative',
      }}
    >
      <span style={{
        position: 'absolute', top: 14, right: 14,
        width: 8, height: 8, borderRadius: '50%',
        background: isCompleted ? 'var(--ok)' : isInProgress ? accent.dot : 'var(--border-strong)',
        boxShadow: isCompleted
          ? '0 0 0 3px oklch(0.74 0.13 155 / 0.18)'
          : isInProgress ? `0 0 0 3px ${accent.bg}` : 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingRight: 20 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: accent.dot,
        }}>
          {TRACKS.find(t => t.id === concept.track)?.label}
        </span>
      </div>

      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)', lineHeight: 1.3 }}>
        {concept.title}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: DIFFICULTY_COLOR[concept.difficulty], textTransform: 'capitalize' }}>
          {concept.difficulty}
        </span>
      </div>

      <p style={{
        margin: 0, fontSize: 12.5, color: 'var(--fg-3)', lineHeight: 1.55,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {concept.summary}
      </p>

      <div style={{ fontSize: 11.5, color: 'var(--fg-4)', fontFamily: 'var(--mono)', marginTop: 2 }}>
        ~{concept.timeEstimate} min
      </div>
    </button>
  )
}
