import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import Badge from '@/components/atoms/Badge'
import InvoiceModal from '@/components/organisms/InvoiceModal'
import PaymentModal from '@/components/organisms/PaymentModal'
import FinancialReports from '@/components/organisms/FinancialReports'
import invoiceService from '@/services/api/invoiceService'
import clientService from '@/services/api/clientService'

export default function FinancePage() {
  const [invoices, setInvoices] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showReports, setShowReports] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [invoicesData, clientsData] = await Promise.all([
        invoiceService.getAll(),
        clientService.getAll()
      ])
      setInvoices(invoicesData)
      setClients(clientsData)
    } catch (err) {
      setError('Failed to load financial data')
      toast.error('Failed to load financial data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInvoice = () => {
    setSelectedInvoice(null)
    setShowInvoiceModal(true)
  }

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setShowInvoiceModal(true)
  }

  const handleAddPayment = (invoice) => {
    setSelectedInvoice(invoice)
    setShowPaymentModal(true)
  }

  const handleInvoiceSaved = (savedInvoice) => {
    if (selectedInvoice) {
      setInvoices(invoices.map(inv => inv.id === savedInvoice.id ? savedInvoice : inv))
      toast.success('Invoice updated successfully')
    } else {
      setInvoices([...invoices, savedInvoice])
      toast.success('Invoice created successfully')
    }
    setShowInvoiceModal(false)
  }

  const handlePaymentAdded = (updatedInvoice) => {
    setInvoices(invoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv))
    setShowPaymentModal(false)
    toast.success('Payment recorded successfully')
  }

  const handleDeleteInvoice = async (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoiceService.delete(invoiceId)
        setInvoices(invoices.filter(inv => inv.id !== invoiceId))
        toast.success('Invoice deleted successfully')
      } catch (error) {
        toast.error('Failed to delete invoice')
      }
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'paid': return 'success'
      case 'partial': return 'warning'
      case 'overdue': return 'danger'
      default: return 'primary'
    }
  }

  const filteredInvoices = statusFilter === 'all' 
    ? invoices 
    : invoices.filter(inv => inv.status === statusFilter)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon name="Loader2" className="animate-spin" size={32} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Text className="text-danger mb-4">{error}</Text>
        <Button onClick={loadData}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Text as="h1" className="text-2xl font-heading font-bold text-surface-900 dark:text-white">
            Finance & Invoicing
          </Text>
          <Text className="text-surface-600 dark:text-surface-400 mt-1">
            Manage invoices, track payments, and view financial reports
          </Text>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowReports(!showReports)}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
          >
            <Icon name="BarChart3" size={16} className="mr-2" />
            Reports
          </Button>
          <Button
            onClick={handleCreateInvoice}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Financial Reports */}
      {showReports && (
        <FinancialReports />
      )}

      {/* Status Filter */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All', count: invoices.length },
            { key: 'pending', label: 'Pending', count: invoices.filter(inv => inv.status === 'pending').length },
            { key: 'paid', label: 'Paid', count: invoices.filter(inv => inv.status === 'paid').length },
            { key: 'overdue', label: 'Overdue', count: invoices.filter(inv => inv.status === 'overdue').length },
            { key: 'partial', label: 'Partial', count: invoices.filter(inv => inv.status === 'partial').length }
          ].map(filter => (
            <Button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                statusFilter === filter.key
                  ? 'bg-primary text-white'
                  : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
              }`}
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>
      </Card>

      {/* Invoices List */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <Text className="text-lg font-semibold text-surface-900 dark:text-white">
            Invoices
          </Text>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="FileText" size={48} className="mx-auto text-surface-400 mb-4" />
            <Text className="text-surface-600 dark:text-surface-400 mb-4">
              {statusFilter === 'all' ? 'No invoices found' : `No ${statusFilter} invoices`}
            </Text>
            <Button
              onClick={handleCreateInvoice}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Create First Invoice
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 dark:bg-surface-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-surface-900 divide-y divide-surface-200 dark:divide-surface-700">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-surface-50 dark:hover:bg-surface-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <Text className="text-sm font-medium text-surface-900 dark:text-white">
                          {invoice.number}
                        </Text>
                        <Text className="text-sm text-surface-500 dark:text-surface-400">
                          {new Date(invoice.issueDate).toLocaleDateString()}
                        </Text>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text className="text-sm text-surface-900 dark:text-white">
                        {invoice.clientName}
                      </Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <Text className="text-sm font-medium text-surface-900 dark:text-white">
                          {formatCurrency(invoice.total)}
                        </Text>
                        {invoice.amountPaid > 0 && (
                          <Text className="text-xs text-success">
                            {formatCurrency(invoice.amountPaid)} paid
                          </Text>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text className="text-sm text-surface-900 dark:text-white">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {invoice.status !== 'paid' && (
                          <Button
                            onClick={() => handleAddPayment(invoice)}
                            className="p-1 text-success hover:bg-success/10 rounded"
                            title="Add Payment"
                          >
                            <Icon name="DollarSign" size={16} />
                          </Button>
                        )}
                        <Button
                          onClick={() => handleEditInvoice(invoice)}
                          className="p-1 text-primary hover:bg-primary/10 rounded"
                          title="Edit Invoice"
                        >
                          <Icon name="Edit" size={16} />
                        </Button>
                        <Button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="p-1 text-danger hover:bg-danger/10 rounded"
                          title="Delete Invoice"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modals */}
      {showInvoiceModal && (
        <InvoiceModal
          invoice={selectedInvoice}
          clients={clients}
          onSave={handleInvoiceSaved}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}

      {showPaymentModal && selectedInvoice && (
        <PaymentModal
          invoice={selectedInvoice}
          onSave={handlePaymentAdded}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  )
}