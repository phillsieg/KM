'use client'

import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

interface BreadcrumbItem {
  name: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-gray-400 hover:text-gray-500">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.name} className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-2" />
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                {item.name}
              </Link>
            ) : (
              <span className="text-gray-900 text-sm font-medium">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}