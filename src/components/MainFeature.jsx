import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns'
import ApperIcon from './ApperIcon'
import taskService from '../services/api/taskService'
import projectService from '../services/api/projectService'

export default function MainFeature({ 
  view, 
  tasks, 
  projects, 
  onTaskUpdate, 
  onTasksChange,
  getProjectById,
  getPriorityColor,
  getStatusColor 
}) {
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [quickAddData, setQuickAddData] = useState({
    title: '',
    projectId: '',
    priority: 'medium',
    dueDate: ''
  })

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'medium',
    status: 'todo',
    dueDate: ''
  })

  const handleQuickAdd = async (e) => {
    e.preventDefault()
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
      onTasksChange(prev => [...(prev || []), createdTask])
      setQuickAddData({ title: '', projectId: '', priority: 'medium', dueDate: '' })
      setShowQuickAdd(false)
      toast.success('Task created successfully')
    } catch (err) {
      toast.error('Failed to create task')
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) return

    try {
      const taskData = {
        ...newTask,
        timeSpent: 0,
        dueDate: newTask.dueDate || format(new Date(), 'yyyy-MM-dd')
      }
      
      const createdTask = await taskService.create(taskData)
      onTasksChange(prev => [...(prev || []), createdTask])
      setNewTask({
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

  const handleUpdateTask = async (e) => {
    e.preventDefault()
    if (!selectedTask || !newTask.title.trim()) return

    try {
      const updatedTask = await taskService.update(selectedTask.id, newTask)
      onTasksChange(prev => prev?.map(task => task.id === selectedTask.id ? updatedTask : task) || [])
      setShowTaskModal(false)
      setSelectedTask(null)
      toast.success('Task updated successfully')
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId)
      onTasksChange(prev => prev?.filter(task => task.id !== taskId) || [])
      setShowTaskModal(false)
      setSelectedTask(null)
      toast.success('Task deleted successfully')
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  const openTaskModal = (task = null) => {
    if (task) {
      setSelectedTask(task)
      setNewTask({
        title: task.title || '',
        description: task.description || '',
        projectId: task.projectId || '',
        priority: task.priority || 'medium',
        status: task.status || 'todo',
        dueDate: task.dueDate || ''
      })
    } else {
      setSelectedTask(null)
      setNewTask({
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

  const getTasksForDate = (date) => {
    return tasks?.filter(task => 
      isSameDay(new Date(task.dueDate), date)
    ) || []
  }

  const renderCalendarView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-semibold text-surface-900 dark:text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              <ApperIcon name="ChevronLeft" size={16} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              <ApperIcon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-surface-200 dark:bg-surface-700 rounded-lg overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-surface-100 dark:bg-surface-800 p-3 text-center">
              <span className="text-sm font-medium text-surface-600 dark:text-surface-400">{day}</span>
            </div>
          ))}
          {days.map(day => {
            const dayTasks = getTasksForDate(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isCurrentDay = isToday(day)
            
            return (
              <div
                key={day.toISOString()}
                className={`bg-white dark:bg-surface-800 p-3 h-24 ${
                  isCurrentMonth ? '' : 'opacity-40'
                } ${isCurrentDay ? 'ring-2 ring-primary' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm ${
                    isCurrentDay 
                      ? 'font-semibold text-primary' 
                      : 'text-surface-700 dark:text-surface-300'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-xs bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
                      {dayTasks.length}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {dayTasks.slice(0, 2).map(task => {
                    const project = getProjectById(task.projectId)
                    return (
                      <div
                        key={task.id}
                        className="text-xs p-1 rounded cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-700"
                        onClick={() => openTaskModal(task)}
                        style={{ borderLeft: `3px solid ${project.color}` }}
                      >
                        <div className="truncate">{task.title}</div>
                      </div>
                    )
                  })}
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-surface-500 dark:text-surface-400">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderListView = () => {
    const groupedTasks = tasks?.reduce((groups, task) => {
      const status = task.status || 'todo'
      if (!groups[status]) groups[status] = []
      groups[status].push(task)
      return groups
    }, {}) || {}

    const statusOrder = ['todo', 'in-progress', 'review', 'complete']
    const statusLabels = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'review': 'Review',
      'complete': 'Complete'
    }

    return (
      <div className="p-6">
        <div className="space-y-6">
          {statusOrder.map(status => {
            const statusTasks = groupedTasks[status] || []
            if (statusTasks.length === 0) return null

            return (
              <div key={status}>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                    {statusLabels[status]}
                  </h3>
                  <span className="text-sm text-surface-500 dark:text-surface-400">
                    {statusTasks.length} tasks
                  </span>
                </div>
                <div className="space-y-2">
                  {statusTasks.map(task => {
                    const project = getProjectById(task.projectId)
                    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'complete'
                    
                    return (
                      <motion.div
                        key={task.id}
                        layout
                        className="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 p-4 hover:shadow-card transition-shadow cursor-pointer"
                        onClick={() => openTaskModal(task)}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const newStatus = task.status === 'complete' ? 'todo' : 'complete'
                              onTaskUpdate(task.id, { status: newStatus })
                            }}
                            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              task.status === 'complete'
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-surface-300 dark:border-surface-600 hover:border-primary'
                            }`}
                          >
                            {task.status === 'complete' && (
                              <ApperIcon name="Check" size={12} />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h4 className={`font-medium truncate ${
                                  task.status === 'complete'
                                    ? 'line-through text-surface-500 dark:text-surface-400'
                                    : 'text-surface-900 dark:text-white'
                                }`}>
                                  {task.title}
                                </h4>
                                {task.description && (
                                  <p className="text-sm text-surface-600 dark:text-surface-400 mt-1 line-clamp-2">
                                    {task.description}
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                                  {task.status.replace('-', ' ')}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-3 text-sm text-surface-500 dark:text-surface-400">
                              <div className="flex items-center gap-1">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: project.color }}
                                />
                                <span>{project.name}</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <ApperIcon name="Calendar" size={14} />
                                <span className={isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                                  {format(new Date(task.dueDate), 'MMM d')}
                                </span>
                              </div>
                              
                              {task.timeSpent > 0 && (
                                <div className="flex items-center gap-1">
                                  <ApperIcon name="Clock" size={14} />
                                  <span>{Math.round(task.timeSpent / 60)}h</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Quick Add Bar */}
      <div className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 p-4">
        <AnimatePresence>
          {showQuickAdd ? (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleQuickAdd}
              className="space-y-3"
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={quickAddData.title}
                  onChange={(e) => setQuickAddData(prev => ({ ...prev, title: e.target.value }))}
                  className="flex-1 px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  autoFocus
                />
                <select
                  value={quickAddData.projectId}
                  onChange={(e) => setQuickAddData(prev => ({ ...prev, projectId: e.target.value }))}
                  className="px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select Project</option>
                  {projects?.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <select
                    value={quickAddData.priority}
                    onChange={(e) => setQuickAddData(prev => ({ ...prev, priority: e.target.value }))}
                    className="px-3 py-1 text-sm bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <input
                    type="date"
                    value={quickAddData.dueDate}
                    onChange={(e) => setQuickAddData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="px-3 py-1 text-sm bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowQuickAdd(false)}
                    className="px-3 py-1 text-sm text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </motion.form>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowQuickAdd(true)}
                className="flex items-center gap-2 px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors"
              >
                <ApperIcon name="Plus" size={16} />
                <span>Quick add task...</span>
              </button>
              <button
                onClick={() => openTaskModal()}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <ApperIcon name="Plus" size={16} />
                <span className="hidden sm:inline">New Task</span>
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {view === 'list' ? renderListView() : renderCalendarView()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowTaskModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-card w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-white">
                    {selectedTask ? 'Edit Task' : 'Create Task'}
                  </h3>
                  <button
                    onClick={() => setShowTaskModal(false)}
                    className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <ApperIcon name="X" size={16} />
                  </button>
                </div>

                <form onSubmit={selectedTask ? handleUpdateTask : handleCreateTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Project
                      </label>
                      <select
                        value={newTask.projectId}
                        onChange={(e) => setNewTask(prev => ({ ...prev, projectId: e.target.value }))}
                        className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="">Select Project</option>
                        {projects?.map(project => (
                          <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Priority
                      </label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Status
                      </label>
                      <select
                        value={newTask.status}
                        onChange={(e) => setNewTask(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="complete">Complete</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    {selectedTask && (
                      <button
                        type="button"
                        onClick={() => handleDeleteTask(selectedTask.id)}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    )}
                    <div className="flex items-center gap-3 ml-auto">
                      <button
                        type="button"
                        onClick={() => setShowTaskModal(false)}
                        className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        {selectedTask ? 'Update' : 'Create'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}