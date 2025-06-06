import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import FormField from '@/components/molecules/FormField'
import Select from '@/components/atoms/Select'

export default function ClientDetailModal({ 
  isOpen, 
  onClose, 
  client, 
  projects = [],
  onSave 
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    isActive: true,
    projectIds: [],
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        company: client.company || '',
        address: client.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'USA'
        },
        isActive: client.isActive !== undefined ? client.isActive : true,
        projectIds: client.projectIds || [],
        notes: client.notes || ''
      })
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'USA'
        },
        isActive: true,
        projectIds: [],
        notes: ''
      })
    }
    setErrors({})
  }, [client, isOpen])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      await onSave(formData)
    } catch (error) {
      console.error('Error saving client:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleProjectSelection = (projectId) => {
    setFormData(prev => ({
      ...prev,
      projectIds: prev.projectIds.includes(projectId)
        ? prev.projectIds.filter(id => id !== projectId)
        : [...prev.projectIds, projectId]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-surface-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Text as="h2" className="text-xl font-semibold text-surface-900 dark:text-white">
            {client ? 'Edit Client' : 'Add New Client'}
          </Text>
          <Button
            onClick={onClose}
            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
              Basic Information
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormField
                  label="Client Name *"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Enter client name"
                  required
                />
                {errors.name && (
                  <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>
                )}
              </div>
              
              <div>
                <FormField
                  label="Company *"
                  value={formData.company}
                  onChange={(e) => updateFormData('company', e.target.value)}
                  placeholder="Enter company name"
                  required
                />
                {errors.company && (
                  <Text className="text-red-500 text-sm mt-1">{errors.company}</Text>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
              Contact Information
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormField
                  label="Email Address *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="Enter email address"
                  required
                />
                {errors.email && (
                  <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
                )}
              </div>
              
              <FormField
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
              Address
            </Text>
            <div className="space-y-4">
              <FormField
                label="Street Address"
                value={formData.address.street}
                onChange={(e) => updateFormData('address.street', e.target.value)}
                placeholder="Enter street address"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="City"
                  value={formData.address.city}
                  onChange={(e) => updateFormData('address.city', e.target.value)}
                  placeholder="Enter city"
                />
                
                <FormField
                  label="State"
                  value={formData.address.state}
                  onChange={(e) => updateFormData('address.state', e.target.value)}
                  placeholder="Enter state"
                />
                
                <FormField
                  label="ZIP Code"
                  value={formData.address.zipCode}
                  onChange={(e) => updateFormData('address.zipCode', e.target.value)}
                  placeholder="Enter ZIP code"
                />
              </div>
              
              <FormField
                label="Country"
                value={formData.address.country}
                onChange={(e) => updateFormData('address.country', e.target.value)}
                placeholder="Enter country"
              />
            </div>
          </div>

          {/* Project Associations */}
          {projects.length > 0 && (
            <div>
              <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
                Associated Projects
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {projects.map((project) => (
                  <label key={project.id} className="flex items-center gap-2 p-2 hover:bg-surface-50 dark:hover:bg-surface-700 rounded">
                    <input
                      type="checkbox"
                      checked={formData.projectIds.includes(project.id)}
                      onChange={() => handleProjectSelection(project.id)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <Text className="text-sm text-surface-700 dark:text-surface-300">
                        {project.name}
                      </Text>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <FormField
              label="Notes"
              as="textarea"
              rows={3}
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
              placeholder="Enter any additional notes about this client"
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-surface-700 dark:text-surface-300">
              Active Client
            </Text>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => updateFormData('isActive', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/50 rounded-full peer dark:bg-surface-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-surface-600 peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
            <Button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? 'Saving...' : (client ? 'Update Client' : 'Create Client')}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}