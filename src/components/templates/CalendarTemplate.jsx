import React from 'react'
import CalendarHeader from '@/components/organisms/CalendarHeader'
import CalendarGrid from '@/components/organisms/CalendarGrid'

export default function CalendarTemplate({ currentDate, setCurrentDate, tasks, onTaskClick, getProjectById }) {
  return (
    <div className="p-6">
      <CalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />
      <CalendarGrid
        currentDate={currentDate}
        tasks={tasks}
        onTaskClick={onTaskClick}
        getProjectById={getProjectById}
      />
    </div>
  )
}