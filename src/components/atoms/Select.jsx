import React from 'react'

export default function Select({ children, value, onChange, className = '' }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
    >
      {children}
    </select>
  )
}