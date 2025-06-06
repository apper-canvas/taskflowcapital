import React from 'react'
import { format } from 'date-fns'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'

export default function CalendarHeader({ currentDate, setCurrentDate }) {
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <Text as="h2" className="text-2xl font-heading font-semibold text-surface-900 dark:text-white">
        {format(currentDate, 'MMMM yyyy')}
      </Text>
      <div className="flex items-center gap-2">
        <Button onClick={goToPreviousMonth} className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700">
          <Icon name="ChevronLeft" size={16} />
        </Button>
        <Button onClick={goToToday} className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark">
          Today
        </Button>
        <Button onClick={goToNextMonth} className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700">
          <Icon name="ChevronRight" size={16} />
        </Button>
      </div>
    </div>
  )
}