import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import taskService from '../services/api/taskService'
import projectService from '../services/api/projectService'
import { format, isToday, isPast } from 'date-fns'

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [view, setView] = useState('list') // 'list' or 'calendar'
  const [selectedProject, setSelectedProject] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ])
      setTasks(tasksData || [])
      setProjects(projectsData || [])
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load data')
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

  const filteredTasks = tasks?.filter(task => {
    const matchesProject = selectedProject === 'all' || task.projectId === selectedProject
    const matchesSearch = !searchQuery || 
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesProject && matchesSearch
  }) || []

  const getProjectById = (id) => projects?.find(p => p.id === id) || { name: 'Unknown Project', color: '#6b7280' }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      case 'medium': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      default: return 'text-surface-600 bg-surface-100 dark:bg-surface-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'text-surface-600 bg-surface-100 dark:bg-surface-800'
      case 'in-progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
      case 'review': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'
      case 'complete': return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      default: return 'text-surface-600 bg-surface-100 dark:bg-surface-800'
    }
  }

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates)
      setTasks(prev => prev?.map(task => task.id === taskId ? updatedTask : task) || [])
      toast.success('Task updated successfully')
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const urgentTasks = filteredTasks?.filter(task => 
    isPast(new Date(task.dueDate)) && task.status !== 'complete'
  ) || []

  const todayTasks = filteredTasks?.filter(task => 
    isToday(new Date(task.dueDate))
  ) || []

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-surface-800/95 backdrop-blur-sm border-b border-surface-200 dark:border-surface-700">
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <ApperIcon name="CheckSquare" size={16} className="text-white" />
              </div>
              <h1 className="text-xl font-heading font-semibold text-surface-900 dark:text-white">
                TaskFlow Pro
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="hidden sm:flex bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  view === 'list' 
                    ? 'bg-white dark:bg-surface-600 text-surface-900 dark:text-white shadow-sm' 
                    : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white'
                }`}
              >
                <ApperIcon name="List" size={16} />
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  view === 'calendar' 
                    ? 'bg-white dark:bg-surface-600 text-surface-900 dark:text-white shadow-sm' 
                    : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white'
                }`}
              >
                <ApperIcon name="Calendar" size={16} />
              </button>
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            >
              <ApperIcon 
                name={darkMode ? "Sun" : "Moon"} 
                size={18} 
                className="text-surface-600 dark:text-surface-300" 
              />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarCollapsed ? 0 : 280 }}
          className="hidden lg:block bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 overflow-hidden"
        >
          <div className="p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <ApperIcon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
              />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Quick Stats */}
            <div className="space-y-2">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <ApperIcon name="AlertTriangle" size={16} className="text-red-600" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">
                    {urgentTasks?.length || 0} Overdue
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Calendar" size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {todayTasks?.length || 0} Due Today
                  </span>
                </div>
              </div>
            </div>

            {/* Projects Filter */}
            <div>
              <h3 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Projects</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedProject('all')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedProject === 'all'
                      ? 'bg-primary text-white'
                      : 'hover:bg-surface-50 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-surface-400" />
                  <span className="text-sm">All Projects</span>
                  <span className="ml-auto text-xs opacity-75">{tasks?.length || 0}</span>
                </button>
                {projects?.map(project => {
                  const projectTasks = tasks?.filter(task => task.projectId === project.id) || []
                  return (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedProject === project.id
                          ? 'bg-primary text-white'
                          : 'hover:bg-surface-50 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                      }`}
                    >
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="text-sm truncate">{project.name}</span>
                      <span className="ml-auto text-xs opacity-75">{projectTasks.length}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {!sidebarCollapsed && (
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
                    <h2 className="font-semibold text-surface-900 dark:text-white">Menu</h2>
                    <button
                      onClick={() => setSidebarCollapsed(true)}
                      className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                    >
                      <ApperIcon name="X" size={16} />
                    </button>
                  </div>
                  {/* Same content as desktop sidebar */}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <MainFeature 
            view={view}
            tasks={filteredTasks}
            projects={projects}
            onTaskUpdate={handleTaskUpdate}
            onTasksChange={setTasks}
            getProjectById={getProjectById}
            getPriorityColor={getPriorityColor}
            getStatusColor={getStatusColor}
          />
        </main>
      </div>

      {/* Floating Timer Widget */}
      <div className="fixed bottom-6 right-6 z-30">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="glassmorphism dark:glassmorphism-dark rounded-xl p-4 shadow-card"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <ApperIcon name="Play" size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-surface-900 dark:text-white">
                No active timer
              </div>
              <div className="text-xs text-surface-500 dark:text-surface-400">
                Click to start tracking
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}