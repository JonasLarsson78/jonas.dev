<script setup lang="ts">
import { computed } from 'vue'
import type { Task, TaskStatus, TaskPriority } from '@/types'
import { useTaskStore } from '@/stores/tasks'
import { useLocale } from '../composables/useLocale'

const props = defineProps<{ task: Task }>()

const store = useTaskStore()
const { t } = useLocale()

const priorityColors: Record<TaskPriority, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
}

const statusOptions = computed<{ value: TaskStatus; label: string }[]>(() => [
  { value: 'todo',        label: t.value.columns.todo },
  { value: 'in-progress', label: t.value.columns['in-progress'] },
  { value: 'done',        label: t.value.columns.done },
])

const priorityTooltip = computed(() => t.value.taskCard.priorityTooltip(t.value.priorities[props.task.priority]))

function moveTo(status: TaskStatus) {
  store.moveTask(props.task.id, status)
}
</script>

<template>
  <div class="task-card">
    <div class="task-card-top">
      <div
        class="priority-dot"
        :style="{ background: priorityColors[task.priority] }"
        :title="priorityTooltip"
      />
      <div class="task-title">{{ store.displayTitle(task) }}</div>
      <button class="delete-btn" :title="t.taskCard.deleteTooltip" @click.stop="store.deleteTask(task.id)">×</button>
    </div>

    <p class="task-desc">{{ store.displayDesc(task) }}</p>

    <div class="task-tags">
      <span v-for="tag in task.tags" :key="tag" class="tag">{{ tag }}</span>
    </div>

    <div class="task-footer">
      <div class="move-btns">
        <button
          v-for="opt in statusOptions.filter(o => o.value !== task.status)"
          :key="opt.value"
          class="move-btn"
          @click="moveTo(opt.value)"
        >
          → {{ opt.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  background: #0d0d1a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s ease;
  cursor: default;
}

.task-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
  background: #12122a;
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.task-card-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}

.task-title {
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  flex: 1;
  line-height: 1.4;
}

.delete-btn {
  background: none;
  border: none;
  color: #334155;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.15s;
  flex-shrink: 0;
}

.delete-btn:hover {
  color: #ef4444;
}

.task-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
}

.task-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #64748b;
}

.task-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  padding-top: 10px;
}

.move-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.move-btn {
  padding: 4px 10px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 500;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: #818cf8;
  cursor: pointer;
  transition: all 0.15s;
}

.move-btn:hover {
  background: rgba(99, 102, 241, 0.18);
  border-color: rgba(99, 102, 241, 0.4);
}
</style>
