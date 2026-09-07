import { createSchema } from 'graphql-yoga'
import { execute, parse, validate } from 'graphql'

interface GqlUser { id: string; name: string; email: string; role: string }
interface GqlTask { id: string; title: string; description: string; status: string; priority: string; authorId: string }

const users: GqlUser[] = [
  { id: 'u1', name: 'Jonas Larsson', email: 'jonas@demo.com', role: 'admin' },
  { id: 'u2', name: 'Anna Svensson',  email: 'anna@demo.com',  role: 'user' },
  { id: 'u3', name: 'Erik Berg',      email: 'erik@demo.com',  role: 'user' },
]

const tasks: GqlTask[] = [
  { id: 't1', title: 'Design GraphQL schema',   description: 'Define types, queries, mutations', status: 'done',        priority: 'high',   authorId: 'u1' },
  { id: 't2', title: 'Implement resolvers',      description: 'Write resolver functions',         status: 'done',        priority: 'high',   authorId: 'u1' },
  { id: 't3', title: 'Add authentication',       description: 'Protect mutations with JWT',       status: 'in_progress', priority: 'medium', authorId: 'u2' },
  { id: 't4', title: 'Write integration tests',  description: 'Test all queries and mutations',   status: 'todo',        priority: 'medium', authorId: 'u3' },
  { id: 't5', title: 'Deploy to production',     description: 'Set up CI/CD pipeline',            status: 'todo',        priority: 'low',    authorId: 'u2' },
]

const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type User { id: ID!; name: String!; email: String!; role: Role!; tasks: [Task!]! }
    type Task { id: ID!; title: String!; description: String!; status: TaskStatus!; priority: Priority!; author: User! }
    enum Role       { admin user }
    enum TaskStatus { todo in_progress done }
    enum Priority   { low medium high }
    type Query {
      users: [User!]!
      user(id: ID!): User
      tasks(status: TaskStatus, priority: Priority): [Task!]!
      task(id: ID!): Task
    }
    input CreateTaskInput { title: String!; description: String; priority: Priority; authorId: ID! }
    type Mutation { createTask(input: CreateTaskInput!): Task! }
  `,
  resolvers: {
    Query: {
      users: () => users,
      user: (_: unknown, { id }: { id: string }) => users.find(u => u.id === id) ?? null,
      tasks: (_: unknown, args: { status?: string; priority?: string }) => {
        let r = [...tasks]
        if (args.status)   r = r.filter(t => t.status   === args.status)
        if (args.priority) r = r.filter(t => t.priority === args.priority)
        return r
      },
      task: (_: unknown, { id }: { id: string }) => tasks.find(t => t.id === id) ?? null,
    },
    User: { tasks: (u: GqlUser) => tasks.filter(t => t.authorId === u.id) },
    Task: { author: (t: GqlTask) => users.find(u => u.id === t.authorId)! },
    Mutation: {
      createTask: (_: unknown, { input }: { input: { title: string; description?: string; priority?: string; authorId: string } }) => {
        const t: GqlTask = {
          id: Math.random().toString(36).slice(2, 7),
          title: input.title,
          description: input.description ?? '',
          status: 'todo',
          priority: input.priority ?? 'medium',
          authorId: input.authorId,
        }
        tasks.push(t)
        return t
      },
    },
  },
})

export default defineEventHandler(async (event) => {
  const { query, variables } = await readBody(event) as { query?: string; variables?: Record<string, unknown> }

  if (!query) {
    throw createError({ statusCode: 400, message: 'GraphQL query is required' })
  }

  let document
  try {
    document = parse(query)
  } catch (e) {
    return { errors: [{ message: (e as Error).message }] }
  }

  const errors = validate(schema, document)
  if (errors.length) {
    return { errors: errors.map(e => ({ message: e.message })) }
  }

  return execute({ schema, document, variableValues: variables ?? {} })
})
