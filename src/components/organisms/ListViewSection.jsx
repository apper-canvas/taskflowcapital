import React from 'react'
import TaskCard from '@/components/molecules/TaskCard'
import Text from '@/components/atoms/Text'

export default function ListViewSection({
  status,
  tasks,
  onTaskClick,
  onToggleComplete,
  getProjectById,
  getPriorityColor,
  getStatusColor
}) {
  const statusLabels = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'review': 'Review',
    'complete': 'Complete'
  }

  if (tasks.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <Text as="h3" className="text-lg font-semibold text-surface-900 dark:text-white">
          {statusLabels[status]}
        </Text>
        <Text as="span" className="text-sm text-surface-500 dark:text-surface-400">
          {tasks.length} tasks
        </Text>
      </div>
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onTaskClick={onTaskClick}
            onToggleComplete={onToggleComplete}
            getProjectById={getProjectById}
            getPriorityColor={getPriorityColor}
            getStatusColor={getStatusColor}
          />
        ))}
      </div>
    </div>
  )
}