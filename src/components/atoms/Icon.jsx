import React from 'react'
import ApperIcon from '@/components/ApperIcon'

export default function Icon({ name, size, className = '' }) {
  return <ApperIcon name={name} size={size} className={className} />
}