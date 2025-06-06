import React from 'react'
import Button from '@/components/atoms/Button'
import ProjectDot from '@/components/atoms/ProjectDot'
import Text from '@/components/atoms/Text'

export default function SidebarFilterItem({
  label,
  count,
  color,
  isSelected,
  onClick,
  isAll = false
}) {
  return (
    <Button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
        isSelected
          ? 'bg-primary text-white'
          : 'hover:bg-surface-50 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
      }`}
    >
      <ProjectDot color={color} />
      <Text as="span" className={`text-sm ${isAll ? '' : 'truncate'}`}>{label}</Text>
      <Text as="span" className="ml-auto text-xs opacity-75">{count}</Text>
    </Button>
  )
}