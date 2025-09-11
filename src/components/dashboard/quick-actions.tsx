'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  DocumentDuplicateIcon,
  ClipboardDocumentListIcon 
} from '@heroicons/react/24/outline'
import { hasPermission } from '@/lib/rbac'

export function QuickActions() {
  const { data: session } = useSession()
  const userRole = session?.user?.role || 'VISITOR'

  const actions = [
    {
      name: 'Create Content',
      description: 'Add new document or policy',
      href: '/content/create',
      icon: PlusIcon,
      color: 'bg-blue-500 hover:bg-blue-600',
      permission: 'content:create',
    },
    {
      name: 'Advanced Search',
      description: 'Find content with filters',
      href: '/search',
      icon: MagnifyingGlassIcon,
      color: 'bg-green-500 hover:bg-green-600',
      permission: 'content:read',
    },
    {
      name: 'Copy Template',
      description: 'Create from existing template',
      href: '/templates',
      icon: DocumentDuplicateIcon,
      color: 'bg-purple-500 hover:bg-purple-600',
      permission: 'content:create',
    },
    {
      name: 'Review Queue',
      description: 'Review pending approvals',
      href: '/reviews',
      icon: ClipboardDocumentListIcon,
      color: 'bg-orange-500 hover:bg-orange-600',
      permission: 'content:approve',
    },
  ]

  const availableActions = actions.filter(action => 
    hasPermission(userRole, action.permission as any)
  )

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableActions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className={`group flex items-center p-4 rounded-lg text-white transition-colors ${action.color}`}
          >
            <action.icon className="h-6 w-6 mr-3" />
            <div>
              <div className="font-medium">{action.name}</div>
              <div className="text-sm opacity-90">{action.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}