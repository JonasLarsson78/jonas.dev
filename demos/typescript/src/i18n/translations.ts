export type Locale = 'en' | 'sv'

const en = {
  topbar: { back: 'Portfolio' },
  header: {
    title: 'TypeScript Showcase',
    subtitleHtml: 'Interactive examples of the TypeScript patterns used across this portfolio. Every file is strict mode — no <code>any</code>, no escape hatches.',
  },
  sections: {
    utility:       { label: 'Utility Types',       panelTitle: 'Utility Types',       panelTagline: 'Build new types from existing ones — no copy-paste.' },
    generics:      { label: 'Generics',            panelTitle: 'Generics',            panelTagline: 'One function, any type — compiler verifies everything.' },
    discriminated: { label: 'Discriminated Unions', panelTitle: 'Discriminated Unions', panelTagline: "Model every possible state — the compiler won't let you skip one." },
    typeguards:    { label: 'Type Guards',         panelTitle: 'Type Guards',         panelTagline: 'Safely narrow unknown data to a known type at runtime.' },
  },
  utility: {
    codeTitle: 'Types definition',
    demoTitle: 'Live — CreateTask form',
    titlePlaceholder: 'title: string',
    addBtn: 'Add',
    summaryLabel: "TaskSummary[ ] — Pick<Task, 'id' | 'title'>",
    recordLabel: 'Record<Priority, string>',
    priorities: {
      low:    '● Low',
      medium: '●● Medium',
      high:   '●●● High',
    },
  },
  generics: {
    codeTitle: 'Generic function with constraint',
    demoTitle: 'Live — getById<Task>(tasks, id)',
    pickId: '— pick an id —',
    tInferred: 'T = Task (inferred)',
    emptyHint: 'Select an id above → returns Task | undefined',
  },
  discriminated: {
    codeTitle: 'Exhaustive response type',
    demoTitle: 'Live — ApiResponse<Task[]>',
    simulateLoading: 'Simulate loading',
    simulateError: 'Simulate error',
    fetching: 'Fetching...',
    errorMessage: 'Network timeout after 5000ms',
  },
  typeguards: {
    codeTitle: 'isTask — user-defined type guard',
    demoTitle: 'Live — isTask(unknownBlob)',
    blobLabel: 'unknownBlob (type: <code>unknown</code>)',
    passNote: 'TypeScript narrows to Task — all fields accessible',
    failNote: 'Object is missing required fields — stays unknown',
    addFields: 'Add required fields →',
    removeFields: 'Remove required fields →',
    blobTitleWhenValid: 'Parsed from JSON',
    blobTitleWhenInvalid: 'Parsed from JSON',
  },
  config: {
    title: 'tsconfig.json — strict mode',
  },
  seedTasks: [
    'Implement generics',
    'Add utility types',
    'Discriminated unions',
    'Write type guards',
    'strict: true everywhere',
  ],
}

const sv: typeof en = {
  topbar: { back: 'Portfölj' },
  header: {
    title: 'TypeScript-showcase',
    subtitleHtml: 'Interaktiva exempel på de TypeScript-mönster som används i portföljen. Varje fil är strict mode — inga <code>any</code>, inga escape hatches.',
  },
  sections: {
    utility:       { label: 'Utility Types',        panelTitle: 'Utility Types',        panelTagline: 'Bygg nya typer från befintliga — utan copy-paste.' },
    generics:      { label: 'Generics',             panelTitle: 'Generics',             panelTagline: 'En funktion, valfri typ — kompilatorn verifierar allt.' },
    discriminated: { label: 'Discriminated Unions', panelTitle: 'Discriminated Unions', panelTagline: 'Modellera varje möjligt tillstånd — kompilatorn låter dig inte hoppa över något.' },
    typeguards:    { label: 'Type Guards',          panelTitle: 'Type Guards',          panelTagline: 'Smalna okänd data till en känd typ säkert i runtime.' },
  },
  utility: {
    codeTitle: 'Typdefinitioner',
    demoTitle: 'Live — CreateTask-formulär',
    titlePlaceholder: 'title: string',
    addBtn: 'Lägg till',
    summaryLabel: "TaskSummary[ ] — Pick<Task, 'id' | 'title'>",
    recordLabel: 'Record<Priority, string>',
    priorities: {
      low:    '● Låg',
      medium: '●● Medel',
      high:   '●●● Hög',
    },
  },
  generics: {
    codeTitle: 'Generisk funktion med constraint',
    demoTitle: 'Live — getById<Task>(tasks, id)',
    pickId: '— välj ett id —',
    tInferred: 'T = Task (inferred)',
    emptyHint: 'Välj ett id ovan → returnerar Task | undefined',
  },
  discriminated: {
    codeTitle: 'Uttömmande responstyp',
    demoTitle: 'Live — ApiResponse<Task[]>',
    simulateLoading: 'Simulera loading',
    simulateError: 'Simulera fel',
    fetching: 'Hämtar...',
    errorMessage: 'Nätverkstimeout efter 5000ms',
  },
  typeguards: {
    codeTitle: 'isTask — egendefinierad type guard',
    demoTitle: 'Live — isTask(unknownBlob)',
    blobLabel: 'unknownBlob (typ: <code>unknown</code>)',
    passNote: 'TypeScript smalnar till Task — alla fält är åtkomliga',
    failNote: 'Objektet saknar obligatoriska fält — förblir unknown',
    addFields: 'Lägg till obligatoriska fält →',
    removeFields: 'Ta bort obligatoriska fält →',
    blobTitleWhenValid: 'Parsad från JSON',
    blobTitleWhenInvalid: 'Parsad från JSON',
  },
  config: {
    title: 'tsconfig.json — strict mode',
  },
  seedTasks: [
    'Implementera generics',
    'Lägg till utility types',
    'Discriminated unions',
    'Skriv type guards',
    'strict: true överallt',
  ],
}

export const translations: Record<Locale, typeof en> = { en, sv }
