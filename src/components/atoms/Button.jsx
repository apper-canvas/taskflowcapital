import React from 'react'

export default function Button({ children, onClick, className = '', type = 'button', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`transition-colors duration-200 ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}