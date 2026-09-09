export type TaskStatus = 'todo' | 'in-progress' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high'

import type { SeedTaskKey } from '../i18n/translations'

export interface Task {
  id: string
  seedKey?: SeedTaskKey
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  tags: string[]
  createdAt: Date
}

export interface Column {
  id: TaskStatus
  label: string
  color: string
  accent: string
}
