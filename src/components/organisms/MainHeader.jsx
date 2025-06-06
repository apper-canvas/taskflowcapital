import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import ViewToggle from '@/components/molecules/ViewToggle'

export default function MainHeader({ toggleSidebar, toggleDarkMode, darkMode, view, setView }) {
  const location = useLocation()

const navItems = [
    { path: '/projects', label: 'Projects', icon: 'FolderOpen' },
    { path: '/', label: 'Tasks', icon: 'CheckSquare' },
    { path: '/clients', label: 'Clients', icon: 'Users' }
  ]

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

        {/* Page Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="hidden lg:flex items-center gap-2 bg-surface-100 dark:bg-surface-700 rounded-lg px-3 py-2 min-w-[240px]">
            <Icon name="Search" size={16} className="text-surface-400 dark:text-surface-500" />
            <input
              type="text"
              placeholder="Search tasks, projects..."
              className="bg-transparent text-sm text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 outline-none flex-1"
            />
          </div>

          <ViewToggle currentView={view} setView={setView} />
          
          {/* User Profile */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <Text className="text-xs font-semibold text-white">JD</Text>
            </div>
          </div>

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

      {/* Mobile Navigation */}
      <nav className="md:hidden border-t border-surface-200 dark:border-surface-700 px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-surface-600 dark:text-surface-300'
                }`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}