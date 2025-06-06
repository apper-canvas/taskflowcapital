import React from 'react'
import Text from '@/components/atoms/Text'
import SidebarFilterItem from '@/components/molecules/SidebarFilterItem'

export default function ProjectFilter({ projects, tasks, selectedProject, setSelectedProject }) {
  return (
    <div>
      <Text as="h3" className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Projects</Text>
      <div className="space-y-1">
        <SidebarFilterItem
          label="All Projects"
          count={tasks?.length || 0}
          color="bg-surface-400"
          isSelected={selectedProject === 'all'}
          onClick={() => setSelectedProject('all')}
          isAll={true}
        />
        {projects?.map(project => {
          const projectTasks = tasks?.filter(task => task.projectId === project.id) || []
          return (
            <SidebarFilterItem
              key={project.id}
              label={project.name}
              count={projectTasks.length}
              color={project.color}
              isSelected={selectedProject === project.id}
              onClick={() => setSelectedProject(project.id)}
            />
          )
        })}
      </div>
    </div>
  )
}