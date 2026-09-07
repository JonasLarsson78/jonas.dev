import { createServer } from 'node:http'
import { createSchema, createYoga } from 'graphql-yoga'

// ── In-memory data ────────────────────────────────────────────────────────────

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  authorId: string
}

const users: User[] = [
  { id: 'u1', name: 'Jonas Larsson', email: 'jl.7804@gmail.com', role: 'admin' },
  { id: 'u2', name: 'Anna Svensson', email: 'anna@example.com', role: 'user' },
  { id: 'u3', name: 'Erik Berg', email: 'erik@example.com', role: 'user' },
]

let tasks: Task[] = [
  { id: 't1', title: 'Design GraphQL schema', description: 'Define types, queries, and mutations', status: 'done', priority: 'high', authorId: 'u1' },
  { id: 't2', title: 'Implement resolvers', description: 'Write resolver functions for all fields', status: 'done', priority: 'high', authorId: 'u1' },
  { id: 't3', title: 'Add authentication', description: 'Protect mutations with JWT middleware', status: 'in_progress', priority: 'medium', authorId: 'u2' },
  { id: 't4', title: 'Write integration tests', description: 'Test all queries and mutations', status: 'todo', priority: 'medium', authorId: 'u3' },
  { id: 't5', title: 'Deploy to production', description: 'Set up CI/CD pipeline', status: 'todo', priority: 'low', authorId: 'u2' },
]

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

// ── Schema ────────────────────────────────────────────────────────────────────

const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    name: String!
    email: String!
    role: Role!
    tasks: [Task!]!
  }

  type Task {
    id: ID!
    title: String!
    description: String!
    status: TaskStatus!
    priority: Priority!
    author: User!
  }

  enum Role { admin user }
  enum TaskStatus { todo in_progress done }
  enum Priority { low medium high }

  type Query {
    users: [User!]!
    user(id: ID!): User
    tasks(status: TaskStatus, priority: Priority): [Task!]!
    task(id: ID!): Task
  }

  input CreateTaskInput {
    title: String!
    description: String
    priority: Priority
    authorId: ID!
  }

  input UpdateTaskInput {
    title: String
    description: String
    status: TaskStatus
    priority: Priority
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task
    deleteTask(id: ID!): Boolean!
  }
`

// ── Resolvers ─────────────────────────────────────────────────────────────────

const resolvers = {
  Query: {
    users: () => users,
    user: (_: unknown, { id }: { id: string }) => users.find(u => u.id === id) ?? null,
    tasks: (_: unknown, args: { status?: string; priority?: string }) => {
      let result = [...tasks]
      if (args.status) result = result.filter(t => t.status === args.status)
      if (args.priority) result = result.filter(t => t.priority === args.priority)
      return result
    },
    task: (_: unknown, { id }: { id: string }) => tasks.find(t => t.id === id) ?? null,
  },

  User: {
    tasks: (user: User) => tasks.filter(t => t.authorId === user.id),
  },

  Task: {
    author: (task: Task) => users.find(u => u.id === task.authorId)!,
  },

  Mutation: {
    createTask: (_: unknown, { input }: { input: { title: string; description?: string; priority?: string; authorId: string } }) => {
      const task: Task = {
        id: generateId(),
        title: input.title,
        description: input.description ?? '',
        status: 'todo',
        priority: (input.priority as Task['priority']) ?? 'medium',
        authorId: input.authorId,
      }
      tasks.push(task)
      return task
    },

    updateTask: (_: unknown, { id, input }: { id: string; input: Partial<Task> }) => {
      const idx = tasks.findIndex(t => t.id === id)
      if (idx === -1) return null
      tasks[idx] = { ...tasks[idx], ...input }
      return tasks[idx]
    },

    deleteTask: (_: unknown, { id }: { id: string }) => {
      const before = tasks.length
      tasks = tasks.filter(t => t.id !== id)
      return tasks.length < before
    },
  },
}

// ── Server ────────────────────────────────────────────────────────────────────

const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3006'],
    methods: ['GET', 'POST', 'OPTIONS'],
  },
  graphiql: {
    title: 'Jonas Larsson — GraphQL API',
  },
  landingPage: false,
})

const server = createServer(yoga)

server.listen(4001, () => {
  console.log('\n  GraphQL API   →  http://localhost:4001/graphql')
  console.log('  GraphiQL IDE  →  http://localhost:4001/graphql\n')
})
