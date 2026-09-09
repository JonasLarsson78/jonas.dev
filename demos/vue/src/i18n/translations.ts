export type Locale = 'en' | 'sv'

export type SeedTaskKey =
  | 'seed-pinia'
  | 'seed-kanban'
  | 'seed-types'
  | 'seed-api'
  | 'seed-tests'
  | 'seed-deploy'

interface SeedTask { title: string; description: string }
interface CalloutItem { icon: string; html: string }

const en = {
  topbar: {
    back: 'Portfolio',
  },
  header: {
    title: 'Task Board',
    subtitle: 'Built with Vue 3 Composition API, Pinia, and TypeScript',
  },
  stats: {
    progress: 'Progress',
    todo: 'todo',
    active: 'active',
    done: 'done',
  },
  filters: {
    searchPlaceholder: 'Search tasks...',
    allPriorities: 'All priorities',
    highPriority: 'High priority',
    mediumPriority: 'Medium priority',
    lowPriority: 'Low priority',
  },
  columns: {
    todo: 'To Do',
    'in-progress': 'In Progress',
    done: 'Done',
  },
  priorities: {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  },
  taskCard: {
    priorityTooltip: (label: string) => `${label} priority`,
    deleteTooltip: 'Delete task',
  },
  addTask: {
    tooltip: 'Add task',
    titlePlaceholder: 'Task title...',
    descPlaceholder: 'Description (optional)...',
    cancel: 'Cancel',
    add: 'Add',
  },
  emptyState: 'No tasks here',
  callout: {
    title: 'What this demo shows',
    items: [
      { icon: '🧩', html: '<strong>Composition API</strong> — <code>&lt;script setup&gt;</code>, <code>ref</code>, <code>computed</code>' },
      { icon: '🗃️', html: '<strong>Pinia</strong> — defineStore with composable-style setup' },
      { icon: '🔷', html: '<strong>TypeScript</strong> — typed props, store, computed values' },
      { icon: '✨', html: '<strong>Transitions</strong> — TransitionGroup for smooth card animations' },
    ] as CalloutItem[],
  },
  seedTasks: {
    'seed-pinia':  { title: 'Set up Pinia store',      description: 'Configure Pinia for state management with TypeScript support' },
    'seed-kanban': { title: 'Build Kanban board',      description: 'Create drag-and-drop task board with column filtering' },
    'seed-types':  { title: 'Add TypeScript types',    description: 'Define interfaces for Task, Column, and store state' },
    'seed-api':    { title: 'Integrate Node.js API',   description: 'Connect to the Express REST API running on port 3003' },
    'seed-tests':  { title: 'Write unit tests',        description: 'Add Vitest tests for the Pinia store and components' },
    'seed-deploy': { title: 'Deploy to Vercel',        description: 'Set up CI/CD pipeline and deploy Vue demo to Vercel' },
  } as Record<SeedTaskKey, SeedTask>,
}

const sv: typeof en = {
  topbar: {
    back: 'Portfölj',
  },
  header: {
    title: 'Uppgiftstavla',
    subtitle: 'Byggd med Vue 3 Composition API, Pinia och TypeScript',
  },
  stats: {
    progress: 'Framsteg',
    todo: 'att göra',
    active: 'aktiva',
    done: 'klara',
  },
  filters: {
    searchPlaceholder: 'Sök uppgifter...',
    allPriorities: 'Alla prioriteter',
    highPriority: 'Hög prioritet',
    mediumPriority: 'Medel prioritet',
    lowPriority: 'Låg prioritet',
  },
  columns: {
    todo: 'Att göra',
    'in-progress': 'Pågår',
    done: 'Klart',
  },
  priorities: {
    low: 'Låg',
    medium: 'Medel',
    high: 'Hög',
  },
  taskCard: {
    priorityTooltip: (label: string) => `${label} prioritet`,
    deleteTooltip: 'Radera uppgift',
  },
  addTask: {
    tooltip: 'Lägg till uppgift',
    titlePlaceholder: 'Titel...',
    descPlaceholder: 'Beskrivning (valfri)...',
    cancel: 'Avbryt',
    add: 'Lägg till',
  },
  emptyState: 'Inga uppgifter här',
  callout: {
    title: 'Vad demot visar',
    items: [
      { icon: '🧩', html: '<strong>Composition API</strong> — <code>&lt;script setup&gt;</code>, <code>ref</code>, <code>computed</code>' },
      { icon: '🗃️', html: '<strong>Pinia</strong> — defineStore i composable-stil' },
      { icon: '🔷', html: '<strong>TypeScript</strong> — typade props, store och computed values' },
      { icon: '✨', html: '<strong>Transitions</strong> — TransitionGroup för mjuka kortanimationer' },
    ] as CalloutItem[],
  },
  seedTasks: {
    'seed-pinia':  { title: 'Sätt upp Pinia store',      description: 'Konfigurera Pinia för state management med TypeScript-stöd' },
    'seed-kanban': { title: 'Bygg Kanban-tavla',         description: 'Skapa drag-and-drop-tavla med kolumnfiltrering' },
    'seed-types':  { title: 'Lägg till TypeScript-typer', description: 'Definiera interfaces för Task, Column och store state' },
    'seed-api':    { title: 'Integrera Node.js API',      description: 'Koppla till Express REST API på port 3003' },
    'seed-tests':  { title: 'Skriv enhetstester',         description: 'Lägg till Vitest-tester för Pinia store och komponenter' },
    'seed-deploy': { title: 'Deploya till Vercel',        description: 'Sätt upp CI/CD-pipeline och deploya Vue-demot till Vercel' },
  },
}

export const translations: Record<Locale, typeof en> = { en, sv }
