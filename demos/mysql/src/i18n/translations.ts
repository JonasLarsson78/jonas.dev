export type Locale = 'en' | 'sv'
export type Tab = 'schema' | 'tasks' | 'insert' | 'stats'

const en = {
  topbar: { back: 'Portfolio' },
  header: {
    title: 'MySQL Demo',
    subtitle: 'Real SQL running in-memory via SQLite — same syntax as MySQL. Schema with foreign keys, indexes, JOINs, GROUP BY, and aggregates.',
  },
  tabs: {
    schema: 'Schema',
    tasks: 'SELECT + JOIN',
    insert: 'INSERT',
    stats: 'GROUP BY / aggregate',
  } as Record<Tab, string>,
  labels: {
    ddl: 'DDL (MySQL syntax)',
    tables: 'Tables',
    sqlGenerated: 'SQL (generated from filters)',
    sql: 'SQL',
    values: 'Values',
    sqlGroupBy: 'SQL — GROUP BY + aggregate functions',
    result: 'Result',
    rows: (n: number) => `(${n} rows)`,
  },
  buttons: {
    running: 'Running…',
    execQuery: '▶  Execute query',
    execInsert: '▶  Execute INSERT',
  },
  hints: {
    clickExecute: 'Click "Execute query"',
    clickInsert: 'Click "Execute INSERT"',
    rowInserted: '✅ Row inserted',
    statusAll: 'status: all',
    priorityAll: 'priority: all',
    titlePlaceholder: 'title',
  },
  users: [
    { id: '1', label: 'user_id: 1 (Jonas)' },
    { id: '2', label: 'user_id: 2 (Anna)' },
    { id: '3', label: 'user_id: 3 (Erik)' },
  ],
  statsHeader: {
    name: 'Name',
    total: 'Total',
    done: 'Done',
    active: 'Active',
    todo: 'Todo',
  },
}

const sv: typeof en = {
  topbar: { back: 'Portfölj' },
  header: {
    title: 'MySQL-demo',
    subtitle: 'Riktig SQL som körs in-memory via SQLite — samma syntax som MySQL. Schema med foreign keys, index, JOINs, GROUP BY och aggregat.',
  },
  tabs: {
    schema: 'Schema',
    tasks: 'SELECT + JOIN',
    insert: 'INSERT',
    stats: 'GROUP BY / aggregat',
  },
  labels: {
    ddl: 'DDL (MySQL-syntax)',
    tables: 'Tabeller',
    sqlGenerated: 'SQL (genererad från filter)',
    sql: 'SQL',
    values: 'Värden',
    sqlGroupBy: 'SQL — GROUP BY + aggregatfunktioner',
    result: 'Resultat',
    rows: (n: number) => `(${n} rader)`,
  },
  buttons: {
    running: 'Kör…',
    execQuery: '▶  Kör query',
    execInsert: '▶  Kör INSERT',
  },
  hints: {
    clickExecute: 'Klicka "Kör query"',
    clickInsert: 'Klicka "Kör INSERT"',
    rowInserted: '✅ Rad tillagd',
    statusAll: 'status: alla',
    priorityAll: 'priority: alla',
    titlePlaceholder: 'titel',
  },
  users: [
    { id: '1', label: 'user_id: 1 (Jonas)' },
    { id: '2', label: 'user_id: 2 (Anna)' },
    { id: '3', label: 'user_id: 3 (Erik)' },
  ],
  statsHeader: {
    name: 'Namn',
    total: 'Totalt',
    done: 'Klara',
    active: 'Aktiva',
    todo: 'Att göra',
  },
}

export const translations: Record<Locale, typeof en> = { en, sv }
