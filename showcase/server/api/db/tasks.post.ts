const AUTHORS: Record<string, { name: string; role: string }> = {
  '1': { name: 'Jonas Larsson', role: 'admin' },
  '2': { name: 'Anna Svensson',  role: 'user' },
  '3': { name: 'Erik Berg',      role: 'user' },
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as { title?: string; description?: string; priority?: string; status?: string; user_id?: string }
  if (!body.title || !body.user_id) throw createError({ statusCode: 400, message: 'title and user_id required' })

  const author = AUTHORS[body.user_id] ?? { name: 'Unknown', role: 'user' }
  const row = {
    id: Math.floor(Math.random() * 9000) + 1000,
    title: body.title,
    description: body.description ?? '',
    status: body.status ?? 'todo',
    priority: body.priority ?? 'medium',
    created_at: new Date().toISOString(),
    author_id: Number(body.user_id),
    author_name: author.name,
    author_role: author.role,
  }

  return {
    data: row,
    sql: `INSERT INTO tasks (title, description, status, priority, user_id)\nVALUES (@title, @description, @status, @priority, @user_id)`,
  }
})
