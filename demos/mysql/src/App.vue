<script setup lang="ts">
import { ref } from 'vue'

const API          = (import.meta.env.VITE_API_URL || 'http://localhost:3003') + '/api/db'
const portfolioUrl = import.meta.env.VITE_PORTFOLIO_URL || 'http://localhost:3000'

type Tab = 'schema' | 'tasks' | 'insert' | 'stats'
const activeTab = ref<Tab>('schema')

interface DbTask { id: number; title: string; status: string; priority: string; created_at: string; author_name: string; author_role: string }
interface DbUser { id: number; name: string; email: string; role: string; created_at: string }
interface StatRow { name: string; total_tasks: number; done: number; in_progress: number; todo: number }

const tasksData   = ref<{ data: DbTask[]; count: number; sql: string; params: object } | null>(null)
const usersData   = ref<DbUser[] | null>(null)
const statsData   = ref<StatRow[] | null>(null)
const insertResult = ref<{ data: DbTask; sql: string } | null>(null)
const loading     = ref(false)
const error       = ref('')

const statusFilter   = ref('')
const priorityFilter = ref('')
const newTitle       = ref('New MySQL task')
const newUserId      = ref('1')
const newPriority    = ref('medium')

async function query<T>(url: string, opts?: RequestInit): Promise<T | null> {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(url, opts)
    const json = await res.json() as T & { error?: string }
    if (!res.ok) throw new Error((json as { error: string }).error)
    return json
  } catch (e) { error.value = (e as Error).message; return null }
  finally { loading.value = false }
}

async function fetchTasks() {
  const params = new URLSearchParams()
  if (statusFilter.value)   params.set('status',   statusFilter.value)
  if (priorityFilter.value) params.set('priority', priorityFilter.value)
  tasksData.value = await query(`${API}/tasks?${params}`)
}

async function fetchUsers() {
  const res = await query<{ data: DbUser[] }>(`${API}/users`)
  usersData.value = res?.data ?? null
}

async function fetchStats() {
  statsData.value = (await query<{ data: StatRow[] }>(`${API}/stats`))?.data ?? null
}

async function insertTask() {
  insertResult.value = await query(`${API}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: newTitle.value, priority: newPriority.value, user_id: newUserId.value }),
  })
}

const SCHEMA_SQL = `-- MySQL-compatible schema (running on SQLite)

CREATE TABLE users (
  id         INT          PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  role       ENUM('admin','user') DEFAULT 'user',
  created_at DATETIME     DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id          INT          PRIMARY KEY AUTO_INCREMENT,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  status      ENUM('todo','in_progress','done') DEFAULT 'todo',
  priority    ENUM('low','medium','high')       DEFAULT 'medium',
  user_id     INT          NOT NULL,
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status  ON tasks(status);`

const statusColor: Record<string, string> = { done: '#22c55e', in_progress: '#f59e0b', todo: '#64748b' }
const priorityColor: Record<string, string> = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' }
</script>

<template>
  <div class="app">
    <div class="topbar">
      <a :href="portfolioUrl" class="back-link">← Portfolio</a>
      <div class="topbar-center">
        <span class="badge mysql">MySQL</span>
        <span class="badge sqlite">SQLite (in-memory)</span>
        <span class="badge node">Node.js + better-sqlite3</span>
      </div>
      <div style="width:120px" />
    </div>

    <div class="container">
      <div class="page-header">
        <h1 class="page-title">MySQL Demo</h1>
        <p class="page-subtitle">
          Real SQL running in-memory via SQLite — same syntax as MySQL.
          Schema with foreign keys, indexes, JOINs, GROUP BY, and aggregates.
        </p>
      </div>

      <div class="tabs">
        <button v-for="t in (['schema','tasks','insert','stats'] as Tab[])" :key="t"
          class="tab" :class="{ active: activeTab === t }" @click="activeTab = t">
          {{ { schema: 'Schema', tasks: 'SELECT + JOIN', insert: 'INSERT', stats: 'GROUP BY / aggregate' }[t] }}
        </button>
      </div>

      <!-- Schema -->
      <div v-if="activeTab === 'schema'" class="panel">
        <div class="split">
          <div>
            <div class="code-label">DDL (MySQL syntax)</div>
            <pre class="sql-code">{{ SCHEMA_SQL }}</pre>
          </div>
          <div>
            <div class="code-label">Tables</div>
            <div class="table-card">
              <div class="table-name">users</div>
              <div v-for="col in [['id','INT','PK AUTO_INCREMENT'],['name','VARCHAR(100)','NOT NULL'],['email','VARCHAR(150)','UNIQUE'],['role','ENUM','admin|user'],['created_at','DATETIME','DEFAULT NOW()']]" :key="col[0]" class="col-row">
                <span class="col-name">{{ col[0] }}</span>
                <span class="col-type">{{ col[1] }}</span>
                <span class="col-meta">{{ col[2] }}</span>
              </div>
            </div>
            <div class="table-card" style="margin-top:12px">
              <div class="table-name">tasks</div>
              <div v-for="col in [['id','INT','PK AUTO_INCREMENT'],['title','VARCHAR(200)','NOT NULL'],['description','TEXT','nullable'],['status','ENUM','todo|in_progress|done'],['priority','ENUM','low|medium|high'],['user_id','INT','FK → users.id'],['created_at','DATETIME','DEFAULT NOW()']]" :key="col[0]" class="col-row">
                <span class="col-name">{{ col[0] }}</span>
                <span class="col-type">{{ col[1] }}</span>
                <span class="col-meta">{{ col[2] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SELECT + JOIN -->
      <div v-else-if="activeTab === 'tasks'" class="panel">
        <div class="split">
          <div>
            <div class="code-label">SQL (generated from filters)</div>
            <pre class="sql-code" v-if="tasksData">{{ tasksData.sql }}</pre>
            <pre class="sql-code" v-else>SELECT t.*, u.name AS author_name, u.role AS author_role
FROM tasks t
INNER JOIN users u ON u.id = t.user_id
[WHERE ...]
ORDER BY t.id LIMIT 10 OFFSET 0</pre>
            <div class="filter-row">
              <select v-model="statusFilter" class="sql-select">
                <option value="">status: all</option>
                <option value="todo">todo</option>
                <option value="in_progress">in_progress</option>
                <option value="done">done</option>
              </select>
              <select v-model="priorityFilter" class="sql-select">
                <option value="">priority: all</option>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </div>
            <button class="run-btn" :disabled="loading" @click="fetchTasks">
              {{ loading ? 'Running…' : '▶  Execute query' }}
            </button>
          </div>
          <div>
            <div class="code-label">Result <span v-if="tasksData">({{ tasksData.count }} rows)</span></div>
            <div v-if="error" class="err">{{ error }}</div>
            <div v-else-if="!tasksData" class="empty-hint">Click "Execute query"</div>
            <div v-else class="rows">
              <div v-for="row in tasksData.data" :key="row.id" class="db-row">
                <div class="row-top">
                  <span class="row-id">{{ row.id }}</span>
                  <span class="row-title">{{ row.title }}</span>
                </div>
                <div class="row-meta">
                  <span class="pill" :style="{color: statusColor[row.status]}">{{ row.status }}</span>
                  <span class="pill" :style="{color: priorityColor[row.priority]}">{{ row.priority }}</span>
                  <span class="pill">{{ row.author_name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- INSERT -->
      <div v-else-if="activeTab === 'insert'" class="panel">
        <div class="split">
          <div>
            <div class="code-label">SQL</div>
            <pre class="sql-code">INSERT INTO tasks
  (title, description, status, priority, user_id)
VALUES
  (@title, @description, @status, @priority, @user_id)

-- Returns inserted row via:
SELECT t.*, u.name AS author_name
FROM tasks t
INNER JOIN users u ON u.id = t.user_id
WHERE t.id = LAST_INSERT_ID()</pre>
            <div class="code-label" style="margin-top:16px">Values</div>
            <input v-model="newTitle" class="sql-input" placeholder="title" />
            <select v-model="newPriority" class="sql-select">
              <option value="low">priority: low</option>
              <option value="medium">priority: medium</option>
              <option value="high">priority: high</option>
            </select>
            <select v-model="newUserId" class="sql-select">
              <option value="1">user_id: 1 (Jonas)</option>
              <option value="2">user_id: 2 (Anna)</option>
              <option value="3">user_id: 3 (Erik)</option>
            </select>
            <button class="run-btn" :disabled="loading || !newTitle.trim()" @click="insertTask">
              {{ loading ? 'Running…' : '▶  Execute INSERT' }}
            </button>
          </div>
          <div>
            <div class="code-label">Result</div>
            <div v-if="error" class="err">{{ error }}</div>
            <div v-else-if="!insertResult" class="empty-hint">Click "Execute INSERT"</div>
            <div v-else class="db-row created">
              <div class="created-ok">✅ Row inserted</div>
              <div v-for="[k,v] in Object.entries(insertResult.data)" :key="k" class="kv-row">
                <span class="kv-key">{{ k }}</span><span class="kv-val">{{ v }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div v-else-if="activeTab === 'stats'" class="panel">
        <div class="split">
          <div>
            <div class="code-label">SQL — GROUP BY + aggregate functions</div>
            <pre class="sql-code">SELECT
  u.name,
  COUNT(t.id)                                     AS total_tasks,
  SUM(CASE WHEN t.status = 'done'
           THEN 1 ELSE 0 END)                     AS done,
  SUM(CASE WHEN t.status = 'in_progress'
           THEN 1 ELSE 0 END)                     AS in_progress,
  SUM(CASE WHEN t.status = 'todo'
           THEN 1 ELSE 0 END)                     AS todo
FROM users u
LEFT JOIN tasks t ON t.user_id = u.id
GROUP BY u.id, u.name
ORDER BY total_tasks DESC</pre>
            <button class="run-btn" :disabled="loading" @click="fetchStats">
              {{ loading ? 'Running…' : '▶  Execute query' }}
            </button>
          </div>
          <div>
            <div class="code-label">Result</div>
            <div v-if="error" class="err">{{ error }}</div>
            <div v-else-if="!statsData" class="empty-hint">Click "Execute query"</div>
            <div v-else class="stats-table">
              <div class="stats-header">
                <span>Name</span><span>Total</span><span>Done</span><span>Active</span><span>Todo</span>
              </div>
              <div v-for="row in statsData" :key="row.name" class="stats-row">
                <span>{{ row.name }}</span>
                <span class="num">{{ row.total_tasks }}</span>
                <span class="num done">{{ row.done }}</span>
                <span class="num wip">{{ row.in_progress }}</span>
                <span class="num todo">{{ row.todo }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app { min-height: 100vh; }
.topbar { background: rgba(6,6,16,.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,.06); padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
.back-link { font-size: 13px; color: #64748b; text-decoration: none; font-weight: 500; transition: color .15s; }
.back-link:hover { color: #e2e8f0; }
.topbar-center { display: flex; gap: 6px; flex-wrap: wrap; }
.badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.badge.mysql  { background: rgba(0,117,143,.12); border: 1px solid rgba(0,117,143,.3); color: #00759f; }
.badge.sqlite { background: rgba(49,120,198,.1);  border: 1px solid rgba(49,120,198,.25); color: #60a5fa; }
.badge.node   { background: rgba(51,153,51,.1);   border: 1px solid rgba(51,153,51,.25); color: #5cb85c; }

.container { max-width: 1060px; margin: 0 auto; padding: 40px 24px 80px; }
.page-header { margin-bottom: 32px; }
.page-title  { font-size: 30px; font-weight: 800; letter-spacing: -.03em; margin-bottom: 10px; }
.page-subtitle { font-size: 15px; color: #64748b; line-height: 1.6; max-width: 580px; }

.tabs { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
.tab { padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 500; background: transparent; border: 1px solid rgba(255,255,255,.06); color: #64748b; cursor: pointer; transition: all .15s; font-family: inherit; }
.tab:hover { color: #e2e8f0; }
.tab.active { background: rgba(0,117,143,.1); border-color: rgba(0,117,143,.35); color: #00a8cc; }

.panel { background: #0a0a18; border: 1px solid rgba(255,255,255,.05); border-radius: 14px; padding: 28px; }
.split { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.code-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: #475569; margin-bottom: 10px; }
.sql-code { font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.7; color: #60a5fa; background: #060610; border: 1px solid rgba(255,255,255,.05); border-radius: 8px; padding: 16px; white-space: pre; overflow-x: auto; }
.filter-row { display: flex; gap: 8px; margin: 12px 0; flex-wrap: wrap; }
.sql-select, .sql-input { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 7px; padding: 8px 12px; font-size: 13px; color: #e2e8f0; font-family: 'JetBrains Mono', monospace; outline: none; transition: border-color .15s; flex: 1; cursor: pointer; margin-bottom: 8px; display: block; width: 100%; }
.sql-select:focus, .sql-input:focus { border-color: rgba(0,117,143,.5); }
.sql-select option { background: #0a0a18; }
.run-btn { width: 100%; padding: 10px; border-radius: 8px; background: rgba(0,117,143,.12); border: 1px solid rgba(0,117,143,.3); color: #00a8cc; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .15s; font-family: inherit; margin-top: 4px; }
.run-btn:hover:not(:disabled) { background: rgba(0,117,143,.22); }
.run-btn:disabled { opacity: .4; cursor: not-allowed; }
.err { font-size: 12px; color: #f87171; background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.2); border-radius: 6px; padding: 8px 12px; }
.empty-hint { color: #334155; font-size: 13px; text-align: center; padding: 24px 0; }

/* Table schema */
.table-card { background: #060610; border: 1px solid rgba(255,255,255,.05); border-radius: 8px; padding: 12px; }
.table-name { font-size: 13px; font-weight: 700; color: #00a8cc; margin-bottom: 10px; font-family: 'JetBrains Mono', monospace; }
.col-row { display: grid; grid-template-columns: 100px 1fr 1fr; gap: 6px; align-items: center; padding: 4px 0; border-top: 1px solid rgba(255,255,255,.03); font-size: 12px; }
.col-name { font-family: 'JetBrains Mono', monospace; color: #94a3b8; }
.col-type { color: #60a5fa; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
.col-meta { color: #334155; font-size: 11px; }

/* Rows */
.rows { display: flex; flex-direction: column; gap: 6px; }
.db-row { background: #0d0d1a; border: 1px solid rgba(255,255,255,.05); border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
.db-row.created { border-color: rgba(34,197,94,.2); }
.created-ok { font-size: 12px; color: #22c55e; font-weight: 600; }
.row-top { display: flex; gap: 8px; align-items: center; }
.row-id { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #334155; }
.row-title { font-size: 13px; color: #94a3b8; }
.row-meta { display: flex; gap: 6px; flex-wrap: wrap; }
.pill { font-size: 11px; font-weight: 600; background: rgba(255,255,255,.04); border-radius: 4px; padding: 2px 8px; color: #64748b; }
.kv-row { display: flex; gap: 12px; font-size: 12px; padding: 3px 0; border-top: 1px solid rgba(255,255,255,.03); }
.kv-key { font-family: 'JetBrains Mono', monospace; color: #60a5fa; width: 100px; flex-shrink: 0; }
.kv-val { color: #94a3b8; }

/* Stats table */
.stats-table { display: flex; flex-direction: column; gap: 1px; }
.stats-header, .stats-row { display: grid; grid-template-columns: 1fr 60px 60px 60px 60px; gap: 8px; padding: 8px 12px; border-radius: 6px; font-size: 13px; }
.stats-header { font-size: 11px; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: .06em; }
.stats-row { background: #0d0d1a; border: 1px solid rgba(255,255,255,.04); }
.stats-row span { color: #64748b; }
.num { text-align: right; font-family: 'JetBrains Mono', monospace; font-weight: 600; }
.num.done { color: #22c55e; }
.num.wip  { color: #f59e0b; }
.num.todo { color: #475569; }

@media(max-width:680px){.split{grid-template-columns:1fr}}
</style>
