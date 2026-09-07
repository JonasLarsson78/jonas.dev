import { SEED_TASKS } from '../shared/data'

export default defineEventHandler((event) => {
  const { status, priority } = getQuery(event) as Record<string, string>
  let tasks = [...SEED_TASKS]
  if (status)   tasks = tasks.filter(t => t.status === status)
  if (priority) tasks = tasks.filter(t => t.priority === priority)
  return { data: tasks, count: tasks.length, timestamp: new Date().toISOString() }
})
