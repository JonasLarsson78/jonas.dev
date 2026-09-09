export type Locale = 'en' | 'sv'
export type Tab = 'schema' | 'queries' | 'aggregation'

const en = {
  topbar: { back: 'Portfolio' },
  header: {
    title: 'MongoDB Demo',
    subtitle: 'NoSQL document database. No rigid schema — documents in a collection can have different shapes. Powerful aggregation pipeline replaces SQL GROUP BY.',
  },
  tabs: {
    schema: 'Schema & Model',
    queries: 'find() & insertOne()',
    aggregation: 'Aggregation Pipeline',
  } as Record<Tab, string>,
  labels: {
    document: 'MongoDB document (tasks collection)',
    schema: 'Mongoose schema (TypeScript)',
    query: 'MongoDB query',
    insertOne: 'insertOne()',
    result: 'Result',
    aggPipeline: 'Aggregation Pipeline',
  },
  buttons: {
    runFind: '▶ Run find()',
    runInsert: '▶ insertOne()',
    runAgg: '▶ Run aggregate()',
  },
  hints: {
    statusAny: 'status: (any)',
    titlePlaceholder: 'title',
    docInserted: '✅ Document inserted',
    clickFind: 'Click "Run find()" to execute',
    clickAgg: 'Click "Run aggregate()"',
  },
  vs: {
    title: 'MongoDB vs MySQL',
    rows: [
      ['Collection', 'Table'],
      ['Document', 'Row'],
      ['Field', 'Column'],
      ['$lookup', 'JOIN'],
      ['_id (ObjectId)', 'id (INT PK)'],
    ] as [string, string][],
  },
}

const sv: typeof en = {
  topbar: { back: 'Portfölj' },
  header: {
    title: 'MongoDB-demo',
    subtitle: 'NoSQL-dokumentdatabas. Inget rigid schema — dokument i en collection kan ha olika strukturer. Kraftfull aggregation pipeline ersätter SQL GROUP BY.',
  },
  tabs: {
    schema: 'Schema & modell',
    queries: 'find() & insertOne()',
    aggregation: 'Aggregation Pipeline',
  },
  labels: {
    document: 'MongoDB-dokument (tasks-collection)',
    schema: 'Mongoose-schema (TypeScript)',
    query: 'MongoDB-query',
    insertOne: 'insertOne()',
    result: 'Resultat',
    aggPipeline: 'Aggregation Pipeline',
  },
  buttons: {
    runFind: '▶ Kör find()',
    runInsert: '▶ insertOne()',
    runAgg: '▶ Kör aggregate()',
  },
  hints: {
    statusAny: 'status: (alla)',
    titlePlaceholder: 'titel',
    docInserted: '✅ Dokument tillagt',
    clickFind: 'Klicka "Kör find()" för att exekvera',
    clickAgg: 'Klicka "Kör aggregate()"',
  },
  vs: {
    title: 'MongoDB vs MySQL',
    rows: [
      ['Collection', 'Tabell'],
      ['Dokument', 'Rad'],
      ['Fält', 'Kolumn'],
      ['$lookup', 'JOIN'],
      ['_id (ObjectId)', 'id (INT PK)'],
    ],
  },
}

export const translations: Record<Locale, typeof en> = { en, sv }
