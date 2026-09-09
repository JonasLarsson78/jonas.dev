<script setup lang="ts">
import { ref } from 'vue'
import LanguageToggle from '../../_shared/vue/LanguageToggle.vue'
import { useLocale } from './composables/useLocale'
import type { Tab } from './i18n/translations'

const portfolioUrl = '/'
const API = '/api/mongo'
const { t } = useLocale()
const activeTab = ref<Tab>('schema')
const tabIds: Tab[] = ['schema', 'queries', 'aggregation']

interface MongoTask { _id: string; title: string; status: string; priority: string; createdAt: string; author: { name: string; role: string } }
interface StatRow { _id: string; count: number; done: number }

const result = ref<MongoTask[] | null>(null)
const aggResult = ref<StatRow[] | null>(null)
const insertResult = ref<MongoTask | null>(null)
const loading = ref(false)
const error = ref('')

async function query<T>(url: string, opts?: RequestInit): Promise<T | null> {
  loading.value = true; error.value = ''
  try {
    const res = await fetch(url, opts)
    const json = await res.json() as T & { error?: string }
    if (!res.ok) throw new Error((json as { error: string }).error)
    return json
  } catch(e) { error.value = (e as Error).message; return null }
  finally { loading.value = false }
}

const statusFilter = ref('')
const newTitle = ref('My MongoDB task')
const newPriority = ref('medium')

async function fetchTasks() {
  const params = new URLSearchParams()
  if (statusFilter.value) params.set('status', statusFilter.value)
  const res = await query<{ data: MongoTask[] }>(`${API}/tasks?${params}`)
  result.value = res?.data ?? null
}

async function insertTask() {
  const res = await query<{ data: MongoTask }>(`${API}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: newTitle.value, priority: newPriority.value }),
  })
  insertResult.value = res?.data ?? null
}

async function fetchAgg() {
  const res = await query<{ data: StatRow[] }>(`${API}/aggregate`)
  aggResult.value = res?.data ?? null
}

const statusColor: Record<string, string> = { done: '#22c55e', 'in-progress': '#f59e0b', todo: '#64748b' }
</script>

<template>
  <div class="app">
    <div class="topbar">
      <a :href="portfolioUrl" class="back-link">← {{ t.topbar.back }}</a>
      <div class="topbar-center">
        <span class="badge mongo">MongoDB</span>
        <span class="badge doc">Documents</span>
        <span class="badge agg">Aggregation</span>
      </div>
      <div class="topbar-right">
        <LanguageToggle />
      </div>
    </div>

    <div class="container">
      <div class="page-header">
        <h1 class="page-title">{{ t.header.title }}</h1>
        <p class="page-subtitle">{{ t.header.subtitle }}</p>
      </div>

      <div class="tabs">
        <button v-for="tab in tabIds" :key="tab"
          class="tab" :class="{ active: activeTab === tab }" @click="activeTab = tab">{{ t.tabs[tab] }}</button>
      </div>

      <!-- Schema -->
      <div v-if="activeTab === 'schema'" class="panel">
        <div class="split">
          <div>
            <div class="code-label">{{ t.labels.document }}</div>
            <pre class="mongo-code">{
  _id: ObjectId("65f1a2b3c4d5e6f7a8b9c0d1"),
  title: "Design GraphQL schema",
  description: "Define types, queries, mutations",
  status: "done",
  priority: "high",
  tags: ["graphql", "backend"],
  author: {
    _id: ObjectId("..."),
    name: "Jonas Larsson",
    role: "admin"
  },
  createdAt: ISODate("2024-01-01T00:00:00.000Z"),
  updatedAt: ISODate("2024-01-15T12:00:00.000Z")
}</pre>
          </div>
          <div>
            <div class="code-label">{{ t.labels.schema }}</div>
            <pre class="mongo-code">const taskSchema = new Schema({
  title:    { type: String, required: true },
  status:   {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  author: { type: ObjectId, ref: 'User' },
  tags:   [String],
}, { timestamps: true })

taskSchema.index({ status: 1 })
taskSchema.index({ author: 1, status: 1 })</pre>
            <div class="vs-box">
              <div class="vs-title">{{ t.vs.title }}</div>
              <div v-for="row in t.vs.rows" :key="row[0]" class="vs-row">
                <span class="vs-mongo">{{ row[0] }}</span><span class="vs-sql">{{ row[1] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Queries -->
      <div v-else-if="activeTab === 'queries'" class="panel">
        <div class="split">
          <div>
            <div class="code-label">{{ t.labels.query }}</div>
            <pre class="mongo-code">// find() with filter
await Task.find(
  {{ statusFilter ? `{ status: '${statusFilter}' }` : '{} // all documents' }}
)
.populate('author', 'name role')
.sort({ createdAt: -1 })
.lean()</pre>

            <div class="filter-row">
              <select v-model="statusFilter" class="mongo-select">
                <option value="">{{ t.hints.statusAny }}</option>
                <option value="todo">todo</option>
                <option value="in-progress">in-progress</option>
                <option value="done">done</option>
              </select>
              <button class="run-btn" :disabled="loading" @click="fetchTasks">{{ t.buttons.runFind }}</button>
            </div>

            <div class="code-label" style="margin-top:20px">{{ t.labels.insertOne }}</div>
            <input v-model="newTitle" class="mongo-input" :placeholder="t.hints.titlePlaceholder" />
            <select v-model="newPriority" class="mongo-select">
              <option value="low">priority: low</option>
              <option value="medium">priority: medium</option>
              <option value="high">priority: high</option>
            </select>
            <button class="run-btn" :disabled="loading || !newTitle.trim()" @click="insertTask" style="margin-top:8px">{{ t.buttons.runInsert }}</button>
          </div>

          <div>
            <div class="code-label">{{ t.labels.result }}</div>
            <div v-if="error" class="err">{{ error }}</div>
            <div v-else-if="insertResult" class="doc-list">
              <div class="doc-inserted">{{ t.hints.docInserted }}</div>
              <div class="doc-card">
                <div v-for="[k,v] in Object.entries(insertResult)" :key="k" class="doc-field">
                  <span class="doc-key">{{ k }}</span>
                  <span class="doc-val">{{ typeof v === 'object' ? JSON.stringify(v) : v }}</span>
                </div>
              </div>
            </div>
            <div v-else-if="result" class="doc-list">
              <div v-for="doc in result" :key="doc._id" class="doc-card">
                <div class="doc-id">{{ doc._id }}</div>
                <div class="doc-title">{{ doc.title }}</div>
                <div class="doc-meta">
                  <span class="pill" :style="{color: statusColor[doc.status]}">{{ doc.status }}</span>
                  <span class="pill">{{ doc.priority }}</span>
                  <span class="pill">{{ doc.author.name }}</span>
                </div>
              </div>
            </div>
            <div v-else class="empty">{{ t.hints.clickFind }}</div>
          </div>
        </div>
      </div>

      <!-- Aggregation -->
      <div v-else-if="activeTab === 'aggregation'" class="panel">
        <div class="split">
          <div>
            <div class="code-label">{{ t.labels.aggPipeline }}</div>
            <pre class="mongo-code">await Task.aggregate([
  // Stage 1: Group by status
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 },
      titles: { $push: '$title' },
    }
  },
  // Stage 2: Sort by count desc
  { $sort: { count: -1 } },
  // Stage 3: Reshape output
  {
    $project: {
      status: '$_id',
      count: 1,
      _id: 0,
    }
  }
])</pre>
            <button class="run-btn" :disabled="loading" @click="fetchAgg">{{ t.buttons.runAgg }}</button>
          </div>
          <div>
            <div class="code-label">{{ t.labels.result }}</div>
            <div v-if="error" class="err">{{ error }}</div>
            <div v-else-if="!aggResult" class="empty">{{ t.hints.clickAgg }}</div>
            <div v-else class="agg-list">
              <div v-for="row in aggResult" :key="row._id" class="agg-row">
                <span class="pill" :style="{color: statusColor[row._id] || '#64748b'}">{{ row._id }}</span>
                <div class="agg-bar-wrap">
                  <div class="agg-bar" :style="{width: (row.count / 5 * 100)+'%', background: statusColor[row._id] || '#64748b'}" />
                </div>
                <span class="agg-count">{{ row.count }}</span>
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
.back-link { font-size: 13px; color: #64748b; text-decoration: none; font-weight: 500; }
.back-link:hover { color: #e2e8f0; }
.topbar-center { display: flex; gap: 6px; }
.topbar-right { display: flex; justify-content: flex-end; min-width: 100px; }
.badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.badge.mongo { background: rgba(0,163,75,.12); border: 1px solid rgba(0,163,75,.3); color: #00a34b; }
.badge.doc   { background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.2); color: #22c55e; }
.badge.agg   { background: rgba(245,158,11,.1); border: 1px solid rgba(245,158,11,.2); color: #f59e0b; }
.container { max-width: 1000px; margin: 0 auto; padding: 40px 24px 80px; }
.page-header { margin-bottom: 32px; }
.page-title { font-size: 30px; font-weight: 800; letter-spacing: -.03em; margin-bottom: 10px; }
.page-subtitle { font-size: 15px; color: #64748b; line-height: 1.6; max-width: 580px; }
.tabs { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
.tab { padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 500; background: transparent; border: 1px solid rgba(255,255,255,.06); color: #64748b; cursor: pointer; font-family: inherit; transition: all .15s; }
.tab:hover { color: #e2e8f0; }
.tab.active { background: rgba(0,163,75,.1); border-color: rgba(0,163,75,.3); color: #00c95a; }
.panel { background: #0a0a18; border: 1px solid rgba(255,255,255,.05); border-radius: 14px; padding: 28px; }
.split { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.code-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: #475569; margin-bottom: 10px; }
.mongo-code { font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.7; color: #94a3b8; background: #060610; border: 1px solid rgba(255,255,255,.05); border-radius: 8px; padding: 16px; white-space: pre; overflow-x: auto; margin-bottom: 14px; }
.filter-row { display: flex; gap: 8px; flex-wrap: wrap; }
.mongo-select, .mongo-input { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 7px; padding: 8px 12px; font-size: 13px; color: #e2e8f0; font-family: 'JetBrains Mono', monospace; outline: none; transition: border-color .15s; width: 100%; cursor: pointer; margin-bottom: 8px; }
.mongo-select:focus, .mongo-input:focus { border-color: rgba(0,163,75,.5); }
.mongo-select option { background: #0a0a18; }
.run-btn { width: 100%; padding: 9px; border-radius: 8px; background: rgba(0,163,75,.12); border: 1px solid rgba(0,163,75,.3); color: #00c95a; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all .15s; }
.run-btn:hover:not(:disabled) { background: rgba(0,163,75,.22); }
.run-btn:disabled { opacity: .4; cursor: not-allowed; }
.err { font-size: 12px; color: #f87171; background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.2); border-radius: 6px; padding: 10px 12px; }
.empty { color: #334155; font-size: 13px; text-align: center; padding: 24px 0; }
.doc-list { display: flex; flex-direction: column; gap: 8px; }
.doc-inserted { font-size: 12px; color: #22c55e; font-weight: 600; margin-bottom: 4px; }
.doc-card { background: #0d0d1a; border: 1px solid rgba(255,255,255,.06); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 5px; }
.doc-id { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #334155; }
.doc-title { font-size: 13px; color: #94a3b8; font-weight: 500; }
.doc-meta { display: flex; gap: 5px; flex-wrap: wrap; }
.doc-field { display: flex; gap: 10px; font-size: 12px; border-top: 1px solid rgba(255,255,255,.04); padding-top: 4px; }
.doc-key { font-family: 'JetBrains Mono', monospace; color: #00c95a; width: 80px; flex-shrink: 0; }
.doc-val { color: #94a3b8; word-break: break-all; }
.pill { font-size: 11px; font-weight: 600; background: rgba(255,255,255,.04); border-radius: 4px; padding: 2px 8px; }
.vs-box { background: #060610; border: 1px solid rgba(255,255,255,.05); border-radius: 8px; padding: 14px; margin-top: 14px; }
.vs-title { font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 10px; }
.vs-row { display: flex; gap: 8px; justify-content: space-between; padding: 5px 0; border-top: 1px solid rgba(255,255,255,.04); font-size: 12px; }
.vs-mongo { color: #00c95a; font-family: 'JetBrains Mono', monospace; }
.vs-sql   { color: #00a8cc; font-family: 'JetBrains Mono', monospace; }
.agg-list { display: flex; flex-direction: column; gap: 12px; margin-top: 8px; }
.agg-row { display: flex; align-items: center; gap: 12px; }
.agg-bar-wrap { flex: 1; height: 8px; background: rgba(255,255,255,.05); border-radius: 4px; overflow: hidden; }
.agg-bar { height: 100%; border-radius: 4px; transition: width .5s ease; opacity: .7; }
.agg-count { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; color: #94a3b8; width: 20px; text-align: right; }
@media(max-width:680px) { .split { grid-template-columns: 1fr; } }
</style>
