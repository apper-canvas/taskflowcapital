import projectData from '../mockData/projects.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage
let projects = [...projectData]

const projectService = {
  async getAll() {
    await delay(250)
    return [...projects]
  },

  async getById(id) {
    await delay(200)
    const project = projects.find(p => p.id === id)
    if (!project) throw new Error('Project not found')
    return { ...project }
  },

  async create(projectData) {
    await delay(350)
    const newProject = {
      ...projectData,
      id: Date.now().toString(),
      isActive: projectData.isActive !== undefined ? projectData.isActive : true
    }
    projects.push(newProject)
    return { ...newProject }
  },

  async update(id, updates) {
    await delay(300)
    const index = projects.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Project not found')
    
    projects[index] = { ...projects[index], ...updates }
    return { ...projects[index] }
  },

  async delete(id) {
    await delay(250)
    const index = projects.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Project not found')
    
    projects.splice(index, 1)
    return true
  },

  async getActive() {
    await delay(200)
    return projects.filter(p => p.isActive).map(p => ({ ...p }))
  }
}

export default projectService