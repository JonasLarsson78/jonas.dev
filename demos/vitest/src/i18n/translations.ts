export type Locale = 'en' | 'sv'
export type Tab = 'runner' | 'code' | 'coverage'

const en = {
  topbar: { back: 'Portfolio' },
  header: {
    title: 'Vitest',
    subtitle: 'Vitest is Vite-native unit testing — same config, same transforms, 10× faster than Jest. These tests target the Pinia store and Vue components from the Kanban demo.',
  },
  tabs: {
    runner: 'Test Runner',
    code: 'Test Code',
    coverage: 'Coverage',
  } as Record<Tab, string>,
  runner: {
    running: 'Running…',
    runBtn: '▶  Run tests',
    summary: (pass: number, fail: number, ms: number) => `${pass} passed · ${fail} failed · ${ms}ms`,
    failCount: (n: number) => `${n} fail`,
  },
  code: {
    storeLabel: 'stores/tasks.test.ts — Pinia store tests',
    componentLabel: 'components/TaskCard.test.ts — Vue component tests',
  },
  coverage: {
    reportLabel: 'Coverage report — v8 provider',
    headers: { file: 'File', stmts: 'Statements', branch: 'Branches', funcs: 'Functions' },
  },
  suites: {
    tasksFile: 'stores/tasks.test.ts',
    tasks: [
      'adds a task to the store',
      'moves task to in-progress',
      'deletes a task by id',
      'filters tasks by status',
      'computed: tasksByStatus returns correct tasks',
    ],
    cardFile: 'components/TaskCard.test.ts',
    cards: [
      'renders task title',
      'shows priority dot with correct color',
      'emits delete event on button click',
      'applies done class when task.done is true',
    ],
    dateFile: 'utils/formatDate.test.ts',
    dates: [
      'formats ISO date to readable string',
      'returns "Today" for current date',
      'handles invalid date gracefully',
    ],
  },
}

const sv: typeof en = {
  topbar: { back: 'Portfölj' },
  header: {
    title: 'Vitest',
    subtitle: 'Vitest är Vite-native unit testing — samma config, samma transforms, 10× snabbare än Jest. Testerna riktar sig mot Pinia-storen och Vue-komponenterna från Kanban-demot.',
  },
  tabs: {
    runner: 'Test Runner',
    code: 'Test-kod',
    coverage: 'Coverage',
  },
  runner: {
    running: 'Kör…',
    runBtn: '▶  Kör tester',
    summary: (pass: number, fail: number, ms: number) => `${pass} lyckades · ${fail} misslyckades · ${ms}ms`,
    failCount: (n: number) => `${n} misslyckade`,
  },
  code: {
    storeLabel: 'stores/tasks.test.ts — Pinia store-tester',
    componentLabel: 'components/TaskCard.test.ts — Vue-komponenttester',
  },
  coverage: {
    reportLabel: 'Coverage-rapport — v8-provider',
    headers: { file: 'Fil', stmts: 'Statements', branch: 'Branches', funcs: 'Funktioner' },
  },
  suites: {
    tasksFile: 'stores/tasks.test.ts',
    tasks: [
      'lägger till en uppgift i storen',
      'flyttar uppgift till in-progress',
      'raderar en uppgift efter id',
      'filtrerar uppgifter efter status',
      'computed: tasksByStatus returnerar rätt uppgifter',
    ],
    cardFile: 'components/TaskCard.test.ts',
    cards: [
      'renderar uppgiftstitel',
      'visar prioritets-prick med rätt färg',
      'emitterar delete-event vid knappklick',
      'lägger på done-klass när task.done är true',
    ],
    dateFile: 'utils/formatDate.test.ts',
    dates: [
      'formaterar ISO-datum till läsbar sträng',
      'returnerar "Idag" för nuvarande datum',
      'hanterar ogiltigt datum snyggt',
    ],
  },
}

export const translations: Record<Locale, typeof en> = { en, sv }
