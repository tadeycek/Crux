import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { useConceptProgress } from '../../lib/useConceptProgress'

interface ProgressViewProps {
  onResumeProblem: (slug: string) => void
}

const INTENSITY_COLORS = [
  'var(--bg-3)',
  'oklch(0.74 0.13 155 / 0.25)',
  'oklch(0.74 0.13 155 / 0.55)',
  'var(--ok)',
]

export function ProgressView({ onResumeProblem }: ProgressViewProps) {
  const { progress } = useConceptProgress()
  const { data: summary, isLoading } = useQuery({
    queryKey: ['progress-summary'],
    queryFn: () => api.progress.summary(),
    staleTime: 60_000,
  })

  const completedCount = Object.values(progress).filter((s) => s === 'completed').length
  const streak = summary?.streak ?? 0
  const problemsSolved = summary?.problemsSolved ?? 0
  const grid = summary?.grid ?? Array.from({ length: 98 }, () => 0)

  const TRACKS = [
    { label: 'Foundations', total: 4, color: 'oklch(0.72 0.14 55)' },
    { label: 'Data Structures', total: 6, color: 'oklch(0.68 0.15 278)' },
    { label: 'Algorithms', total: 10, color: 'oklch(0.72 0.15 155)' },
    { label: 'Core CS Foundations', total: 8, color: 'oklch(0.70 0.16 200)' },
  ]
  const totalConcepts = TRACKS.reduce((s, t) => s + t.total, 0)
  const perTrackCompleted = completedCount / Math.max(totalConcepts, 1)

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: 'var(--bg-0)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 860, width: '100%', margin: '0 auto', padding: '40px 40px 80px' }}>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: 'var(--fg)', letterSpacing: '-0.025em' }}>
            Progress & Performance
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13.5, color: 'var(--fg-3)' }}>
            Analytical dashboard measuring algorithmic streak and conceptual mastery.
          </p>
        </div>

        {isLoading ? (
          <div style={{ fontSize: 13, color: 'var(--fg-4)', padding: '40px 0' }}>Loading stats…</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>

            {/* Streak Card */}
            <div style={{
              background: 'var(--bg-1)', border: '1px solid var(--border-soft)',
              borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--fg)' }}>Consistent Coding</h3>
                  <span style={{ fontSize: 12, color: 'var(--fg-4)' }}>Daily activity streak</span>
                </div>
                <div style={{
                  fontSize: 13, fontWeight: 600, color: streak > 0 ? 'var(--warn)' : 'var(--fg-4)',
                  background: streak > 0 ? 'oklch(0.78 0.13 75 / 0.12)' : 'var(--bg-2)',
                  padding: '4px 10px', borderRadius: 999,
                  border: `1px solid ${streak > 0 ? 'oklch(0.78 0.13 75 / 0.25)' : 'var(--border-soft)'}`,
                }}>
                  {streak > 0 ? `🔥 ${streak} Day Streak` : 'No active streak'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: 4, marginTop: 8 }}>
                {grid.map((intensity, i) => (
                  <div key={i} style={{
                    aspectRatio: '1', borderRadius: 2,
                    background: INTENSITY_COLORS[Math.min(intensity, 3)],
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-4)' }}>
                <span>14 weeks ago</span>
                <span>Today</span>
              </div>

              {/* quick stats row */}
              <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                <div style={{ flex: 1, textAlign: 'center', padding: '10px 0', background: 'var(--bg-2)', borderRadius: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--fg)' }}>{problemsSolved}</div>
                  <div style={{ color: 'var(--fg-4)' }}>Problems solved</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: '10px 0', background: 'var(--bg-2)', borderRadius: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--fg)' }}>{completedCount}</div>
                  <div style={{ color: 'var(--fg-4)' }}>Concepts mastered</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: '10px 0', background: 'var(--bg-2)', borderRadius: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--fg)' }}>{streak}</div>
                  <div style={{ color: 'var(--fg-4)' }}>Day streak</div>
                </div>
              </div>
            </div>

            {/* Curriculum Mastery Card */}
            <div style={{
              background: 'var(--bg-1)', border: '1px solid var(--border-soft)',
              borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16,
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--fg)' }}>Curriculum Mastery</h3>
                <span style={{ fontSize: 12, color: 'var(--fg-4)' }}>Completion progress by core concept tracks</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {TRACKS.map((t) => {
                  const count = Math.round(perTrackCompleted * t.total)
                  const pct = Math.round((count / t.total) * 100)
                  return (
                    <div key={t.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                        <span style={{ color: 'var(--fg-2)', fontWeight: 500 }}>{t.label}</span>
                        <span style={{ color: 'var(--fg-3)', fontFamily: 'var(--mono)' }}>{count}/{t.total} ({pct}%)</span>
                      </div>
                      <div style={{ height: 6, background: 'var(--bg-3)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: t.color, borderRadius: 99, transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Practice CTA */}
            <div style={{
              background: 'var(--bg-1)', border: '1px solid var(--border-soft)',
              borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 14,
              gridColumn: '1 / -1',
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--fg)' }}>Continue Practicing</h3>
                <span style={{ fontSize: 12, color: 'var(--fg-4)' }}>Jump back into a problem from your history</span>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { label: 'Climbing Stairs', slug: 'climbing-stairs' },
                  { label: 'Two Sum', slug: 'two-sum' },
                  { label: 'Number of Islands', slug: 'number-of-islands' },
                  { label: 'Group Anagrams', slug: 'group-anagrams' },
                ].map(({ label, slug }) => (
                  <button
                    key={slug}
                    onClick={() => onResumeProblem(slug)}
                    style={{
                      padding: '7px 16px', background: 'var(--bg-2)', border: '1px solid var(--border-soft)',
                      borderRadius: 8, fontSize: 12, fontWeight: 500, color: 'var(--fg)', cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-3)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-2)' }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
