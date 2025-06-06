import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import MainHeader from '../organisms/MainHeader'
import Sidebar from '../organisms/Sidebar'
import MobileSidebar from '../organisms/MobileSidebar'
import ProjectDetailModal from '../organisms/ProjectDetailModal'
import TimerWidget from '../organisms/TimerWidget'
import Card from '../atoms/Card'
import Text from '../atoms/Text'
import Button from '../atoms/Button'
import Icon from '../atoms/Icon'
import Badge from '../atoms/Badge'
import ProjectDot from '../atoms/ProjectDot'
import { projectService, taskService } from '../../services'

export default function ProjectsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ])
      setProjects(projectsData || [])
      setTasks(tasksData || [])
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const filteredProjects = projects?.filter(project => {
    if (!searchQuery) return true
    return project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  }) || []

  const getProjectTaskCount = (projectId) => {
    return tasks?.filter(task => task.projectId === projectId).length || 0
  }

  const getProjectCompletedTasks = (projectId) => {
    return tasks?.filter(task => task.projectId === projectId && task.status === 'complete').length || 0
  }

  const openProjectModal = (project = null) => {
    setSelectedProject(project)
    setShowProjectModal(true)
  }

  const closeProjectModal = () => {
    setShowProjectModal(false)
    setSelectedProject(null)
  }

  const handleSaveProject = async (projectData) => {
    try {
      setLoading(true)
      let savedProject
      
      if (selectedProject) {
        savedProject = await projectService.update(selectedProject.id, projectData)
        setProjects(prev => prev.map(p => p.id === selectedProject.id ? savedProject : p))
        toast.success('Project updated successfully!')
      } else {
        savedProject = await projectService.create(projectData)
        setProjects(prev => [...prev, savedProject])
        toast.success('Project created successfully!')
      }
      
      closeProjectModal()
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error('Failed to save project')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await projectService.delete(projectId)
        setProjects(prev => prev.filter(p => p.id !== projectId))
        toast.success('Project deleted successfully')
      } catch (err) {
        toast.error('Failed to delete project')
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      case 'on-hold': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      case 'completed': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
      case 'cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      default: return 'text-surface-600 bg-surface-100 dark:bg-surface-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <MainHeader
        toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
        view="list"
        setView={() => {}}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          urgentTasks={[]}
          todayTasks={[]}
          projects={projects}
          tasks={tasks}
          selectedProject="all"
          setSelectedProject={() => {}}
          currentPage="projects"
        />

        <AnimatePresence>
          {!sidebarCollapsed && (
            <MobileSidebar
              sidebarCollapsed={sidebarCollapsed}
              setSidebarCollapsed={setSidebarCollapsed}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              urgentTasks={[]}
              todayTasks={[]}
              projects={projects}
              tasks={tasks}
              selectedProject="all"
              setSelectedProject={() => {}}
              currentPage="projects"
            />
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800">
            <div className="flex items-center justify-between">
              <div>
                <Text as="h1" className="text-2xl font-heading font-bold text-surface-900 dark:text-white">
                  Projects
                </Text>
                <Text className="text-surface-600 dark:text-surface-400 mt-1">
                  Manage your projects and track progress
                </Text>
              </div>
              <Button
                onClick={() => openProjectModal()}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-2"
              >
                <Icon name="Plus" size={16} />
                New Project
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="FolderOpen" size={48} className="mx-auto text-surface-400 dark:text-surface-500 mb-4" />
                <Text as="h3" className="text-lg font-medium text-surface-900 dark:text-white mb-2">
                  No projects found
                </Text>
                <Text className="text-surface-600 dark:text-surface-400 mb-6">
                  Get started by creating your first project
                </Text>
                <Button
                  onClick={() => openProjectModal()}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
                >
                  Create Project
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                  const taskCount = getProjectTaskCount(project.id)
                  const completedTasks = getProjectCompletedTasks(project.id)
                  const progress = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0

                  return (
                    <motion.div
                      key={project.id}
                      layout
                      className="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 p-6 hover:shadow-card transition-shadow cursor-pointer"
                      onClick={() => openProjectModal(project)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <ProjectDot color={project.color} size="lg" />
                          <div>
                            <Text as="h3" className="font-medium text-surface-900 dark:text-white">
                              {project.name}
                            </Text>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteProject(project.id)
                          }}
                          className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded text-surface-400 hover:text-red-600"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>

                      {project.description && (
                        <Text className="text-sm text-surface-600 dark:text-surface-400 mb-4 line-clamp-2">
                          {project.description}
                        </Text>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <Text className="text-surface-600 dark:text-surface-400">Progress</Text>
                          <Text className="font-medium text-surface-900 dark:text-white">{progress}%</Text>
                        </div>
                        <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                          <motion.div
                            className="bg-primary rounded-full h-2"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm text-surface-600 dark:text-surface-400">
                          <div className="flex items-center gap-1">
                            <Icon name="CheckSquare" size={14} />
                            <Text>{completedTasks}/{taskCount} tasks</Text>
                          </div>
                          {project.dueDate && (
                            <div className="flex items-center gap-1">
                              <Icon name="Calendar" size={14} />
                              <Text>{new Date(project.dueDate).toLocaleDateString()}</Text>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      <TimerWidget />

      <ProjectDetailModal
        isOpen={showProjectModal}
        onClose={closeProjectModal}
        project={selectedProject}
        onSave={handleSaveProject}
      />
    </div>
  )
}