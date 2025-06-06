import React from 'react'
import { motion } from 'framer-motion'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'

export default function TimerWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-30">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="glassmorphism dark:glassmorphism-dark rounded-xl p-4 shadow-card"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Icon name="Play" size={16} className="text-white" />
          </div>
          <div>
            <Text as="div" className="text-sm font-medium text-surface-900 dark:text-white">
              No active timer
            </Text>
            <Text as="div" className="text-xs text-surface-500 dark:text-surface-400">
              Click to start tracking
            </Text>
          </div>
        </div>
      </motion.div>
    </div>
  )
}