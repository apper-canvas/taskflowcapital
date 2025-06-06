import React from 'react'
import ListViewSection from '@/components/organisms/ListViewSection'

export default function ListTemplate({
  tasks,
  onTaskClick,
  onToggleComplete,
  getProjectById,
  getPriorityColor,
  getStatusColor
}) {
  const groupedTasks = tasks?.reduce((groups, task) => {
    const status = task.status || 'todo'
    if (!groups[status]) groups[status] = []
    groups[status].push(task)
    return groups
  }, {}) || {}

  const statusOrder = ['todo', 'in-progress', 'review', 'complete']

  return (
    <div className="p-6">
      <div className="space-y-6">
        {statusOrder.map(status => {
          const statusTasks = groupedTasks[status] || []
          return (
            <ListViewSection
              key={status}
              status={status}
              tasks={statusTasks}
              onTaskClick={onTaskClick}
              onToggleComplete={onToggleComplete}
              getProjectById={getProjectById}
              getPriorityColor={getPriorityColor}
              getStatusColor={getStatusColor}
            />
          )
        })}
      </div>
    </div>
  )
}