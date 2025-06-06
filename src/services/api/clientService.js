import clientData from '../mockData/clients.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage
let clients = [...clientData]

const clientService = {
  async getAll() {
    await delay(250)
    return [...clients]
  },

  async getById(id) {
    await delay(200)
    const client = clients.find(c => c.id === id)
    if (!client) throw new Error('Client not found')
    return { ...client }
  },

  async create(clientData) {
    await delay(350)
    const newClient = {
      ...clientData,
      id: 'client-' + Date.now().toString(),
      dateAdded: new Date().toISOString(),
      lastContact: new Date().toISOString(),
      isActive: clientData.isActive !== undefined ? clientData.isActive : true,
      projectIds: clientData.projectIds || []
    }
    clients.push(newClient)
    return { ...newClient }
  },

  async update(id, updates) {
    await delay(300)
    const index = clients.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Client not found')
    
    clients[index] = { ...clients[index], ...updates }
    return { ...clients[index] }
  },

  async delete(id) {
    await delay(250)
    const index = clients.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Client not found')
    
    clients.splice(index, 1)
    return true
  },

  async getActive() {
    await delay(200)
    return clients.filter(c => c.isActive).map(c => ({ ...c }))
  },

  async searchClients(query) {
    await delay(200)
    const lowercaseQuery = query.toLowerCase()
    return clients.filter(client =>
      client.name.toLowerCase().includes(lowercaseQuery) ||
      client.email.toLowerCase().includes(lowercaseQuery) ||
client.company.toLowerCase().includes(lowercaseQuery)
    ).map(c => ({ ...c }))
  },

  async getClientInvoices(clientId) {
    await delay(200)
    // This would be handled by invoiceService in real implementation
    // Placeholder for client invoice integration
    return []
  },

  async updateBillingInfo(id, billingData) {
    await delay(300)
    const index = clients.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Client not found')
    
    clients[index] = { 
      ...clients[index], 
      billing: { ...clients[index].billing, ...billingData },
      lastContact: new Date().toISOString()
    }
    return { ...clients[index] }
  }
}

export default clientService