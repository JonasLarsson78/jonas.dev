import { genId } from '../shared/data'
import type { Task } from '../shared/data'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as Partial<Task>
  if (!body.title) throw createError({ statusCode: 400, message: 'title is required' })

  const task: Task = {
    id: genId(),
    title: body.title,
    description: body.description ?? '',
    priority: body.priority ?? 'medium',
    status: body.status ?? 'todo',
    createdAt: new Date().toISOString(),
  }

  return { data: task, timestamp: new Date().toISOString() }
})
