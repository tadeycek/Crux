import { supabase } from './supabase'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

async function getToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  problems: {
    list: (params?: { topic?: string; difficulty?: string }) => {
      const qs = new URLSearchParams()
      if (params?.topic) qs.set('topic', params.topic)
      if (params?.difficulty) qs.set('difficulty', params.difficulty)
      const q = qs.toString()
      return request<ApiProblem[]>(`/api/problems${q ? `?${q}` : ''}`)
    },
    bySlug: (slug: string) => request<ApiProblemDetail>(`/api/problems/${slug}`),
    topics: () => request<ApiTopic[]>('/api/problems/all/topics'),
  },
  sessions: {
    list: () => request<ApiSession[]>('/api/sessions'),
    create: (problemId: number) =>
      request<ApiSession>('/api/sessions', {
        method: 'POST',
        body: JSON.stringify({ problemId }),
      }),
    get: (id: string) => request<ApiSessionDetail>(`/api/sessions/${id}`),
    saveCode: (id: string, code: string) =>
      request<{ ok: boolean }>(`/api/sessions/${id}/code`, {
        method: 'PATCH',
        body: JSON.stringify({ code }),
      }),
    complete: (id: string) =>
      request<{ ok: boolean }>(`/api/sessions/${id}/complete`, { method: 'POST' }),
    run: (id: string, code: string, language: string) =>
      request<ApiRunResult>(`/api/sessions/${id}/run`, {
        method: 'POST',
        body: JSON.stringify({ code, language }),
      }),
  },
  chat: {
    send: (sessionId: string, content: string, mode = 'Socratic', language = 'python') =>
      request<{ userMessage: ApiMessage; assistantMessage: ApiMessage }>(
        `/api/chat/${sessionId}`,
        { method: 'POST', body: JSON.stringify({ content, mode, language }) },
      ),
  },
  progress: {
    summary: () => request<ApiProgressSummary>('/api/progress/summary'),
  },
  concepts: {
    getProgress: () => request<Record<string, 'completed' | 'in-progress'>>('/api/concepts/progress'),
    setProgress: (slug: string, status: 'completed' | 'in-progress') =>
      request<{ ok: boolean }>(`/api/concepts/progress/${slug}`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      }),
    deleteProgress: (slug: string) =>
      request<{ ok: boolean }>(`/api/concepts/progress/${slug}`, { method: 'DELETE' }),
  },
  playlists: {
    list: () => request<ApiPlaylist[]>('/api/playlists'),
  },
  billing: {
    status: () => request<ApiBillingStatus>('/api/billing/status'),
    checkout: (plan: 'monthly' | 'yearly') =>
      request<{ url: string }>('/api/billing/checkout', {
        method: 'POST',
        body: JSON.stringify({ plan }),
      }),
  },
}

export interface ApiProblem {
  id: number
  title: string
  slug: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  starterCode: string
  constraints: string
  examples: { input: string; output: string; explain: string }[]
  createdAt: string
}

export interface ApiTopic {
  id: number
  name: string
  slug: string
}

export interface ApiProblemDetail extends ApiProblem {
  topics: ApiTopic[]
}

export interface ApiSession {
  id: string
  userId: string
  problemId: number
  currentCode: string
  status: 'active' | 'completed' | 'abandoned'
  startedAt: string
  endedAt: string | null
}

export interface ApiMessage {
  id: string
  sessionId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface ApiSessionDetail extends ApiSession {
  messages: ApiMessage[]
}

export interface ApiRunResult {
  stdout: string
  stderr: string
  exitCode: number
}

export interface ApiProgressSummary {
  streak: number
  activeDates: string[]
  grid: number[]
  problemsSolved: number
  totalSessions: number
}

export interface ApiPlaylistProblem {
  id: number
  title: string
  slug: string
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
}

export interface ApiBillingStatus {
  subscriptionStatus: 'free' | 'pro'
  isPro: boolean
  aiMessagesToday: number
  aiMessagesLimit: number | null
  aiMessagesRemaining: number | null
}

export interface ApiPlaylist {
  id: number
  title: string
  description: string
  badge: string
  difficulty: string
  position: number
  problems: ApiPlaylistProblem[]
}
