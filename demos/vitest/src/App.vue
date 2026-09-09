<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import LanguageToggle from '../../_shared/vue/LanguageToggle.vue'
import { useLocale } from './composables/useLocale'
import type { Tab } from './i18n/translations'

const portfolioUrl = '/'
const { t } = useLocale()
const activeTab = ref<Tab>('runner')
const tabIds: Tab[] = ['runner', 'code', 'coverage']
const isRunning = ref(false)

interface TestResult { name: string; status: 'pass' | 'fail' | 'skip' | 'pending'; ms: number; error?: string }
interface TestSuite { file: string; tests: TestResult[]; expanded: boolean }

function buildSuites(): TestSuite[] {
  const tv = t.value
  return [
    { file: tv.suites.tasksFile, expanded: true, tests: tv.suites.tasks.map(name => ({ name, status: 'pending' as const, ms: 0 })) },
    { file: tv.suites.cardFile,  expanded: true, tests: tv.suites.cards.map(name => ({ name, status: 'pending' as const, ms: 0 })) },
    { file: tv.suites.dateFile,  expanded: true, tests: tv.suites.dates.map(name => ({ name, status: 'pending' as const, ms: 0 })) },
  ]
}

const suites = ref<TestSuite[]>(buildSuites())

watch(t, () => {
  if (isRunning.value) return
  suites.value = buildSuites()
})

const RESULTS: TestResult['status'][] = ['pass','pass','pass','pass','pass','pass','pass','pass','pass','pass','pass','pass','fail']
const FAIL_IDX = 12
const FAIL_ERR = "Expected 'Invalid date' to equal 'Invalid Date'\n  - Expected: 'Invalid date'\n  + Received: 'Invalid Date'"

async function runTests() {
  if (isRunning.value) return
  isRunning.value = true

  // reset
  suites.value.forEach(s => s.tests.forEach(t => { t.status = 'pending'; t.ms = 0; t.error = undefined }))

  let idx = 0
  for (const suite of suites.value) {
    for (const test of suite.tests) {
      await new Promise(r => setTimeout(r, 120 + Math.random() * 180))
      test.status = RESULTS[idx] ?? 'pass'
      test.ms = Math.floor(8 + Math.random() * 40)
      if (idx === FAIL_IDX) test.error = FAIL_ERR
      idx++
    }
  }
  isRunning.value = false
}

const totals = computed(() => {
  const all = suites.value.flatMap(s => s.tests)
  return {
    total: all.length,
    pass:  all.filter(t => t.status === 'pass').length,
    fail:  all.filter(t => t.status === 'fail').length,
    pending: all.filter(t => t.status === 'pending').length,
    ms: all.reduce((s, t) => s + t.ms, 0),
    done: all.every(t => t.status !== 'pending'),
  }
})

const iconMap: Record<TestResult['status'], string> = {
  pass: '✓', fail: '✗', skip: '○', pending: '·'
}
const colorMap: Record<TestResult['status'], string> = {
  pass: '#22c55e', fail: '#ef4444', skip: '#64748b', pending: '#334155'
}

const STORE_TEST = `import { setActivePinia, createPinia } from 'pinia'
import { useTaskStore } from '@/stores/tasks'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Task Store', () => {
  beforeEach(() => { setActivePinia(createPinia()) })

  it('adds a task to the store', () => {
    const store = useTaskStore()
    store.addTask({
      title: 'Test task',
      description: '',
      priority: 'high',
      status: 'todo',
      tags: [],
    })
    expect(store.tasks).toHaveLength(1)
    expect(store.tasks[0].title).toBe('Test task')
  })

  it('moves task to in-progress', () => {
    const store = useTaskStore()
    store.addTask({ title: 'Test', description: '', priority: 'low', status: 'todo', tags: [] })
    const id = store.tasks[0].id
    store.moveTask(id, 'in-progress')
    expect(store.tasks[0].status).toBe('in-progress')
  })

  it('filters tasks by status', () => {
    const store = useTaskStore()
    store.searchQuery = ''
    const todoTasks = store.tasksByStatus('todo')
    todoTasks.forEach(t => expect(t.status).toBe('todo'))
  })
})`

const COMPONENT_TEST = `import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TaskCard from '@/components/TaskCard.vue'

describe('TaskCard', () => {
  const task = {
    id: '1', title: 'Test task', description: '',
    priority: 'high', status: 'todo', tags: [],
    createdAt: new Date(),
  }

  it('renders task title', () => {
    const wrapper = mount(TaskCard, { props: { task } })
    expect(wrapper.text()).toContain('Test task')
  })

  it('emits delete event on button click', async () => {
    const wrapper = mount(TaskCard, { props: { task } })
    await wrapper.find('.delete-btn').trigger('click')
    // Calls store.deleteTask — verified via store mock
    expect(wrapper.emitted()).toBeTruthy()
  })
})`

const COVERAGE = [
  { file: 'stores/tasks.ts',        stmts: 94, branch: 88, funcs: 100 },
  { file: 'components/TaskCard.vue', stmts: 87, branch: 75, funcs: 100 },
  { file: 'components/TaskColumn.vue',stmts: 82, branch: 70, funcs:  92 },
  { file: 'utils/formatDate.ts',    stmts: 100, branch: 100, funcs: 100 },
]

function coverageColor(n: number) {
  if (n >= 90) return '#22c55e'
  if (n >= 75) return '#f59e0b'
  return '#ef4444'
}
</script>

<template>
  <div class="app">
    <div class="topbar">
      <a :href="portfolioUrl" class="back-link">← {{ t.topbar.back }}</a>
      <div class="topbar-center">
        <span class="badge vitest">Vitest</span>
        <span class="badge vue-test">@vue/test-utils</span>
        <span class="badge pinia-test">pinia testing</span>
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

      <!-- Runner -->
      <div v-if="activeTab === 'runner'" class="panel">
        <div class="runner-header">
          <button class="run-btn" :class="{ running: isRunning }" :disabled="isRunning" @click="runTests">
            <span v-if="isRunning" class="spinner" />
            {{ isRunning ? t.runner.running : t.runner.runBtn }}
          </button>
          <div v-if="totals.done" class="summary" :class="totals.fail ? 'has-fail' : 'all-pass'">
            {{ t.runner.summary(totals.pass, totals.fail, totals.ms) }}
          </div>
        </div>

        <div class="suite-list">
          <div v-for="suite in suites" :key="suite.file" class="suite">
            <button class="suite-header" @click="suite.expanded = !suite.expanded">
              <span class="suite-arrow">{{ suite.expanded ? '▼' : '▶' }}</span>
              <span class="suite-file">{{ suite.file }}</span>
              <span class="suite-counts">
                <span class="pass-count">{{ suite.tests.filter(t => t.status === 'pass').length }}</span>
                <span v-if="suite.tests.some(test => test.status === 'fail')" class="fail-count">{{ t.runner.failCount(suite.tests.filter(test => test.status === 'fail').length) }}</span>
              </span>
            </button>
            <div v-if="suite.expanded" class="test-list">
              <div v-for="test in suite.tests" :key="test.name" class="test-item">
                <span class="test-icon" :style="{ color: colorMap[test.status] }">{{ iconMap[test.status] }}</span>
                <span class="test-name" :class="{ 'test-fail': test.status === 'fail' }">{{ test.name }}</span>
                <span v-if="test.ms" class="test-ms">{{ test.ms }}ms</span>
              </div>
              <div v-if="suite.tests.some(test => test.error)" class="error-block">
                <pre>{{ suite.tests.find(test => test.error)?.error }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Code -->
      <div v-else-if="activeTab === 'code'" class="panel">
        <div class="split">
          <div>
            <div class="code-label">{{ t.code.storeLabel }}</div>
            <pre class="test-code">{{ STORE_TEST }}</pre>
          </div>
          <div>
            <div class="code-label">{{ t.code.componentLabel }}</div>
            <pre class="test-code">{{ COMPONENT_TEST }}</pre>
          </div>
        </div>
      </div>

      <!-- Coverage -->
      <div v-else-if="activeTab === 'coverage'" class="panel">
        <div class="code-label" style="margin-bottom:16px">{{ t.coverage.reportLabel }}</div>
        <div class="coverage-table">
          <div class="cov-header">
            <span>{{ t.coverage.headers.file }}</span><span>{{ t.coverage.headers.stmts }}</span><span>{{ t.coverage.headers.branch }}</span><span>{{ t.coverage.headers.funcs }}</span>
          </div>
          <div v-for="row in COVERAGE" :key="row.file" class="cov-row">
            <span class="cov-file">{{ row.file }}</span>
            <span class="cov-pct" :style="{ color: coverageColor(row.stmts) }">{{ row.stmts }}%</span>
            <span class="cov-pct" :style="{ color: coverageColor(row.branch) }">{{ row.branch }}%</span>
            <span class="cov-pct" :style="{ color: coverageColor(row.funcs) }">{{ row.funcs }}%</span>
          </div>
          <div class="cov-config">
            <pre class="test-code small">// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      thresholds: { statements: 80, branches: 70 },
    },
  },
})</pre>
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
.topbar-center { display: flex; gap: 6px; flex-wrap: wrap; }
.topbar-right { display: flex; justify-content: flex-end; min-width: 100px; }
.badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.badge.vitest    { background: rgba(252,211,77,.12); border: 1px solid rgba(252,211,77,.3); color: #fcd34d; }
.badge.vue-test  { background: rgba(66,184,131,.1); border: 1px solid rgba(66,184,131,.25); color: #42b883; }
.badge.pinia-test{ background: rgba(255,198,41,.1); border: 1px solid rgba(255,198,41,.2); color: #ffc629; }
.container { max-width: 1000px; margin: 0 auto; padding: 40px 24px 80px; }
.page-header { margin-bottom: 32px; }
.page-title { font-size: 30px; font-weight: 800; letter-spacing: -.03em; margin-bottom: 10px; }
.page-subtitle { font-size: 15px; color: #64748b; line-height: 1.6; max-width: 580px; }
.tabs { display: flex; gap: 6px; margin-bottom: 20px; }
.tab { padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 500; background: transparent; border: 1px solid rgba(255,255,255,.06); color: #64748b; cursor: pointer; font-family: inherit; transition: all .15s; }
.tab:hover { color: #e2e8f0; }
.tab.active { background: rgba(252,211,77,.1); border-color: rgba(252,211,77,.3); color: #fcd34d; }
.panel { background: #0a0a18; border: 1px solid rgba(255,255,255,.05); border-radius: 14px; padding: 28px; display: flex; flex-direction: column; gap: 20px; }
.runner-header { display: flex; align-items: center; gap: 16px; }
.run-btn { padding: 10px 24px; border-radius: 8px; background: rgba(252,211,77,.12); border: 1px solid rgba(252,211,77,.3); color: #fcd34d; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all .15s; display: flex; align-items: center; gap: 8px; }
.run-btn:hover:not(:disabled) { background: rgba(252,211,77,.22); }
.run-btn:disabled { opacity: .5; cursor: not-allowed; }
.spinner { width: 14px; height: 14px; border: 2px solid rgba(252,211,77,.3); border-top-color: #fcd34d; border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.summary { font-size: 13px; font-weight: 600; }
.summary.all-pass { color: #22c55e; }
.summary.has-fail { color: #ef4444; }
.suite-list { display: flex; flex-direction: column; gap: 8px; }
.suite { background: #0d0d1a; border: 1px solid rgba(255,255,255,.06); border-radius: 9px; overflow: hidden; }
.suite-header { width: 100%; display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: none; border: none; color: #e2e8f0; cursor: pointer; text-align: left; font-family: inherit; font-size: 13px; font-weight: 600; }
.suite-header:hover { background: rgba(255,255,255,.02); }
.suite-arrow { color: #475569; font-size: 10px; }
.suite-file { flex: 1; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #94a3b8; }
.suite-counts { display: flex; gap: 8px; }
.pass-count { font-size: 12px; color: #22c55e; }
.fail-count { font-size: 12px; color: #ef4444; }
.test-list { padding: 4px 14px 12px 32px; display: flex; flex-direction: column; gap: 5px; }
.test-item { display: flex; align-items: center; gap: 10px; font-size: 13px; }
.test-icon { width: 14px; font-weight: 700; font-size: 14px; flex-shrink: 0; }
.test-name { flex: 1; color: #94a3b8; }
.test-name.test-fail { color: #f87171; }
.test-ms { font-size: 11px; color: #334155; font-family: 'JetBrains Mono', monospace; }
.error-block { background: rgba(239,68,68,.06); border: 1px solid rgba(239,68,68,.2); border-radius: 6px; padding: 10px 12px; margin-top: 6px; }
.error-block pre { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #f87171; white-space: pre-wrap; }
.split { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.code-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: #475569; margin-bottom: 10px; }
.test-code { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; line-height: 1.65; color: #94a3b8; background: #060610; border: 1px solid rgba(255,255,255,.05); border-radius: 8px; padding: 16px; white-space: pre; overflow-x: auto; }
.test-code.small { font-size: 11px; padding: 12px; }
.coverage-table { display: flex; flex-direction: column; gap: 4px; }
.cov-header { display: grid; grid-template-columns: 1fr 100px 100px 100px; gap: 8px; padding: 6px 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: #475569; }
.cov-row { display: grid; grid-template-columns: 1fr 100px 100px 100px; gap: 8px; background: #0d0d1a; border: 1px solid rgba(255,255,255,.04); border-radius: 7px; padding: 10px 12px; align-items: center; }
.cov-file { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #64748b; }
.cov-pct { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; text-align: right; }
.cov-config { margin-top: 16px; }
@media(max-width:680px) { .split { grid-template-columns: 1fr; } }
</style>
