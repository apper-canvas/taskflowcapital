import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import Badge from '@/components/atoms/Badge'
import ProjectDot from '@/components/atoms/ProjectDot'

const COLUMN_CONFIG = [
  { id: 'todo', title: 'To Do', color: 'bg-surface-100 dark:bg-surface-700' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-primary/10' },
  { id: 'review', title: 'Review', color: 'bg-warning/10' },
  { id: 'done', title: 'Done', color: 'bg-success/10' }
]

export default function KanbanBoard({ tasks, projects, onTaskUpdate, onTaskClick }) {
  const [columns, setColumns] = useState({})

  useEffect(() => {
    // Group tasks by status
    const groupedTasks = COLUMN_CONFIG.reduce((acc, column) => {
      acc[column.id] = tasks.filter(task => task.status === column.id)
      return acc
    }, {})
    
    setColumns(groupedTasks)
  }, [tasks])

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const task = tasks.find(t => t.id === draggableId)
    if (!task) return

    // Update task status
    const updatedTask = {
      ...task,
      status: destination.droppableId
    }

    try {
      await onTaskUpdate(updatedTask)
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const getProjectInfo = (projectId) => {
    return projects.find(p => p.id === projectId) || { name: 'No Project', color: '#94a3b8' }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'primary'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {COLUMN_CONFIG.map((column) => (
          <div key={column.id} className="flex flex-col">
            <div className={`p-4 rounded-t-lg ${column.color}`}>
              <div className="flex items-center justify-between">
                <Text className="font-semibold text-surface-900 dark:text-white">
                  {column.title}
                </Text>
                <Badge variant="primary" className="text-xs">
                  {columns[column.id]?.length || 0}
                </Badge>
              </div>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 p-2 space-y-3 min-h-[400px] border-x border-b border-surface-200 dark:border-surface-700 rounded-b-lg transition-colors ${
                    snapshot.isDraggingOver 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'bg-surface-50 dark:bg-surface-800/50'
                  }`}
                >
                  {(columns[column.id] || []).map((task, index) => {
                    const project = getProjectInfo(task.projectId)
                    
                    return (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-lg ${
                              snapshot.isDragging 
                                ? 'rotate-3 shadow-xl ring-2 ring-primary/20' 
                                : 'hover:scale-105'
                            }`}
                            onClick={() => onTaskClick(task)}
                          >
                            <div className="space-y-3">
                              {/* Task Header */}
                              <div className="flex items-start justify-between gap-2">
                                <Text className="font-medium text-surface-900 dark:text-white line-clamp-2 flex-1">
                                  {task.title}
                                </Text>
                                <Badge variant={getPriorityColor(task.priority)} className="text-xs shrink-0">
                                  {task.priority}
                                </Badge>
                              </div>

                              {/* Task Description */}
                              {task.description && (
                                <Text className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2">
                                  {task.description}
                                </Text>
                              )}

                              {/* Project Info */}
                              <div className="flex items-center gap-2">
                                <ProjectDot color={project.color} size="sm" />
                                <Text className="text-xs text-surface-500 dark:text-surface-400 truncate">
                                  {project.name}
                                </Text>
                              </div>

                              {/* Task Footer */}
                              <div className="flex items-center justify-between text-xs text-surface-500 dark:text-surface-400">
                                <div className="flex items-center gap-2">
                                  {task.dueDate && (
                                    <div className="flex items-center gap-1">
                                      <Icon name="Calendar" size={12} />
                                      <span className={
                                        new Date(task.dueDate) < new Date() 
                                          ? 'text-danger' 
                                          : ''
                                      }>
                                        {formatDate(task.dueDate)}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  {task.assignee && (
                                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                      <Text className="text-[10px] font-semibold text-white">
                                        {task.assignee.split(' ').map(n => n[0]).join('')}
                                      </Text>
                                    </div>
                                  )}
                                  
                                  {task.attachments && task.attachments.length > 0 && (
                                    <div className="flex items-center gap-1">
                                      <Icon name="Paperclip" size={12} />
                                      <span>{task.attachments.length}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Progress Bar (if applicable) */}
                              {task.progress !== undefined && (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <Text className="text-surface-600 dark:text-surface-400">Progress</Text>
                                    <Text className="text-surface-600 dark:text-surface-400">{task.progress}%</Text>
                                  </div>
                                  <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-1.5">
                                    <div 
                                      className="bg-primary rounded-full h-1.5 transition-all duration-300"
                                      style={{ width: `${task.progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}

                  {/* Empty State */}
                  {(!columns[column.id] || columns[column.id].length === 0) && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Icon 
                        name="Plus" 
                        size={32} 
                        className="text-surface-300 dark:text-surface-600 mb-2" 
                      />
                      <Text className="text-surface-400 dark:text-surface-500 text-sm">
                        No tasks in {column.title.toLowerCase()}
                      </Text>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}