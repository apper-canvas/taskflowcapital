import React from 'react'
import Label from '@/components/atoms/Label'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Text from '@/components/atoms/Text'

export default function FormField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  options,
  required = false,
  as = 'input',
  rows,
  className = '',
  min,
  max,
  step,
  disabled = false
}) {
  const renderControl = () => {
    if (as === 'select') {
      return (
        <Select value={value} onChange={onChange} className={`w-full ${className}`}>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      )
    } else if (as === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={onChange}
          rows={rows}
          className={`w-full px-3 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
          required={required}
        />
      )
} else {
      return (
        <Input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`w-full ${className}`}
        />
      )
    }
  }

  return (
    <div>
      {label && <Label>{label}</Label>}
      {renderControl()}
    </div>
  )
}