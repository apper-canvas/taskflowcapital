import React from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'

export default function QuickAddForm({
  quickAddData,
  setQuickAddData,
  projects,
  handleQuickAdd,
  onCancel
}) {
  return (
    <motion.form
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      onSubmit={handleQuickAdd}
      className="space-y-3"
    >
      <div className="flex gap-3">
        <Input
          type="text"
          placeholder="What needs to be done?"
          value={quickAddData.title}
          onChange={(e) => setQuickAddData(prev => ({ ...prev, title: e.target.value }))}
          className="flex-1"
          autoFocus
        />
        <Select
          value={quickAddData.projectId}
          onChange={(e) => setQuickAddData(prev => ({ ...prev, projectId: e.target.value }))}
        >
          <option value="">Select Project</option>
          {projects?.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select
            value={quickAddData.priority}
            onChange={(e) => setQuickAddData(prev => ({ ...prev, priority: e.target.value }))}
            className="px-3 py-1 text-sm bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
          <Input
            type="date"
            value={quickAddData.dueDate}
            onChange={(e) => setQuickAddData(prev => ({ ...prev, dueDate: e.target.value }))}
            className="px-3 py-1 text-sm bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 text-sm text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-4 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark"
          >
            Add Task
          </Button>
        </div>
      </div>
    </motion.form>
  )
}