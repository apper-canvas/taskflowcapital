import React from 'react'

export default function Text({ children, className = '', as = 'p' }) {
  const Component = as
  return <Component className={className}>{children}</Component>
}