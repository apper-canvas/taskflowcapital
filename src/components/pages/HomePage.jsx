import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { format, isPast, isToday } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import MainHeader from '@/components/organisms/MainHeader'
import QuickAddBar from '@/components/organisms/QuickAddBar'
import TaskDetailModal from '@/components/organisms/TaskDetailModal'
import ProjectDetailModal from '@/components/organisms/ProjectDetailModal'
import TimerWidget from '@/components/organisms/TimerWidget'
import ListTemplate from '@/components/templates/ListTemplate'
import CalendarTemplate from '@/components/templates/CalendarTemplate'
import { taskService, projectService } from '@/services'
export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false)
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [view, setView] = useState('list') // 'list' or 'calendar'
  const [selectedProject, setSelectedProject] = useState('all')
  const [viewMode, setViewMode] = useState('list')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date())
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
const [selectedProjectData, setSelectedProjectData] = useState(null)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [quickAddData, setQuickAddData] = useState({
    title: '',
    projectId: '',
    priority: 'medium',
    dueDate: ''
  })

  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'medium',
    status: 'todo',
    dueDate: ''
  })

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

  const handleQuickAdd = async () => {
    if (!quickAddData.title.trim()) return

    try {
      const taskData = {
        ...quickAddData,
        description: '',
        status: 'todo',
        timeSpent: 0,
        dueDate: quickAddData.dueDate || format(new Date(), 'yyyy-MM-dd')
      }

      const createdTask = await taskService.create(taskData)
      setTasks(prev => [...(prev || []), createdTask])
      setQuickAddData({ title: '', projectId: '', priority: 'medium', dueDate: '' })
      setShowQuickAdd(false)
      toast.success('Task created successfully')
    } catch (err) {
      toast.error('Failed to create task')
    }
  }

  const openTaskModal = (task = null) => {
    if (task) {
      setSelectedTask(task)
      setNewTaskData({
        title: task.title || '',
        description: task.description || '',
        projectId: task.projectId || '',
        priority: task.priority || 'medium',
        status: task.status || 'todo',
        dueDate: task.dueDate || format(new Date(), 'yyyy-MM-dd')
      })
    } else {
      setSelectedTask(null)
      setNewTaskData({
        title: '',
        description: '',
        projectId: '',
        priority: 'medium',
        status: 'todo',
        dueDate: format(new Date(), 'yyyy-MM-dd')
      })
    }
    setShowTaskModal(true)
  }

  const closeTaskModal = () => {
    setShowTaskModal(false)
    setSelectedTask(null)
  }

  const openProjectModal = (project = null) => {
    setSelectedProjectData(project)
    setShowProjectModal(true)
  }

  const closeProjectModal = () => {
    setShowProjectModal(false)
    setSelectedProjectData(null)
  }

const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTaskData.title.trim()) return

    try {
      const taskData = {
        ...newTaskData,
        timeSpent: 0,
        dueDate: newTaskData.dueDate || format(new Date(), 'yyyy-MM-dd')
      }

      const createdTask = await taskService.create(taskData)
      setTasks(prev => [...(prev || []), createdTask])
      setNewTaskData({
        title: '',
        description: '',
        projectId: '',
        priority: 'medium',
        status: 'todo',
        dueDate: ''
      })
      setShowTaskModal(false)
      toast.success('Task created successfully')
    } catch (err) {
      toast.error('Failed to create task')
    }
  }

const handleSaveProject = async (projectData) => {
    try {
      setLoading(true)
      let savedProject
      
      if (selectedProjectData) {
        savedProject = await projectService.update(selectedProjectData.id, projectData)
        setProjects(prev => prev.map(p => p.id === selectedProjectData.id ? savedProject : p))
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

  const handleSaveTask = async (taskData) => {
    try {
      let savedTask
      
      if (selectedTask) {
        savedTask = await taskService.update(selectedTask.id, taskData)
        setTasks(prev => prev.map(t => t.id === selectedTask.id ? savedTask : t))
        toast.success('Task updated successfully!')
      } else {
        savedTask = await taskService.create(taskData)
        setTasks(prev => [...prev, savedTask])
        toast.success('Task created successfully!')
      }
      
      closeTaskModal()
    } catch (error) {
      console.error('Error saving task:', error)
      toast.error('Failed to save task')
    }
  }

const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(id)
        setTasks(prev => prev.filter(task => task.id !== id))
        toast.success('Task deleted successfully')
      } catch (err) {
        toast.error('Failed to delete task')
      }
    }
  }

  const handleUpdateTask = async (e) => {
    e.preventDefault()
    if (!selectedTask || !newTaskData.title.trim()) return

    try {
      const updatedTask = await taskService.update(selectedTask.id, newTaskData)
      setTasks(prev => prev?.map(task => task.id === selectedTask.id ? updatedTask : task) || [])
      setShowTaskModal(false)
      setSelectedTask(null)
      toast.success('Task updated successfully')
    } catch (err) {
      toast.error('Failed to update task')
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
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
        view={view}
        setView={setView}
      />

      <div className="h-[calc(100vh-4rem)]">

<main className="w-full overflow-hidden flex flex-col">
          <QuickAddBar
            showQuickAdd={showQuickAdd}
            setShowQuickAdd={setShowQuickAdd}
            quickAddData={quickAddData}
            setQuickAddData={setQuickAddData}
            projects={projects}
            handleQuickAdd={handleQuickAdd}
            openTaskModal={openTaskModal}
            openProjectModal={openProjectModal}
          />

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {view === 'list' ? (
                  <ListTemplate
                    tasks={filteredTasks}
                    onTaskClick={openTaskModal}
                    onToggleComplete={handleTaskUpdate}
                    getProjectById={getProjectById}
                    getPriorityColor={getPriorityColor}
                    getStatusColor={getStatusColor}
                  />
                ) : (
                  <CalendarTemplate
                    tasks={filteredTasks}
                    currentDate={currentCalendarDate}
                    setCurrentDate={setCurrentCalendarDate}
                    onTaskClick={openTaskModal}
                    getProjectById={getProjectById}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <TimerWidget />
{/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={showTaskModal}
        onClose={closeTaskModal}
        task={selectedTask}
        projects={projects}
        onSave={handleSaveTask}
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        isOpen={showProjectModal}
        onClose={closeProjectModal}
        project={selectedProjectData}
        onSave={handleSaveProject}
      />
    </div>
  )
}