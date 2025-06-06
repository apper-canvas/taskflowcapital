import React from 'react'

export default function ProjectDot({ color, className = '' }) {
  return (
    <div className={`w-3 h-3 rounded-full ${className}`} style={{ backgroundColor: color }} />
  )
}