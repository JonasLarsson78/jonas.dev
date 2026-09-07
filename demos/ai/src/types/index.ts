export type MessageRole = 'user' | 'assistant'

export interface Message {
  id: string
  role: MessageRole
  content: string
  streaming?: boolean
  timestamp: Date
}

export interface ChatState {
  messages: Message[]
  loading: boolean
  error: string | null
}
