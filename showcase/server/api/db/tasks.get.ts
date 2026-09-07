const DB_TASKS = [
  { id: 1, title: 'Set up SQLite schema',   description: 'CREATE TABLE, indexes, FK', status: 'done',        priority: 'high',   created_at: '2024-01-01T00:00:00Z', author_id: 1, author_name: 'Jonas Larsson', author_role: 'admin' },
  { id: 2, title: 'Write SELECT with JOIN',  description: 'Combine tasks and users',   status: 'done',        priority: 'high',   created_at: '2024-01-02T00:00:00Z', author_id: 1, author_name: 'Jonas Larsson', author_role: 'admin' },
  { id: 3, title: 'Add pagination',          description: 'LIMIT and OFFSET',          status: 'in_progress', priority: 'medium', created_at: '2024-01-03T00:00:00Z', author_id: 2, author_name: 'Anna Svensson',  author_role: 'user' },
  { id: 4, title: 'Implement transactions',  description: 'Atomic multi-step ops',     status: 'todo',        priority: 'medium', created_at: '2024-01-04T00:00:00Z', author_id: 2, author_name: 'Anna Svensson',  author_role: 'user' },
  { id: 5, title: 'Add full-text search',   description: 'FTS5 virtual table',         status: 'todo',        priority: 'low',    created_at: '2024-01-05T00:00:00Z', author_id: 3, author_name: 'Erik Berg',       author_role: 'user' },
]

export default defineEventHandler((event) => {
  const { status, priority, limit = '10', offset = '0' } = getQuery(event) as Record<string, string>

  let tasks = [...DB_TASKS]
  if (status)   tasks = tasks.filter(t => t.status === status)
  if (priority) tasks = tasks.filter(t => t.priority === priority)

  const count  = tasks.length
  const paged  = tasks.slice(Number(offset), Number(offset) + Number(limit))

  const conditions = [status && `t.status = '${status}'`, priority && `t.priority = '${priority}'`].filter(Boolean)
  const where = conditions.length ? ' WHERE ' + conditions.join(' AND ') : ''

  return {
    data: paged,
    count,
    sql: `SELECT t.*, u.name AS author_name, u.role AS author_role\nFROM tasks t\nINNER JOIN users u ON u.id = t.user_id${where}\nORDER BY t.id LIMIT ${limit} OFFSET ${offset}`,
    params: { status, priority, limit, offset },
  }
})
