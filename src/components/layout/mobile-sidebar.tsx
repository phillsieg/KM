'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Browse', href: '/browse', icon: FolderIcon },
  { name: 'Search', href: '/search', icon: MagnifyingGlassIcon },
  { name: 'Bookmarks', href: '/bookmarks', icon: BookmarkIcon },
  { name: 'Recent', href: '/recent', icon: ClockIcon },
]

const domains = [
  { name: 'Engineering', href: '/domains/engineering', color: 'bg-blue-500' },
  { name: 'Operations', href: '/domains/operations', color: 'bg-green-500' },
  { name: 'Compliance', href: '/domains/compliance', color: 'bg-red-500' },
  { name: 'Sales', href: '/domains/sales', color: 'bg-purple-500' },
  { name: 'Marketing', href: '/domains/marketing', color: 'bg-orange-500' },
]

export function MobileSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile sidebar trigger */}
      <button
        type="button"
        className="p-2 text-gray-400 hover:text-gray-500 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>

                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                  <div className="flex h-16 shrink-0 items-center">
                    <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-sm">KM</span>
                    </div>
                    <span className="ml-2 text-lg font-semibold">Knowledge Management</span>
                  </div>

                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
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

                      <li>
                        <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wide">
                          Domains
                        </div>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                          {domains.map((domain) => (
                            <li key={domain.name}>
                              <Link
                                href={domain.href}
                                onClick={() => setSidebarOpen(false)}
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
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}