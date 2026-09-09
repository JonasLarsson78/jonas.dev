import { computed } from 'vue'

export type Locale = 'en' | 'sv'

const en = {
  head: {
    title: 'Jonas Larsson — Developer Portfolio',
    description: 'Interactive developer portfolio — see the code, not just the CV',
  },
  nav: {
    demos: 'Demos',
    about: 'About',
    github: 'GitHub',
  },
  hero: {
    badge: 'Available for work',
    subtitle:
      'Frontend-focused fullstack developer. Instead of listing skills on a CV, I built interactive demos in each technology — click around and see for yourself.',
    viewDemos: 'View demos ↓',
    contact: 'Contact me',
  },
  filter: {
    label: 'Filter by category',
    all: 'All',
  },
  categories: {
    frontend: 'Frontend',
    backend: 'Backend',
    ai: 'AI',
    devops: 'DevOps',
  },
  card: {
    live: 'Live',
    soon: 'Soon',
    thisPage: 'This page',
    openDemo: 'Open demo',
    youreHere: "You're already here",
    comingSoon: 'Coming soon',
  },
  demos: {
    nuxt: 'This page is built with Nuxt 3. SSR, file-based routing, composables, and API routes — all in one framework.',
    vue: 'A Kanban task board built with Vue 3. Composition API, <script setup>, Pinia state management, and drag & drop.',
    react: 'An analytics dashboard built with React. Custom hooks, Context API, and data visualization — all type-safe.',
    typescript:
      'Interactive showcase of the TypeScript patterns used across this portfolio: generics, utility types, discriminated unions, and type guards.',
    node: 'A REST API built with Node.js and Express. TypeScript, middleware, JWT auth, CORS, SQLite — the backbone of all demos.',
    graphql:
      'A graphql-yoga server with a fully typed schema — queries, mutations, enums, nested resolvers, and filtering. Interactive query builder included.',
    auth: 'Login, receive a JWT, decode its structure, call a protected endpoint, and walk through the OAuth2 authorization code flow step by step.',
    mysql:
      'Real SQL running against SQLite (MySQL-compatible syntax). Schema with foreign keys, indexes, INNER JOIN, GROUP BY, and aggregate functions.',
    docker:
      'Production-ready Dockerfiles for every service in this portfolio, orchestrated with Docker Compose. Multi-stage builds, healthchecks, secret injection.',
    ai: 'A streaming chat assistant backed by the Claude API. Vue 3 frontend, Node.js proxy — the API key never touches the client.',
    svelte:
      'A reactive task board built with Svelte 4. No virtual DOM — compiled to vanilla JS. Stores, transitions, flip animations, and $: reactive labels.',
    'github-actions':
      'The actual CI/CD pipeline that builds and deploys this portfolio — type checks, demo builds, and Vercel deployment on every push to main.',
    mongodb:
      'NoSQL document database. Schema, Mongoose models, find() with populate(), insertOne(), and aggregation pipeline — compared against SQL.',
    scss: 'Variables, nesting, mixins, @each loops, and an interactive Flexbox/Grid playground — all the SCSS patterns used across this portfolio.',
    vitest:
      'Vite-native unit testing. Animated test runner UI showing Pinia store tests, Vue component tests with @vue/test-utils, and coverage reports.',
  },
  about: {
    title: 'About me',
    p1: "I'm a frontend-focused fullstack developer with a strong preference for TypeScript, Vue 3, and React. I care about clean architecture, readable code, and building things that actually work — not just look good in a demo.",
    p2: 'This portfolio is itself a tech demo. Every section is built in the technology it represents, so you can see the code quality first-hand rather than just read claims about it.',
    stats: {
      years: 'Years experience',
      demos: 'Live demos',
      typescript: 'TypeScript',
      coffee: 'Coffee consumed',
    },
  },
  footer: {
    built: 'Built with Nuxt 3 + TypeScript · Jonas Larsson',
    email: 'Email',
    github: 'GitHub',
    linkedin: 'LinkedIn',
  },
}

const sv: typeof en = {
  head: {
    title: 'Jonas Larsson — Utvecklarportfölj',
    description: 'Interaktiv utvecklarportfölj — se koden, inte bara CV:t',
  },
  nav: {
    demos: 'Demos',
    about: 'Om',
    github: 'GitHub',
  },
  hero: {
    badge: 'Öppen för nya uppdrag',
    subtitle:
      'Fullstack-utvecklare med fokus på frontend. I stället för att lista skills på ett CV har jag byggt interaktiva demos i varje teknik — klicka runt och se själv.',
    viewDemos: 'Se demos ↓',
    contact: 'Kontakta mig',
  },
  filter: {
    label: 'Filtrera efter kategori',
    all: 'Alla',
  },
  categories: {
    frontend: 'Frontend',
    backend: 'Backend',
    ai: 'AI',
    devops: 'DevOps',
  },
  card: {
    live: 'Live',
    soon: 'Snart',
    thisPage: 'Denna sida',
    openDemo: 'Öppna demo',
    youreHere: 'Du är redan här',
    comingSoon: 'Kommer snart',
  },
  demos: {
    nuxt: 'Den här sidan är byggd med Nuxt 3. SSR, filbaserad routing, composables och API-routes — allt i ett ramverk.',
    vue: 'En Kanban-tavla byggd med Vue 3. Composition API, <script setup>, Pinia state management och drag & drop.',
    react: 'En analytics-dashboard byggd med React. Custom hooks, Context API och datavisualisering — helt typsäkert.',
    typescript:
      'Interaktiv genomgång av TypeScript-mönstren som används genom hela portföljen: generics, utility types, discriminated unions och type guards.',
    node: 'Ett REST API byggt med Node.js och Express. TypeScript, middleware, JWT-auth, CORS, SQLite — ryggraden i alla demos.',
    graphql:
      'En graphql-yoga-server med ett helt typat schema — queries, mutations, enums, nästlade resolvers och filtrering. Interaktiv query-byggare ingår.',
    auth: 'Logga in, få en JWT, avkoda dess struktur, anropa en skyddad endpoint och gå igenom OAuth2 authorization code-flödet steg för steg.',
    mysql:
      'Riktig SQL som körs mot SQLite (MySQL-kompatibel syntax). Schema med foreign keys, index, INNER JOIN, GROUP BY och aggregatfunktioner.',
    docker:
      'Production-ready Dockerfiles för varje tjänst i portföljen, orkestrerade med Docker Compose. Multi-stage builds, healthchecks, secret injection.',
    ai: 'En streaming chat-assistent driven av Claude API. Vue 3-frontend, Node.js-proxy — API-nyckeln når aldrig klienten.',
    svelte:
      'En reaktiv task-tavla byggd med Svelte 4. Ingen virtuell DOM — kompileras till vanilla JS. Stores, transitions, flip-animationer och $: reaktiva labels.',
    'github-actions':
      'Den faktiska CI/CD-pipelinen som bygger och deployar den här portföljen — type checks, demo-builds och Vercel-deployment vid varje push till main.',
    mongodb:
      'NoSQL-dokumentdatabas. Schema, Mongoose-modeller, find() med populate(), insertOne() och aggregation pipeline — jämfört med SQL.',
    scss: 'Variabler, nesting, mixins, @each-loopar och en interaktiv Flexbox/Grid-playground — alla SCSS-mönster som används i portföljen.',
    vitest:
      'Vite-native unit testing. Animerat test runner-UI som visar Pinia store-tester, Vue-komponenttester med @vue/test-utils och coverage-rapporter.',
  },
  about: {
    title: 'Om mig',
    p1: 'Jag är en fullstack-utvecklare med fokus på frontend och en tydlig preferens för TypeScript, Vue 3 och React. Jag bryr mig om ren arkitektur, läsbar kod och att bygga saker som faktiskt fungerar — inte bara ser bra ut i en demo.',
    p2: 'Den här portföljen är i sig en teknikdemo. Varje del är byggd i den teknik den representerar, så du kan se kodkvaliteten direkt i stället för att bara läsa påståenden om den.',
    stats: {
      years: 'Års erfarenhet',
      demos: 'Live demos',
      typescript: 'TypeScript',
      coffee: 'Konsumerat kaffe',
    },
  },
  footer: {
    built: 'Byggd med Nuxt 3 + TypeScript · Jonas Larsson',
    email: 'Mejl',
    github: 'GitHub',
    linkedin: 'LinkedIn',
  },
}

const translations: Record<Locale, typeof en> = { en, sv }

export const LOCALE_STORAGE_KEY = 'jonas.dev.locale'

export const useTranslations = () => {
  const locale = useCookie<Locale>(LOCALE_STORAGE_KEY, {
    default: () => 'en',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/',
  })
  const t = computed(() => translations[locale.value ?? 'en'])
  return { locale, t }
}
