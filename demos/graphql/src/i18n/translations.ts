export type Locale = 'en' | 'sv'
export type ActiveTab = 'tasks' | 'user' | 'mutation' | 'schema'

const en = {
  topbar: {
    back: 'Portfolio',
    graphiqlLink: 'Open GraphiQL →',
  },
  header: {
    title: 'GraphQL Demo',
    subtitle: 'Live queries and mutations against a real GraphQL API (graphql-yoga on port 4001). Type-safe schema with nested resolvers, enums, and filtering.',
  },
  tabs: {
    tasks: 'Query: tasks',
    user: 'Query: user(id)',
    mutation: 'Mutation: createTask',
    schema: 'Schema',
  } as Record<ActiveTab, string>,
  labels: {
    query: 'Query',
    variables: 'Variables',
    variable: 'Variable',
    mutation: 'Mutation',
    input: 'Input',
    response: 'Response',
    sdl: 'SDL — Schema Definition Language',
    nestedResolver: 'tasks (nested resolver)',
  },
  buttons: {
    running: 'Running…',
    runQuery: '▶  Run query',
    runMutation: '▶  Run mutation',
  },
  hints: {
    runQueryToExecute: 'Click "Run query" to execute',
    runMutationToCreate: 'Click "Run mutation" to create a task',
    noTasksAssigned: 'No tasks assigned',
    taskCreated: '✅ Task created',
    statusAny: 'status: (any)',
    priorityAny: 'priority: (any)',
    titlePlaceholder: 'title: String!',
    noUserFound: (id: string) => `No user with id "${id}"`,
  },
  users: [
    { id: 'u1', label: 'u1 — Jonas Larsson' },
    { id: 'u2', label: 'u2 — Anna Svensson' },
    { id: 'u3', label: 'u3 — Erik Berg' },
    { id: 'u99', label: 'u99 — (not found)' },
  ],
}

const sv: typeof en = {
  topbar: {
    back: 'Portfölj',
    graphiqlLink: 'Öppna GraphiQL →',
  },
  header: {
    title: 'GraphQL-demo',
    subtitle: 'Live queries och mutations mot ett riktigt GraphQL-API (graphql-yoga på port 4001). Typsäkert schema med nästlade resolvers, enums och filtrering.',
  },
  tabs: {
    tasks: 'Query: tasks',
    user: 'Query: user(id)',
    mutation: 'Mutation: createTask',
    schema: 'Schema',
  },
  labels: {
    query: 'Query',
    variables: 'Variabler',
    variable: 'Variabel',
    mutation: 'Mutation',
    input: 'Input',
    response: 'Svar',
    sdl: 'SDL — Schema Definition Language',
    nestedResolver: 'tasks (nästlad resolver)',
  },
  buttons: {
    running: 'Kör…',
    runQuery: '▶  Kör query',
    runMutation: '▶  Kör mutation',
  },
  hints: {
    runQueryToExecute: 'Klicka "Kör query" för att exekvera',
    runMutationToCreate: 'Klicka "Kör mutation" för att skapa en uppgift',
    noTasksAssigned: 'Inga uppgifter tilldelade',
    taskCreated: '✅ Uppgift skapad',
    statusAny: 'status: (alla)',
    priorityAny: 'priority: (alla)',
    titlePlaceholder: 'title: String!',
    noUserFound: (id: string) => `Ingen användare med id "${id}"`,
  },
  users: [
    { id: 'u1', label: 'u1 — Jonas Larsson' },
    { id: 'u2', label: 'u2 — Anna Svensson' },
    { id: 'u3', label: 'u3 — Erik Berg' },
    { id: 'u99', label: 'u99 — (finns inte)' },
  ],
}

export const translations: Record<Locale, typeof en> = { en, sv }
