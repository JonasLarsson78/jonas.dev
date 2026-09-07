export type Priority = 'low' | 'medium' | 'high'
export type Status   = 'todo' | 'in-progress' | 'done'

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  status: Status
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

export const USERS: User[] = [
  { id: 'u1', name: 'Jonas Larsson', email: 'jonas@demo.com', role: 'admin' },
  { id: 'u2', name: 'Anna Svensson',  email: 'anna@demo.com',  role: 'user' },
  { id: 'u3', name: 'Erik Berg',      email: 'erik@demo.com',  role: 'user' },
]

export const SEED_TASKS: Task[] = [
  { id: '1', title: 'Set up Express API',    description: 'Initialize Node.js + Express with TypeScript', status: 'done',        priority: 'high',   createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', title: 'Add CORS middleware',   description: 'Configure CORS for frontend origins',          status: 'done',        priority: 'high',   createdAt: '2024-01-02T00:00:00Z' },
  { id: '3', title: 'Type all responses',    description: 'Use TypeScript generics for API responses',     status: 'in-progress', priority: 'medium', createdAt: '2024-01-03T00:00:00Z' },
  { id: '4', title: 'Add auth middleware',   description: 'JWT-based authentication',                     status: 'todo',        priority: 'medium', createdAt: '2024-01-04T00:00:00Z' },
  { id: '5', title: 'Rate limiting',         description: 'Protect endpoints with rate limiting',          status: 'todo',        priority: 'low',    createdAt: '2024-01-05T00:00:00Z' },
]

export function genId(): string {
  return Math.random().toString(36).slice(2, 9)
}
