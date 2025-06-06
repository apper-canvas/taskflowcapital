import React from 'react'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'

export default function SidebarQuickStat({ iconName, iconColor, text, bgColor }) {
  return (
    <div className={`p-3 rounded-lg ${bgColor}`}>
      <div className="flex items-center gap-2">
        <Icon name={iconName} size={16} className={iconColor} />
        <Text as="span" className={`text-sm font-medium ${text}`}>{text}</Text>
      </div>
    </div>
  )
}