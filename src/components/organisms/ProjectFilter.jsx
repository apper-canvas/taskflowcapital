import React from 'react'
import Text from '@/components/atoms/Text'
import ProjectFilterDropdown from '@/components/organisms/ProjectFilterDropdown'

export default function ProjectFilter({ 
  projects, 
  tasks, 
  selectedProject, 
  setSelectedProject,
  selectedProjects,
  setSelectedProjects,
  variant = 'sidebar', // 'sidebar' or 'dropdown'
  multiSelect = false
}) {
  // Handle both single and multi-select modes
  const isMultiSelect = multiSelect && selectedProjects && setSelectedProjects
  
  // Convert single selection to array for dropdown compatibility
  const currentSelection = isMultiSelect ? selectedProjects : (selectedProject === 'all' ? ['all'] : [selectedProject])
  
  const handleSelectionChange = (projects) => {
    if (isMultiSelect) {
      setSelectedProjects(projects)
    } else {
      if (projects.includes('all') || projects.length === 0) {
        setSelectedProject('all')
      } else {
        setSelectedProject(projects[0])
      }
    }
  }

  // Multi-select checkbox handlers
  const handleSelectAll = () => {
    if (!isMultiSelect) return
    
    const allProjectIds = projects?.map(p => p.id) || []
    const isAllSelected = allProjectIds.every(id => selectedProjects.includes(id))
    
    if (isAllSelected) {
      setSelectedProjects([])
    } else {
      setSelectedProjects(allProjectIds)
    }
  }

  const handleProjectToggle = (projectId) => {
    if (!isMultiSelect) {
      setSelectedProject(projectId)
      return
    }
    
    const newSelection = selectedProjects.includes(projectId)
      ? selectedProjects.filter(id => id !== projectId)
      : [...selectedProjects, projectId]
    
    setSelectedProjects(newSelection)
  }

  const getCheckboxState = (projectId = null) => {
    if (!isMultiSelect) return false
    
    if (projectId === null) {
      // "Select All" checkbox
      const allProjectIds = projects?.map(p => p.id) || []
      const selectedCount = allProjectIds.filter(id => selectedProjects.includes(id)).length
      
      if (selectedCount === 0) return 'unchecked'
      if (selectedCount === allProjectIds.length) return 'checked'
      return 'indeterminate'
    }
    
    return selectedProjects.includes(projectId) ? 'checked' : 'unchecked'
  }

if (variant === 'dropdown') {
    return (
      <ProjectFilterDropdown
        projects={projects}
        tasks={tasks}
        selectedProjects={currentSelection}
        setSelectedProjects={handleSelectionChange}
        className="mb-6"
      />
    )
  }

  // Enhanced sidebar design with multi-select support
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Text as="h3" className="text-sm font-medium text-surface-700 dark:text-surface-300">
          Projects
        </Text>
        {isMultiSelect && (
          <Text className="text-xs text-surface-500 dark:text-surface-400">
            {selectedProjects.length} selected
          </Text>
        )}
      </div>
      
      <div className="space-y-1">
        {/* Select All option for multi-select */}
        {isMultiSelect && (
          <div
            onClick={handleSelectAll}
            className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-surface-100 dark:hover:bg-surface-700"
          >
<div className="relative">
              <input
                type="checkbox"
                checked={getCheckboxState() === 'checked'}
                onChange={() => {}}
                className={`checkbox-custom pointer-events-none ${
                  getCheckboxState() === 'indeterminate' ? 'checkbox-indeterminate' : ''
                }`}
                readOnly
              />
            </div>
            <Text className="text-sm font-medium flex-1 text-surface-700 dark:text-surface-300">
              Select All
            </Text>
            <Text className="text-xs text-surface-500">{tasks?.length || 0}</Text>
          </div>
        )}
        
        {/* All Projects option (for single select) */}
        {!isMultiSelect && (
          <div
            onClick={() => setSelectedProject('all')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
              selectedProject === 'all'
                ? 'bg-primary/10 text-primary'
                : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-surface-400" />
            <Text className="text-sm font-medium flex-1">All Projects</Text>
            <Text className="text-xs">{tasks?.length || 0}</Text>
          </div>
        )}
        
        {/* Project list */}
        {projects?.map(project => {
          const projectTasks = tasks?.filter(task => task.projectId === project.id) || []
          const isSelected = isMultiSelect 
            ? selectedProjects.includes(project.id)
            : selectedProject === project.id
          
return (
            <div
              key={project.id}
              onClick={() => handleProjectToggle(project.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                isSelected && !isMultiSelect
                  ? 'bg-primary/10 text-primary'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
              } ${isSelected && isMultiSelect ? 'bg-primary/5' : ''}`}
            >
              {isMultiSelect ? (
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={getCheckboxState(project.id) === 'checked'}
                    onChange={() => {}}
                    className="checkbox-custom pointer-events-none"
                    readOnly
                  />
                </div>
              ) : (
                <div className={`w-3 h-3 rounded-full ${project.color}`} />
              )}
              
              <Text className={`text-sm font-medium flex-1 ${
                isSelected && isMultiSelect ? 'text-surface-800 dark:text-surface-200' : ''
              }`}>
                {project.name}
              </Text>
              
              <Text className={`text-xs ${
                isSelected && isMultiSelect ? 'text-surface-600 dark:text-surface-400' : 'text-surface-500'
              }`}>
                {projectTasks.length}
              </Text>
            </div>
          )
        })}
        
        {/* Empty state message for multi-select */}
        {isMultiSelect && selectedProjects.length === 0 && (
          <div className="px-3 py-2 text-center">
            <Text className="text-xs text-surface-500 dark:text-surface-400 italic">
              No projects selected. Select projects to filter tasks.
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}