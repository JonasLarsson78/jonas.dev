const STATS = [
  { name: 'Jonas Larsson', total_tasks: 2, done: 2, in_progress: 0, todo: 0 },
  { name: 'Anna Svensson',  total_tasks: 2, done: 0, in_progress: 1, todo: 1 },
  { name: 'Erik Berg',      total_tasks: 1, done: 0, in_progress: 0, todo: 1 },
]

export default defineEventHandler(() => ({
  data: STATS,
  sql: `SELECT\n  u.name,\n  COUNT(t.id) AS total_tasks,\n  SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END) AS done,\n  SUM(CASE WHEN t.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress,\n  SUM(CASE WHEN t.status = 'todo' THEN 1 ELSE 0 END) AS todo\nFROM users u\nLEFT JOIN tasks t ON t.user_id = u.id\nGROUP BY u.id, u.name\nORDER BY total_tasks DESC`,
}))
