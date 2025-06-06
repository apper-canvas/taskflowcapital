import React from 'react'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'

export default function ViewToggle({ currentView, setView }) {
  const buttonClass = (viewName) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
      currentView === viewName
        ? 'bg-white dark:bg-surface-600 text-surface-900 dark:text-white shadow-sm'
        : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white'
    }`

  return (
    <div className="hidden sm:flex bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
      <Button onClick={() => setView('list')} className={buttonClass('list')}>
        <Icon name="List" size={16} />
      </Button>
      <Button onClick={() => setView('calendar')} className={buttonClass('calendar')}>
        <Icon name="Calendar" size={16} />
      </Button>
    </div>
  )
}