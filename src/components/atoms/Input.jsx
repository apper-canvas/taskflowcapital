import React from 'react'

export default function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  required = false,
  autoFocus = false
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
      required={required}
      autoFocus={autoFocus}
    />
  )
}