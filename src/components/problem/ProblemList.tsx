import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { ApiProblem, ApiTopic } from '../../lib/api'
import { DotIcon } from '../icons'

const DIFFICULTY_COLOR = {
  easy:   'var(--ok)',
  medium: 'var(--warn)',
  hard:   'var(--danger)',
}

interface ProblemListProps {
  onSelect: (slug: string) => void
}

export function ProblemList({ onSelect }: ProblemListProps) {
  const [topicFilter, setTopicFilter] = useState<string>('')
  const [diffFilter, setDiffFilter] = useState<string>('')

  const { data: topics = [] } = useQuery<ApiTopic[]>({
    queryKey: ['topics'],
    queryFn: () => api.problems.topics(),
  })

  const { data: problems = [], isLoading } = useQuery<ApiProblem[]>({
    queryKey: ['problems', topicFilter, diffFilter],
    queryFn: () => api.problems.list({
      topic: topicFilter || undefined,
      difficulty: diffFilter || undefined,
    }),
  })

  return (
    <aside style={{
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg-1)', minHeight: 0,
    }}>
      {/* header */}
      <div style={{
        padding: '14px 16px 10px',
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>Problems</div>

        {/* filters */}
        <div style={{ display: 'flex', gap: 6 }}>
          <select
            value={diffFilter}
            onChange={e => setDiffFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="">All levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            value={topicFilter}
            onChange={e => setTopicFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="">All topics</option>
            {topics.map(t => (
              <option key={t.id} value={t.slug}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* list */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {isLoading ? (
          <div style={{ padding: 20, fontSize: 13, color: 'var(--fg-4)' }}>Loading…</div>
        ) : problems.length === 0 ? (
          <div style={{ padding: 20, fontSize: 13, color: 'var(--fg-4)' }}>No problems match the filters.</div>
        ) : (
          problems.map((p, i) => (
            <ProblemRow key={p.id} problem={p} index={i + 1} onClick={() => onSelect(p.slug)} />
          ))
        )}
      </div>
    </aside>
  )
}

function ProblemRow({ problem, index, onClick }: { problem: ApiProblem; index: number; onClick: () => void }) {
  const color = DIFFICULTY_COLOR[problem.difficulty]
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left', background: 'transparent',
        border: 'none', borderBottom: '1px solid var(--border-soft)',
        padding: '12px 16px', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 5,
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-2)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--fg-4)',
          minWidth: 28,
        }}>
          {String(index).padStart(2, '0')}
        </span>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)', flex: 1 }}>
          {problem.title}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color, fontSize: 11.5 }}>
          <DotIcon />
          <span style={{ textTransform: 'capitalize' }}>{problem.difficulty}</span>
        </span>
      </div>
    </button>
  )
}

const selectStyle: React.CSSProperties = {
  flex: 1,
  padding: '5px 8px',
  background: 'var(--bg-2)',
  border: '1px solid var(--border-soft)',
  borderRadius: 7,
  color: 'var(--fg-2)',
  fontSize: 12,
  fontFamily: 'inherit',
  cursor: 'pointer',
  outline: 'none',
}
