<script setup lang="ts">
import { computed } from 'vue'
import TaskColumn from './components/TaskColumn.vue'
import { useTaskStore } from './stores/tasks'
import type { Column } from './types'

const store        = useTaskStore()
const portfolioUrl = '/'

const columns: Column[] = [
  { id: 'todo', label: 'To Do', color: '#64748b', accent: 'rgba(100, 116, 139, 0.15)' },
  { id: 'in-progress', label: 'In Progress', color: '#f59e0b', accent: 'rgba(245, 158, 11, 0.12)' },
  { id: 'done', label: 'Done', color: '#22c55e', accent: 'rgba(34, 197, 94, 0.12)' },
]

const progress = computed(() => {
  const total = store.tasks.length
  const done = store.totalByStatus.done
  return total > 0 ? Math.round((done / total) * 100) : 0
})
</script>

<template>
  <div class="app">
    <!-- Top bar -->
    <div class="topbar">
      <a :href="portfolioUrl" class="back-link">← Portfolio</a>
      <div class="topbar-center">
        <span class="tech-badge vue">Vue 3</span>
        <span class="tech-badge ts">TypeScript</span>
        <span class="tech-badge pinia">Pinia</span>
      </div>
      <div class="topbar-right" />
    </div>

    <div class="container">
      <!-- Header -->
      <div class="board-header">
        <div>
          <h1 class="board-title">Task Board</h1>
          <p class="board-subtitle">
            Built with Vue 3 Composition API, Pinia, and TypeScript
          </p>
        </div>
        <div class="board-stats">
          <div class="progress-bar-wrap">
            <div class="progress-label">
              <span>Progress</span>
              <span class="progress-value">{{ progress }}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: progress + '%' }" />
            </div>
          </div>
          <div class="stat-pills">
            <span class="stat-pill todo">{{ store.totalByStatus.todo }} todo</span>
            <span class="stat-pill wip">{{ store.totalByStatus['in-progress'] }} active</span>
            <span class="stat-pill done">{{ store.totalByStatus.done }} done</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <input
          v-model="store.searchQuery"
          class="search-input"
          placeholder="Search tasks..."
        />
        <select v-model="store.filterPriority" class="filter-select">
          <option value="all">All priorities</option>
          <option value="high">High priority</option>
          <option value="medium">Medium priority</option>
          <option value="low">Low priority</option>
        </select>
      </div>

      <!-- Board -->
      <div class="board">
        <TaskColumn
          v-for="col in columns"
          :key="col.id"
          :id="col.id"
          :label="col.label"
          :color="col.color"
          :tasks="store.tasksByStatus(col.id)"
        />
      </div>

      <!-- Code callout -->
      <div class="code-callout">
        <div class="code-callout-title">What this demo shows</div>
        <div class="code-callout-items">
          <div class="code-item">
            <span class="code-item-icon">🧩</span>
            <span><strong>Composition API</strong> — <code>&lt;script setup&gt;</code>, <code>ref</code>, <code>computed</code></span>
          </div>
          <div class="code-item">
            <span class="code-item-icon">🗃️</span>
            <span><strong>Pinia</strong> — defineStore with composable-style setup</span>
          </div>
          <div class="code-item">
            <span class="code-item-icon">🔷</span>
            <span><strong>TypeScript</strong> — typed props, store, computed values</span>
          </div>
          <div class="code-item">
            <span class="code-item-icon">✨</span>
            <span><strong>Transitions</strong> — TransitionGroup for smooth card animations</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: #060610; color: #e2e8f0; font-family: 'Inter', sans-serif; min-height: 100vh; }
</style>

<style scoped>
.app { min-height: 100vh; display: flex; flex-direction: column; }

.topbar {
  background: rgba(6, 6, 16, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-link {
  font-size: 13px;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s;
}
.back-link:hover { color: #e2e8f0; }

.topbar-center {
  display: flex;
  gap: 8px;
}

.topbar-right { width: 80px; }

.tech-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}
.tech-badge.vue {
  background: rgba(66, 184, 131, 0.12);
  border: 1px solid rgba(66, 184, 131, 0.25);
  color: #42b883;
}
.tech-badge.ts {
  background: rgba(49, 120, 198, 0.12);
  border: 1px solid rgba(49, 120, 198, 0.25);
  color: #3b82f6;
}
.tech-badge.pinia {
  background: rgba(255, 198, 41, 0.1);
  border: 1px solid rgba(255, 198, 41, 0.2);
  color: #ffc629;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 60px;
  width: 100%;
  flex: 1;
}

.board-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.board-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #fff;
  margin-bottom: 6px;
}

.board-subtitle {
  font-size: 14px;
  color: #64748b;
}

.board-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 200px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 6px;
}

.progress-value { color: #22c55e; font-weight: 600; }

.progress-track {
  height: 4px;
  background: rgba(255,255,255,0.06);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.stat-pills { display: flex; gap: 6px; flex-wrap: wrap; }

.stat-pill {
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
}
.stat-pill.todo { background: rgba(100,116,139,0.12); color: #94a3b8; }
.stat-pill.wip { background: rgba(245,158,11,0.1); color: #f59e0b; }
.stat-pill.done { background: rgba(34,197,94,0.1); color: #22c55e; }

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-input, .filter-select {
  background: #0d0d1a;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #e2e8f0;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
}

.search-input { flex: 1; min-width: 200px; }
.search-input:focus, .filter-select:focus { border-color: rgba(99,102,241,0.4); }
.filter-select { cursor: pointer; }
.filter-select option { background: #0d0d1a; }

.board {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  overflow-x: auto;
  padding-bottom: 8px;
}

.code-callout {
  margin-top: 40px;
  background: #0a0a18;
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 12px;
  padding: 24px;
}

.code-callout-title {
  font-size: 13px;
  font-weight: 600;
  color: #818cf8;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.code-callout-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.code-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
}

.code-item strong { color: #94a3b8; }
.code-item code {
  background: rgba(99, 102, 241, 0.1);
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 12px;
  color: #818cf8;
  font-family: monospace;
}

.code-item-icon { font-size: 16px; flex-shrink: 0; }
</style>
