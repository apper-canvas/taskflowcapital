import React from 'react'
import { motion } from 'framer-motion'
import { format, isPast } from 'date-fns'
import Icon from '@/components/atoms/Icon'
import Badge from '@/components/atoms/Badge'
import ProjectDot from '@/components/atoms/ProjectDot'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'

export default function TaskCard({
  task,
  onTaskClick,
  onToggleComplete,
  getProjectById,
  getPriorityColor,
  getStatusColor
}) {
  const project = getProjectById(task.projectId)
  const isOverdue = isPast(new Date(task.dueDate)) && task.status !== 'complete'

  return (
    <motion.div
      layout
      className="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 p-4 hover:shadow-card transition-shadow cursor-pointer"
      onClick={() => onTaskClick(task)}
    >
      <div className="flex items-start gap-3">
        <Button
          onClick={(e) => {
            e.stopPropagation()
            const newStatus = task.status === 'complete' ? 'todo' : 'complete'
            onToggleComplete(task.id, { status: newStatus })
          }}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
            task.status === 'complete'
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-surface-300 dark:border-surface-600 hover:border-primary'
          }`}
        >
          {task.status === 'complete' && (
            <Icon name="Check" size={12} />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <Text as="h4" className={`font-medium truncate ${
                task.status === 'complete'
                  ? 'line-through text-surface-500 dark:text-surface-400'
                  : 'text-surface-900 dark:text-white'
              }`}>
                {task.title}
              </Text>
              {task.description && (
                <Text as="p" className="text-sm text-surface-600 dark:text-surface-400 mt-1 line-clamp-2">
                  {task.description}
                </Text>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Badge className={getStatusColor(task.status)}>
                {task.status.replace('-', ' ')}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm text-surface-500 dark:text-surface-400">
            <div className="flex items-center gap-1">
              <ProjectDot color={project.color} />
              <Text as="span">{project.name}</Text>
            </div>

            <div className="flex items-center gap-1">
              <Icon name="Calendar" size={14} />
              <Text as="span" className={isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                {format(new Date(task.dueDate), 'MMM d')}
              </Text>
            </div>

            {task.timeSpent > 0 && (
              <div className="flex items-center gap-1">
                <Icon name="Clock" size={14} />
                <Text as="span">{Math.round(task.timeSpent / 60)}h</Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}