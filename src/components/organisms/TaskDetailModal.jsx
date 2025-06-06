import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
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
  if (!showModal) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={() => setShowModal(false)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-surface-800 rounded-xl shadow-card w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Text as="h3" className="text-xl font-semibold text-surface-900 dark:text-white">
              {selectedTask ? 'Edit Task' : 'Create Task'}
            </Text>
            <Button
              onClick={() => setShowModal(false)}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>

          <form onSubmit={selectedTask ? handleUpdate : handleCreate} className="space-y-4">
            <FormField
              label="Title"
              value={newTaskData.title}
              onChange={(e) => setNewTaskData(prev => ({ ...prev, title: e.target.value }))}
              required
            />

            <FormField
              label="Description"
              as="textarea"
              value={newTaskData.description}
              onChange={(e) => setNewTaskData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Project"
                as="select"
                value={newTaskData.projectId}
                onChange={(e) => setNewTaskData(prev => ({ ...prev, projectId: e.target.value }))}
                options={[{ value: '', label: 'Select Project' }, ...(projects || []).map(p => ({ value: p.id, label: p.name }))]}
              />

              <FormField
                label="Priority"
                as="select"
                value={newTaskData.priority}
                onChange={(e) => setNewTaskData(prev => ({ ...prev, priority: e.target.value }))}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' }
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Status"
                as="select"
                value={newTaskData.status}
                onChange={(e) => setNewTaskData(prev => ({ ...prev, status: e.target.value }))}
                options={[
                  { value: 'todo', label: 'To Do' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'review', label: 'Review' },
                  { value: 'complete', label: 'Complete' }
                ]}
              />

              <FormField
                label="Due Date"
                type="date"
                value={newTaskData.dueDate}
                onChange={(e) => setNewTaskData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              {selectedTask && (
                <Button
                  type="button"
                  onClick={() => handleDelete(selectedTask.id)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  Delete
                </Button>
              )}
              <div className="flex items-center gap-3 ml-auto">
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  {selectedTask ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}