import React from 'react'
import { eachDayOfInterval } from 'date-fns'
import CalendarDay from '@/components/molecules/CalendarDay'

export default function CalendarGrid({ currentDate, tasks, onTaskClick, getProjectById }) {
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getTasksForDate = (date) => {
    return tasks?.filter(task =>
      new Date(task.dueDate).toDateString() === date.toDateString()
    ) || []
  }

  return (
    <div className="grid grid-cols-7 gap-px bg-surface-200 dark:bg-surface-700 rounded-lg overflow-hidden">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="bg-surface-100 dark:bg-surface-800 p-3 text-center">
          <span className="text-sm font-medium text-surface-600 dark:text-surface-400">{day}</span>
        </div>
      ))}
      {days.map(day => (
        <CalendarDay
          key={day.toISOString()}
          day={day}
          tasks={getTasksForDate(day)}
          currentMonth={currentDate}
          onTaskClick={onTaskClick}
          getProjectById={getProjectById}
        />
      ))}
    </div>
  )
}