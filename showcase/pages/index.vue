<script setup lang="ts">
interface Tech {
  id: string
  name: string
  icon: string
  category: 'frontend' | 'backend' | 'ai' | 'devops'
  categoryLabel: string
  description: string
  tags: string[]
  demoUrl: string | null
  demoStatus: 'live' | 'wip' | 'this-page'
  cardGlow: string
}

const technologies: Tech[] = [
  {
    id: 'nuxt',
    name: 'Nuxt 3',
    icon: '🟢',
    category: 'frontend',
    categoryLabel: 'Frontend',
    description: 'This page is built with Nuxt 3. SSR, file-based routing, composables, and API routes — all in one framework.',
    tags: ['SSR', 'Vue 3', 'TypeScript', 'File routing'],
    demoUrl: null,
    demoStatus: 'this-page',
    cardGlow: 'rgba(0, 220, 130, 0.08)',
  },
  {
    id: 'vue',
    name: 'Vue 3',
    icon: '💚',
    category: 'frontend',
    categoryLabel: 'Frontend',
    description: 'A Kanban task board built with Vue 3. Composition API, <script setup>, Pinia state management, and drag & drop.',
    tags: ['Composition API', 'Pinia', 'TypeScript', 'Vite'],
    demoUrl: '/demos/vue/',
    demoStatus: 'live',
    cardGlow: 'rgba(66, 184, 131, 0.08)',
  },
  {
    id: 'react',
    name: 'React',
    icon: '⚛️',
    category: 'frontend',
    categoryLabel: 'Frontend',
    description: 'An analytics dashboard built with React. Custom hooks, Context API, and data visualization — all type-safe.',
    tags: ['Hooks', 'Context API', 'TypeScript', 'Vite'],
    demoUrl: '/demos/react/',
    demoStatus: 'live',
    cardGlow: 'rgba(97, 218, 251, 0.06)',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: '🔷',
    category: 'frontend',
    categoryLabel: 'Frontend',
    description: 'Interactive showcase of the TypeScript patterns used across this portfolio: generics, utility types, discriminated unions, and type guards.',
    tags: ['Strict mode', 'Generics', 'Utility types', 'Type guards'],
    demoUrl: '/demos/typescript/',
    demoStatus: 'live',
    cardGlow: 'rgba(49, 120, 198, 0.08)',
  },
  {
    id: 'node',
    name: 'Node.js',
    icon: '🟩',
    category: 'backend',
    categoryLabel: 'Backend',
    description: 'A REST API built with Node.js and Express. TypeScript, middleware, JWT auth, CORS, SQLite — the backbone of all demos.',
    tags: ['Express', 'REST API', 'TypeScript', 'Middleware'],
    demoUrl: '/api/tasks',
    demoStatus: 'live',
    cardGlow: 'rgba(51, 153, 51, 0.07)',
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    icon: '🔴',
    category: 'backend',
    categoryLabel: 'Backend',
    description: 'A graphql-yoga server with a fully typed schema — queries, mutations, enums, nested resolvers, and filtering. Interactive query builder included.',
    tags: ['graphql-yoga', 'SDL schema', 'Resolvers', 'TypeScript'],
    demoUrl: '/demos/graphql/',
    demoStatus: 'live',
    cardGlow: 'rgba(225, 0, 152, 0.07)',
  },
  {
    id: 'auth',
    name: 'JWT + OAuth2',
    icon: '🔐',
    category: 'backend',
    categoryLabel: 'Backend',
    description: 'Login, receive a JWT, decode its structure, call a protected endpoint, and walk through the OAuth2 authorization code flow step by step.',
    tags: ['jsonwebtoken', 'OAuth2', 'Express', 'TypeScript'],
    demoUrl: '/demos/auth/',
    demoStatus: 'live',
    cardGlow: 'rgba(234, 179, 8, 0.07)',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    icon: '🗄️',
    category: 'backend',
    categoryLabel: 'Backend',
    description: 'Real SQL running against SQLite (MySQL-compatible syntax). Schema with foreign keys, indexes, INNER JOIN, GROUP BY, and aggregate functions.',
    tags: ['SQL', 'INNER JOIN', 'GROUP BY', 'better-sqlite3'],
    demoUrl: '/demos/mysql/',
    demoStatus: 'live',
    cardGlow: 'rgba(0, 117, 143, 0.07)',
  },
  {
    id: 'docker',
    name: 'Docker',
    icon: '🐳',
    category: 'devops',
    categoryLabel: 'DevOps',
    description: 'Production-ready Dockerfiles for every service in this portfolio, orchestrated with Docker Compose. Multi-stage builds, healthchecks, secret injection.',
    tags: ['Dockerfile', 'Compose', 'Multi-stage', 'nginx'],
    demoUrl: '/demos/docker/',
    demoStatus: 'live',
    cardGlow: 'rgba(36, 150, 237, 0.07)',
  },
  {
    id: 'ai',
    name: 'AI / Claude',
    icon: '🤖',
    category: 'ai',
    categoryLabel: 'AI',
    description: 'A streaming chat assistant backed by the Claude API. Vue 3 frontend, Node.js proxy — the API key never touches the client.',
    tags: ['Claude API', 'SSE streaming', 'Vue 3', 'Secure proxy'],
    demoUrl: '/demos/ai/',
    demoStatus: 'live',
    cardGlow: 'rgba(217, 119, 6, 0.07)',
  },
]

type FilterCategory = 'all' | 'frontend' | 'backend' | 'ai' | 'devops'
const activeFilter = ref<FilterCategory>('all')

const filters: { key: FilterCategory; label: string }[] = [
  { key: 'all',      label: 'All' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend',  label: 'Backend' },
  { key: 'ai',       label: 'AI' },
  { key: 'devops',   label: 'DevOps' },
]

const filteredTech = computed(() =>
  activeFilter.value === 'all'
    ? technologies
    : technologies.filter(t => t.category === activeFilter.value)
)

function handleCardClick(tech: Tech) {
  if (tech.demoUrl) {
    window.open(tech.demoUrl, '_blank')
  }
}
</script>

<template>
  <div class="page-wrapper">
    <nav class="nav">
      <div class="nav-logo">jonas<span>.dev</span></div>
      <ul class="nav-links">
        <li><a href="#demos">Demos</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="https://github.com" target="_blank">GitHub</a></li>
      </ul>
    </nav>

    <section class="hero">
      <div class="hero-badge">Available for work</div>
      <h1 class="hero-title">
        Jonas<br>
        <span class="accent">Larsson</span>
      </h1>
      <p class="hero-subtitle">
        Frontend-focused fullstack developer. Instead of listing skills on a CV,
        I built interactive demos in each technology — click around and see for yourself.
      </p>
      <div class="hero-cta">
        <a href="#demos" class="btn btn-primary">View demos ↓</a>
        <a href="mailto:jl.7804@gmail.com" class="btn btn-ghost">Contact me</a>
      </div>
    </section>

    <section id="demos">
      <div class="filter-section">
        <div class="filter-label">Filter by category</div>
        <div class="filter-tabs">
          <button
            v-for="f in filters"
            :key="f.key"
            class="filter-tab"
            :class="{ active: activeFilter === f.key }"
            @click="activeFilter = f.key"
          >
            {{ f.label }}
          </button>
        </div>
      </div>

      <div class="tech-grid">
        <div
          v-for="tech in filteredTech"
          :key="tech.id"
          class="tech-card"
          :style="{ '--card-glow': tech.cardGlow }"
          :class="{ clickable: tech.demoUrl }"
          style="cursor: pointer"
          @click="handleCardClick(tech)"
        >
          <div class="tech-card-header">
            <div class="tech-icon" :style="{ background: tech.cardGlow }">
              {{ tech.icon }}
            </div>
            <div class="tech-card-meta">
              <div class="tech-name">{{ tech.name }}</div>
              <div class="tech-category">{{ tech.categoryLabel }}</div>
            </div>
            <span v-if="tech.demoStatus === 'live'" class="demo-badge live">Live</span>
            <span v-else-if="tech.demoStatus === 'this-page'" class="this-page-badge">This page</span>
            <span v-else class="demo-badge wip">Soon</span>
          </div>

          <p class="tech-description">{{ tech.description }}</p>

          <div class="tech-tags">
            <span v-for="tag in tech.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <div class="tech-card-footer" :class="tech.demoUrl ? 'has-demo' : 'no-demo'">
            <template v-if="tech.demoUrl">
              Open demo <span class="arrow">→</span>
            </template>
            <template v-else-if="tech.demoStatus === 'this-page'">
              You're already here
            </template>
            <template v-else>
              Coming soon
            </template>
          </div>
        </div>
      </div>
    </section>

    <section id="about" class="about-section">
      <div class="section-title">About me</div>
      <div class="about-grid">
        <div class="about-text">
          <p>
            I'm a frontend-focused fullstack developer with a strong preference for
            TypeScript, Vue 3, and React. I care about clean architecture, readable
            code, and building things that actually work — not just look good in a demo.
          </p>
          <p>
            This portfolio is itself a tech demo. Every section is built in the
            technology it represents, so you can see the code quality first-hand
            rather than just read claims about it.
          </p>
        </div>
        <div class="about-stats">
          <div class="stat-card">
            <div class="stat-number">5<span>+</span></div>
            <div class="stat-label">Years experience</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">5</div>
            <div class="stat-label">Live demos</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">100<span>%</span></div>
            <div class="stat-label">TypeScript</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">∞</div>
            <div class="stat-label">Coffee consumed</div>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div>Built with Nuxt 3 + TypeScript · Jonas Larsson</div>
      <div class="footer-links">
        <a href="mailto:jl.7804@gmail.com">Email</a>
        <a href="https://github.com" target="_blank">GitHub</a>
        <a href="https://linkedin.com" target="_blank">LinkedIn</a>
      </div>
    </footer>
  </div>
</template>
