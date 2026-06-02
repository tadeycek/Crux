import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { ApiPlaylist } from '../../lib/api'

interface PlaylistsViewProps {
  onSelectProblem: (slug: string) => void
}

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: 'var(--ok)',
  medium: 'var(--warn)',
  hard: 'var(--danger)',
}

// Static fallback used before db:push creates the playlists table
const STATIC_PLAYLISTS: ApiPlaylist[] = [
  {
    id: 1, position: 0, badge: 'Essential', difficulty: 'Mixed',
    title: 'Blind 75 Essentials',
    description: 'The absolute most critical algorithms and data structures interview questions.',
    problems: [
      { id: 1, title: 'Two Sum', slug: 'two-sum', difficulty: 'easy', description: 'Find two numbers that add up to a specific target.' },
      { id: 3, title: 'Best Time to Buy and Sell Stock', slug: 'best-time-to-buy-and-sell-stock', difficulty: 'easy', description: 'Maximize profit with a single buy and sell transaction.' },
      { id: 4, title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating', difficulty: 'medium', description: 'Find the longest substring without repeating characters.' },
      { id: 8, title: 'Merge Intervals', slug: 'merge-intervals', difficulty: 'medium', description: 'Merge all overlapping intervals.' },
    ],
  },
  {
    id: 2, position: 1, badge: 'Core Algorithmic', difficulty: 'Medium',
    title: 'Graphs & Traversals Masterclass',
    description: 'Master BFS, DFS, and connectivity searches on grid environments.',
    problems: [
      { id: 12, title: 'Number of Islands', slug: 'number-of-islands', difficulty: 'medium', description: 'Count connected land masses on a 2D binary grid.' },
    ],
  },
  {
    id: 3, position: 2, badge: 'Advanced Paradigms', difficulty: 'Hard',
    title: 'Dynamic Programming Boot Camp',
    description: 'Conquer recursion, memoization grids, and optimization transitions.',
    problems: [
      { id: 7, title: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'easy', description: 'Calculate distinct combinations of climbs.' },
    ],
  },
  {
    id: 4, position: 3, badge: 'First Principles', difficulty: 'Easy',
    title: 'Foundations & String Utilities',
    description: 'Solidify pointer operations, hashing lookups, and basic complexity.',
    problems: [
      { id: 2, title: 'Valid Palindrome', slug: 'valid-palindrome', difficulty: 'easy', description: 'Determine palindrome validity bidirectionally.' },
      { id: 5, title: 'Group Anagrams', slug: 'group-anagrams', difficulty: 'medium', description: 'Group character sets together by sorted key.' },
    ],
  },
]

export function PlaylistsView({ onSelectProblem }: PlaylistsViewProps) {
  const [activePlaylist, setActivePlaylist] = useState<number | null>(null)

  const { data: apiPlaylists, isLoading, isError } = useQuery<ApiPlaylist[]>({
    queryKey: ['playlists'],
    queryFn: () => api.playlists.list(),
    staleTime: 10 * 60_000,
  })
  // Fall back to static data if the DB table doesn't exist yet (before db:push)
  const playlists = apiPlaylists ?? (isError ? STATIC_PLAYLISTS : [])

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: 'var(--bg-0)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 860, width: '100%', margin: '0 auto', padding: '40px 40px 80px' }}>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: 'var(--fg)', letterSpacing: '-0.025em' }}>
            Problem Playlists
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13.5, color: 'var(--fg-3)' }}>
            Curated collections targeted to maximize specific core competencies.
          </p>
        </div>

        {isLoading && (
          <div style={{ fontSize: 13, color: 'var(--fg-4)', padding: '40px 0' }}>Loading playlists…</div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {playlists.map((list) => {
            const isOpen = activePlaylist === list.id
            return (
              <div
                key={list.id}
                style={{
                  background: 'var(--bg-1)', border: '1px solid var(--border-soft)',
                  borderRadius: 12, overflow: 'hidden',
                }}
              >
                <div
                  onClick={() => setActivePlaylist(isOpen ? null : list.id)}
                  style={{
                    padding: '20px 24px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-2)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{
                        fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em',
                        textTransform: 'uppercase', color: 'var(--accent)',
                        background: 'var(--accent-bg)', padding: '2px 8px', borderRadius: 999,
                      }}>
                        {list.badge}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--fg-4)' }}>
                        Difficulty: <strong style={{ color: 'var(--fg-3)' }}>{list.difficulty}</strong>
                      </span>
                    </div>
                    <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: 'var(--fg)' }}>
                      {list.title}
                    </h2>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.4 }}>
                      {list.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: 'var(--fg-4)' }}>
                      {list.problems.length} Problem{list.problems.length !== 1 ? 's' : ''}
                    </span>
                    <span style={{ color: 'var(--fg-4)', fontSize: 16 }}>{isOpen ? '▼' : '▶'}</span>
                  </div>
                </div>

                {isOpen && (
                  <div style={{ borderTop: '1px solid var(--border-soft)', padding: '8px 0', background: 'var(--bg-inset)' }}>
                    {list.problems.map((prob) => (
                      <div
                        key={prob.slug}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '12px 24px', borderBottom: '1px solid var(--border-soft)',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg)' }}>{prob.title}</span>
                            <span style={{
                              fontSize: 11, fontWeight: 500,
                              color: DIFFICULTY_COLOR[prob.difficulty] ?? 'var(--fg-3)',
                              textTransform: 'capitalize',
                            }}>
                              {prob.difficulty}
                            </span>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--fg-4)' }}>{prob.description}</div>
                        </div>

                        <button
                          onClick={() => onSelectProblem(prob.slug)}
                          style={{
                            padding: '6px 14px',
                            background: 'linear-gradient(180deg, oklch(0.52 0.16 278), oklch(0.46 0.16 278))',
                            color: 'white',
                            border: '1px solid oklch(0.62 0.16 278 / 0.6)',
                            borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9' }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                        >
                          Solve
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
