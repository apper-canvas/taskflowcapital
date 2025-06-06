import React from 'react'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import ViewToggle from '@/components/molecules/ViewToggle'

export default function MainHeader({ toggleSidebar, toggleDarkMode, darkMode, view, setView }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-surface-800/95 backdrop-blur-sm border-b border-surface-200 dark:border-surface-700">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <div className="flex items-center gap-4">
          <Button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
          >
            <Icon name="Menu" size={20} />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Icon name="CheckSquare" size={16} className="text-white" />
            </div>
            <Text as="h1" className="text-xl font-heading font-semibold text-surface-900 dark:text-white">
              TaskFlow Pro
            </Text>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ViewToggle currentView={view} setView={setView} />
          <Button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
          >
            <Icon
              name={darkMode ? "Sun" : "Moon"}
              size={18}
              className="text-surface-600 dark:text-surface-300"
            />
          </Button>
        </div>
      </div>
    </header>
  )
}