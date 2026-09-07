<script setup lang="ts">
import { ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task, TaskStatus, TaskPriority } from '@/types'
import { useTaskStore } from '@/stores/tasks'

const props = defineProps<{
  id: TaskStatus
  label: string
  color: string
  tasks: Task[]
}>()

const store = useTaskStore()
const showAddForm = ref(false)
const newTitle = ref('')
const newDesc = ref('')
const newPriority = ref<TaskPriority>('medium')

function submitTask() {
  if (!newTitle.value.trim()) return
  store.addTask({
    title: newTitle.value.trim(),
    description: newDesc.value.trim(),
    priority: newPriority.value,
    status: props.id,
    tags: [],
  })
  newTitle.value = ''
  newDesc.value = ''
  newPriority.value = 'medium'
  showAddForm.value = false
}
</script>

<template>
  <div class="column">
    <div class="column-header">
      <div class="column-title-row">
        <span class="column-dot" :style="{ background: color }" />
        <span class="column-label">{{ label }}</span>
        <span class="column-count">{{ tasks.length }}</span>
      </div>
      <button class="add-btn" title="Add task" @click="showAddForm = !showAddForm">+</button>
    </div>

    <Transition name="slide-down">
      <form v-if="showAddForm" class="add-form" @submit.prevent="submitTask">
        <input
          v-model="newTitle"
          class="form-input"
          placeholder="Task title..."
          autofocus
        />
        <input
          v-model="newDesc"
          class="form-input"
          placeholder="Description (optional)..."
        />
        <div class="form-row">
          <select v-model="newPriority" class="form-select">
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="showAddForm = false">Cancel</button>
            <button type="submit" class="btn-submit">Add</button>
          </div>
        </div>
      </form>
    </Transition>

    <div class="task-list">
      <TransitionGroup name="task">
        <TaskCard v-for="task in tasks" :key="task.id" :task="task" />
      </TransitionGroup>
      <div v-if="tasks.length === 0" class="empty-state">
        No tasks here
      </div>
    </div>
  </div>
</template>

<style scoped>
.column {
  background: #0a0a18;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 280px;
  flex: 1;
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.column-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.column-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.column-label {
  font-size: 13px;
  font-weight: 600;
  color: #e2e8f0;
  letter-spacing: -0.01em;
}

.column-count {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 1px 7px;
}

.add-btn {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: #818cf8;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  line-height: 1;
  padding-bottom: 1px;
}

.add-btn:hover {
  background: rgba(99, 102, 241, 0.2);
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #12122a;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 10px;
  padding: 14px;
}

.form-input, .form-select {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 7px;
  padding: 8px 12px;
  font-size: 13px;
  color: #e2e8f0;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
}

.form-input:focus, .form-select:focus {
  border-color: rgba(99, 102, 241, 0.4);
}

.form-select option {
  background: #12122a;
}

.form-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.form-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.btn-cancel, .btn-submit {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  border: none;
  font-family: inherit;
}

.btn-cancel {
  background: transparent;
  color: #64748b;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.btn-cancel:hover { color: #e2e8f0; }

.btn-submit {
  background: #6366f1;
  color: #fff;
}

.btn-submit:hover { background: #7173f4; }

.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.empty-state {
  text-align: center;
  padding: 32px 16px;
  color: #334155;
  font-size: 13px;
}

/* Transitions */
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.task-enter-active, .task-leave-active {
  transition: all 0.25s ease;
}
.task-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.task-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
