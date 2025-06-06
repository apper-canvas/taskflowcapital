import React from 'react'
import { format, isToday, isSameMonth } from 'date-fns'
import Text from '@/components/atoms/Text'
import ProjectDot from '@/components/atoms/ProjectDot'

export default function CalendarDay({ day, tasks, currentMonth, onTaskClick, getProjectById }) {
  const dayTasks = tasks || []
  const isCurrentMonth = isSameMonth(day, currentMonth)
  const isCurrentDay = isToday(day)

  return (
    <div
      className={`bg-white dark:bg-surface-800 p-3 h-24 ${
        isCurrentMonth ? '' : 'opacity-40'
      } ${isCurrentDay ? 'ring-2 ring-primary' : ''}`}
    >
      <div className="flex items-center justify-between mb-1">
        <Text as="span" className={`text-sm ${
          isCurrentDay
            ? 'font-semibold text-primary'
            : 'text-surface-700 dark:text-surface-300'
        }`}>
          {format(day, 'd')}
        </Text>
        {dayTasks.length > 0 && (
          <span className="text-xs bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
            {dayTasks.length}
          </span>
        )}
      </div>
      <div className="space-y-1">
        {dayTasks.slice(0, 2).map(task => {
          const project = getProjectById(task.projectId)
          return (
            <div
              key={task.id}
              className="text-xs p-1 rounded cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-700"
              onClick={() => onTaskClick(task)}
              style={{ borderLeft: `3px solid ${project.color}` }}
            >
              <div className="truncate">{task.title}</div>
            </div>
          )
        })}
        {dayTasks.length > 2 && (
          <Text as="div" className="text-xs text-surface-500 dark:text-surface-400">
            +{dayTasks.length - 2} more
          </Text>
        )}
      </div>
    </div>
  )
}