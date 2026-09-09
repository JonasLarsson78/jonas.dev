<script setup lang="ts">
import { ref } from 'vue'
import LanguageToggle from '../../_shared/vue/LanguageToggle.vue'
import { useLocale } from './composables/useLocale'
import type { Tab } from './i18n/translations'

const portfolioUrl = '/'
const { t } = useLocale()

const activeTab = ref<Tab>('compose')
const tabIds: Tab[] = ['compose', 'dockerfiles', 'commands']

const COMPOSE = `version: '3.9'

services:
  showcase:
    build: ./showcase
    ports: ['3000:3000']
    environment:
      - NODE_ENV=production
    depends_on: [api]

  api:
    build: ./demos/node-api
    ports: ['3003:3003']
    environment:
      - ANTHROPIC_API_KEY=\${ANTHROPIC_API_KEY}
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3003']
      interval: 30s
      timeout: 5s
      retries: 3

  graphql-api:
    build: ./demos/graphql-api
    ports: ['4001:4001']

  vue-demo:
    build: ./demos/vue
    ports: ['3001:80']

  react-demo:
    build: ./demos/react
    ports: ['3002:80']

  ai-demo:
    build: ./demos/ai
    ports: ['3004:80']

  typescript-demo:
    build: ./demos/typescript
    ports: ['3005:80']

  graphql-demo:
    build: ./demos/graphql
    ports: ['3006:80']

  auth-demo:
    build: ./demos/auth
    ports: ['3007:80']

  mysql-demo:
    build: ./demos/mysql
    ports: ['3008:80']`

const DOCKERFILES: Record<string, { name: string; content: string; color: string }> = {
  nuxt: {
    name: 'showcase/ (Nuxt 3)',
    color: '#00dc82',
    content: `FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]`,
  },
  api: {
    name: 'demos/node-api/ (Express)',
    color: '#5cb85c',
    content: `FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3003
CMD ["node", "dist/index.js"]`,
  },
  vue: {
    name: 'demos/vue/ (Vue 3 + Vite)',
    color: '#42b883',
    content: `FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,
  },
  graphql: {
    name: 'demos/graphql-api/ (graphql-yoga)',
    color: '#e10098',
    content: `FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4001
CMD ["node", "dist/index.js"]`,
  },
}

const activeFile = ref('nuxt')
</script>

<template>
  <div class="app">
    <div class="topbar">
      <a :href="portfolioUrl" class="back-link">← {{ t.topbar.back }}</a>
      <div class="topbar-center">
        <span class="badge docker">Docker</span>
        <span class="badge compose">Compose</span>
        <span class="badge multistage">Multi-stage builds</span>
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

      <!-- Architecture overview -->
      <div class="arch-row">
        <div v-for="svc in t.services" :key="svc.label" class="svc-card" :style="{'--c': svc.color}">
          <div class="svc-name">{{ svc.label }}</div>
          <div class="svc-port">:{{ svc.port }}</div>
          <div class="svc-note">{{ svc.note }}</div>
        </div>
      </div>

      <div class="tabs">
        <button v-for="tab in tabIds" :key="tab"
          class="tab" :class="{ active: activeTab === tab }" @click="activeTab = tab">
          {{ t.tabs[tab] }}
        </button>
      </div>

      <!-- Compose -->
      <div v-if="activeTab === 'compose'" class="panel">
        <div class="code-label">{{ t.compose.codeLabel }}</div>
        <pre class="docker-code">{{ COMPOSE }}</pre>
        <div class="tip-row">
          <div class="tip" v-html="t.compose.tip1Html" />
          <div class="tip" v-html="t.compose.tip2Html" />
          <div class="tip" v-html="t.compose.tip3Html" />
        </div>
      </div>

      <!-- Dockerfiles -->
      <div v-else-if="activeTab === 'dockerfiles'" class="panel">
        <div class="file-tabs">
          <button v-for="(f, key) in DOCKERFILES" :key="key"
            class="file-tab" :class="{ active: activeFile === key }"
            :style="activeFile === key ? {'--c': f.color} : {}"
            @click="activeFile = key">
            {{ f.name }}
          </button>
        </div>
        <div class="code-label" style="margin-top:18px">{{ DOCKERFILES[activeFile].name }}</div>
        <pre class="docker-code">{{ DOCKERFILES[activeFile].content }}</pre>
        <div class="tip-row">
          <div class="tip" v-html="t.dockerfiles.tip1Html" />
          <div v-if="activeFile === 'vue' || activeFile === 'graphql'" class="tip" v-html="t.dockerfiles.tip2Html" />
        </div>
      </div>

      <!-- Commands -->
      <div v-else-if="activeTab === 'commands'" class="panel">
        <div class="cmd-groups">
          <div v-for="group in t.commands" :key="group.group" class="cmd-group">
            <div class="group-label">{{ group.group }}</div>
            <div v-for="item in group.items" :key="item.cmd" class="cmd-item">
              <code class="cmd">{{ item.cmd }}</code>
              <span class="cmd-desc">{{ item.desc }}</span>
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
.topbar-right { display: flex; justify-content: flex-end; min-width: 100px; }
.badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.badge.docker     { background: rgba(36,150,237,.12); border: 1px solid rgba(36,150,237,.3); color: #2496ed; }
.badge.compose    { background: rgba(36,150,237,.08); border: 1px solid rgba(36,150,237,.2); color: #60a5fa; }
.badge.multistage { background: rgba(99,102,241,.1);  border: 1px solid rgba(99,102,241,.25); color: #818cf8; }

.container { max-width: 1060px; margin: 0 auto; padding: 40px 24px 80px; }
.page-header { margin-bottom: 32px; }
.page-title  { font-size: 30px; font-weight: 800; letter-spacing: -.03em; margin-bottom: 10px; }
.page-subtitle { font-size: 15px; color: #64748b; line-height: 1.6; max-width: 580px; }

.arch-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 28px; }
.svc-card { background: #0d0d1a; border: 1px solid rgba(255,255,255,.06); border-top: 2px solid var(--c); border-radius: 8px; padding: 12px 16px; min-width: 140px; }
.svc-name { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; color: var(--c); margin-bottom: 4px; }
.svc-port { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #334155; margin-bottom: 4px; }
.svc-note { font-size: 11px; color: #475569; }

.tabs { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
.tab { padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 500; background: transparent; border: 1px solid rgba(255,255,255,.06); color: #64748b; cursor: pointer; transition: all .15s; font-family: inherit; }
.tab:hover { color: #e2e8f0; }
.tab.active { background: rgba(36,150,237,.1); border-color: rgba(36,150,237,.3); color: #2496ed; }

.panel { background: #0a0a18; border: 1px solid rgba(255,255,255,.05); border-radius: 14px; padding: 28px; display: flex; flex-direction: column; gap: 16px; }
.code-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: #475569; }
.docker-code { font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.65; color: #94a3b8; background: #060610; border: 1px solid rgba(255,255,255,.05); border-radius: 8px; padding: 18px; white-space: pre; overflow-x: auto; }

.tip-row { display: flex; flex-direction: column; gap: 8px; }
.tip { font-size: 13px; color: #475569; line-height: 1.5; }
.tip code { font-family: 'JetBrains Mono', monospace; color: #818cf8; background: rgba(99,102,241,.08); border-radius: 4px; padding: 1px 5px; font-size: 12px; }
.tip strong { color: #64748b; }

.file-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.file-tab { padding: 6px 14px; border-radius: 7px; font-size: 12px; font-weight: 500; background: transparent; border: 1px solid rgba(255,255,255,.06); color: #64748b; cursor: pointer; transition: all .15s; font-family: inherit; }
.file-tab:hover { color: #e2e8f0; }
.file-tab.active { background: color-mix(in srgb, var(--c) 12%, transparent); border-color: color-mix(in srgb, var(--c) 35%, transparent); color: var(--c); }

.cmd-groups { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.cmd-group { display: flex; flex-direction: column; gap: 8px; }
.group-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: #334155; margin-bottom: 4px; }
.cmd-item { background: #060610; border: 1px solid rgba(255,255,255,.04); border-radius: 7px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px; }
.cmd { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #2496ed; }
.cmd-desc { font-size: 12px; color: #475569; }

@media(max-width:680px){.cmd-groups{grid-template-columns:1fr}}
</style>
