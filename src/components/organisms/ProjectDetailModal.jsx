import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import FormField from '@/components/molecules/FormField'

const PROJECT_COLORS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#ef4444',
  '#8b5cf6', '#06b6d4', '#f97316', '#84cc16', '#f43f5e'
]

export default function ProjectDetailModal({ 
  isOpen, 
  onClose, 
  project, 
  onSave 
}) {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    description: '',
    color: PROJECT_COLORS[0],
    isActive: true
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        client: project.client || '',
        description: project.description || '',
        color: project.color || PROJECT_COLORS[0],
        isActive: project.isActive !== undefined ? project.isActive : true
      })
    } else {
      setFormData({
        name: '',
        client: '',
        description: '',
        color: PROJECT_COLORS[0],
        isActive: true
      })
    }
    setErrors({})
  }, [project, isOpen])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required'
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
      onClose()
    } catch (error) {
      console.error('Error saving project:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-surface-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Text as="h2" className="text-xl font-semibold text-surface-900 dark:text-white">
            {project ? 'Edit Project' : 'Create New Project'}
          </Text>
          <Button
            onClick={onClose}
            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div>
            <FormField
              label="Project Name *"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              placeholder="Enter project name"
              required
            />
            {errors.name && (
              <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>
            )}
          </div>

          {/* Client */}
          <FormField
            label="Client"
            value={formData.client}
            onChange={(e) => updateFormData('client', e.target.value)}
            placeholder="Enter client name"
          />

          {/* Description */}
          <FormField
            label="Description"
            as="textarea"
            rows={3}
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="Enter project description"
          />

          {/* Color Picker */}
          <div>
            <Text className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Project Color
            </Text>
            <div className="flex gap-2 flex-wrap">
              {PROJECT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateFormData('color', color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color
                      ? 'border-surface-900 dark:border-white'
                      : 'border-surface-300 dark:border-surface-600'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-surface-700 dark:text-surface-300">
              Active Project
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
              {loading ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}