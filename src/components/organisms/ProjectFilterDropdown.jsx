import React, { useState, useRef, useEffect } from 'react'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import Button from '@/components/atoms/Button'
import ProjectDot from '@/components/atoms/ProjectDot'

export default function ProjectFilterDropdown({ 
  projects, 
  tasks, 
  selectedProjects, 
  setSelectedProjects,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter projects based on search query
  const filteredProjects = projects?.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  // Calculate task counts
  const getProjectTaskCount = (projectId) => {
    return tasks?.filter(task => task.projectId === projectId).length || 0
  }

  const getAllTasksCount = () => tasks?.length || 0

  // Handle project selection
  const handleProjectToggle = (projectId) => {
    if (projectId === 'all') {
      setSelectedProjects(['all'])
    } else {
      const currentSelected = selectedProjects.filter(id => id !== 'all')
      if (currentSelected.includes(projectId)) {
        const newSelected = currentSelected.filter(id => id !== projectId)
        setSelectedProjects(newSelected.length === 0 ? ['all'] : newSelected)
      } else {
        setSelectedProjects([...currentSelected, projectId])
      }
    }
  }

  // Clear all selections
  const handleClearAll = () => {
    setSelectedProjects(['all'])
  }

  // Select all projects
  const handleSelectAll = () => {
    const allProjectIds = projects?.map(p => p.id) || []
    setSelectedProjects(allProjectIds)
  }

  // Get display text for selected projects
  const getDisplayText = () => {
    if (selectedProjects.includes('all')) {
      return 'All Projects'
    }
    if (selectedProjects.length === 0) {
      return 'No projects selected'
    }
    if (selectedProjects.length === 1) {
      const project = projects?.find(p => p.id === selectedProjects[0])
      return project ? project.name : 'Unknown project'
    }
    return `${selectedProjects.length} projects selected`
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl hover:border-primary/30 dark:hover:border-primary/30 transition-colors ${
          isOpen ? 'border-primary dark:border-primary' : ''
        }`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Icon name="Filter" size={16} className="text-surface-500 dark:text-surface-400" />
            <Text className="text-sm font-medium text-surface-900 dark:text-white">
              Projects
            </Text>
          </div>
          <div className="h-4 w-px bg-surface-200 dark:bg-surface-700" />
          <Text className="text-sm text-surface-600 dark:text-surface-400 truncate">
            {getDisplayText()}
          </Text>
        </div>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`text-surface-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </Button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-lg z-50 max-h-80 overflow-hidden">
          {/* Search Bar */}
          <div className="p-3 border-b border-surface-200 dark:border-surface-700">
            <div className="relative">
              <Icon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 dark:text-surface-500" 
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg text-sm text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 outline-none focus:border-primary dark:focus:border-primary"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between p-3 border-b border-surface-200 dark:border-surface-700">
            <Button
              onClick={handleSelectAll}
              className="text-xs text-primary hover:text-primary-dark"
            >
              Select All
            </Button>
            <Button
              onClick={handleClearAll}
              className="text-xs text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
            >
              Clear All
            </Button>
          </div>

          {/* Project List */}
          <div className="max-h-48 overflow-y-auto">
            {/* All Projects Option */}
            <button
              onClick={() => handleProjectToggle('all')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors ${
                selectedProjects.includes('all') ? 'bg-primary/5 dark:bg-primary/10' : ''
              }`}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                selectedProjects.includes('all')
                  ? 'bg-primary border-primary'
                  : 'border-surface-300 dark:border-surface-600'
              }`}>
                {selectedProjects.includes('all') && (
                  <Icon name="Check" size={12} className="text-white" />
                )}
              </div>
              <ProjectDot color="bg-surface-400" />
              <div className="flex-1 text-left">
                <Text className="text-sm font-medium text-surface-900 dark:text-white">
                  All Projects
                </Text>
              </div>
              <Text className="text-xs text-surface-500 dark:text-surface-400">
                {getAllTasksCount()}
              </Text>
            </button>

            {/* Individual Projects */}
            {filteredProjects.map(project => {
              const isSelected = selectedProjects.includes(project.id)
              const taskCount = getProjectTaskCount(project.id)
              
              return (
                <button
                  key={project.id}
                  onClick={() => handleProjectToggle(project.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors ${
                    isSelected ? 'bg-primary/5 dark:bg-primary/10' : ''
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    isSelected
                      ? 'bg-primary border-primary'
                      : 'border-surface-300 dark:border-surface-600'
                  }`}>
                    {isSelected && (
                      <Icon name="Check" size={12} className="text-white" />
                    )}
                  </div>
                  <ProjectDot color={project.color} />
                  <div className="flex-1 text-left">
                    <Text className="text-sm font-medium text-surface-900 dark:text-white">
                      {project.name}
                    </Text>
                  </div>
                  <Text className="text-xs text-surface-500 dark:text-surface-400">
                    {taskCount}
                  </Text>
                </button>
              )
            })}

            {filteredProjects.length === 0 && searchQuery && (
              <div className="px-3 py-6 text-center">
                <Text className="text-sm text-surface-500 dark:text-surface-400">
                  No projects found
                </Text>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}