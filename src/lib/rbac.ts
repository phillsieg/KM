import { UserRole } from '@prisma/client'

export const roleHierarchy = {
  VISITOR: 0,
  CONTRIBUTOR: 1,
  STEWARD: 2,
  OWNER: 3,
  ADMIN: 4,
}

export const permissions = {
  // Content permissions
  'content:read': ['VISITOR', 'CONTRIBUTOR', 'STEWARD', 'OWNER', 'ADMIN'],
  'content:create': ['CONTRIBUTOR', 'STEWARD', 'OWNER', 'ADMIN'],
  'content:update:own': ['CONTRIBUTOR', 'STEWARD', 'OWNER', 'ADMIN'],
  'content:update:any': ['STEWARD', 'OWNER', 'ADMIN'],
  'content:delete:own': ['CONTRIBUTOR', 'STEWARD', 'OWNER', 'ADMIN'],
  'content:delete:any': ['STEWARD', 'OWNER', 'ADMIN'],
  'content:publish': ['STEWARD', 'OWNER', 'ADMIN'],
  'content:approve': ['STEWARD', 'OWNER', 'ADMIN'],
  
  // Review permissions
  'review:create': ['STEWARD', 'OWNER', 'ADMIN'],
  'review:complete': ['STEWARD', 'OWNER', 'ADMIN'],
  
  // Analytics permissions
  'analytics:view': ['STEWARD', 'OWNER', 'ADMIN'],
  'analytics:export': ['OWNER', 'ADMIN'],
  
  // User management
  'user:manage': ['ADMIN'],
  'user:assign_roles': ['ADMIN'],
  
  // System administration
  'system:configure': ['ADMIN'],
  'system:backup': ['ADMIN'],
} as const

export function hasPermission(userRole: UserRole, permission: keyof typeof permissions): boolean {
  const allowedRoles = permissions[permission] as readonly string[]
  return allowedRoles.includes(userRole)
}

export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function canAccessContent(
  userRole: UserRole,
  contentSensitivity: string,
  isOwner: boolean = false
): boolean {
  // Admins and owners can access everything
  if (userRole === 'ADMIN' || isOwner) return true
  
  // Role-based content access
  switch (contentSensitivity) {
    case 'PUBLIC':
      return hasMinimumRole(userRole, 'VISITOR')
    case 'INTERNAL':
      return hasMinimumRole(userRole, 'CONTRIBUTOR')
    case 'RESTRICTED':
      return hasMinimumRole(userRole, 'STEWARD')
    default:
      return false
  }
}

export function canEditContent(userRole: UserRole, isOwner: boolean, isAuthor: boolean): boolean {
  if (userRole === 'ADMIN' || userRole === 'OWNER') return true
  if (userRole === 'STEWARD') return true
  if (userRole === 'CONTRIBUTOR' && (isOwner || isAuthor)) return true
  return false
}