'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  RocketLaunchIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

const roleBasedTiles = {
  VISITOR: [
    {
      name: 'New Starter Guide',
      description: 'Essential information for getting started',
      href: '/guides/new-starter',
      icon: RocketLaunchIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Company Policies',
      description: 'Important policies and procedures',
      href: '/domains/compliance/policies',
      icon: ShieldCheckIcon,
      color: 'bg-green-500',
    },
  ],
  CONTRIBUTOR: [
    {
      name: 'Field Operations',
      description: 'On-site procedures and safety protocols',
      href: '/domains/operations',
      icon: WrenchScrewdriverIcon,
      color: 'bg-orange-500',
    },
    {
      name: 'Technical Documentation',
      description: 'Engineering standards and best practices',
      href: '/domains/engineering',
      icon: DocumentTextIcon,
      color: 'bg-purple-500',
    },
  ],
  STEWARD: [
    {
      name: 'Content Management',
      description: 'Review and approve pending content',
      href: '/reviews',
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Analytics Overview',
      description: 'Content performance and usage metrics',
      href: '/analytics',
      icon: ChartBarIcon,
      color: 'bg-green-500',
    },
  ],
  OWNER: [
    {
      name: 'System Analytics',
      description: 'Comprehensive platform insights',
      href: '/analytics',
      icon: ChartBarIcon,
      color: 'bg-blue-600',
    },
    {
      name: 'User Management',
      description: 'Manage users and permissions',
      href: '/users',
      icon: UserGroupIcon,
      color: 'bg-purple-600',
    },
  ],
  ADMIN: [
    {
      name: 'System Administration',
      description: 'Platform configuration and management',
      href: '/settings',
      icon: WrenchScrewdriverIcon,
      color: 'bg-red-600',
    },
    {
      name: 'Advanced Analytics',
      description: 'Detailed system metrics and reporting',
      href: '/analytics/advanced',
      icon: ChartBarIcon,
      color: 'bg-indigo-600',
    },
  ],
}

export function RoleBasedTiles() {
  const { data: session } = useSession()
  const userRole = session?.user?.role || 'VISITOR'
  const tiles = roleBasedTiles[userRole as keyof typeof roleBasedTiles] || []

  if (tiles.length === 0) return null

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Quick Access for {userRole.charAt(0) + userRole.slice(1).toLowerCase()}s
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiles.map((tile) => (
          <Link
            key={tile.name}
            href={tile.href}
            className="group relative rounded-lg p-6 bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div>
              <span className={`inline-flex rounded-lg p-3 ${tile.color}`}>
                <tile.icon className="h-6 w-6 text-white" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                {tile.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {tile.description}
              </p>
            </div>
            <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16L19.293 3.293z" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}