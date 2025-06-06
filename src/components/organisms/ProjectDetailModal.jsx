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
    isActive: true,
    timeline: {
      startDate: '',
      endDate: '',
      duration: 0
    },
    milestones: [],
    attachments: []
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
        isActive: project.isActive !== undefined ? project.isActive : true,
        timeline: project.timeline || {
          startDate: '',
          endDate: '',
          duration: 0
        },
        milestones: project.milestones || [],
        attachments: project.attachments || []
      })
    } else {
      setFormData({
        name: '',
        client: '',
        description: '',
        color: PROJECT_COLORS[0],
        isActive: true,
        timeline: {
          startDate: '',
          endDate: '',
          duration: 0
        },
        milestones: [],
        attachments: []
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

  const updateTimelineData = (field, value) => {
    setFormData(prev => {
      const newTimeline = { ...prev.timeline, [field]: value }
      
      // Calculate duration if both dates are provided
      if (newTimeline.startDate && newTimeline.endDate) {
        const start = new Date(newTimeline.startDate)
        const end = new Date(newTimeline.endDate)
        const diffTime = Math.abs(end - start)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        newTimeline.duration = diffDays
      }
      
      return { ...prev, timeline: newTimeline }
    })
  }

  const addMilestone = () => {
    const newMilestone = {
      id: Date.now().toString(),
      name: '',
      description: '',
      dueDate: '',
      completed: false
    }
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }))
  }

  const updateMilestone = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map(milestone =>
        milestone.id === id ? { ...milestone, [field]: value } : milestone
      )
    }))
  }

  const removeMilestone = (id) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(milestone => milestone.id !== id)
    }))
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const newAttachments = files.map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString()
    }))
    
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }))
  }

  const removeAttachment = (id) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(attachment => attachment.id !== id)
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

          {/* Project Timeline */}
          <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
            <Text className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
              Project Timeline
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Start Date"
                type="date"
                value={formData.timeline.startDate}
                onChange={(e) => updateTimelineData('startDate', e.target.value)}
              />
              <FormField
                label="End Date"
                type="date"
                value={formData.timeline.endDate}
                onChange={(e) => updateTimelineData('endDate', e.target.value)}
              />
            </div>
            {formData.timeline.duration > 0 && (
              <Text className="text-sm text-surface-600 dark:text-surface-400 mt-2">
                Project Duration: {formData.timeline.duration} days
              </Text>
            )}
          </div>

          {/* Milestones */}
          <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
            <div className="flex items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-surface-900 dark:text-white">
                Milestones
              </Text>
              <Button
                type="button"
                onClick={addMilestone}
                className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm"
              >
                <Icon name="Plus" size={16} className="mr-1" />
                Add Milestone
              </Button>
            </div>
            
            {formData.milestones.length === 0 ? (
              <Text className="text-surface-500 dark:text-surface-400 text-sm italic">
                No milestones added yet. Click "Add Milestone" to create one.
              </Text>
            ) : (
              <div className="space-y-4">
                {formData.milestones.map((milestone) => (
                  <div key={milestone.id} className="border border-surface-200 dark:border-surface-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <FormField
                        label="Milestone Name"
                        value={milestone.name}
                        onChange={(e) => updateMilestone(milestone.id, 'name', e.target.value)}
                        placeholder="Enter milestone name"
                        className="flex-1 mr-2"
                      />
                      <Button
                        type="button"
                        onClick={() => removeMilestone(milestone.id)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <FormField
                        label="Due Date"
                        type="date"
                        value={milestone.dueDate}
                        onChange={(e) => updateMilestone(milestone.id, 'dueDate', e.target.value)}
                      />
                      <div className="flex items-center justify-between pt-6">
                        <Text className="text-sm font-medium text-surface-700 dark:text-surface-300">
                          Completed
                        </Text>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={milestone.completed}
                            onChange={(e) => updateMilestone(milestone.id, 'completed', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer dark:bg-surface-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-surface-600 peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                    
                    <FormField
                      label="Description"
                      as="textarea"
                      rows={2}
                      value={milestone.description}
                      onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                      placeholder="Enter milestone description"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* File Attachments */}
          <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
            <Text className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
              File Attachments
            </Text>
            
            <div className="border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Icon name="Upload" size={32} className="text-surface-400 mb-2" />
                <Text className="text-surface-600 dark:text-surface-400">
                  Click to upload files or drag and drop
                </Text>
                <Text className="text-surface-500 dark:text-surface-500 text-sm mt-1">
                  PDF, DOC, XLS, PPT, Images (Max 10MB each)
                </Text>
              </label>
            </div>
            
            {formData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <Text className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Uploaded Files ({formData.attachments.length})
                </Text>
                {formData.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-2 bg-surface-50 dark:bg-surface-700 rounded-lg">
                    <div className="flex items-center">
                      <Icon name="File" size={16} className="text-surface-500 mr-2" />
                      <div>
                        <Text className="text-sm font-medium text-surface-900 dark:text-white">
                          {attachment.name}
                        </Text>
                        <Text className="text-xs text-surface-500 dark:text-surface-400">
                          {(attachment.size / 1024 / 1024).toFixed(2)} MB
                        </Text>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeAttachment(attachment.id)}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
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