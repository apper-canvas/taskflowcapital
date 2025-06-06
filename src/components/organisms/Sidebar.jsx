import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ProjectFilter from '@/components/organisms/ProjectFilter'
function Sidebar({
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

const navigationItems = [
    { path: '/clients', label: 'Clients', icon: 'Users' },
    { path: '/', label: 'Tasks', icon: 'CheckSquare' }
  ]
  return (
    <AnimatePresence>
      {!sidebarCollapsed && (
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-70 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 hidden lg:flex flex-col h-full"
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
              <Icon name="ChevronLeft" size={16} />
              <Text className="text-sm">Collapse</Text>
            </Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

// Collapsed Sidebar
export function CollapsedSidebar({ setSidebarCollapsed }) {
  const location = useLocation()

const navigationItems = [
    { path: '/clients', label: 'Clients', icon: 'Users' },
    { path: '/', label: 'Tasks', icon: 'CheckSquare' }
  ]
  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-16 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 hidden lg:flex flex-col items-center py-4 h-full"
    >
      <Button
        onClick={() => setSidebarCollapsed(false)}
        className="p-3 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg mb-4"
      >
        <Icon name="ChevronRight" size={16} />
      </Button>
      
      <div className="flex flex-col gap-3">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`p-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-primary text-white'
                : 'hover:bg-surface-100 dark:hover:bg-surface-700'
            }`}
            title={item.label}
          >
            <Icon name={item.icon} size={16} />
          </Link>
        ))}
      </div>
    </motion.aside>
  )
}

// Main Sidebar Component
export default function MainSidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
  searchQuery,
  setSearchQuery,
  urgentTasks,
  todayTasks,
  projects,
  tasks,
  selectedProject,
  setSelectedProject,
  currentPage
}) {
  return (
    <>
      {sidebarCollapsed ? (
        <CollapsedSidebar setSidebarCollapsed={setSidebarCollapsed} />
      ) : (
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          urgentTasks={urgentTasks}
          todayTasks={todayTasks}
          projects={projects}
          tasks={tasks}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          currentPage={currentPage}
        />
      )}
    </>
  )
}
// Additional collapsed state component

// Re-export for backwards compatibility
export { Sidebar }