import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import MainHeader from '@/components/organisms/MainHeader'
import Sidebar from '@/components/organisms/Sidebar'
import MobileSidebar from '@/components/organisms/MobileSidebar'
import ClientDetailModal from '@/components/organisms/ClientDetailModal'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Input from '@/components/atoms/Input'
import { clientService, projectService } from '@/services'

export default function ClientsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showClientModal, setShowClientModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
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
      const [clientsData, projectsData] = await Promise.all([
        clientService.getAll(),
        projectService.getAll()
      ])
      setClients(clientsData || [])
      setProjects(projectsData || [])
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load clients')
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

  const filteredClients = clients.filter(client => {
    const query = searchQuery.toLowerCase()
    return (
      client.name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.company.toLowerCase().includes(query)
    )
  })

  const openClientModal = (client = null) => {
    setSelectedClient(client)
    setShowClientModal(true)
  }

  const closeClientModal = () => {
    setShowClientModal(false)
    setSelectedClient(null)
  }

  const handleSaveClient = async (clientData) => {
    try {
      setLoading(true)
      let savedClient
      
      if (selectedClient) {
        savedClient = await clientService.update(selectedClient.id, clientData)
        setClients(prev => prev.map(c => c.id === selectedClient.id ? savedClient : c))
        toast.success('Client updated successfully!')
      } else {
        savedClient = await clientService.create(clientData)
        setClients(prev => [...prev, savedClient])
        toast.success('Client created successfully!')
      }
      
      closeClientModal()
    } catch (error) {
      console.error('Error saving client:', error)
      toast.error('Failed to save client')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientService.delete(clientId)
        setClients(prev => prev.filter(client => client.id !== clientId))
        toast.success('Client deleted successfully')
      } catch (err) {
        toast.error('Failed to delete client')
      }
    }
  }

  const getClientProjects = (client) => {
    return projects.filter(project => client.projectIds.includes(project.id))
  }

  if (loading && clients.length === 0) {
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
      />

      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          projects={projects}
          currentPage="clients"
        />

        <AnimatePresence>
          {!sidebarCollapsed && (
            <MobileSidebar
              sidebarCollapsed={sidebarCollapsed}
              setSidebarCollapsed={setSidebarCollapsed}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              projects={projects}
              currentPage="clients"
            />
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-surface-200 dark:border-surface-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Text as="h1" className="text-2xl font-bold text-surface-900 dark:text-white">
                    Clients
                  </Text>
                  <Text className="text-surface-600 dark:text-surface-400">
                    Manage your client relationships and contacts
                  </Text>
                </div>
                <Button
                  onClick={() => openClientModal()}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-2"
                >
                  <Icon name="Plus" size={16} />
                  Add Client
                </Button>
              </div>

              {/* Search */}
              <div className="relative max-w-md">
                <Icon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
                />
                <Input
                  type="text"
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {/* Client Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredClients.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Icon name="Users" size={48} className="text-surface-400 mb-4" />
                  <Text className="text-surface-600 dark:text-surface-400 mb-2">
                    {searchQuery ? 'No clients found' : 'No clients yet'}
                  </Text>
                  <Text className="text-surface-500 dark:text-surface-500 text-sm mb-4">
                    {searchQuery ? 'Try adjusting your search terms' : 'Get started by adding your first client'}
                  </Text>
                  {!searchQuery && (
                    <Button
                      onClick={() => openClientModal()}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
                    >
                      Add First Client
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredClients.map((client) => {
                    const clientProjects = getClientProjects(client)
                    return (
                      <motion.div
                        key={client.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <Text as="h3" className="font-semibold text-surface-900 dark:text-white mb-1">
                                {client.name}
                              </Text>
                              <Text className="text-surface-600 dark:text-surface-400 text-sm">
                                {client.company}
                              </Text>
                            </div>
                            <Badge
                              className={`${
                                client.isActive
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400'
                              }`}
                            >
                              {client.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2">
                              <Icon name="Mail" size={14} className="text-surface-400" />
                              <Text className="text-sm text-surface-600 dark:text-surface-400 truncate">
                                {client.email}
                              </Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="Phone" size={14} className="text-surface-400" />
                              <Text className="text-sm text-surface-600 dark:text-surface-400">
                                {client.phone}
                              </Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="Briefcase" size={14} className="text-surface-400" />
                              <Text className="text-sm text-surface-600 dark:text-surface-400">
                                {clientProjects.length} Project{clientProjects.length !== 1 ? 's' : ''}
                              </Text>
                            </div>
                          </div>

                          {client.notes && (
                            <Text className="text-sm text-surface-600 dark:text-surface-400 mb-4 line-clamp-2">
                              {client.notes}
                            </Text>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t border-surface-100 dark:border-surface-700">
                            <Text className="text-xs text-surface-500 dark:text-surface-500">
                              Added {format(new Date(client.dateAdded), 'MMM d, yyyy')}
                            </Text>
                            <div className="flex items-center gap-1">
                              <Button
                                onClick={() => openClientModal(client)}
                                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg"
                                title="Edit client"
                              >
                                <Icon name="Edit2" size={14} />
                              </Button>
                              <Button
                                onClick={() => handleDeleteClient(client.id)}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg"
                                title="Delete client"
                              >
                                <Icon name="Trash2" size={14} />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Client Detail Modal */}
      <ClientDetailModal
        isOpen={showClientModal}
        onClose={closeClientModal}
        client={selectedClient}
        projects={projects}
        onSave={handleSaveClient}
      />
    </div>
  )
}