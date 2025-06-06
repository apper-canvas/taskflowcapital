import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Target, User, Folder, Tag, Flag, CheckCircle, Calendar } from 'lucide-react'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'

export default function TaskDetailModal({
  showModal,
  setShowModal,
  selectedTask,
  newTaskData,
  setNewTaskData,
  projects,
  handleCreate,
  handleUpdate,
  handleDelete
}) {
  const isEditing = Boolean(selectedTask)

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'completed', label: 'Completed' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ]

  const categoryOptions = [
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'writing', label: 'Writing' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'other', label: 'Other' }
  ]

  const projectOptions = [
    { value: '', label: 'Select Project' },
    ...(projects?.map(project => ({
      value: project.id,
      label: `${project.name} (${project.clientName})`
    })) || [])
  ]

  const getSelectedProject = () => {
    return projects?.find(p => p.id === newTaskData.projectId)
  }

  const getTimeProgress = () => {
    if (!newTaskData.timeEstimated || newTaskData.timeEstimated === 0) return 0
    return Math.min((newTaskData.timeSpent || 0) / newTaskData.timeEstimated * 100, 100)
  }

  const formatTime = (minutes) => {
    if (!minutes) return '0h 0m'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing) {
      handleUpdate(e)
    } else {
      handleCreate(e)
    }
  }

  const selectedProject = getSelectedProject()

  return (
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl mx-4 bg-white dark:bg-surface-800 rounded-xl shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                  {isEditing ? 'Edit Task' : 'Create New Task'}
                </h2>
                <Button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                >
                  <X size={20} />
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-surface-900 dark:text-white flex items-center gap-2">
                  <Target size={20} />
                  Basic Information
                </h3>
                
                <FormField
                  label="Task Title"
                  type="text"
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title..."
                  required
                />

                <FormField
                  label="Description"
                  as="textarea"
                  rows={3}
                  value={newTaskData.description}
                  onChange={(e) => setNewTaskData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the task..."
                />
              </div>

              {/* Project & Client */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-surface-900 dark:text-white flex items-center gap-2">
                  <User size={20} />
                  Project & Client
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Project"
                    as="select"
                    value={newTaskData.projectId}
                    onChange={(e) => setNewTaskData(prev => ({ ...prev, projectId: e.target.value }))}
                    options={projectOptions}
                    required
                  />
                  
                  {selectedProject && (
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Client
                      </label>
                      <div className="px-3 py-2 bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg text-surface-900 dark:text-white">
                        {selectedProject.clientName}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Categorization */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-surface-900 dark:text-white flex items-center gap-2">
                  <Tag size={20} />
                  Categorization
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    label="Category"
                    as="select"
                    value={newTaskData.category}
                    onChange={(e) => setNewTaskData(prev => ({ ...prev, category: e.target.value }))}
                    options={categoryOptions}
                    required
                  />
                  
                  <FormField
                    label="Priority"
                    as="select"
                    value={newTaskData.priority}
                    onChange={(e) => setNewTaskData(prev => ({ ...prev, priority: e.target.value }))}
                    options={priorityOptions}
                  />
                  
                  <FormField
                    label="Status"
                    as="select"
                    value={newTaskData.status}
                    onChange={(e) => setNewTaskData(prev => ({ ...prev, status: e.target.value }))}
                    options={statusOptions}
                  />
                </div>
              </div>

              {/* Time Management */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-surface-900 dark:text-white flex items-center gap-2">
                  <Clock size={20} />
                  Time Management
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Time Estimated (minutes)"
                    type="number"
                    value={newTaskData.timeEstimated || ''}
                    onChange={(e) => setNewTaskData(prev => ({ ...prev, timeEstimated: parseInt(e.target.value) || 0 }))}
                    placeholder="120"
                  />
                  
                  <FormField
                    label="Due Date"
                    type="date"
                    value={newTaskData.dueDate}
                    onChange={(e) => setNewTaskData(prev => ({ ...prev, dueDate: e.target.value }))}
                    required
                  />
                </div>

                {/* Time Progress Display */}
                {(newTaskData.timeEstimated > 0 || newTaskData.timeSpent > 0) && (
                  <div className="bg-surface-50 dark:bg-surface-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                        Time Progress
                      </span>
                      <span className="text-sm text-surface-600 dark:text-surface-400">
                        {formatTime(newTaskData.timeSpent || 0)} / {formatTime(newTaskData.timeEstimated || 0)}
                      </span>
                    </div>
                    <div className="w-full bg-surface-200 dark:bg-surface-600 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getTimeProgress()}%` }}
                      />
                    </div>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                      {getTimeProgress().toFixed(1)}% completed
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-surface-200 dark:border-surface-700">
                <div>
                  {isEditing && (
                    <Button
                      type="button"
                      onClick={() => handleDelete(selectedTask.id)}
                      className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Delete Task
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    {isEditing ? 'Update Task' : 'Create Task'}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}