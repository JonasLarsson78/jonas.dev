export default defineEventHandler(async (event) => {
  const { title, priority } = await readBody(event) as { title?: string; priority?: string }
  if (!title) throw createError({ statusCode: 400, message: 'title required' })

  const doc = {
    _id: Math.random().toString(36).slice(2, 26),
    title,
    status: 'todo',
    priority: priority ?? 'medium',
    createdAt: new Date().toISOString(),
    author: { name: 'Jonas Larsson', role: 'admin' },
  }
  return { data: doc }
})
