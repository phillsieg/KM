'use client'

import { useState, useRef, useEffect } from 'react'
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
          { name: 'SOPs', href: '/search?domain=engineering&type=sop' },
          { name: 'Policies', href: '/search?domain=engineering&type=policy' },
          { name: 'Standards', href: '/search?domain=engineering&type=standard' },
        ]
      },
      {
        name: 'Resources',
        items: [
          { name: 'Job Aids', href: '/search?domain=engineering&type=job-aid' },
          { name: 'Templates', href: '/search?domain=engineering&type=template' },
          { name: 'FAQs', href: '/search?domain=engineering&type=faq' },
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
          { name: 'SOPs', href: '/search?domain=operations&type=sop' },
          { name: 'Work Instructions', href: '/search?domain=operations&type=instruction' },
          { name: 'Checklists', href: '/search?domain=operations&type=checklist' },
        ]
      },
      {
        name: 'Support',
        items: [
          { name: 'Training Materials', href: '/search?domain=operations&type=training' },
          { name: 'FAQs', href: '/search?domain=operations&type=faq' },
          { name: 'Troubleshooting', href: '/search?domain=operations&type=troubleshooting' },
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
          { name: 'Policies', href: '/search?domain=compliance&type=policy' },
          { name: 'Procedures', href: '/search?domain=compliance&type=procedure' },
          { name: 'Guidelines', href: '/search?domain=compliance&type=guideline' },
        ]
      },
      {
        name: 'Resources',
        items: [
          { name: 'Audit Reports', href: '/search?domain=compliance&type=audit' },
          { name: 'Training', href: '/search?domain=compliance&type=training' },
          { name: 'Updates', href: '/search?domain=compliance&type=update' },
        ]
      }
    ]
  }
]

export function MegaMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (domainName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setActiveMenu(domainName)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
    }, 1000) // 1 second delay before closing
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="flex space-x-8">
      {domains.map((domain) => (
        <div
          key={domain.name}
          className="relative"
          onMouseEnter={() => handleMouseEnter(domain.name)}
          onMouseLeave={handleMouseLeave}
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
            <div 
              className="absolute left-0 z-10 -mt-2 w-screen max-w-md transform px-2 sm:px-0"
              onMouseEnter={() => handleMouseEnter(domain.name)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Invisible bridge area */}
              <div className="h-4 w-full" />
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