<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'
import ChatMessage from './components/ChatMessage.vue'
import LanguageToggle from '../../_shared/vue/LanguageToggle.vue'
import { useLocale } from './composables/useLocale'
import type { Message } from './types'

const API_URL      = '/api/chat/stream'
const portfolioUrl = '/'

const { t } = useLocale()

const messages = ref<Message[]>([
  {
    id: 'intro',
    role: 'assistant',
    content: t.value.intro,
    timestamp: new Date(),
  },
])

watch(t, () => {
  const intro = messages.value.find(m => m.id === 'intro')
  if (intro) intro.content = t.value.intro
})

const input = ref('')
const loading = ref(false)
const chatEl = ref<HTMLElement | null>(null)

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

async function scrollToBottom() {
  await nextTick()
  if (chatEl.value) {
    chatEl.value.scrollTop = chatEl.value.scrollHeight
  }
}

async function send(text?: string) {
  const content = text ?? input.value.trim()
  if (!content || loading.value) return

  input.value = ''
  loading.value = true

  messages.value.push({
    id: generateId(),
    role: 'user',
    content,
    timestamp: new Date(),
  })

  const assistantId = generateId()
  messages.value.push({
    id: assistantId,
    role: 'assistant',
    content: '',
    streaming: true,
    timestamp: new Date(),
  })

  await scrollToBottom()

  try {
    const history = messages.value
      .filter(m => !m.streaming)
      .slice(0, -1)
      .map(m => ({ role: m.role, content: m.content }))

    history.push({ role: 'user', content })

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    })

    if (!response.body) throw new Error('No stream body')

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    const msg = messages.value.find(m => m.id === assistantId)!

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n').filter(l => l.startsWith('data:'))

      for (const line of lines) {
        const raw = line.slice(5).trim()
        try {
          const event = JSON.parse(raw) as { type: string; text?: string; error?: string }
          if (event.type === 'delta' && event.text) {
            msg.content += event.text
            await scrollToBottom()
          } else if (event.type === 'done') {
            msg.streaming = false
          } else if (event.type === 'error') {
            msg.content += t.value.errors.apiError(event.error ?? 'unknown')
            msg.streaming = false
          }
        } catch {
          // skip malformed
        }
      }
    }

    msg.streaming = false
  } catch (err) {
    const msg = messages.value.find(m => m.id === assistantId)!
    msg.content = t.value.errors.apiUnreachable
    msg.streaming = false
  }

  loading.value = false
  await scrollToBottom()
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

onMounted(scrollToBottom)
</script>

<template>
  <div class="app">
    <!-- Topbar -->
    <div class="topbar">
      <a :href="portfolioUrl" class="back-link">← {{ t.topbar.back }}</a>
      <div class="topbar-center">
        <span class="badge vue">Vue 3</span>
        <span class="badge node">Node.js</span>
        <span class="badge claude">Claude API</span>
        <span class="badge mock">{{ t.topbar.mockBadge }}</span>
      </div>
      <div class="topbar-right">
        <LanguageToggle />
      </div>
    </div>

    <!-- Chat layout -->
    <div class="chat-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-section">
          <div class="sidebar-label">{{ t.sidebar.architecture }}</div>
          <div class="arch-flow">
            <div class="arch-node frontend">Vue 3 frontend</div>
            <div class="arch-arrow">↓ fetch (SSE)</div>
            <div class="arch-node backend">Node.js proxy</div>
            <div class="arch-arrow">↓ ANTHROPIC_API_KEY</div>
            <div class="arch-node claude">Claude API</div>
          </div>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-label">{{ t.sidebar.tryAsking }}</div>
          <div class="suggestions">
            <button
              v-for="s in t.suggestions"
              :key="s"
              class="suggestion"
              @click="send(s)"
            >
              {{ s }}
            </button>
          </div>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-label">{{ t.sidebar.status }}</div>
          <div class="status-item">
            <span class="status-dot mock" />
            <span class="status-text">{{ t.sidebar.mockActive }}</span>
          </div>
          <div class="status-note" v-html="t.sidebar.statusNote" />
        </div>
      </aside>

      <!-- Chat -->
      <main class="chat-main">
        <div class="chat-header">
          <div class="chat-title">{{ t.chat.title }}</div>
          <div class="chat-subtitle">{{ t.chat.subtitle }}</div>
        </div>

        <div ref="chatEl" class="messages">
          <ChatMessage
            v-for="msg in messages"
            :key="msg.id"
            :message="msg"
          />

          <div v-if="loading && !messages.at(-1)?.streaming" class="typing-indicator">
            <span /><span /><span />
          </div>
        </div>

        <div class="input-area">
          <textarea
            v-model="input"
            class="chat-input"
            :placeholder="t.chat.inputPlaceholder"
            rows="1"
            :disabled="loading"
            @keydown="handleKeydown"
          />
          <button
            class="send-btn"
            :disabled="!input.trim() || loading"
            @click="send()"
          >
            <span v-if="loading" class="spinner" />
            <span v-else>↑</span>
          </button>
        </div>
        <div class="input-hint">{{ t.chat.inputHint }}</div>
      </main>
    </div>
  </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { background: #060610; color: #e2e8f0; font-family: 'Inter', sans-serif; }
</style>

<style scoped>
.app { height: 100vh; display: flex; flex-direction: column; overflow: hidden; }

/* Topbar */
.topbar {
  background: rgba(6, 6, 16, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  z-index: 100;
}

.back-link {
  font-size: 13px;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s;
  width: 100px;
}
.back-link:hover { color: #e2e8f0; }

.topbar-center { display: flex; gap: 6px; }
.topbar-right {
  display: flex;
  justify-content: flex-end;
  min-width: 100px;
}

.badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}
.badge.vue { background: rgba(66,184,131,0.1); border: 1px solid rgba(66,184,131,0.25); color: #42b883; }
.badge.node { background: rgba(51,153,51,0.1); border: 1px solid rgba(51,153,51,0.25); color: #5cb85c; }
.badge.claude { background: rgba(217,119,6,0.1); border: 1px solid rgba(217,119,6,0.2); color: #f59e0b; }
.badge.mock { background: rgba(100,116,139,0.1); border: 1px solid rgba(100,116,139,0.2); color: #64748b; font-style: italic; }

/* Layout */
.chat-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 260px;
  flex-shrink: 0;
  border-right: 1px solid rgba(255,255,255,0.05);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  overflow-y: auto;
}

.sidebar-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #334155;
  margin-bottom: 12px;
}

/* Architecture flow */
.arch-flow { display: flex; flex-direction: column; gap: 4px; }

.arch-node {
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}
.arch-node.frontend { background: rgba(66,184,131,0.1); border: 1px solid rgba(66,184,131,0.2); color: #42b883; }
.arch-node.backend { background: rgba(51,153,51,0.1); border: 1px solid rgba(51,153,51,0.2); color: #5cb85c; }
.arch-node.claude { background: rgba(217,119,6,0.1); border: 1px solid rgba(217,119,6,0.2); color: #f59e0b; }
.arch-arrow { font-size: 11px; color: #334155; text-align: center; padding: 2px 0; }

/* Suggestions */
.suggestions { display: flex; flex-direction: column; gap: 6px; }

.suggestion {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  color: #64748b;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
  line-height: 1.4;
}
.suggestion:hover {
  background: rgba(99,102,241,0.08);
  border-color: rgba(99,102,241,0.2);
  color: #94a3b8;
}

/* Status */
.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.status-dot.mock { background: #64748b; }
.status-dot.live { background: #22c55e; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

.status-text { font-size: 13px; color: #64748b; }
.status-note {
  font-size: 11px;
  color: #334155;
  line-height: 1.5;
}
.status-note :deep(code) {
  font-family: 'JetBrains Mono', monospace;
  color: #475569;
  background: rgba(255,255,255,0.04);
  border-radius: 3px;
  padding: 1px 4px;
}

/* Chat main */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-width: 780px;
}

.chat-header {
  padding: 20px 28px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  flex-shrink: 0;
}
.chat-title { font-size: 18px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 3px; }
.chat-subtitle { font-size: 12px; color: #475569; }

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 8px 28px;
  scroll-behavior: smooth;
}

/* Scrollbar */
.messages::-webkit-scrollbar { width: 4px; }
.messages::-webkit-scrollbar-track { background: transparent; }
.messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

/* Typing indicator */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 16px 0;
}
.typing-indicator span {
  width: 6px;
  height: 6px;
  background: #334155;
  border-radius: 50%;
  animation: bounce 1.2s infinite;
}
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce { 0%,80%,100% { transform:scale(1); } 40% { transform:scale(1.4); } }

/* Input area */
.input-area {
  display: flex;
  gap: 10px;
  padding: 16px 28px 8px;
  border-top: 1px solid rgba(255,255,255,0.05);
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
  background: #0d0d1a;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
  color: #e2e8f0;
  font-family: 'Inter', sans-serif;
  resize: none;
  outline: none;
  max-height: 120px;
  transition: border-color 0.15s;
  line-height: 1.5;
}
.chat-input:focus { border-color: rgba(99,102,241,0.4); }
.chat-input::placeholder { color: #334155; }
.chat-input:disabled { opacity: 0.5; }

.send-btn {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #6366f1;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
  align-self: flex-end;
}
.send-btn:hover:not(:disabled) { background: #7173f4; transform: translateY(-1px); }
.send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.input-hint {
  font-size: 11px;
  color: #1e293b;
  padding: 0 28px 14px;
  flex-shrink: 0;
}

@media (max-width: 720px) {
  .sidebar { display: none; }
}
</style>
