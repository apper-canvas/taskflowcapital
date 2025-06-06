import invoiceData from '../mockData/invoices.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage
let invoices = [...invoiceData]

const invoiceService = {
  async getAll() {
    await delay(250)
    return [...invoices]
  },

  async getById(id) {
    await delay(200)
    const invoice = invoices.find(inv => inv.id === id)
    if (!invoice) throw new Error('Invoice not found')
    return { ...invoice }
  },

  async create(invoiceData) {
    await delay(350)
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`
    
    const newInvoice = {
      ...invoiceData,
      id: 'inv-' + Date.now().toString(),
      number: invoiceNumber,
      status: 'pending',
      amountPaid: 0,
      amountDue: invoiceData.total,
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    invoices.push(newInvoice)
    return { ...newInvoice }
  },

  async update(id, updates) {
    await delay(300)
    const index = invoices.findIndex(inv => inv.id === id)
    if (index === -1) throw new Error('Invoice not found')
    
    invoices[index] = { 
      ...invoices[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    }
    return { ...invoices[index] }
  },

  async delete(id) {
    await delay(250)
    const index = invoices.findIndex(inv => inv.id === id)
    if (index === -1) throw new Error('Invoice not found')
    
    invoices.splice(index, 1)
    return true
  },

  async getByStatus(status) {
    await delay(200)
    return invoices.filter(inv => inv.status === status).map(inv => ({ ...inv }))
  },

  async getByClient(clientId) {
    await delay(200)
    return invoices.filter(inv => inv.clientId === clientId).map(inv => ({ ...inv }))
  },

  async addPayment(invoiceId, paymentData) {
    await delay(300)
    const index = invoices.findIndex(inv => inv.id === invoiceId)
    if (index === -1) throw new Error('Invoice not found')
    
    const invoice = invoices[index]
    const payment = {
      ...paymentData,
      id: 'pay-' + Date.now().toString(),
      date: paymentData.date || new Date().toISOString().split('T')[0]
    }
    
    invoice.payments.push(payment)
    invoice.amountPaid += payment.amount
    invoice.amountDue = invoice.total - invoice.amountPaid
    
    // Update status based on payment
    if (invoice.amountDue <= 0) {
      invoice.status = 'paid'
    } else if (invoice.amountPaid > 0) {
      invoice.status = 'partial'
    }
    
    invoice.updatedAt = new Date().toISOString()
    
    return { ...invoice }
  },

  async getFinancialSummary() {
    await delay(200)
    const totalRevenue = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0)
    
    const pendingAmount = invoices
      .filter(inv => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.amountDue, 0)
    
    const overdueAmount = invoices
      .filter(inv => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amountDue, 0)
    
    const partialAmount = invoices
      .filter(inv => inv.status === 'partial')
      .reduce((sum, inv) => sum + inv.amountDue, 0)
    
    return {
      totalRevenue,
      pendingAmount,
      overdueAmount,
      partialAmount,
      totalInvoices: invoices.length,
      paidInvoices: invoices.filter(inv => inv.status === 'paid').length,
      pendingInvoices: invoices.filter(inv => inv.status === 'pending').length,
      overdueInvoices: invoices.filter(inv => inv.status === 'overdue').length
    }
  },

  async getRevenueByMonth(year = new Date().getFullYear()) {
    await delay(200)
    const monthlyRevenue = Array(12).fill(0)
    
    invoices
      .filter(inv => inv.status === 'paid')
      .forEach(invoice => {
        const invoiceYear = new Date(invoice.issueDate).getFullYear()
        if (invoiceYear === year) {
          const month = new Date(invoice.issueDate).getMonth()
          monthlyRevenue[month] += invoice.total
        }
      })
    
    return monthlyRevenue
  },

  async markOverdue() {
    await delay(200)
    const today = new Date().toISOString().split('T')[0]
    
    invoices.forEach(invoice => {
      if (invoice.status === 'pending' && invoice.dueDate < today) {
        invoice.status = 'overdue'
        invoice.updatedAt = new Date().toISOString()
      }
    })
    
    return invoices.filter(inv => inv.status === 'overdue').length
  }
}

export default invoiceService