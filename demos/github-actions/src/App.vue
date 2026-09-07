<script setup lang="ts">
import { ref } from 'vue'

const portfolioUrl = '/'
type Tab = 'workflow' | 'steps' | 'patterns'
const activeTab = ref<Tab>('workflow')

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

const steps = [
  {
    name: 'Trigger',
    icon: '⚡',
    color: '#818cf8',
    items: [
      { label: 'push to main', desc: 'Every commit to main triggers the full pipeline' },
      { label: 'pull_request', desc: 'PRs run tests before merge is allowed' },
    ],
  },
  {
    name: 'Test job',
    icon: '🧪',
    color: '#22c55e',
    items: [
      { label: 'actions/checkout@v4', desc: 'Clone the repository into the runner' },
      { label: 'setup-node@v4 + cache', desc: 'Node 22 with npm cache — faster reinstalls' },
      { label: 'npm ci', desc: 'Clean install from package-lock.json (reproducible)' },
      { label: 'type-check', desc: 'Run vue-tsc / tsc across all workspaces' },
      { label: 'build-demos.sh', desc: 'Build all 9 Vite demos into showcase/public/' },
    ],
  },
  {
    name: 'Deploy job',
    icon: '🚀',
    color: '#f59e0b',
    items: [
      { label: 'needs: test', desc: 'Deploy only runs if test job succeeds' },
      { label: 'if: main branch', desc: 'PRs run tests but never deploy to production' },
      { label: 'vercel-action', desc: 'Triggers a Vercel production deployment via API' },
      { label: 'secrets.*', desc: 'Credentials stored in GitHub Secrets — never in code' },
    ],
  },
]

const patterns = [
  { title: 'Matrix builds', code: `strategy:\n  matrix:\n    node: [20, 22]\n    os: [ubuntu-latest, windows-latest]`, desc: 'Run tests across multiple Node versions and OS combinations in parallel.' },
  { title: 'Caching', code: `- uses: actions/cache@v4\n  with:\n    path: ~/.npm\n    key: \${{ runner.os }}-node-\${{ hashFiles('package-lock.json') }}`, desc: 'Cache dependencies between runs — saves 30-60s on most projects.' },
  { title: 'Environment secrets', code: `env:\n  ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}\n  DATABASE_URL: \${{ secrets.DATABASE_URL }}`, desc: 'Secrets are injected at runtime, never stored in the repo.' },
  { title: 'Conditional steps', code: `- name: Deploy\n  if: github.ref == 'refs/heads/main'\n    && github.event_name == 'push'`, desc: 'Gate destructive steps behind branch and event conditions.' },
]
</script>

<template>
  <div class="app">
    <div class="topbar">
      <a :href="portfolioUrl" class="back-link">← Portfolio</a>
      <div class="topbar-center">
        <span class="badge gh">GitHub Actions</span>
        <span class="badge ci">CI/CD</span>
        <span class="badge yaml">YAML</span>
      </div>
      <div style="width:100px" />
    </div>

    <div class="container">
      <div class="page-header">
        <h1 class="page-title">GitHub Actions</h1>
        <p class="page-subtitle">
          The CI/CD pipeline that builds and deploys this portfolio.
          Every push to main runs type checks, builds all demos, then deploys to Vercel.
        </p>
      </div>

      <div class="tabs">
        <button v-for="[k,l] in [['workflow','Workflow YAML'],['steps','Pipeline steps'],['patterns','Common patterns']]" :key="k"
          class="tab" :class="{ active: activeTab === k }" @click="activeTab = (k as Tab)">{{ l }}</button>
      </div>

      <div v-if="activeTab === 'workflow'" class="panel">
        <div class="code-label">.github/workflows/ci.yml</div>
        <pre class="yaml-code">{{ WORKFLOW }}</pre>
      </div>

      <div v-else-if="activeTab === 'steps'" class="panel">
        <div class="pipeline">
          <div v-for="(job, ji) in steps" :key="ji" class="job-block" :style="{'--c': job.color}">
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
            <div v-if="ji < steps.length - 1" class="arrow-down">↓ on success</div>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'patterns'" class="panel">
        <div class="patterns-grid">
          <div v-for="p in patterns" :key="p.title" class="pattern-card">
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
