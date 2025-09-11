'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

const domains = [
  {
    name: 'Engineering',
    href: '/domains/engineering',
    description: 'Technical documentation, SOPs, and standards',
    sections: [
      {
        name: 'Documentation',
        items: [
          { name: 'SOPs', href: '/domains/engineering/sops' },
          { name: 'Policies', href: '/domains/engineering/policies' },
          { name: 'Standards', href: '/domains/engineering/standards' },
        ]
      },
      {
        name: 'Resources',
        items: [
          { name: 'Job Aids', href: '/domains/engineering/job-aids' },
          { name: 'Templates', href: '/domains/engineering/templates' },
          { name: 'FAQs', href: '/domains/engineering/faqs' },
        ]
      }
    ]
  },
  {
    name: 'Operations',
    href: '/domains/operations',
    description: 'Operational procedures and guidelines',
    sections: [
      {
        name: 'Procedures',
        items: [
          { name: 'SOPs', href: '/domains/operations/sops' },
          { name: 'Work Instructions', href: '/domains/operations/work-instructions' },
          { name: 'Checklists', href: '/domains/operations/checklists' },
        ]
      },
      {
        name: 'Support',
        items: [
          { name: 'Training Materials', href: '/domains/operations/training' },
          { name: 'FAQs', href: '/domains/operations/faqs' },
          { name: 'Troubleshooting', href: '/domains/operations/troubleshooting' },
        ]
      }
    ]
  },
  {
    name: 'Compliance',
    href: '/domains/compliance',
    description: 'Regulatory and compliance documentation',
    sections: [
      {
        name: 'Documentation',
        items: [
          { name: 'Policies', href: '/domains/compliance/policies' },
          { name: 'Procedures', href: '/domains/compliance/procedures' },
          { name: 'Guidelines', href: '/domains/compliance/guidelines' },
        ]
      },
      {
        name: 'Resources',
        items: [
          { name: 'Audit Reports', href: '/domains/compliance/audits' },
          { name: 'Training', href: '/domains/compliance/training' },
          { name: 'Updates', href: '/domains/compliance/updates' },
        ]
      }
    ]
  }
]

export function MegaMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  return (
    <div className="flex space-x-8">
      {domains.map((domain) => (
        <div
          key={domain.name}
          className="relative"
          onMouseEnter={() => setActiveMenu(domain.name)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <button
            className={cn(
              'flex items-center space-x-1 text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium',
              activeMenu === domain.name && 'text-blue-600'
            )}
          >
            <span>{domain.name}</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>

          {activeMenu === domain.name && (
            <div className="absolute left-0 z-10 mt-2 w-screen max-w-md transform px-2 sm:px-0">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                  <Link
                    href={domain.href}
                    className="block p-3 -m-3 rounded-lg hover:bg-gray-50"
                  >
                    <p className="text-base font-medium text-gray-900">
                      {domain.name} Overview
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {domain.description}
                    </p>
                  </Link>
                  
                  {domain.sections.map((section) => (
                    <div key={section.name}>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        {section.name}
                      </h3>
                      <div className="mt-2 space-y-2">
                        {section.items.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block text-sm text-gray-900 hover:text-blue-600"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}