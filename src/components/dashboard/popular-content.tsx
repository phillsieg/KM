'use client'

import Link from 'next/link'
import { EyeIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import { formatRelativeTime, getLifecycleStateColor } from '@/lib/utils'

const mockPopularContent = [
  {
    id: '1',
    title: 'API Documentation Standards',
    type: 'SOP',
    domain: 'Engineering',
    views: 1234,
    lastUpdated: new Date('2024-01-15'),
    lifecycleState: 'PUBLISHED',
    href: '/content/api-documentation-standards',
  },
  {
    id: '2',
    title: 'Employee Onboarding Process',
    type: 'Policy',
    domain: 'HR',
    views: 987,
    lastUpdated: new Date('2024-01-10'),
    lifecycleState: 'PUBLISHED',
    href: '/content/employee-onboarding-process',
  },
  {
    id: '3',
    title: 'Incident Response Procedure',
    type: 'SOP',
    domain: 'Operations',
    views: 856,
    lastUpdated: new Date('2024-01-08'),
    lifecycleState: 'PUBLISHED',
    href: '/content/incident-response-procedure',
  },
  {
    id: '4',
    title: 'Code Review Checklist',
    type: 'Job Aid',
    domain: 'Engineering',
    views: 743,
    lastUpdated: new Date('2024-01-12'),
    lifecycleState: 'PUBLISHED',
    href: '/content/code-review-checklist',
  },
  {
    id: '5',
    title: 'Data Privacy Guidelines',
    type: 'Policy',
    domain: 'Compliance',
    views: 621,
    lastUpdated: new Date('2024-01-05'),
    lifecycleState: 'PUBLISHED',
    href: '/content/data-privacy-guidelines',
  },
]

export function PopularContent() {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Most Viewed</h3>
        <div className="flex items-center text-sm text-gray-500">
          <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
          This month
        </div>
      </div>
      
      <div className="space-y-4">
        {mockPopularContent.map((item, index) => (
          <div key={item.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 text-center">
              <span className="text-sm font-medium text-gray-500">
                {index + 1}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                  >
                    {item.title}
                  </Link>
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.domain}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getLifecycleStateColor(item.lifecycleState)}`}>
                      {item.lifecycleState.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                    <div className="flex items-center">
                      <EyeIcon className="h-3 w-3 mr-1" />
                      {item.views.toLocaleString()} views
                    </div>
                    <div>
                      Updated {formatRelativeTime(item.lastUpdated)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link
          href="/analytics/content"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View detailed analytics →
        </Link>
      </div>
    </div>
  )
}