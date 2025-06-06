import React, { useState } from 'react'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import FormField from '@/components/molecules/FormField'
import invoiceService from '@/services/api/invoiceService'

export default function PaymentModal({ invoice, onSave, onClose }) {
  const [formData, setFormData] = useState({
    amount: invoice.amountDue,
    method: 'bank_transfer',
    date: new Date().toISOString().split('T')[0],
    reference: ''
  })
  
  const [loading, setLoading] = useState(false)

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'check', label: 'Check' },
    { value: 'cash', label: 'Cash' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'stripe', label: 'Stripe' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updatedInvoice = await invoiceService.addPayment(invoice.id, formData)
      onSave(updatedInvoice)
    } catch (error) {
      console.error('Error adding payment:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <Text className="text-xl font-semibold text-surface-900 dark:text-white">
              Record Payment
            </Text>
            <Button onClick={onClose} className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg">
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Invoice Information */}
          <div className="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <Text className="font-medium">Invoice:</Text>
              <Text>{invoice.number}</Text>
            </div>
            <div className="flex justify-between">
              <Text className="font-medium">Client:</Text>
              <Text>{invoice.clientName}</Text>
            </div>
            <div className="flex justify-between">
              <Text className="font-medium">Total Amount:</Text>
              <Text>{formatCurrency(invoice.total)}</Text>
            </div>
            <div className="flex justify-between">
              <Text className="font-medium">Amount Paid:</Text>
              <Text className="text-success">{formatCurrency(invoice.amountPaid)}</Text>
            </div>
            <div className="flex justify-between border-t border-surface-200 dark:border-surface-600 pt-2">
              <Text className="font-medium">Amount Due:</Text>
              <Text className="font-semibold text-danger">{formatCurrency(invoice.amountDue)}</Text>
            </div>
          </div>

          {/* Payment Form */}
          <FormField
            label="Payment Amount ($)"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            min="0"
            max={invoice.amountDue}
            step="0.01"
            required
          />

          <FormField
            label="Payment Method"
            as="select"
            value={formData.method}
            onChange={(e) => setFormData({ ...formData, method: e.target.value })}
            options={paymentMethods}
            required
          />

          <FormField
            label="Payment Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <FormField
            label="Reference/Transaction ID"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            placeholder="Check number, transaction ID, etc."
          />

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
              disabled={loading || formData.amount <= 0 || formData.amount > invoice.amountDue}
              className="px-6 py-2 bg-success text-white rounded-lg hover:bg-success-dark transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Icon name="Loader2" className="animate-spin mr-2" size={16} />
                  Recording...
                </>
              ) : (
                'Record Payment'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}