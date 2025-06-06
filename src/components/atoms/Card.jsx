import React from 'react'

export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-surface-800 rounded-lg shadow-sm ${className}`}>
      {children}
    </div>
  )
}