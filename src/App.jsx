import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import HomePage from '@/components/pages/HomePage'
import ClientsPage from '@/components/pages/ClientsPage'
import NotFound from '@/pages/NotFound'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          toastClassName="text-sm"
          bodyClassName="text-sm"
          style={{
            fontSize: '14px'
          }}
        />
      </div>
    </Router>
  )
}

export default App