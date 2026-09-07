interface ChatMessage { role: 'user' | 'assistant'; content: string }

const MOCK: Record<string, string> = {
  vue: `Vue 3 is my preferred frontend framework. The Composition API with \`<script setup>\` gives you excellent TypeScript inference and no boilerplate like \`useCallback\`.

Key patterns I use in this portfolio:

\`\`\`ts
const store = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const filtered = computed(() => tasks.value.filter(...))
  return { tasks, filtered }
})
\`\`\`

The Kanban board demo shows Pinia, \`<TransitionGroup>\`, typed props, and reactive state.`,

  react: `React's custom hooks let you extract and reuse stateful logic cleanly.

The analytics dashboard uses three hook patterns:

\`\`\`ts
const load = useCallback(() => {
  setLoading(true)
  setTimeout(() => { setData(allData[range]); setLoading(false) }, 400)
}, [range])

const metrics = useMemo(() => computeMetrics(data), [data])
\`\`\`

\`useCallback\` keeps \`load\` stable across renders so \`useEffect\` doesn't loop.`,

  typescript: `TypeScript strict mode is non-negotiable for me. Key patterns:

\`\`\`ts
type ApiResponse<T> =
  | { state: 'loading' }
  | { state: 'error'; message: string }
  | { state: 'success'; data: T; count: number }

type CreateTask = Omit<Task, 'id' | 'createdAt'>
\`\`\`

Every file in this portfolio uses \`strict: true\`, \`noUnusedLocals\`, and \`noUnusedParameters\`. No \`any\`.`,

  default: `I'm a demonstration of the Claude API streaming pattern used in this portfolio.

I'm currently running in **mock mode** — but the SSE streaming is identical to the real Claude API. The Nuxt server route proxies to Anthropic's API when \`ANTHROPIC_API_KEY\` is set.

Try asking about: **Vue 3**, **React**, **TypeScript**, or this portfolio's architecture.`,
}

function pickResponse(messages: ChatMessage[]): string {
  const last = messages.at(-1)?.content?.toLowerCase() ?? ''
  if (last.includes('vue'))        return MOCK.vue
  if (last.includes('react'))      return MOCK.react
  if (last.includes('typescript')) return MOCK.typescript
  return MOCK.default
}

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event) as { messages: ChatMessage[] }
  if (!Array.isArray(messages) || !messages.length) throw createError({ statusCode: 400, message: 'messages required' })

  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')

  const apiKey = process.env.ANTHROPIC_API_KEY

  if (apiKey) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1024, stream: true, system: "You are a helpful assistant in Jonas Larsson's developer portfolio.", messages }),
    })
    const reader = response.body!.getReader()
    const dec = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const lines = dec.decode(value).split('\n').filter(l => l.startsWith('data:'))
      for (const line of lines) {
        try {
          const ev = JSON.parse(line.slice(5)) as { type: string; delta?: { text?: string } }
          if (ev.type === 'content_block_delta' && ev.delta?.text) {
            await send(event, `data: ${JSON.stringify({ type: 'delta', text: ev.delta.text })}\n\n`)
          }
        } catch { /* skip */ }
      }
    }
  } else {
    const text = pickResponse(messages)
    for (let i = 0; i < text.length;) {
      const chunk = text.slice(i, i + 3)
      i += 3
      await send(event, `data: ${JSON.stringify({ type: 'delta', text: chunk })}\n\n`)
      await new Promise(r => setTimeout(r, 20))
    }
  }

  await send(event, `data: ${JSON.stringify({ type: 'done' })}\n\n`)
})
