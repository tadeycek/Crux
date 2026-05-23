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
  },
  chat: {
    send: (sessionId: string, content: string) =>
      request<{ userMessage: ApiMessage; assistantMessage: ApiMessage }>(
        `/api/chat/${sessionId}`,
        { method: 'POST', body: JSON.stringify({ content }) },
      ),
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
