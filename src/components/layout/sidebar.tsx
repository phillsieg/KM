'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  DocumentTextIcon,
  FolderIcon,
  ChartBarIcon,
  UserGroupIcon,
  CogIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  ClockIcon,
  BellIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
// import { hasPermission } from '@/lib/rbac'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, roles: ['VISITOR', 'CONTRIBUTOR', 'STEWARD', 'OWNER', 'ADMIN'] },
  { name: 'Browse', href: '/browse', icon: FolderIcon, roles: ['VISITOR', 'CONTRIBUTOR', 'STEWARD', 'OWNER', 'ADMIN'] },
  { name: 'Search', href: '/search', icon: MagnifyingGlassIcon, roles: ['VISITOR', 'CONTRIBUTOR', 'STEWARD', 'OWNER', 'ADMIN'] },
  { name: 'My Content', href: '/my-content', icon: DocumentTextIcon, roles: ['CONTRIBUTOR', 'STEWARD', 'OWNER', 'ADMIN'] },
  { name: 'Bookmarks', href: '/bookmarks', icon: BookmarkIcon, roles: ['VISITOR', 'CONTRIBUTOR', 'STEWARD', 'OWNER', 'ADMIN'] },
  { name: 'Recent', href: '/recent', icon: ClockIcon, roles: ['VISITOR', 'CONTRIBUTOR', 'STEWARD', 'OWNER', 'ADMIN'] },
]

const managementNavigation = [
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, roles: ['STEWARD', 'OWNER', 'ADMIN'] },
  { name: 'Reviews', href: '/reviews', icon: BellIcon, roles: ['STEWARD', 'OWNER', 'ADMIN'] },
  { name: 'Users', href: '/users', icon: UserGroupIcon, roles: ['ADMIN'] },
  { name: 'Settings', href: '/settings', icon: CogIcon, roles: ['OWNER', 'ADMIN'] },
]

const domains = [
  { name: 'Engineering', href: '/domains/engineering', color: 'bg-blue-500' },
  { name: 'Operations', href: '/domains/operations', color: 'bg-green-500' },
  { name: 'Compliance', href: '/domains/compliance', color: 'bg-red-500' },
  { name: 'Sales', href: '/domains/sales', color: 'bg-purple-500' },
  { name: 'Marketing', href: '/domains/marketing', color: 'bg-orange-500' },
]

export function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const userRole = session?.user?.role || 'VISITOR'

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  )

  const filteredManagementNavigation = managementNavigation.filter(item =>
    item.roles.includes(userRole)
  )

  return (
    <div className="sidebar-hidden-mobile lg:fixed lg:inset-y-0 sidebar-layer lg:flex lg:w-64 lg:flex-col">
      <div className="flex h-full flex-col gap-y-5 overflow-y-auto bg-white px-4 pb-4 shadow-sm border-r border-gray-200">
        <nav className="flex flex-1 flex-col pt-20">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            {/* Main Navigation */}
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {filteredNavigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        pathname === item.href
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium'
                      )}
                    >
                      <item.icon
                        className={cn(
                          pathname === item.href
                            ? 'text-blue-700'
                            : 'text-gray-400 group-hover:text-blue-700',
                          'h-5 w-5 shrink-0'
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Domains */}
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wide">
                Domains
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {domains.map((domain) => (
                  <li key={domain.name}>
                    <Link
                      href={domain.href}
                      className={cn(
                        pathname.startsWith(domain.href)
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium'
                      )}
                    >
                      <div className={cn(domain.color, 'h-5 w-5 rounded-sm shrink-0')} />
                      {domain.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Management (for appropriate roles) */}
            {filteredManagementNavigation.length > 0 && (
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wide">
                  Management
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {filteredManagementNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          pathname === item.href
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium'
                        )}
                      >
                        <item.icon
                          className={cn(
                            pathname === item.href
                              ? 'text-blue-700'
                              : 'text-gray-400 group-hover:text-blue-700',
                            'h-5 w-5 shrink-0'
                          )}
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  )
}