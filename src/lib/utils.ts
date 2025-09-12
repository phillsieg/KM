import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) {
    return 'Today'
  } else if (diffInDays === 1) {
    return 'Yesterday'
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return `${months} month${months > 1 ? 's' : ''} ago`
  } else {
    const years = Math.floor(diffInDays / 365)
    return `${years} year${years > 1 ? 's' : ''} ago`
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getRoleColor(role: string): string {
  const colors = {
    VISITOR: 'bg-gray-100 text-gray-800',
    CONTRIBUTOR: 'bg-blue-100 text-blue-800',
    STEWARD: 'bg-green-100 text-green-800',
    OWNER: 'bg-purple-100 text-purple-800',
    ADMIN: 'bg-red-100 text-red-800',
  }
  return colors[role as keyof typeof colors] || colors.VISITOR
}

export function getLifecycleStateColor(state: string): string {
  const colors = {
    DRAFT: 'bg-gray-100 text-gray-800',
    IN_REVIEW: 'bg-yellow-100 text-yellow-800',
    PUBLISHED: 'bg-green-100 text-green-800',
    NEEDS_UPDATE: 'bg-orange-100 text-orange-800',
    ARCHIVED: 'bg-blue-100 text-blue-800',
    DEPRECATED: 'bg-red-100 text-red-800',
  }
  return colors[state as keyof typeof colors] || colors.DRAFT
}

export function getReviewStatusColor(status: string): string {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800', 
    COMPLETED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  }
  return colors[status as keyof typeof colors] || colors.PENDING
}

export function formatLifecycleState(state: string): string {
  return state.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

export function formatReviewStatus(status: string): string {
  return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

export function getSensitivityColor(sensitivity: string): string {
  const colors = {
    PUBLIC: 'bg-green-100 text-green-800',
    INTERNAL: 'bg-yellow-100 text-yellow-800',
    RESTRICTED: 'bg-red-100 text-red-800',
  }
  return colors[sensitivity as keyof typeof colors] || colors.INTERNAL
}