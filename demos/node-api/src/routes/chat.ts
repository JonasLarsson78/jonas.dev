import { Router, Request, Response } from 'express'

const router = Router()

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
}

// Mock responses that stream character-by-character, simulating Claude
const MOCK_RESPONSES: Record<string, string> = {
  default: `I'm a demonstration of the Claude API integration pattern used in this portfolio. In production, this response would come from Anthropic's Claude model via a streaming API call.

This architecture keeps the API key secure on the server side — the frontend never sees credentials. The Node.js proxy handles:

• **Authentication** — API key injected server-side via environment variable
• **Streaming** — Server-Sent Events pipe Claude's chunks directly to the client
• **Context** — Full message history sent with each request for multi-turn conversation

To enable real Claude responses, set \`ANTHROPIC_API_KEY\` in your environment and the proxy will forward to \`https://api.anthropic.com/v1/messages\`.`,

  vue: `Vue 3 is my preferred frontend framework. The Composition API with \`<script setup>\` gives you the expressiveness of React hooks but with better TypeScript inference and no need for boilerplate like \`useCallback\` to prevent re-renders.

Key things I use in this portfolio's Vue demo:

\`\`\`ts
// Pinia store — cleaner than Vuex, great TS support
const store = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const filtered = computed(() => tasks.value.filter(...))
  return { tasks, filtered }
})
\`\`\`

The \`<TransitionGroup>\` for card animations, strict TypeScript props via \`defineProps<T>()\`, and watchers for reactive side-effects are all showcased in the Kanban board demo.`,

  react: `React's strength is its ecosystem and the mental model of "UI = f(state)". Custom hooks let you extract and reuse stateful logic cleanly.

In the analytics dashboard demo I use three hooks patterns:

\`\`\`ts
// useCallback prevents load from changing ref on every render
const load = useCallback(() => {
  setLoading(true)
  setTimeout(() => { setData(allData[range]); setLoading(false) }, 400)
}, [range])

// useMemo only recalculates when data changes
const metrics = useMemo(() => computeMetrics(data), [data])
\`\`\`

The \`useEffect\` depends on \`load\` (stable via \`useCallback\`), so changing the time range triggers exactly one reload — no stale closures, no extra renders.`,

  typescript: `TypeScript is non-negotiable for me on any project beyond a small script. The upfront cost pays back on day one when you refactor.

Things I actually use (not just basic types):

\`\`\`ts
// Discriminated unions for type narrowing
type ApiResponse<T> =
  | { status: 'ok'; data: T }
  | { status: 'error'; error: string }

// Utility types
type CreateTask = Omit<Task, 'id' | 'createdAt'>

// Generic route handler
function createHandler<T>(fn: (body: T) => Promise<Response>) { ... }
\`\`\`

Every file in this portfolio is strict TypeScript — \`strict: true\`, \`noUnusedLocals\`, \`noUnusedParameters\`. No \`any\`.`,
}

function pickMockResponse(messages: ChatMessage[]): string {
  const last = messages.at(-1)?.content?.toLowerCase() ?? ''
  if (last.includes('vue')) return MOCK_RESPONSES.vue
  if (last.includes('react')) return MOCK_RESPONSES.react
  if (last.includes('typescript') || last.includes('ts')) return MOCK_RESPONSES.typescript
  return MOCK_RESPONSES.default
}

async function streamReal(res: Response, messages: ChatMessage[]): Promise<void> {
  const apiKey = process.env.ANTHROPIC_API_KEY!

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      stream: true,
      system: `You are a helpful assistant in Jonas Larsson's interactive developer portfolio.
Jonas is a frontend-focused fullstack developer with 5 years of experience, specialising in Vue 3, React, TypeScript, and Node.js.
Answer questions concisely and technically. If asked about this portfolio or its code, you can discuss the architecture.`,
      messages,
    }),
  })

  if (!response.ok || !response.body) {
    res.write(`data: ${JSON.stringify({ type: 'error', error: 'Claude API error' })}\n\n`)
    res.end()
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n').filter(l => l.startsWith('data:'))

    for (const line of lines) {
      const data = line.slice(5).trim()
      if (data === '[DONE]') continue
      try {
        const event = JSON.parse(data) as { type: string; delta?: { text?: string } }
        if (event.type === 'content_block_delta' && event.delta?.text) {
          res.write(`data: ${JSON.stringify({ type: 'delta', text: event.delta.text })}\n\n`)
        }
      } catch {
        // skip malformed lines
      }
    }
  }

  res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
  res.end()
}

async function streamMock(res: Response, messages: ChatMessage[]): Promise<void> {
  const text = pickMockResponse(messages)
  const chars = text.split('')

  await new Promise<void>(resolve => {
    let i = 0
    function next() {
      if (i >= chars.length) {
        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
        res.end()
        resolve()
        return
      }
      // Send chunks of 2-4 chars to feel natural
      const chunkSize = Math.floor(Math.random() * 3) + 2
      const chunk = chars.slice(i, i + chunkSize).join('')
      i += chunkSize
      res.write(`data: ${JSON.stringify({ type: 'delta', text: chunk })}\n\n`)
      setTimeout(next, 18 + Math.random() * 14)
    }
    next()
  })
}

router.post('/stream', async (req: Request, res: Response) => {
  const { messages } = req.body as ChatRequest

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  if (process.env.ANTHROPIC_API_KEY) {
    await streamReal(res, messages)
  } else {
    await streamMock(res, messages)
  }
})

export default router
