import React from 'react'
import Text from '@/components/atoms/Text'
import ProjectFilterDropdown from '@/components/organisms/ProjectFilterDropdown'

export default function ProjectFilter({ 
  projects, 
  tasks, 
  selectedProject, 
  setSelectedProject,
  variant = 'sidebar' // 'sidebar' or 'dropdown'
}) {
  // Convert single selection to array for dropdown
  const selectedProjects = selectedProject === 'all' ? ['all'] : [selectedProject]
  
  const setSelectedProjects = (projects) => {
    if (projects.includes('all') || projects.length === 0) {
      setSelectedProject('all')
    } else {
      // For now, use the first selected project (maintaining single selection)
      setSelectedProject(projects[0])
    }
  }

  if (variant === 'dropdown') {
    return (
      <ProjectFilterDropdown
        projects={projects}
        tasks={tasks}
        selectedProjects={selectedProjects}
        setSelectedProjects={setSelectedProjects}
        className="mb-6"
      />
    )
  }

  // Fallback to original sidebar design for backward compatibility
  return (
    <div>
      <Text as="h3" className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Projects</Text>
      <div className="space-y-1">
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
        {projects?.map(project => {
          const projectTasks = tasks?.filter(task => task.projectId === project.id) || []
          return (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                selectedProject === project.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${project.color}`} />
              <Text className="text-sm font-medium flex-1">{project.name}</Text>
              <Text className="text-xs">{projectTasks.length}</Text>
            </div>
          )
        })}
      </div>
    </div>
  )
}