<script setup lang="ts">
import { ref } from 'vue'
import LanguageToggle from '../../_shared/vue/LanguageToggle.vue'
import { useLocale } from './composables/useLocale'
import type { Tab } from './i18n/translations'

const portfolioUrl = '/'
const { t } = useLocale()
const activeTab = ref<Tab>('workflow')
const tabIds: Tab[] = ['workflow', 'steps', 'patterns']

const WORKFLOW = `name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check --workspaces --if-present

      - name: Build all demos
        run: bash showcase/build-demos.sh

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'`

</script>

<template>
  <div class="app">
    <div class="topbar">
      <a :href="portfolioUrl" class="back-link">← {{ t.topbar.back }}</a>
      <div class="topbar-center">
        <span class="badge gh">GitHub Actions</span>
        <span class="badge ci">CI/CD</span>
        <span class="badge yaml">YAML</span>
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

      <div v-if="activeTab === 'workflow'" class="panel">
        <div class="code-label">{{ t.workflow.codeLabel }}</div>
        <pre class="yaml-code">{{ WORKFLOW }}</pre>
      </div>

      <div v-else-if="activeTab === 'steps'" class="panel">
        <div class="pipeline">
          <div v-for="(job, ji) in t.jobs" :key="ji" class="job-block" :style="{'--c': job.color}">
            <div class="job-header">
              <span class="job-icon">{{ job.icon }}</span>
              <span class="job-name">{{ job.name }}</span>
            </div>
            <div class="step-list">
              <div v-for="(step, si) in job.items" :key="si" class="step-item">
                <code class="step-name">{{ step.label }}</code>
                <span class="step-desc">{{ step.desc }}</span>
              </div>
            </div>
            <div v-if="ji < t.jobs.length - 1" class="arrow-down">{{ t.arrows.onSuccess }}</div>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'patterns'" class="panel">
        <div class="patterns-grid">
          <div v-for="p in t.patterns" :key="p.title" class="pattern-card">
            <div class="pattern-title">{{ p.title }}</div>
            <pre class="yaml-code small">{{ p.code }}</pre>
            <div class="pattern-desc">{{ p.desc }}</div>
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
.badge.gh   { background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15); color: #e2e8f0; }
.badge.ci   { background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.25); color: #22c55e; }
.badge.yaml { background: rgba(245,158,11,.1); border: 1px solid rgba(245,158,11,.2); color: #f59e0b; }
.container { max-width: 900px; margin: 0 auto; padding: 40px 24px 80px; }
.page-header { margin-bottom: 32px; }
.page-title { font-size: 30px; font-weight: 800; letter-spacing: -.03em; margin-bottom: 10px; }
.page-subtitle { font-size: 15px; color: #64748b; line-height: 1.6; max-width: 560px; }
.tabs { display: flex; gap: 6px; margin-bottom: 20px; }
.tab { padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 500; background: transparent; border: 1px solid rgba(255,255,255,.06); color: #64748b; cursor: pointer; font-family: inherit; transition: all .15s; }
.tab:hover { color: #e2e8f0; }
.tab.active { background: rgba(34,197,94,.1); border-color: rgba(34,197,94,.3); color: #22c55e; }
.panel { background: #0a0a18; border: 1px solid rgba(255,255,255,.05); border-radius: 14px; padding: 28px; }
.code-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: #475569; margin-bottom: 12px; }
.yaml-code { font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.7; color: #94a3b8; background: #060610; border: 1px solid rgba(255,255,255,.05); border-radius: 8px; padding: 20px; white-space: pre; overflow-x: auto; }
.yaml-code.small { font-size: 11px; padding: 12px; margin: 10px 0; }
.pipeline { display: flex; flex-direction: column; gap: 4px; }
.job-block { background: color-mix(in srgb, var(--c) 5%, #0d0d1a); border: 1px solid color-mix(in srgb, var(--c) 25%, transparent); border-radius: 10px; padding: 18px; }
.job-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.job-icon { font-size: 18px; }
.job-name { font-size: 15px; font-weight: 700; color: var(--c); }
.step-list { display: flex; flex-direction: column; gap: 8px; }
.step-item { display: flex; align-items: baseline; gap: 10px; }
.step-name { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--c); background: color-mix(in srgb, var(--c) 10%, transparent); border-radius: 4px; padding: 2px 7px; white-space: nowrap; flex-shrink: 0; }
.step-desc { font-size: 13px; color: #64748b; }
.arrow-down { text-align: center; font-size: 13px; color: #334155; padding: 8px 0; }
.patterns-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.pattern-card { background: #0d0d1a; border: 1px solid rgba(255,255,255,.06); border-radius: 10px; padding: 18px; }
.pattern-title { font-size: 14px; font-weight: 700; color: #22c55e; margin-bottom: 10px; }
.pattern-desc { font-size: 12px; color: #64748b; line-height: 1.5; }
@media(max-width:640px) { .patterns-grid { grid-template-columns: 1fr; } }
</style>
