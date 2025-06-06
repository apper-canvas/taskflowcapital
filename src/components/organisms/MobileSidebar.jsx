import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ProjectFilter from '@/components/organisms/ProjectFilter'
export default function MobileSidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
  searchQuery,
  setSearchQuery,
  urgentTasks = [],
  todayTasks = [],
  projects = [],
  tasks = [],
  selectedProject,
  setSelectedProject,
  currentPage = 'home'
}) {
  const location = useLocation()

  if (sidebarCollapsed) return null

const navigationItems = [
    { path: '/clients', label: 'Clients', icon: 'Users' },
    { path: '/', label: 'Tasks', icon: 'CheckSquare' }
  ]
  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSidebarCollapsed(true)}
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
      />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -280, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-16 bottom-0 w-70 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 z-50 lg:hidden flex flex-col"
      >
        {/* Navigation */}
        <div className="p-4 border-b border-surface-200 dark:border-surface-700">
          <Text as="h3" className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">
            Navigation
          </Text>
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarCollapsed(true)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary text-white'
                    : 'text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700'
                }`}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-surface-200 dark:border-surface-700">
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
            />
            <Input
              type="text"
              placeholder={currentPage === 'clients' ? 'Search clients...' : 'Search tasks...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
</div>

        {/* Project Filter - only show on tasks page */}
        {currentPage !== 'clients' && (
          <div className="flex-1 overflow-y-auto p-4">
            <ProjectFilter
              projects={projects}
              tasks={tasks}
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
            />
          </div>
        )}
        {/* Footer */}
        <div className="p-4 border-t border-surface-200 dark:border-surface-700">
          <Button
            onClick={() => setSidebarCollapsed(true)}
            className="w-full flex items-center justify-center gap-2 p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg"
          >
            <Icon name="X" size={16} />
            <Text className="text-sm">Close</Text>
          </Button>
        </div>
      </motion.aside>
    </>
  )
}