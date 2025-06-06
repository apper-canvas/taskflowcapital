import taskData from '../mockData/tasks.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage
let tasks = [...taskData]

const taskService = {
  async getAll() {
    await delay(300)
    return [...tasks]
  },

  async getById(id) {
    await delay(200)
    const task = tasks.find(t => t.id === id)
    if (!task) throw new Error('Task not found')
    return { ...task }
  },

  async create(taskData) {
    await delay(400)
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      timeSpent: taskData.timeSpent || 0
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, updates) {
    await delay(300)
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    
    tasks[index] = { ...tasks[index], ...updates }
    return { ...tasks[index] }
  },

  async delete(id) {
    await delay(250)
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    
    tasks.splice(index, 1)
    return true
  },

  async getByProject(projectId) {
    await delay(200)
    return tasks.filter(t => t.projectId === projectId).map(t => ({ ...t }))
  },

  async getByStatus(status) {
    await delay(200)
    return tasks.filter(t => t.status === status).map(t => ({ ...t }))
  }
}

export default taskService