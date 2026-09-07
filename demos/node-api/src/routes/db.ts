import { Router } from 'express'
import Database from 'better-sqlite3'

const router = Router()

// In-memory SQLite database — same SQL as MySQL
const db = new Database(':memory:')

db.exec(`
  CREATE TABLE users (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT    NOT NULL,
    email   TEXT    NOT NULL UNIQUE,
    role    TEXT    NOT NULL DEFAULT 'user',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    description TEXT,
    status      TEXT    NOT NULL DEFAULT 'todo',
    priority    TEXT    NOT NULL DEFAULT 'medium',
    user_id     INTEGER NOT NULL REFERENCES users(id),
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX idx_tasks_user_id ON tasks(user_id);
  CREATE INDEX idx_tasks_status  ON tasks(status);

  INSERT INTO users (name, email, role) VALUES
    ('Jonas Larsson', 'jonas@demo.com', 'admin'),
    ('Anna Svensson',  'anna@demo.com',  'user'),
    ('Erik Berg',      'erik@demo.com',  'user');

  INSERT INTO tasks (title, description, status, priority, user_id) VALUES
    ('Set up SQLite schema',    'CREATE TABLE, indexes, foreign keys', 'done',        'high',   1),
    ('Write SELECT with JOIN',  'Combine tasks and users tables',       'done',        'high',   1),
    ('Add pagination',          'LIMIT and OFFSET for large datasets',  'in_progress', 'medium', 2),
    ('Implement transactions',  'Atomic multi-step operations',         'todo',        'medium', 2),
    ('Add full-text search',    'FTS5 virtual table',                   'todo',        'low',    3);
`)

// ── Queries ───────────────────────────────────────────────────────────────────

router.get('/users', (_, res) => {
  const rows = db.prepare('SELECT * FROM users ORDER BY id').all()
  res.json({ data: rows, sql: 'SELECT * FROM users ORDER BY id' })
})

router.get('/tasks', (req, res) => {
  const { status, priority, limit = '10', offset = '0' } = req.query as Record<string, string>

  let sql = `
    SELECT
      t.id, t.title, t.description, t.status, t.priority, t.created_at,
      u.id   AS author_id,
      u.name AS author_name,
      u.role AS author_role
    FROM tasks t
    INNER JOIN users u ON u.id = t.user_id`

  const conditions: string[] = []
  const params: Record<string, string> = {}

  if (status)   { conditions.push('t.status = @status');     params.status = status }
  if (priority) { conditions.push('t.priority = @priority'); params.priority = priority }

  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ')
  sql += ` ORDER BY t.id LIMIT @limit OFFSET @offset`
  params.limit = limit
  params.offset = offset

  const rows = db.prepare(sql).all(params)
  const count = (db.prepare(`SELECT COUNT(*) as n FROM tasks t${conditions.length ? ' WHERE ' + conditions.join(' AND ') : ''}`).get(params) as { n: number }).n

  res.json({ data: rows, count, sql: sql.trim(), params })
})

router.post('/tasks', (req, res) => {
  const { title, description, status, priority, user_id } = req.body as Record<string, string>
  if (!title || !user_id) return res.status(400).json({ error: 'title and user_id required' })

  const sql = `INSERT INTO tasks (title, description, status, priority, user_id)
               VALUES (@title, @description, @status, @priority, @user_id)`
  const info = db.prepare(sql).run({ title, description: description ?? '', status: status ?? 'todo', priority: priority ?? 'medium', user_id })
  const row  = db.prepare('SELECT t.*, u.name AS author_name FROM tasks t INNER JOIN users u ON u.id = t.user_id WHERE t.id = ?').get(info.lastInsertRowid)

  res.status(201).json({ data: row, sql })
})

router.get('/stats', (_, res) => {
  const sql = `
    SELECT
      u.name,
      COUNT(t.id)                                           AS total_tasks,
      SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END)   AS done,
      SUM(CASE WHEN t.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress,
      SUM(CASE WHEN t.status = 'todo' THEN 1 ELSE 0 END)   AS todo
    FROM users u
    LEFT JOIN tasks t ON t.user_id = u.id
    GROUP BY u.id, u.name
    ORDER BY total_tasks DESC`

  const rows = db.prepare(sql).all()
  res.json({ data: rows, sql: sql.trim() })
})

export default router
