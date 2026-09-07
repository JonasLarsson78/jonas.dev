export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

export interface ApiResponse<T> {
  data: T
  count?: number
  timestamp: string
}

export interface ApiError {
  error: string
  status: number
}
