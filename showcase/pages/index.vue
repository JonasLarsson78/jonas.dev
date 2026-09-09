<script setup lang="ts">
import { computed, ref } from 'vue'

type Category = 'frontend' | 'backend' | 'ai' | 'devops'
type DemoId = keyof ReturnType<typeof useTranslations>['t']['value']['demos']

interface Tech {
  id: DemoId
  name: string
  icon: string
  category: Category
  tags: string[]
  demoUrl: string | null
  demoStatus: 'live' | 'wip' | 'this-page'
  cardGlow: string
}

const technologies: Tech[] = [
  { id: 'nuxt',           name: 'Nuxt 3',         icon: '🟢',  category: 'frontend', tags: ['SSR', 'Vue 3', 'TypeScript', 'File routing'],           demoUrl: null,                      demoStatus: 'this-page', cardGlow: 'rgba(0, 220, 130, 0.08)' },
  { id: 'vue',            name: 'Vue 3',          icon: '💚',  category: 'frontend', tags: ['Composition API', 'Pinia', 'TypeScript', 'Vite'],       demoUrl: '/demos/vue/',             demoStatus: 'live',      cardGlow: 'rgba(66, 184, 131, 0.08)' },
  { id: 'react',          name: 'React',          icon: '⚛️',  category: 'frontend', tags: ['Hooks', 'Context API', 'TypeScript', 'Vite'],           demoUrl: '/demos/react/',           demoStatus: 'live',      cardGlow: 'rgba(97, 218, 251, 0.06)' },
  { id: 'typescript',     name: 'TypeScript',     icon: '🔷',  category: 'frontend', tags: ['Strict mode', 'Generics', 'Utility types', 'Type guards'], demoUrl: '/demos/typescript/',   demoStatus: 'live',      cardGlow: 'rgba(49, 120, 198, 0.08)' },
  { id: 'node',           name: 'Node.js',        icon: '🟩',  category: 'backend',  tags: ['Express', 'REST API', 'TypeScript', 'Middleware'],      demoUrl: '/api/tasks',              demoStatus: 'live',      cardGlow: 'rgba(51, 153, 51, 0.07)' },
  { id: 'graphql',        name: 'GraphQL',        icon: '🔴',  category: 'backend',  tags: ['graphql-yoga', 'SDL schema', 'Resolvers', 'TypeScript'], demoUrl: '/demos/graphql/',        demoStatus: 'live',      cardGlow: 'rgba(225, 0, 152, 0.07)' },
  { id: 'auth',           name: 'JWT + OAuth2',   icon: '🔐',  category: 'backend',  tags: ['jsonwebtoken', 'OAuth2', 'Express', 'TypeScript'],      demoUrl: '/demos/auth/',            demoStatus: 'live',      cardGlow: 'rgba(234, 179, 8, 0.07)' },
  { id: 'mysql',          name: 'MySQL',          icon: '🗄️', category: 'backend',  tags: ['SQL', 'INNER JOIN', 'GROUP BY', 'better-sqlite3'],      demoUrl: '/demos/mysql/',           demoStatus: 'live',      cardGlow: 'rgba(0, 117, 143, 0.07)' },
  { id: 'docker',         name: 'Docker',         icon: '🐳',  category: 'devops',   tags: ['Dockerfile', 'Compose', 'Multi-stage', 'nginx'],        demoUrl: '/demos/docker/',          demoStatus: 'live',      cardGlow: 'rgba(36, 150, 237, 0.07)' },
  { id: 'ai',             name: 'AI / Claude',    icon: '🤖',  category: 'ai',       tags: ['Claude API', 'SSE streaming', 'Vue 3', 'Secure proxy'], demoUrl: '/demos/ai/',              demoStatus: 'live',      cardGlow: 'rgba(217, 119, 6, 0.07)' },
  { id: 'svelte',         name: 'Svelte',         icon: '🔥',  category: 'frontend', tags: ['Svelte stores', 'Transitions', 'animate:flip', 'Compiled'], demoUrl: '/demos/svelte/',      demoStatus: 'live',      cardGlow: 'rgba(255, 62, 0, 0.07)' },
  { id: 'github-actions', name: 'GitHub Actions', icon: '⚙️',  category: 'devops',   tags: ['CI/CD', 'YAML', 'Secrets', 'Matrix builds'],            demoUrl: '/demos/github-actions/',  demoStatus: 'live',      cardGlow: 'rgba(34, 197, 94, 0.06)' },
  { id: 'mongodb',        name: 'MongoDB',        icon: '🍃',  category: 'backend',  tags: ['Documents', 'Mongoose', 'Aggregation', 'populate()'],   demoUrl: '/demos/mongodb/',         demoStatus: 'live',      cardGlow: 'rgba(0, 163, 75, 0.07)' },
  { id: 'scss',           name: 'SCSS',           icon: '🎨',  category: 'frontend', tags: ['Variables', 'Mixins', 'Nesting', 'Flexbox & Grid'],     demoUrl: '/demos/scss/',            demoStatus: 'live',      cardGlow: 'rgba(204, 102, 153, 0.07)' },
  { id: 'vitest',         name: 'Vitest',         icon: '🧪',  category: 'frontend', tags: ['Unit tests', '@vue/test-utils', 'Pinia testing', 'Coverage'], demoUrl: '/demos/vitest/',      demoStatus: 'live',      cardGlow: 'rgba(252, 211, 77, 0.06)' },
]

const { locale, t } = useTranslations()

useHead(() => ({
  title: t.value.head.title,
  meta: [{ name: 'description', content: t.value.head.description }],
  htmlAttrs: { lang: locale.value },
}))

type FilterCategory = 'all' | Category
const activeFilter = ref<FilterCategory>('all')

const filters = computed<{ key: FilterCategory; label: string }[]>(() => [
  { key: 'all',      label: t.value.filter.all },
  { key: 'frontend', label: t.value.categories.frontend },
  { key: 'backend',  label: t.value.categories.backend },
  { key: 'ai',       label: t.value.categories.ai },
  { key: 'devops',   label: t.value.categories.devops },
])

const filteredTech = computed(() =>
  activeFilter.value === 'all'
    ? technologies
    : technologies.filter(tech => tech.category === activeFilter.value)
)

function handleCardClick(tech: Tech) {
  if (tech.demoUrl) {
    window.location.href = tech.demoUrl
  }
}
</script>

<template>
  <div class="page-wrapper">
    <nav class="nav">
      <div class="nav-logo">jonas<span>.dev</span></div>
      <ul class="nav-links">
        <li><a href="#demos">{{ t.nav.demos }}</a></li>
        <li><a href="#about">{{ t.nav.about }}</a></li>
        <li><a href="https://github.com/JonasLarsson78/jonas.dev" target="_blank">{{ t.nav.github }}</a></li>
        <li>
          <div class="lang-toggle" role="group" aria-label="Language">
            <button
              type="button"
              :class="{ active: locale === 'en' }"
              :aria-pressed="locale === 'en'"
              @click="locale = 'en'"
            >EN</button>
            <button
              type="button"
              :class="{ active: locale === 'sv' }"
              :aria-pressed="locale === 'sv'"
              @click="locale = 'sv'"
            >SV</button>
          </div>
        </li>
      </ul>
    </nav>

    <section class="hero">
      <div class="hero-badge">{{ t.hero.badge }}</div>
      <h1 class="hero-title">
        Jonas<br>
        <span class="accent">Larsson</span>
      </h1>
      <p class="hero-subtitle">{{ t.hero.subtitle }}</p>
      <div class="hero-cta">
        <a href="#demos" class="btn btn-primary">{{ t.hero.viewDemos }}</a>
        <a href="mailto:jl.7804@gmail.com" class="btn btn-ghost">{{ t.hero.contact }}</a>
      </div>
    </section>

    <section id="demos">
      <div class="filter-section">
        <div class="filter-label">{{ t.filter.label }}</div>
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
              <div class="tech-category">{{ t.categories[tech.category] }}</div>
            </div>
            <span v-if="tech.demoStatus === 'live'" class="demo-badge live">{{ t.card.live }}</span>
            <span v-else-if="tech.demoStatus === 'this-page'" class="this-page-badge">{{ t.card.thisPage }}</span>
            <span v-else class="demo-badge wip">{{ t.card.soon }}</span>
          </div>

          <p class="tech-description">{{ t.demos[tech.id] }}</p>

          <div class="tech-tags">
            <span v-for="tag in tech.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <div class="tech-card-footer" :class="tech.demoUrl ? 'has-demo' : 'no-demo'">
            <template v-if="tech.demoUrl">
              {{ t.card.openDemo }} <span class="arrow">→</span>
            </template>
            <template v-else-if="tech.demoStatus === 'this-page'">
              {{ t.card.youreHere }}
            </template>
            <template v-else>
              {{ t.card.comingSoon }}
            </template>
          </div>
        </div>
      </div>
    </section>

    <section id="about" class="about-section">
      <div class="section-title">{{ t.about.title }}</div>
      <div class="about-grid">
        <div class="about-text">
          <p>{{ t.about.p1 }}</p>
          <p>{{ t.about.p2 }}</p>
        </div>
        <div class="about-stats">
          <div class="stat-card">
            <div class="stat-number">5<span>+</span></div>
            <div class="stat-label">{{ t.about.stats.years }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ technologies.length }}</div>
            <div class="stat-label">{{ t.about.stats.demos }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">100<span>%</span></div>
            <div class="stat-label">{{ t.about.stats.typescript }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">∞</div>
            <div class="stat-label">{{ t.about.stats.coffee }}</div>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div>{{ t.footer.built }}</div>
      <div class="footer-links">
        <a href="mailto:jl.7804@gmail.com">{{ t.footer.email }}</a>
        <a href="https://github.com" target="_blank">{{ t.footer.github }}</a>
        <a href="https://linkedin.com" target="_blank">{{ t.footer.linkedin }}</a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.lang-toggle {
  display: inline-flex;
  align-items: center;
  padding: 2px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.lang-toggle button {
  padding: 4px 10px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
  font-family: inherit;
}
.lang-toggle button:hover:not(.active) {
  color: rgba(255, 255, 255, 0.85);
}
.lang-toggle button.active {
  background: rgba(99, 102, 241, 0.18);
  color: #fff;
}
</style>
