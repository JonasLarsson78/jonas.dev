import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, TaskStatus, TaskPriority } from '@/types'

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

const initialTasks: Task[] = [
  {
    id: generateId(),
    title: 'Set up Pinia store',
    description: 'Configure Pinia for state management with TypeScript support',
    priority: 'high',
    status: 'done',
    tags: ['pinia', 'typescript'],
    createdAt: new Date('2024-01-01'),
  },
  {
    id: generateId(),
    title: 'Build Kanban board',
    description: 'Create drag-and-drop task board with column filtering',
    priority: 'high',
    status: 'done',
    tags: ['vue3', 'components'],
    createdAt: new Date('2024-01-02'),
  },
  {
    id: generateId(),
    title: 'Add TypeScript types',
    description: 'Define interfaces for Task, Column, and store state',
    priority: 'medium',
    status: 'in-progress',
    tags: ['typescript'],
    createdAt: new Date('2024-01-03'),
  },
  {
    id: generateId(),
    title: 'Integrate Node.js API',
    description: 'Connect to the Express REST API running on port 3003',
    priority: 'medium',
    status: 'in-progress',
    tags: ['api', 'node'],
    createdAt: new Date('2024-01-04'),
  },
  {
    id: generateId(),
    title: 'Write unit tests',
    description: 'Add Vitest tests for the Pinia store and components',
    priority: 'low',
    status: 'todo',
    tags: ['vitest', 'testing'],
    createdAt: new Date('2024-01-05'),
  },
  {
    id: generateId(),
    title: 'Deploy to Vercel',
    description: 'Set up CI/CD pipeline and deploy Vue demo to Vercel',
    priority: 'low',
    status: 'todo',
    tags: ['devops', 'vercel'],
    createdAt: new Date('2024-01-06'),
  },
]

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>(initialTasks)
  const searchQuery = ref('')
  const filterPriority = ref<TaskPriority | 'all'>('all')

  const filteredTasks = computed(() => {
    let result = tasks.value

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
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
  }
})
