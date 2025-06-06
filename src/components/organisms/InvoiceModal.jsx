import React, { useState, useEffect } from 'react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import FormField from '@/components/molecules/FormField'
import invoiceService from '@/services/api/invoiceService'

export default function InvoiceModal({ invoice, clients, onSave, onClose }) {
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    clientEmail: '',
    clientAddress: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA'
    },
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    taxRate: 0,
    discountRate: 0,
    notes: '',
    paymentTerms: 'Net 30'
  })
  
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (invoice) {
      setFormData({
        ...invoice,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate
      })
    } else {
      // Set default due date to 30 days from issue date
      const issueDate = new Date()
      const dueDate = new Date(issueDate)
      dueDate.setDate(dueDate.getDate() + 30)
      
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0]
      }))
    }
  }, [invoice])

  const calculateItemAmount = (quantity, rate) => {
    return parseFloat(quantity) * parseFloat(rate)
  }

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0)
    const discountAmount = (subtotal * formData.discountRate) / 100
    const taxableAmount = subtotal - discountAmount
    const taxAmount = (taxableAmount * formData.taxRate) / 100
    const total = taxableAmount + taxAmount

    return {
      subtotal,
      discountAmount,
      taxAmount,
      total
    }
  }

  const handleClientChange = (clientId) => {
    const selectedClient = clients.find(c => c.id === clientId)
    if (selectedClient) {
      setFormData({
        ...formData,
        clientId,
        clientName: selectedClient.name,
        clientEmail: selectedClient.email,
        clientAddress: {
          street: selectedClient.address?.street || '',
          city: selectedClient.address?.city || '',
          state: selectedClient.address?.state || '',
          zip: selectedClient.address?.zip || '',
          country: selectedClient.address?.country || 'USA'
        }
      })
    }
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    
    if (field === 'quantity' || field === 'rate') {
      updatedItems[index].amount = calculateItemAmount(
        updatedItems[index].quantity,
        updatedItems[index].rate
      )
    }
    
    setFormData({ ...formData, items: updatedItems })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    })
  }

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index)
      setFormData({ ...formData, items: updatedItems })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { subtotal, discountAmount, taxAmount, total } = calculateTotals()
      
      const invoiceData = {
        ...formData,
        subtotal,
        taxAmount,
        discountAmount,
        total
      }

      let savedInvoice
      if (invoice) {
        savedInvoice = await invoiceService.update(invoice.id, invoiceData)
      } else {
        savedInvoice = await invoiceService.create(invoiceData)
      }

      onSave(savedInvoice)
    } catch (error) {
      console.error('Error saving invoice:', error)
    } finally {
      setLoading(false)
    }
  }

  const { subtotal, discountAmount, taxAmount, total } = calculateTotals()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <Text className="text-xl font-semibold text-surface-900 dark:text-white">
              {invoice ? 'Edit Invoice' : 'Create New Invoice'}
            </Text>
            <Button onClick={onClose} className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg">
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Client"
              as="select"
              value={formData.clientId}
              onChange={(e) => handleClientChange(e.target.value)}
              options={[
                { value: '', label: 'Select a client' },
                ...clients.map(client => ({ value: client.id, label: client.name }))
              ]}
              required
            />
            <FormField
              label="Client Email"
              type="email"
              value={formData.clientEmail}
              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Issue Date"
              type="date"
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              required
            />
            <FormField
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
          </div>

          {/* Invoice Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-surface-900 dark:text-white">
                Invoice Items
              </Text>
              <Button
                type="button"
                onClick={addItem}
                className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-12 md:col-span-5">
                    <FormField
                      label="Description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Service or product description"
                      required
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <FormField
                      label="Qty"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <FormField
                      label="Rate ($)"
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <FormField
                      label="Amount"
                      value={`$${item.amount.toFixed(2)}`}
                      disabled
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}
                      className="p-2 text-danger hover:bg-danger/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tax and Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Tax Rate (%)"
              type="number"
              value={formData.taxRate}
              onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
              min="0"
              max="100"
              step="0.01"
            />
            <FormField
              label="Discount Rate (%)"
              type="number"
              value={formData.discountRate}
              onChange={(e) => setFormData({ ...formData, discountRate: parseFloat(e.target.value) || 0 })}
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          {/* Totals Display */}
          <div className="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <Text>Subtotal:</Text>
              <Text>${subtotal.toFixed(2)}</Text>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-danger">
                <Text>Discount ({formData.discountRate}%):</Text>
                <Text>-${discountAmount.toFixed(2)}</Text>
              </div>
            )}
            {taxAmount > 0 && (
              <div className="flex justify-between">
                <Text>Tax ({formData.taxRate}%):</Text>
                <Text>${taxAmount.toFixed(2)}</Text>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold border-t border-surface-200 dark:border-surface-600 pt-2">
              <Text>Total:</Text>
              <Text>${total.toFixed(2)}</Text>
            </div>
          </div>

          {/* Notes and Payment Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Payment Terms"
              as="select"
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              options={[
                { value: 'Net 15', label: 'Net 15' },
                { value: 'Net 30', label: 'Net 30' },
                { value: 'Net 45', label: 'Net 45' },
                { value: 'Due on Receipt', label: 'Due on Receipt' }
              ]}
            />
            <FormField
              label="Notes"
              as="textarea"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes or terms"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-surface-200 dark:border-surface-700">
            <Button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Icon name="Loader2" className="animate-spin mr-2" size={16} />
                  {invoice ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                invoice ? 'Update Invoice' : 'Create Invoice'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}