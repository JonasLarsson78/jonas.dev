const DOCS = [
  { _id: '65f1a2b3c4d5e6f7a8b9c0d1', title: 'Design GraphQL schema',   status: 'done',        priority: 'high',   createdAt: '2024-01-01T00:00:00Z', author: { name: 'Jonas Larsson', role: 'admin' } },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d2', title: 'Implement resolvers',      status: 'done',        priority: 'high',   createdAt: '2024-01-02T00:00:00Z', author: { name: 'Jonas Larsson', role: 'admin' } },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d3', title: 'Add authentication',       status: 'in-progress', priority: 'medium', createdAt: '2024-01-03T00:00:00Z', author: { name: 'Anna Svensson',  role: 'user' } },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d4', title: 'Write integration tests',  status: 'todo',        priority: 'medium', createdAt: '2024-01-04T00:00:00Z', author: { name: 'Anna Svensson',  role: 'user' } },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d5', title: 'Deploy to production',     status: 'todo',        priority: 'low',    createdAt: '2024-01-05T00:00:00Z', author: { name: 'Erik Berg',       role: 'user' } },
]

export default defineEventHandler((event) => {
  const { status } = getQuery(event) as { status?: string }
  const data = status ? DOCS.filter(d => d.status === status) : DOCS
  return { data }
})
