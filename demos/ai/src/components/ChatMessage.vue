<script setup lang="ts">
import type { Message } from '@/types'
import { useLocale } from '../composables/useLocale'

defineProps<{ message: Message }>()

const { t } = useLocale()

function formatContent(text: string): string {
  return text
    .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code class="code-block">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
}
</script>

<template>
  <div class="message" :class="message.role">
    <div class="message-avatar">
      <span v-if="message.role === 'user'">JL</span>
      <span v-else class="ai-icon">✦</span>
    </div>
    <div class="message-body">
      <div class="message-role">{{ message.role === 'user' ? t.chat.userRole : t.chat.assistantRole }}</div>
      <div
        class="message-content"
        v-html="formatContent(message.content)"
      />
      <span v-if="message.streaming" class="cursor" />
    </div>
  </div>
</template>

<style scoped>
.message {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 20px 0;
}

.message + .message {
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 2px;
}

.message.user .message-avatar {
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #818cf8;
}

.message.assistant .message-avatar {
  background: rgba(217, 119, 6, 0.15);
  border: 1px solid rgba(217, 119, 6, 0.3);
  color: #f59e0b;
}

.ai-icon { font-size: 16px; }

.message-body { flex: 1; min-width: 0; }

.message-role {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 8px;
}

.message.user .message-role { color: #818cf8; }
.message.assistant .message-role { color: #f59e0b; }

.message-content {
  font-size: 15px;
  line-height: 1.7;
  color: #cbd5e1;
}

.message-content :deep(strong) { color: #e2e8f0; font-weight: 600; }

.message-content :deep(.inline-code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 4px;
  padding: 1px 6px;
  color: #a5b4fc;
}

.message-content :deep(.code-block) {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #94a3b8;
}

.message-content :deep(pre) {
  background: #080814;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
  overflow-x: auto;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 16px;
  background: #f59e0b;
  border-radius: 1px;
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
