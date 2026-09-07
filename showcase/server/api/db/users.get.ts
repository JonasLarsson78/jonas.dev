import { USERS } from '../../shared/data'

export default defineEventHandler(() => ({
  data: USERS.map((u, i) => ({ ...u, id: i + 1, created_at: '2024-01-01T00:00:00Z' })),
  sql: 'SELECT * FROM users ORDER BY id',
}))
