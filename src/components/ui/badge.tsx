import React from 'react'
import { cn } from '@/lib/utils'
import {
  getLifecycleStateColor,
  getRoleColor,
  getSensitivityColor,
  getReviewStatusColor,
  formatLifecycleState,
  formatReviewStatus,
} from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full font-medium'
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    secondary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-50 text-blue-700',
  }
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  )
}

interface LifecycleStateBadgeProps {
  state: string
  size?: 'sm' | 'md'
  className?: string
}

export function LifecycleStateBadge({ state, size = 'md', className }: LifecycleStateBadgeProps) {
  const colorClass = getLifecycleStateColor(state)
  const formattedState = formatLifecycleState(state)
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      colorClass,
      sizeClasses[size],
      className
    )}>
      {formattedState}
    </span>
  )
}

interface RoleBadgeProps {
  role: string
  size?: 'sm' | 'md'
  className?: string
}

export function RoleBadge({ role, size = 'md', className }: RoleBadgeProps) {
  const colorClass = getRoleColor(role)
  const formattedRole = role.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      colorClass,
      sizeClasses[size],
      className
    )}>
      {formattedRole}
    </span>
  )
}

interface SensitivityBadgeProps {
  sensitivity: string
  size?: 'sm' | 'md'
  className?: string
}

export function SensitivityBadge({ sensitivity, size = 'md', className }: SensitivityBadgeProps) {
  const colorClass = getSensitivityColor(sensitivity)
  const formattedSensitivity = sensitivity.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      colorClass,
      sizeClasses[size],
      className
    )}>
      {formattedSensitivity}
    </span>
  )
}

interface ReviewStatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
  className?: string
}

export function ReviewStatusBadge({ status, size = 'md', className }: ReviewStatusBadgeProps) {
  const colorClass = getReviewStatusColor(status)
  const formattedStatus = formatReviewStatus(status)
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      colorClass,
      sizeClasses[size],
      className
    )}>
      {formattedStatus}
    </span>
  )
}

interface ReviewDateBadgeProps {
  date: Date
  isOverdue?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export function ReviewDateBadge({ date, isOverdue = false, size = 'md', className }: ReviewDateBadgeProps) {
  const now = new Date()
  const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  let variant: 'success' | 'warning' | 'error' = 'success'
  let text = ''
  
  if (isOverdue || diffInDays < 0) {
    variant = 'error'
    text = `${Math.abs(diffInDays)} days overdue`
  } else if (diffInDays <= 7) {
    variant = 'warning'
    text = diffInDays === 0 ? 'Due today' : `Due in ${diffInDays} days`
  } else if (diffInDays <= 30) {
    variant = 'warning'
    text = `Due in ${diffInDays} days`
  } else {
    variant = 'success'
    text = `Due in ${Math.ceil(diffInDays / 30)} months`
  }
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  const variantClasses = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  }

  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {text}
    </span>
  )
}

interface ContentTypeBadgeProps {
  type: string
  size?: 'sm' | 'md'
  className?: string
}

export function ContentTypeBadge({ type, size = 'md', className }: ContentTypeBadgeProps) {
  const formattedType = type.replace('_', ' ')
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium bg-gray-100 text-gray-800',
      sizeClasses[size],
      className
    )}>
      {formattedType}
    </span>
  )
}