<script setup lang="ts">
import { ref, computed } from 'vue'

const GQL_URL      = '/api/graphql'
const portfolioUrl = '/'

interface GqlTask { id: string; title: string; status: string; priority: string; author: { name: string } }
interface GqlUser { id: string; name: string; email: string; role: string; tasks: { id: string; title: string }[] }

type ActiveTab = 'tasks' | 'user' | 'mutation' | 'schema'
const activeTab = ref<ActiveTab>('tasks')

// ── Tasks query ──────────────────────────────────────────────────────────────
const statusFilter  = ref('')
const priorityFilter = ref('')
const tasks = ref<GqlTask[]>([])
const tasksLoading = ref(false)
const tasksError = ref('')

const TASKS_QUERY = computed(() => `query GetTasks${statusFilter.value || priorityFilter.value ? `(${[statusFilter.value ? '$status: TaskStatus' : '', priorityFilter.value ? '$priority: Priority' : ''].filter(Boolean).join(', ')})` : ''} {
  tasks${statusFilter.value || priorityFilter.value ? `(${[statusFilter.value ? `status: $status` : '', priorityFilter.value ? `priority: $priority` : ''].filter(Boolean).join(', ')})` : ''} {
    id
    title
    status
    priority
    author {
      name
    }
  }
}`)

async function fetchTasks() {
  tasksLoading.value = true
  tasksError.value = ''
  try {
    const vars: Record<string, string> = {}
    if (statusFilter.value) vars.status = statusFilter.value
    if (priorityFilter.value) vars.priority = priorityFilter.value

    const res = await fetch(GQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: TASKS_QUERY.value, variables: vars }),
    })
    const json = await res.json() as { data?: { tasks: GqlTask[] }; errors?: { message: string }[] }
    if (json.errors) throw new Error(json.errors[0].message)
    tasks.value = json.data?.tasks ?? []
  } catch (e) {
    tasksError.value = (e as Error).message
  }
  tasksLoading.value = false
}

// ── User query ───────────────────────────────────────────────────────────────
const userId = ref('u1')
const user = ref<GqlUser | null>(null)
const userLoading = ref(false)
const userError = ref('')

const USER_QUERY = `query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    role
    tasks {
      id
      title
    }
  }
}`

async function fetchUser() {
  userLoading.value = true
  userError.value = ''
  try {
    const res = await fetch(GQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: USER_QUERY, variables: { id: userId.value } }),
    })
    const json = await res.json() as { data?: { user: GqlUser | null }; errors?: { message: string }[] }
    if (json.errors) throw new Error(json.errors[0].message)
    user.value = json.data?.user ?? null
    if (!user.value) userError.value = `No user with id "${userId.value}"`
  } catch (e) {
    userError.value = (e as Error).message
  }
  userLoading.value = false
}

// ── Mutation ─────────────────────────────────────────────────────────────────
const newTitle = ref('My GraphQL task')
const newPriority = ref('medium')
const mutationResult = ref<GqlTask | null>(null)
const mutationLoading = ref(false)
const mutationError = ref('')

const CREATE_MUTATION = `mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    id
    title
    status
    priority
    author {
      name
    }
  }
}`

async function createTask() {
  if (!newTitle.value.trim()) return
  mutationLoading.value = true
  mutationError.value = ''
  mutationResult.value = null
  try {
    const res = await fetch(GQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: CREATE_MUTATION,
        variables: { input: { title: newTitle.value, priority: newPriority.value, authorId: 'u1' } },
      }),
    })
    const json = await res.json() as { data?: { createTask: GqlTask }; errors?: { message: string }[] }
    if (json.errors) throw new Error(json.errors[0].message)
    mutationResult.value = json.data?.createTask ?? null
  } catch (e) {
    mutationError.value = (e as Error).message
  }
  mutationLoading.value = false
}

const SCHEMA = `type User {
  id:    ID!
  name:  String!
  email: String!
  role:  Role!
  tasks: [Task!]!
}

type Task {
  id:          ID!
  title:       String!
  description: String!
  status:      TaskStatus!
  priority:    Priority!
  author:      User!
}

enum Role       { admin user }
enum TaskStatus { todo in_progress done }
enum Priority   { low medium high }

type Query {
  users:  [User!]!
  user(id: ID!):   User
  tasks(status: TaskStatus, priority: Priority): [Task!]!
  task(id: ID!):   Task
}

input CreateTaskInput {
  title:       String!
  description: String
  priority:    Priority
  authorId:    ID!
}

input UpdateTaskInput {
  title:       String
  description: String
  status:      TaskStatus
  priority:    Priority
}

type Mutation {
  createTask(input: CreateTaskInput!):          Task!
  updateTask(id: ID!, input: UpdateTaskInput!): Task
  deleteTask(id: ID!):                          Boolean!
}`

const statusColor: Record<string, string> = {
  done: '#22c55e', in_progress: '#f59e0b', todo: '#64748b',
}
const priorityColor: Record<string, string> = {
  high: '#ef4444', medium: '#f59e0b', low: '#22c55e',
}
</script>

<template>
  <div class="app">
    <div class="topbar">
      <a :href="portfolioUrl" class="back-link">← Portfolio</a>
      <div class="topbar-center">
        <span class="badge gql">GraphQL</span>
        <span class="badge node">graphql-yoga</span>
        <span class="badge ts">TypeScript</span>
      </div>
      <a href="/api/graphql" target="_blank" class="graphiql-link">Open GraphiQL →</a>
    </div>

    <div class="container">
      <div class="page-header">
        <h1 class="page-title">GraphQL Demo</h1>
        <p class="page-subtitle">
          Live queries and mutations against a real GraphQL API (graphql-yoga on port 4001).
          Type-safe schema with nested resolvers, enums, and filtering.
        </p>
      </div>

      <div class="tabs">
        <button v-for="t in (['tasks','user','mutation','schema'] as ActiveTab[])" :key="t"
          class="tab" :class="{ active: activeTab === t }" @click="activeTab = t">
          {{ { tasks: 'Query: tasks', user: 'Query: user(id)', mutation: 'Mutation: createTask', schema: 'Schema' }[t] }}
        </button>
      </div>

      <!-- TASKS -->
      <div v-if="activeTab === 'tasks'" class="panel">
        <div class="split">
          <div class="code-side">
            <div class="code-label">Query</div>
            <pre class="gql-code">{{ TASKS_QUERY }}</pre>
            <div class="code-label" style="margin-top:16px">Variables</div>
            <div class="var-row">
              <select v-model="statusFilter" class="gql-select">
                <option value="">status: (any)</option>
                <option value="todo">todo</option>
                <option value="in_progress">in_progress</option>
                <option value="done">done</option>
              </select>
              <select v-model="priorityFilter" class="gql-select">
                <option value="">priority: (any)</option>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </div>
            <button class="run-btn" :disabled="tasksLoading" @click="fetchTasks">
              {{ tasksLoading ? 'Running…' : '▶  Run query' }}
            </button>
          </div>

          <div class="result-side">
            <div class="code-label">Response</div>
            <div v-if="tasksError" class="error-box">{{ tasksError }}</div>
            <div v-else-if="!tasks.length && !tasksLoading" class="empty-hint">Click "Run query" to execute</div>
            <div v-else class="task-list">
              <div v-for="t in tasks" :key="t.id" class="gql-task">
                <div class="gql-task-top">
                  <span class="gql-id">{{ t.id }}</span>
                  <span class="gql-title">{{ t.title }}</span>
                </div>
                <div class="gql-task-meta">
                  <span class="pill" :style="{ color: statusColor[t.status] }">{{ t.status }}</span>
                  <span class="pill" :style="{ color: priorityColor[t.priority] }">{{ t.priority }}</span>
                  <span class="pill author">{{ t.author.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- USER -->
      <div v-else-if="activeTab === 'user'" class="panel">
        <div class="split">
          <div class="code-side">
            <div class="code-label">Query</div>
            <pre class="gql-code">{{ USER_QUERY }}</pre>
            <div class="code-label" style="margin-top:16px">Variable</div>
            <div class="var-row">
              <select v-model="userId" class="gql-select" style="flex:1">
                <option value="u1">u1 — Jonas Larsson</option>
                <option value="u2">u2 — Anna Svensson</option>
                <option value="u3">u3 — Erik Berg</option>
                <option value="u99">u99 — (not found)</option>
              </select>
            </div>
            <button class="run-btn" :disabled="userLoading" @click="fetchUser">
              {{ userLoading ? 'Running…' : '▶  Run query' }}
            </button>
          </div>

          <div class="result-side">
            <div class="code-label">Response</div>
            <div v-if="userError" class="error-box">{{ userError }}</div>
            <div v-else-if="!user" class="empty-hint">Click "Run query" to execute</div>
            <div v-else class="user-card">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-meta">
                <span>{{ user.email }}</span>
                <span class="pill role" :class="user.role">{{ user.role }}</span>
              </div>
              <div class="code-label" style="margin-top:14px">tasks (nested resolver)</div>
              <div v-for="t in user.tasks" :key="t.id" class="nested-task">
                <span class="gql-id">{{ t.id }}</span>{{ t.title }}
              </div>
              <div v-if="!user.tasks.length" class="empty-hint" style="padding:8px 0">No tasks assigned</div>
            </div>
          </div>
        </div>
      </div>

      <!-- MUTATION -->
      <div v-else-if="activeTab === 'mutation'" class="panel">
        <div class="split">
          <div class="code-side">
            <div class="code-label">Mutation</div>
            <pre class="gql-code">{{ CREATE_MUTATION }}</pre>
            <div class="code-label" style="margin-top:16px">Input</div>
            <input v-model="newTitle" class="gql-input" placeholder="title: String!" />
            <select v-model="newPriority" class="gql-select">
              <option value="low">priority: low</option>
              <option value="medium">priority: medium</option>
              <option value="high">priority: high</option>
            </select>
            <button class="run-btn" :disabled="mutationLoading || !newTitle.trim()" @click="createTask">
              {{ mutationLoading ? 'Running…' : '▶  Run mutation' }}
            </button>
          </div>

          <div class="result-side">
            <div class="code-label">Response</div>
            <div v-if="mutationError" class="error-box">{{ mutationError }}</div>
            <div v-else-if="!mutationResult" class="empty-hint">Click "Run mutation" to create a task</div>
            <div v-else class="gql-task created">
              <div class="created-label">✅ Task created</div>
              <div class="gql-task-top">
                <span class="gql-id">{{ mutationResult.id }}</span>
                <span class="gql-title">{{ mutationResult.title }}</span>
              </div>
              <div class="gql-task-meta">
                <span class="pill" :style="{ color: statusColor[mutationResult.status] }">{{ mutationResult.status }}</span>
                <span class="pill" :style="{ color: priorityColor[mutationResult.priority] }">{{ mutationResult.priority }}</span>
                <span class="pill author">{{ mutationResult.author.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SCHEMA -->
      <div v-else-if="activeTab === 'schema'" class="panel">
        <div class="code-label" style="margin-bottom:14px">SDL — Schema Definition Language</div>
        <pre class="gql-code schema-full">{{ SCHEMA }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app { min-height: 100vh; }
.topbar { background: rgba(6,6,16,.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,.06); padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
.back-link { font-size: 13px; color: #64748b; text-decoration: none; font-weight: 500; transition: color .15s; }
.back-link:hover { color: #e2e8f0; }
.topbar-center { display: flex; gap: 6px; }
.graphiql-link { font-size: 12px; color: #e10098; text-decoration: none; font-weight: 600; transition: opacity .15s; }
.graphiql-link:hover { opacity: .7; }
.badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.badge.gql  { background: rgba(225,0,152,.12); border: 1px solid rgba(225,0,152,.3); color: #e10098; }
.badge.node { background: rgba(51,153,51,.1);  border: 1px solid rgba(51,153,51,.25); color: #5cb85c; }
.badge.ts   { background: rgba(49,120,198,.12); border: 1px solid rgba(49,120,198,.3); color: #3b82f6; }

.container { max-width: 1060px; margin: 0 auto; padding: 40px 24px 80px; }
.page-header { margin-bottom: 32px; }
.page-title  { font-size: 30px; font-weight: 800; letter-spacing: -.03em; margin-bottom: 10px; }
.page-subtitle { font-size: 15px; color: #64748b; line-height: 1.6; max-width: 580px; }

.tabs { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
.tab { padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 500; background: transparent; border: 1px solid rgba(255,255,255,.06); color: #64748b; cursor: pointer; transition: all .15s; font-family: inherit; }
.tab:hover { color: #e2e8f0; border-color: rgba(255,255,255,.15); }
.tab.active { background: rgba(225,0,152,.1); border-color: rgba(225,0,152,.3); color: #e10098; }

.panel { background: #0a0a18; border: 1px solid rgba(255,255,255,.05); border-radius: 14px; padding: 28px; }
.split { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.code-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: #475569; margin-bottom: 10px; }
.gql-code { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.65; color: #c792ea; background: #060610; border: 1px solid rgba(255,255,255,.05); border-radius: 8px; padding: 16px; white-space: pre; overflow-x: auto; }
.schema-full { color: #94a3b8; }
.var-row { display: flex; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
.gql-select, .gql-input { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 7px; padding: 8px 12px; font-size: 13px; color: #e2e8f0; font-family: 'JetBrains Mono', monospace; outline: none; transition: border-color .15s; flex: 1; cursor: pointer; }
.gql-select:focus, .gql-input:focus { border-color: rgba(225,0,152,.4); }
.gql-select option { background: #0a0a18; }
.gql-input { margin-bottom: 8px; width: 100%; }
.run-btn { margin-top: 12px; width: 100%; padding: 10px; border-radius: 8px; background: rgba(225,0,152,.15); border: 1px solid rgba(225,0,152,.3); color: #e10098; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .15s; font-family: inherit; }
.run-btn:hover:not(:disabled) { background: rgba(225,0,152,.25); }
.run-btn:disabled { opacity: .4; cursor: not-allowed; }

.result-side { display: flex; flex-direction: column; }
.error-box { background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.2); border-radius: 8px; padding: 14px; color: #f87171; font-size: 13px; }
.empty-hint { color: #334155; font-size: 13px; padding: 24px 0; text-align: center; }

.task-list { display: flex; flex-direction: column; gap: 8px; }
.gql-task { background: #0d0d1a; border: 1px solid rgba(255,255,255,.06); border-radius: 8px; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
.gql-task.created { border-color: rgba(34,197,94,.2); }
.created-label { font-size: 12px; color: #22c55e; font-weight: 600; }
.gql-task-top { display: flex; align-items: center; gap: 10px; }
.gql-id { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #334155; flex-shrink: 0; }
.gql-title { font-size: 13px; color: #94a3b8; }
.gql-task-meta { display: flex; gap: 6px; flex-wrap: wrap; }
.pill { font-size: 11px; font-weight: 600; background: rgba(255,255,255,.04); border-radius: 4px; padding: 2px 8px; color: #64748b; }
.pill.author { color: #64748b; }
.pill.role.admin { color: #818cf8; }
.pill.role.user  { color: #64748b; }

.user-card { background: #0d0d1a; border: 1px solid rgba(255,255,255,.06); border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.user-name { font-size: 16px; font-weight: 700; color: #e2e8f0; }
.user-meta { display: flex; gap: 10px; align-items: center; font-size: 13px; color: #64748b; }
.nested-task { display: flex; gap: 8px; align-items: center; font-size: 13px; color: #64748b; padding: 4px 0; border-top: 1px solid rgba(255,255,255,.04); }

@media(max-width:680px){.split{grid-template-columns:1fr}}
</style>
