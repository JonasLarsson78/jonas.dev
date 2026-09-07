import express from 'express'
import cors from 'cors'
import tasksRouter from './routes/tasks'
import chatRouter from './routes/chat'
import authRouter from './routes/auth'
import dbRouter from './routes/db'

const app = express()
const PORT = 3003

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000','http://localhost:3001','http://localhost:3002',
     'http://localhost:3004','http://localhost:3006','http://localhost:3007','http://localhost:3008']

app.use(cors({ origin: ALLOWED_ORIGINS }))
app.use(express.json())

app.get('/', (_, res) => {
  res.json({
    name: 'Jonas Larsson — Node.js API Demo',
    version: '1.0.0',
    stack: ['Node.js', 'Express', 'TypeScript'],
    endpoints: {
      tasks: '/api/tasks',
      chat: '/api/chat/stream',
    },
    aiEnabled: !!process.env.ANTHROPIC_API_KEY,
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/tasks', tasksRouter)
app.use('/api/chat', chatRouter)
app.use('/auth', authRouter)
app.use('/api/db', dbRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found', status: 404 })
})

app.listen(PORT, () => {
  console.log(`\n  API running at http://localhost:${PORT}\n`)
})
