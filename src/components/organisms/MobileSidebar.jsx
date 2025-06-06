import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import Input from '@/components/atoms/Input'
import SidebarQuickStat from '@/components/molecules/SidebarQuickStat'
import ProjectFilter from './ProjectFilter'

export default function MobileSidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
  searchQuery,
  setSearchQuery,
  urgentTasks,
  todayTasks,
  projects,
  tasks,
  selectedProject,
  setSelectedProject
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="lg:hidden fixed inset-0 z-40 bg-black/50"
      onClick={() => setSidebarCollapsed(true)}
    >
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        exit={{ x: -280 }}
        className="w-280 h-full bg-white dark:bg-surface-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Text as="h2" className="font-semibold text-surface-900 dark:text-white">Menu</Text>
            <Button
              onClick={() => setSidebarCollapsed(true)}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Icon
              name="Search"
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400"
            />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2"
            />
          </div>

          {/* Quick Stats */}
          <div className="space-y-2">
            <SidebarQuickStat
              iconName="AlertTriangle"
              iconColor="text-red-600"
              text={`${urgentTasks?.length || 0} Overdue`}
              bgColor="bg-red-50 dark:bg-red-900/20"
            />
            <SidebarQuickStat
              iconName="Calendar"
              iconColor="text-blue-600"
              text={`${todayTasks?.length || 0} Due Today`}
              bgColor="bg-blue-50 dark:bg-blue-900/20"
            />
          </div>

          {/* Projects Filter */}
          <ProjectFilter
            projects={projects}
            tasks={tasks}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}