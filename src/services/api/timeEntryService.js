import timeEntryData from '../mockData/timeEntries.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage
let timeEntries = [...timeEntryData]

const timeEntryService = {
  async getAll() {
    await delay(250)
    return [...timeEntries]
  },

  async getById(id) {
    await delay(200)
    const entry = timeEntries.find(e => e.id === id)
    if (!entry) throw new Error('Time entry not found')
    return { ...entry }
  },

  async create(entryData) {
    await delay(300)
    const newEntry = {
      ...entryData,
      id: Date.now().toString(),
      duration: entryData.duration || 0
    }
    timeEntries.push(newEntry)
    return { ...newEntry }
  },

  async update(id, updates) {
    await delay(250)
    const index = timeEntries.findIndex(e => e.id === id)
    if (index === -1) throw new Error('Time entry not found')
    
    timeEntries[index] = { ...timeEntries[index], ...updates }
    return { ...timeEntries[index] }
  },

  async delete(id) {
    await delay(200)
    const index = timeEntries.findIndex(e => e.id === id)
    if (index === -1) throw new Error('Time entry not found')
    
    timeEntries.splice(index, 1)
    return true
  },

  async getByTask(taskId) {
    await delay(200)
    return timeEntries.filter(e => e.taskId === taskId).map(e => ({ ...e }))
  }
}

export default timeEntryService