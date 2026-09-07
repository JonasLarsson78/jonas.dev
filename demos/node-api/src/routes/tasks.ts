import { Router } from 'express'
import type { Task, ApiResponse } from '../types'

const router = Router()

let tasks: Task[] = [
  { id: '1', title: 'Set up Express API', description: 'Initialize Node.js + Express with TypeScript', status: 'done', priority: 'high', createdAt: new Date('2024-01-01').toISOString() },
  { id: '2', title: 'Add CORS middleware', description: 'Configure CORS for frontend origins', status: 'done', priority: 'high', createdAt: new Date('2024-01-02').toISOString() },
  { id: '3', title: 'Type all responses', description: 'Use TypeScript generics for consistent API responses', status: 'in-progress', priority: 'medium', createdAt: new Date('2024-01-03').toISOString() },
  { id: '4', title: 'Add auth middleware', description: 'JWT-based authentication', status: 'todo', priority: 'medium', createdAt: new Date('2024-01-04').toISOString() },
  { id: '5', title: 'Rate limiting', description: 'Protect endpoints with express-rate-limit', status: 'todo', priority: 'low', createdAt: new Date('2024-01-05').toISOString() },
]

router.get('/', (req, res) => {
  const { status, priority } = req.query

  let result = [...tasks]

  if (typeof status === 'string' && status !== 'all') {
    result = result.filter(t => t.status === status)
  }

  if (typeof priority === 'string' && priority !== 'all') {
    result = result.filter(t => t.priority === priority)
  }

  const response: ApiResponse<Task[]> = {
    data: result,
    count: result.length,
    timestamp: new Date().toISOString(),
  }

  res.json(response)
})

router.get('/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id)

  if (!task) {
    return res.status(404).json({ error: 'Task not found', status: 404 })
  }

  const response: ApiResponse<Task> = {
    data: task,
    timestamp: new Date().toISOString(),
  }

  res.json(response)
})

router.post('/', (req, res) => {
  const { title, description, priority, status } = req.body as Partial<Task>

  if (!title) {
    return res.status(400).json({ error: 'title is required', status: 400 })
  }

  const newTask: Task = {
    id: Math.random().toString(36).slice(2, 9),
    title,
    description: description ?? '',
    priority: priority ?? 'medium',
    status: status ?? 'todo',
    createdAt: new Date().toISOString(),
  }

  tasks.push(newTask)

  const response: ApiResponse<Task> = {
    data: newTask,
    timestamp: new Date().toISOString(),
  }

  res.status(201).json(response)
})

router.patch('/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id)

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found', status: 404 })
  }

  tasks[index] = { ...tasks[index], ...(req.body as Partial<Task>) }

  const response: ApiResponse<Task> = {
    data: tasks[index],
    timestamp: new Date().toISOString(),
  }

  res.json(response)
})

router.delete('/:id', (req, res) => {
  const before = tasks.length
  tasks = tasks.filter(t => t.id !== req.params.id)

  if (tasks.length === before) {
    return res.status(404).json({ error: 'Task not found', status: 404 })
  }

  res.status(204).send()
})

export default router
