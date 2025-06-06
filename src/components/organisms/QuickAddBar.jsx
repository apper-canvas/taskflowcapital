import React from 'react'
import { AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import QuickAddForm from '@/components/molecules/QuickAddForm'

export default function QuickAddBar({
  showQuickAdd,
  setShowQuickAdd,
  quickAddData,
  setQuickAddData,
  projects,
  handleQuickAdd,
  openTaskModal
}) {
  return (
    <div className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 p-4">
      <AnimatePresence>
        {showQuickAdd ? (
          <QuickAddForm
            quickAddData={quickAddData}
            setQuickAddData={setQuickAddData}
            projects={projects}
            handleQuickAdd={handleQuickAdd}
            onCancel={() => setShowQuickAdd(false)}
          />
        ) : (
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setShowQuickAdd(true)}
              className="flex items-center gap-2 px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white"
            >
              <Icon name="Plus" size={16} />
              <Text as="span">Quick add task...</Text>
            </Button>
            <Button
              onClick={() => openTaskModal()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              <Icon name="Plus" size={16} />
              <Text as="span" className="hidden sm:inline">New Task</Text>
            </Button>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}