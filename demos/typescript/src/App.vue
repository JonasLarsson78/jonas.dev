<script setup lang="ts">
import { ref, computed } from 'vue'
import LanguageToggle from '../../_shared/vue/LanguageToggle.vue'
import { useLocale } from './composables/useLocale'

const portfolioUrl = '/'
const { t } = useLocale()

// ─── Types used in this demo ────────────────────────────────────────────────

type Priority = 'low' | 'medium' | 'high'
type Status   = 'todo' | 'in-progress' | 'done'

interface Task {
  id: string
  title: string
  priority: Priority
  status: Status
}

// Utility types: derive new types from existing ones without duplication
type CreateTask  = Omit<Task, 'id'>
type UpdateTask  = Partial<CreateTask>  // used for PATCH — Partial makes all fields optional
type TaskSummary = Pick<Task, 'id' | 'title'>

// Satisfy the compiler — UpdateTask is shown in the demo code block
const _updateExample: UpdateTask = { title: 'New title' }
void _updateExample

// Discriminated union: exhaustive API response modelling
type ApiResponse<T> =
  | { state: 'loading' }
  | { state: 'error'; message: string }
  | { state: 'success'; data: T; count: number }

// Generic function with constraint
function getById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id)
}

// Type guard: narrows unknown → known type at runtime
function isTask(value: unknown): value is Task {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value &&
    'priority' in value &&
    'status' in value
  )
}

// Record type: exhaustive mapping with no room for missing keys
const priorityLabel = computed<Record<Priority, string>>(() => ({
  low:    t.value.utility.priorities.low,
  medium: t.value.utility.priorities.medium,
  high:   t.value.utility.priorities.high,
}))

// ─── Demo state ─────────────────────────────────────────────────────────────

const seedTasks = computed<Task[]>(() => [
  { id: '1', title: t.value.seedTasks[0], priority: 'high',   status: 'done' },
  { id: '2', title: t.value.seedTasks[1], priority: 'high',   status: 'done' },
  { id: '3', title: t.value.seedTasks[2], priority: 'medium', status: 'in-progress' },
  { id: '4', title: t.value.seedTasks[3], priority: 'medium', status: 'todo' },
  { id: '5', title: t.value.seedTasks[4], priority: 'high',   status: 'done' },
])
const userTasks = ref<Task[]>([])
const tasks = computed<Task[]>(() => [...seedTasks.value, ...userTasks.value])

const newTask = ref<CreateTask>({ title: '', priority: 'medium', status: 'todo' })

type ApiState =
  | { state: 'loading' }
  | { state: 'error'; message: string }
  | { state: 'success' }

const apiState = ref<ApiState>({ state: 'success' })
const apiResponse = computed<ApiResponse<Task[]>>(() =>
  apiState.value.state === 'success'
    ? { state: 'success', data: tasks.value, count: tasks.value.length }
    : apiState.value
)

const selectedId = ref<string | null>(null)
const foundTask  = computed(() =>
  selectedId.value ? getById(tasks.value, selectedId.value) : undefined
)

// Unknown JSON blob to demonstrate type guard
const blobHasFields = ref(true)
const unknownBlob = computed<unknown>(() => blobHasFields.value
  ? { id: 'x9', title: t.value.typeguards.blobTitleWhenValid, priority: 'low', status: 'todo' }
  : { id: 'x9', title: t.value.typeguards.blobTitleWhenInvalid }
)
const blobIsTask = computed(() => isTask(unknownBlob.value))

const summaries = computed<TaskSummary[]>(() =>
  tasks.value.map(({ id, title }) => ({ id, title }))
)

function addTask() {
  if (!newTask.value.title.trim()) return
  userTasks.value.push({ ...newTask.value, id: Math.random().toString(36).slice(2, 7) })
  newTask.value = { title: '', priority: 'medium', status: 'todo' }
  apiState.value = { state: 'success' }
}

function simulateLoading() {
  apiState.value = { state: 'loading' }
  setTimeout(() => {
    apiState.value = { state: 'success' }
  }, 1500)
}

function simulateError() {
  apiState.value = { state: 'error', message: t.value.discriminated.errorMessage }
}

function toggleBlobValid() {
  blobHasFields.value = !blobHasFields.value
}

// ─── Section config ─────────────────────────────────────────────────────────
type SectionId = 'utility' | 'generics' | 'discriminated' | 'typeguards'
const sectionIds: SectionId[] = ['utility', 'generics', 'discriminated', 'typeguards']

const active = ref<SectionId>('utility')
</script>

<template>
  <div class="app">
    <!-- Topbar -->
    <div class="topbar">
      <a :href="portfolioUrl" class="back-link">← {{ t.topbar.back }}</a>
      <div class="topbar-center">
        <span class="badge ts">TypeScript 5</span>
        <span class="badge strict">strict: true</span>
        <span class="badge vue">Vue 3</span>
      </div>
      <div class="topbar-right">
        <LanguageToggle />
      </div>
    </div>

    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">{{ t.header.title }}</h1>
        <p class="page-subtitle" v-html="t.header.subtitleHtml" />
      </div>

      <!-- Section nav -->
      <div class="section-nav">
        <button
          v-for="id in sectionIds"
          :key="id"
          class="section-btn"
          :class="{ active: active === id }"
          @click="active = id"
        >
          {{ t.sections[id].label }}
        </button>
      </div>

      <!-- ── Utility Types ─────────────────────────────────────────── -->
      <div v-if="active === 'utility'" class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">{{ t.sections.utility.panelTitle }}</div>
            <div class="panel-tagline">{{ t.sections.utility.panelTagline }}</div>
          </div>
        </div>

        <div class="split">
          <div class="code-card">
            <div class="code-title">{{ t.utility.codeTitle }}</div>
            <pre class="code"><span class="kw">interface</span> <span class="type">Task</span> {
  id:       <span class="type">string</span>
  title:    <span class="type">string</span>
  priority: <span class="type">Priority</span>
  status:   <span class="type">Status</span>
}

<span class="comment">// Omit id — used when creating a new task</span>
<span class="kw">type</span> <span class="type">CreateTask</span> = <span class="fn">Omit</span>&lt;<span class="type">Task</span>, <span class="str">'id'</span>&gt;

<span class="comment">// All fields optional — used for PATCH updates</span>
<span class="kw">type</span> <span class="type">UpdateTask</span> = <span class="fn">Partial</span>&lt;<span class="type">CreateTask</span>&gt;

<span class="comment">// Only id + title — for list views</span>
<span class="kw">type</span> <span class="type">TaskSummary</span> = <span class="fn">Pick</span>&lt;<span class="type">Task</span>, <span class="str">'id'</span> | <span class="str">'title'</span>&gt;

<span class="comment">// Exhaustive map — compiler errors if a key is missing</span>
<span class="kw">const</span> priorityLabel: <span class="fn">Record</span>&lt;<span class="type">Priority</span>, <span class="type">string</span>&gt; = {
  low:    <span class="str">'● Low'</span>,
  medium: <span class="str">'●● Medium'</span>,
  high:   <span class="str">'●●● High'</span>,
}</pre>
          </div>

          <div class="demo-card">
            <div class="demo-title">{{ t.utility.demoTitle }}</div>
            <div class="form-group">
              <input
                v-model="newTask.title"
                class="ts-input"
                :placeholder="t.utility.titlePlaceholder"
                @keydown.enter="addTask"
              />
            </div>
            <div class="form-row">
              <select v-model="newTask.priority" class="ts-select">
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
              <select v-model="newTask.status" class="ts-select">
                <option value="todo">todo</option>
                <option value="in-progress">in-progress</option>
                <option value="done">done</option>
              </select>
              <button class="ts-btn" @click="addTask">{{ t.utility.addBtn }}</button>
            </div>

            <div class="divider" />

            <div class="demo-label">{{ t.utility.summaryLabel }}</div>
            <div class="summary-list">
              <div v-for="s in summaries" :key="s.id" class="summary-item">
                <span class="summary-id">{{ s.id }}</span>
                <span class="summary-title">{{ s.title }}</span>
              </div>
            </div>

            <div class="divider" />

            <div class="demo-label">{{ t.utility.recordLabel }}</div>
            <div class="record-list">
              <div v-for="(label, key) in priorityLabel" :key="key" class="record-item">
                <code>{{ key }}</code> → <span>{{ label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Generics ──────────────────────────────────────────────── -->
      <div v-else-if="active === 'generics'" class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">{{ t.sections.generics.panelTitle }}</div>
            <div class="panel-tagline">{{ t.sections.generics.panelTagline }}</div>
          </div>
        </div>

        <div class="split">
          <div class="code-card">
            <div class="code-title">{{ t.generics.codeTitle }}</div>
            <pre class="code"><span class="comment">// T must have an `id` field — compiler-enforced</span>
<span class="kw">function</span> <span class="fn">getById</span>&lt;<span class="type">T</span> <span class="kw">extends</span> { id: <span class="type">string</span> }&gt;(
  items: <span class="type">T</span>[],
  id: <span class="type">string</span>
): <span class="type">T</span> | <span class="type">undefined</span> {
  <span class="kw">return</span> items.<span class="fn">find</span>(item => item.id === id)
}

<span class="comment">// Works for Task — returns Task | undefined</span>
<span class="kw">const</span> task = <span class="fn">getById</span>&lt;<span class="type">Task</span>&gt;(tasks, <span class="str">'2'</span>)

<span class="comment">// Works for any type with { id: string }</span>
<span class="kw">const</span> user = <span class="fn">getById</span>(users, userId)

<span class="comment">// ❌ Compile error — number[] has no .id</span>
<span class="fn">getById</span>([<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>], <span class="str">'x'</span>)</pre>
          </div>

          <div class="demo-card">
            <div class="demo-title">{{ t.generics.demoTitle }}</div>
            <div class="form-row">
              <select v-model="selectedId" class="ts-select" style="flex:1">
                <option :value="null">{{ t.generics.pickId }}</option>
                <option v-for="task in tasks" :key="task.id" :value="task.id">{{ task.id }}</option>
              </select>
            </div>

            <div class="result-box" :class="{ found: foundTask, empty: !foundTask }">
              <template v-if="foundTask">
                <div class="result-label">{{ t.generics.tInferred }}</div>
                <div class="result-field"><span>id</span><code>{{ foundTask.id }}</code></div>
                <div class="result-field"><span>title</span><code>{{ foundTask.title }}</code></div>
                <div class="result-field"><span>priority</span><code>{{ foundTask.priority }}</code></div>
                <div class="result-field"><span>status</span><code>{{ foundTask.status }}</code></div>
              </template>
              <template v-else>
                <span class="empty-hint">{{ t.generics.emptyHint }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Discriminated Unions ──────────────────────────────────── -->
      <div v-else-if="active === 'discriminated'" class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">{{ t.sections.discriminated.panelTitle }}</div>
            <div class="panel-tagline">{{ t.sections.discriminated.panelTagline }}</div>
          </div>
        </div>

        <div class="split">
          <div class="code-card">
            <div class="code-title">{{ t.discriminated.codeTitle }}</div>
            <pre class="code"><span class="kw">type</span> <span class="type">ApiResponse</span>&lt;<span class="type">T</span>&gt; =
  | { state: <span class="str">'loading'</span> }
  | { state: <span class="str">'error'</span>;   message: <span class="type">string</span> }
  | { state: <span class="str">'success'</span>; data: <span class="type">T</span>; count: <span class="type">number</span> }

<span class="comment">// In a component — compiler narrows automatically:</span>
<span class="kw">if</span> (res.state === <span class="str">'success'</span>) {
  <span class="comment">// ✅ res.data and res.count are available</span>
  <span class="fn">render</span>(res.data)
} <span class="kw">else if</span> (res.state === <span class="str">'error'</span>) {
  <span class="comment">// ✅ res.message is available</span>
  <span class="fn">showError</span>(res.message)
}
<span class="comment">// ❌ Accessing res.data in the error branch → compile error</span></pre>
          </div>

          <div class="demo-card">
            <div class="demo-title">{{ t.discriminated.demoTitle }}</div>
            <div class="union-buttons">
              <button class="ts-btn loading" @click="simulateLoading">{{ t.discriminated.simulateLoading }}</button>
              <button class="ts-btn error"   @click="simulateError">{{ t.discriminated.simulateError }}</button>
            </div>

            <div class="union-state" :class="apiResponse.state">
              <template v-if="apiResponse.state === 'loading'">
                <div class="state-label">state: <code>'loading'</code></div>
                <div class="spinner-row">
                  <span class="spinner" /><span>{{ t.discriminated.fetching }}</span>
                </div>
              </template>
              <template v-else-if="apiResponse.state === 'error'">
                <div class="state-label">state: <code>'error'</code></div>
                <div class="error-msg">{{ apiResponse.message }}</div>
              </template>
              <template v-else>
                <div class="state-label">
                  state: <code>'success'</code> · count: <code>{{ apiResponse.count }}</code>
                </div>
                <div class="task-rows">
                  <div v-for="t in apiResponse.data.slice(0, 4)" :key="t.id" class="task-row">
                    <span class="task-prio" :class="t.priority" />
                    <span class="task-name">{{ t.title }}</span>
                    <span class="task-status" :class="t.status">{{ t.status }}</span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Type Guards ───────────────────────────────────────────── -->
      <div v-else-if="active === 'typeguards'" class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">{{ t.sections.typeguards.panelTitle }}</div>
            <div class="panel-tagline">{{ t.sections.typeguards.panelTagline }}</div>
          </div>
        </div>

        <div class="split">
          <div class="code-card">
            <div class="code-title">{{ t.typeguards.codeTitle }}</div>
            <pre class="code"><span class="comment">// Return type `value is Task` tells TypeScript:</span>
<span class="comment">// "if this returns true, narrow to Task"</span>
<span class="kw">function</span> <span class="fn">isTask</span>(value: <span class="type">unknown</span>): value <span class="kw">is</span> <span class="type">Task</span> {
  <span class="kw">return</span> (
    <span class="kw">typeof</span> value === <span class="str">'object'</span> &&
    value !== <span class="kw">null</span> &&
    <span class="str">'id'</span>       <span class="kw">in</span> value &&
    <span class="str">'title'</span>    <span class="kw">in</span> value &&
    <span class="str">'priority'</span> <span class="kw">in</span> value &&
    <span class="str">'status'</span>   <span class="kw">in</span> value
  )
}

<span class="comment">// Usage — TypeScript narrows inside the if block:</span>
<span class="kw">const</span> parsed: <span class="type">unknown</span> = JSON.<span class="fn">parse</span>(rawJson)

<span class="kw">if</span> (<span class="fn">isTask</span>(parsed)) {
  <span class="comment">// ✅ parsed is Task here</span>
  <span class="fn">saveTask</span>(parsed)
} <span class="kw">else</span> {
  <span class="comment">// Still unknown — can't access parsed.title etc.</span>
}</pre>
          </div>

          <div class="demo-card">
            <div class="demo-title">{{ t.typeguards.demoTitle }}</div>

            <div class="blob-display">
              <div class="blob-label" v-html="t.typeguards.blobLabel" />
              <pre class="blob-code">{{ JSON.stringify(unknownBlob, null, 2) }}</pre>
            </div>

            <div class="guard-result" :class="blobIsTask ? 'pass' : 'fail'">
              <div class="guard-verdict">
                <span class="guard-icon">{{ blobIsTask ? '✅' : '❌' }}</span>
                <span>isTask(unknownBlob) → <strong>{{ blobIsTask }}</strong></span>
              </div>
              <div class="guard-note">
                {{ blobIsTask ? t.typeguards.passNote : t.typeguards.failNote }}
              </div>
            </div>

            <button class="ts-btn" style="width:100%" @click="toggleBlobValid">
              {{ blobIsTask ? t.typeguards.removeFields : t.typeguards.addFields }}
            </button>
          </div>
        </div>
      </div>

      <!-- Config callout -->
      <div class="config-callout">
        <div class="config-title">{{ t.config.title }}</div>
        <div class="config-grid">
          <div v-for="(val, key) in {
            'strict': true,
            'noUnusedLocals': true,
            'noUnusedParameters': true,
            'noFallthroughCasesInSwitch': true,
            'noImplicitAny': true,
            'strictNullChecks': true,
          }" :key="key" class="config-item">
            <span class="config-key">{{ key }}</span>
            <span class="config-val">{{ val }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app { min-height: 100vh; }

/* Topbar */
.topbar {
  background: rgba(6, 6, 16, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}
.back-link { font-size: 13px; color: #64748b; text-decoration: none; font-weight: 500; transition: color 0.15s; }
.back-link:hover { color: #e2e8f0; }
.topbar-center { display: flex; gap: 6px; }
.topbar-right {
  display: flex;
  justify-content: flex-end;
  min-width: 100px;
}
.badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.badge.ts     { background: rgba(49,120,198,0.12); border: 1px solid rgba(49,120,198,0.3); color: #3b82f6; }
.badge.strict { background: rgba(99,102,241,0.1);  border: 1px solid rgba(99,102,241,0.25); color: #818cf8; }
.badge.vue    { background: rgba(66,184,131,0.1);  border: 1px solid rgba(66,184,131,0.25); color: #42b883; }

/* Page */
.container { max-width: 1060px; margin: 0 auto; padding: 40px 24px 80px; }

.page-header { margin-bottom: 36px; }
.page-title  { font-size: 30px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 10px; }
.page-subtitle { font-size: 15px; color: #64748b; line-height: 1.6; max-width: 560px; }
.page-subtitle code { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #818cf8; background: rgba(99,102,241,0.08); border-radius: 4px; padding: 1px 6px; }

/* Section nav */
.section-nav { display: flex; gap: 6px; margin-bottom: 24px; flex-wrap: wrap; }
.section-btn {
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.06);
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.section-btn:hover { border-color: rgba(255,255,255,0.15); color: #e2e8f0; }
.section-btn.active { background: rgba(49,120,198,0.12); border-color: rgba(49,120,198,0.35); color: #60a5fa; }

/* Panel */
.panel { background: #0a0a18; border: 1px solid rgba(255,255,255,0.05); border-radius: 14px; padding: 28px; margin-bottom: 24px; }
.panel-header { margin-bottom: 24px; }
.panel-title  { font-size: 18px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 4px; }
.panel-tagline { font-size: 13px; color: #64748b; }

/* Split layout */
.split { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

/* Code card */
.code-card { background: #060610; border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 20px; }
.code-title { font-size: 12px; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 14px; }
.code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12.5px;
  line-height: 1.7;
  color: #94a3b8;
  white-space: pre;
  overflow-x: auto;
}
.code :deep(.kw)      { color: #818cf8; }
.code :deep(.type)    { color: #34d399; }
.code :deep(.fn)      { color: #60a5fa; }
.code :deep(.str)     { color: #fb923c; }
.code :deep(.num)     { color: #a78bfa; }
.code :deep(.comment) { color: #374151; font-style: italic; }

/* Demo card */
.demo-card { background: #0d0d1a; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.demo-title { font-size: 12px; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; }
.demo-label { font-size: 11px; font-weight: 500; color: #334155; font-family: 'JetBrains Mono', monospace; }

/* Form controls */
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.ts-input, .ts-select {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 7px;
  padding: 8px 12px;
  font-size: 13px;
  color: #e2e8f0;
  font-family: 'JetBrains Mono', monospace;
  outline: none;
  transition: border-color 0.15s;
  flex: 1;
}
.ts-input:focus, .ts-select:focus { border-color: rgba(49,120,198,0.5); }
.ts-select option { background: #0d0d1a; }
.ts-btn {
  padding: 8px 16px;
  border-radius: 7px;
  background: rgba(49,120,198,0.15);
  border: 1px solid rgba(49,120,198,0.3);
  color: #60a5fa;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
  white-space: nowrap;
}
.ts-btn:hover { background: rgba(49,120,198,0.25); }
.ts-btn.loading { background: rgba(99,102,241,0.12); border-color: rgba(99,102,241,0.25); color: #818cf8; }
.ts-btn.error   { background: rgba(239,68,68,0.1);  border-color: rgba(239,68,68,0.25);  color: #f87171; }
.divider { border: none; border-top: 1px solid rgba(255,255,255,0.04); }

/* Summary list */
.summary-list { display: flex; flex-direction: column; gap: 5px; }
.summary-item { display: flex; gap: 10px; align-items: center; font-size: 12px; }
.summary-id    { font-family: 'JetBrains Mono', monospace; color: #334155; width: 28px; flex-shrink: 0; }
.summary-title { color: #64748b; }

/* Record list */
.record-list { display: flex; flex-direction: column; gap: 6px; }
.record-item { font-size: 12px; color: #64748b; display: flex; align-items: center; gap: 8px; }
.record-item code { font-family: 'JetBrains Mono', monospace; color: #818cf8; background: rgba(99,102,241,0.08); border-radius: 4px; padding: 1px 6px; }

/* Generics result box */
.result-box {
  background: #060610;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 14px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.2s;
}
.result-box.found { border-color: rgba(52,211,153,0.25); }
.result-label { font-size: 11px; color: #34d399; font-family: 'JetBrains Mono', monospace; margin-bottom: 4px; }
.result-field { display: flex; gap: 10px; align-items: center; font-size: 12px; }
.result-field span { color: #334155; width: 60px; flex-shrink: 0; }
.result-field code { font-family: 'JetBrains Mono', monospace; color: #94a3b8; background: rgba(255,255,255,0.04); border-radius: 4px; padding: 1px 6px; }
.empty-hint { font-size: 13px; color: #334155; margin: auto; text-align: center; }

/* Discriminated union */
.union-buttons { display: flex; gap: 8px; }
.union-state {
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px;
  padding: 16px;
  min-height: 100px;
  transition: border-color 0.3s;
}
.union-state.loading { border-color: rgba(99,102,241,0.2); }
.union-state.error   { border-color: rgba(239,68,68,0.2); }
.union-state.success { border-color: rgba(34,197,94,0.2); }
.state-label { font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #475569; margin-bottom: 12px; }
.state-label code { color: #818cf8; }
.spinner-row { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #64748b; }
.spinner { width: 14px; height: 14px; border: 2px solid rgba(99,102,241,0.3); border-top-color: #818cf8; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.error-msg { font-size: 13px; color: #f87171; }
.task-rows { display: flex; flex-direction: column; gap: 6px; }
.task-row  { display: flex; align-items: center; gap: 10px; font-size: 13px; }
.task-prio { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.task-prio.low    { background: #22c55e; }
.task-prio.medium { background: #f59e0b; }
.task-prio.high   { background: #ef4444; }
.task-name { flex: 1; color: #94a3b8; }
.task-status { font-size: 11px; font-family: 'JetBrains Mono', monospace; padding: 2px 7px; border-radius: 4px; }
.task-status.todo        { background: rgba(100,116,139,0.1); color: #64748b; }
.task-status.in-progress { background: rgba(245,158,11,0.1);  color: #f59e0b; }
.task-status.done        { background: rgba(34,197,94,0.1);   color: #22c55e; }

/* Type guard */
.blob-display { background: #060610; border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 14px; }
.blob-label   { font-size: 11px; color: #475569; margin-bottom: 8px; font-family: 'JetBrains Mono', monospace; }
.blob-code    { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #94a3b8; line-height: 1.6; }
.guard-result {
  border-radius: 8px;
  padding: 14px;
  border: 1px solid;
  transition: all 0.2s;
}
.guard-result.pass { background: rgba(34,197,94,0.05);  border-color: rgba(34,197,94,0.2); }
.guard-result.fail { background: rgba(239,68,68,0.05);  border-color: rgba(239,68,68,0.2); }
.guard-verdict { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #e2e8f0; margin-bottom: 6px; }
.guard-icon    { font-size: 16px; }
.guard-note    { font-size: 12px; color: #64748b; }

/* Config callout */
.config-callout {
  background: #0a0a18;
  border: 1px solid rgba(49,120,198,0.15);
  border-radius: 12px;
  padding: 24px;
}
.config-title { font-size: 13px; font-weight: 600; color: #60a5fa; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px; }
.config-grid  { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 8px; }
.config-item  { display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); border-radius: 7px; padding: 8px 12px; }
.config-key   { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #64748b; }
.config-val   { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #34d399; font-weight: 600; }

@media (max-width: 680px) {
  .split { grid-template-columns: 1fr; }
}
</style>
