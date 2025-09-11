'use client'

import React from 'react'
import Link from 'next/link'
import { formatRelativeTime, getInitials } from '@/lib/utils'
import {
  DocumentPlusIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'

const activityTypes = {
  created: {
    icon: DocumentPlusIcon,
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
  updated: {
    icon: PencilSquareIcon,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  approved: {
    icon: CheckCircleIcon,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
  viewed: {
    icon: EyeIcon,
    color: 'text-gray-500',
    bg: 'bg-gray-50',
  },
}

const mockActivity = [
  {
    id: '1',
    type: 'created',
    user: {
      name: 'John Doe',
      email: 'john@company.com',
      avatar: null,
    },
    content: {
      title: 'New Security Policy Draft',
      href: '/content/new-security-policy-draft',
    },
    timestamp: new Date('2024-01-15T14:30:00'),
    description: 'created a new policy document',
  },
  {
    id: '2',
    type: 'approved',
    user: {
      name: 'Sarah Smith',
      email: 'sarah@company.com',
      avatar: null,
    },
    content: {
      title: 'API Rate Limiting Guidelines',
      href: '/content/api-rate-limiting-guidelines',
    },
    timestamp: new Date('2024-01-15T13:15:00'),
    description: 'approved for publication',
  },
  {
    id: '3',
    type: 'updated',
    user: {
      name: 'Mike Johnson',
      email: 'mike@company.com',
      avatar: null,
    },
    content: {
      title: 'Deployment Checklist v2.1',
      href: '/content/deployment-checklist',
    },
    timestamp: new Date('2024-01-15T11:45:00'),
    description: 'updated with latest requirements',
  },
  {
    id: '4',
    type: 'viewed',
    user: {
      name: 'Emma Wilson',
      email: 'emma@company.com',
      avatar: null,
    },
    content: {
      title: 'Code Review Process',
      href: '/content/code-review-process',
    },
    timestamp: new Date('2024-01-15T10:30:00'),
    description: 'viewed the document',
  },
  {
    id: '5',
    type: 'created',
    user: {
      name: 'David Chen',
      email: 'david@company.com',
      avatar: null,
    },
    content: {
      title: 'Database Backup Procedures',
      href: '/content/database-backup-procedures',
    },
    timestamp: new Date('2024-01-15T09:20:00'),
    description: 'created new SOP document',
  },
]

export function RecentActivity() {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Activity</h3>
      
      <div className="flow-root">
        <ul className="-mb-8">
          {mockActivity.map((activity, index) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {index !== mockActivity.length - 1 && (
                  <span
                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                
                <div className="relative flex items-start space-x-3">
                  <div
                    className={`relative px-1 ${activityTypes[activity.type as keyof typeof activityTypes].bg} rounded-full`}
                  >
                    <div className="h-8 w-8 rounded-full flex items-center justify-center">
                      {React.createElement(
                        activityTypes[activity.type as keyof typeof activityTypes].icon,
                        {
                          className: `h-4 w-4 ${activityTypes[activity.type as keyof typeof activityTypes].color}`,
                        }
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {activity.user.avatar ? (
                            <img
                              className="h-6 w-6 rounded-full"
                              src={activity.user.avatar}
                              alt={activity.user.name}
                            />
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-700">
                                {getInitials(activity.user.name)}
                              </span>
                            </div>
                          )}
                          <span className="font-medium text-gray-900">
                            {activity.user.name}
                          </span>
                        </div>
                        <span className="text-gray-500">
                          {activity.description}
                        </span>
                      </div>
                      
                      <div className="mt-1">
                        <Link
                          href={activity.content.href}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {activity.content.title}
                        </Link>
                      </div>
                    </div>
                    
                    <div className="mt-1 text-xs text-gray-500">
                      {formatRelativeTime(activity.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link
          href="/activity"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View all activity →
        </Link>
      </div>
    </div>
  )
}