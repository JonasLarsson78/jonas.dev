export default defineEventHandler(() => ({
  data: [
    { _id: 'done',        count: 2 },
    { _id: 'in-progress', count: 1 },
    { _id: 'todo',        count: 2 },
  ],
}))
