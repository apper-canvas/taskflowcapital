import React from 'react'
import { motion } from 'framer-motion'
import Icon from '@/components/atoms/Icon'
import Input from '@/components/atoms/Input'
import SidebarQuickStat from '@/components/molecules/SidebarQuickStat'
import ProjectFilter from './ProjectFilter'

export default function Sidebar({
  sidebarCollapsed,
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
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 0 : 280 }}
      className="hidden lg:block bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 overflow-hidden"
    >
      <div className="p-4 space-y-4">
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
    </motion.aside>
  )
}