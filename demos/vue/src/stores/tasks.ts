import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, TaskStatus, TaskPriority } from '@/types'
import { useLocale } from '../composables/useLocale'

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

const initialTasks: Task[] = [
  { id: generateId(), seedKey: 'seed-pinia',  title: '', description: '', priority: 'high',   status: 'done',        tags: ['pinia', 'typescript'],  createdAt: new Date('2024-01-01') },
  { id: generateId(), seedKey: 'seed-kanban', title: '', description: '', priority: 'high',   status: 'done',        tags: ['vue3', 'components'],   createdAt: new Date('2024-01-02') },
  { id: generateId(), seedKey: 'seed-types',  title: '', description: '', priority: 'medium', status: 'in-progress', tags: ['typescript'],           createdAt: new Date('2024-01-03') },
  { id: generateId(), seedKey: 'seed-api',    title: '', description: '', priority: 'medium', status: 'in-progress', tags: ['api', 'node'],          createdAt: new Date('2024-01-04') },
  { id: generateId(), seedKey: 'seed-tests',  title: '', description: '', priority: 'low',    status: 'todo',        tags: ['vitest', 'testing'],    createdAt: new Date('2024-01-05') },
  { id: generateId(), seedKey: 'seed-deploy', title: '', description: '', priority: 'low',    status: 'todo',        tags: ['devops', 'vercel'],     createdAt: new Date('2024-01-06') },
]

export const useTaskStore = defineStore('tasks', () => {
  const { t } = useLocale()
  const tasks = ref<Task[]>(initialTasks)
  const searchQuery = ref('')
  const filterPriority = ref<TaskPriority | 'all'>('all')

  function displayTitle(task: Task): string {
    return task.seedKey ? t.value.seedTasks[task.seedKey].title : task.title
  }
  function displayDesc(task: Task): string {
    return task.seedKey ? t.value.seedTasks[task.seedKey].description : task.description
  }

  const filteredTasks = computed(() => {
    let result = tasks.value

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        task => displayTitle(task).toLowerCase().includes(q) || displayDesc(task).toLowerCase().includes(q)
      )
    }

    if (filterPriority.value !== 'all') {
      result = result.filter(t => t.priority === filterPriority.value)
    }

    return result
  })

  function tasksByStatus(status: TaskStatus): Task[] {
    return filteredTasks.value.filter(t => t.status === status)
  }

  function addTask(task: Omit<Task, 'id' | 'createdAt'>): void {
    tasks.value.push({
      ...task,
      id: generateId(),
      createdAt: new Date(),
    })
  }

  function moveTask(taskId: string, newStatus: TaskStatus): void {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) task.status = newStatus
  }

  function deleteTask(taskId: string): void {
    tasks.value = tasks.value.filter(t => t.id !== taskId)
  }

  const totalByStatus = computed(() => ({
    todo: tasks.value.filter(t => t.status === 'todo').length,
    'in-progress': tasks.value.filter(t => t.status === 'in-progress').length,
    done: tasks.value.filter(t => t.status === 'done').length,
  }))

  return {
    tasks,
    searchQuery,
    filterPriority,
    filteredTasks,
    tasksByStatus,
    addTask,
    moveTask,
    deleteTask,
    totalByStatus,
    displayTitle,
    displayDesc,
  }
})
