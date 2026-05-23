export interface ProblemExample {
  input: string
  output: string
  explain: string
}

export interface Problem {
  number: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  topics: string[]
  description: string[]
  constraints: string[]
  examples: ProblemExample[]
}

export type MessageRole = 'user' | 'tutor'

export type MessagePart =
  | { type: 'text'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'chips'; items: string[] }

export interface ChatMessage {
  role: MessageRole
  time: string
  body: MessagePart[]
}

export type SessionStatus = 'active' | 'completed' | 'abandoned'

export interface Session {
  id: string
  problemId: string
  currentCode: string
  status: SessionStatus
  startedAt: string
  messages: ChatMessage[]
}
