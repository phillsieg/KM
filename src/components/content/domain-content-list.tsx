'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronDownIcon, ChevronRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

interface Content {
  id: string
  title: string
  summary: string
  contentType: string
  lifecycleState: string
  sensitivity: string
  domain: {
    name: string
    color?: string
  }
  owner: {
    id: string
    name: string | null
    email: string
    image?: string | null
  }
  createdAt: string
  updatedAt: string
  publishedAt?: string | null
  nextReviewDate?: string | null
}

interface DomainContentListProps {
  domainId: string
  domainName: string
  domainColor: string
  isExpanded: boolean
  onToggle: () => void
}

export function DomainContentList({
  domainId,
  domainName,
  domainColor,
  isExpanded,
  onToggle
}: DomainContentListProps) {
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data for demonstration
  const getMockContent = (domainId: string): Content[] => {
    const mockData: Record<string, Content[]> = {
      'engineering': [
        {
          id: '1',
          title: 'API Development Standards',
          summary: 'Guidelines for developing consistent and maintainable APIs.',
          contentType: 'STANDARD',
          lifecycleState: 'PUBLISHED',
          sensitivity: 'INTERNAL',
          domain: { name: 'Engineering', color: '#3B82F6' },
          owner: { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com' },
          createdAt: '2024-01-10T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z',
          publishedAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          title: 'Code Review Guidelines',
          summary: 'Best practices for conducting effective code reviews.',
          contentType: 'STANDARD',
          lifecycleState: 'PUBLISHED',
          sensitivity: 'INTERNAL',
          domain: { name: 'Engineering', color: '#3B82F6' },
          owner: { id: '2', name: 'Mike Chen', email: 'mike@example.com' },
          createdAt: '2024-01-08T00:00:00Z',
          updatedAt: '2024-01-08T00:00:00Z',
          publishedAt: '2024-01-08T00:00:00Z'
        }
      ],
      'operations': [
        {
          id: '3',
          title: 'Incident Response Policy',
          summary: 'Procedures for responding to and managing incidents.',
          contentType: 'POLICY',
          lifecycleState: 'PUBLISHED',
          sensitivity: 'INTERNAL',
          domain: { name: 'Operations', color: '#10B981' },
          owner: { id: '3', name: 'Alex Rodriguez', email: 'alex@example.com' },
          createdAt: '2024-01-12T00:00:00Z',
          updatedAt: '2024-01-12T00:00:00Z',
          publishedAt: '2024-01-12T00:00:00Z'
        },
        {
          id: '4',
          title: 'Deployment Checklist',
          summary: 'Step-by-step checklist for production deployments.',
          contentType: 'SOP',
          lifecycleState: 'PUBLISHED',
          sensitivity: 'INTERNAL',
          domain: { name: 'Operations', color: '#10B981' },
          owner: { id: '4', name: 'Lisa Wang', email: 'lisa@example.com' },
          createdAt: '2024-01-09T00:00:00Z',
          updatedAt: '2024-01-14T00:00:00Z',
          publishedAt: '2024-01-14T00:00:00Z'
        }
      ],
      'compliance': [
        {
          id: '5',
          title: 'Data Privacy Policy',
          summary: 'Guidelines for data handling and privacy protection.',
          contentType: 'POLICY',
          lifecycleState: 'PUBLISHED',
          sensitivity: 'RESTRICTED',
          domain: { name: 'Compliance', color: '#EF4444' },
          owner: { id: '5', name: 'Jennifer Smith', email: 'jennifer@example.com' },
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-11T00:00:00Z',
          publishedAt: '2024-01-11T00:00:00Z'
        },
        {
          id: '6',
          title: 'Security Audit Procedures',
          summary: 'Standard procedures for conducting security audits.',
          contentType: 'SOP',
          lifecycleState: 'IN_REVIEW',
          sensitivity: 'RESTRICTED',
          domain: { name: 'Compliance', color: '#EF4444' },
          owner: { id: '6', name: 'David Kim', email: 'david@example.com' },
          createdAt: '2024-01-13T00:00:00Z',
          updatedAt: '2024-01-16T00:00:00Z'
        }
      ],
      'marketing': [
        {
          id: '7',
          title: 'Brand Guidelines',
          summary: 'Official brand guidelines and usage standards.',
          contentType: 'STANDARD',
          lifecycleState: 'PUBLISHED',
          sensitivity: 'INTERNAL',
          domain: { name: 'Marketing', color: '#F59E0B' },
          owner: { id: '7', name: 'Emma Wilson', email: 'emma@example.com' },
          createdAt: '2024-01-07T00:00:00Z',
          updatedAt: '2024-01-07T00:00:00Z',
          publishedAt: '2024-01-07T00:00:00Z'
        }
      ],
      'sales': [
        {
          id: '8',
          title: 'Customer Onboarding Process',
          summary: 'Step-by-step guide for onboarding new customers.',
          contentType: 'SOP',
          lifecycleState: 'PUBLISHED',
          sensitivity: 'INTERNAL',
          domain: { name: 'Sales', color: '#8B5CF6' },
          owner: { id: '8', name: 'Robert Garcia', email: 'robert@example.com' },
          createdAt: '2024-01-06T00:00:00Z',
          updatedAt: '2024-01-10T00:00:00Z',
          publishedAt: '2024-01-10T00:00:00Z'
        }
      ]
    }

    return mockData[domainId] || []
  }

  const fetchContent = useCallback(async () => {
    setLoading(true)
    setError(null)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      // Use mock data for now since database seeding isn't working
      const mockContent = getMockContent(domainId)
      setContent(mockContent)
    } catch (err) {
      console.error('Content fetch error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [domainId])

  useEffect(() => {
    if (isExpanded && content.length === 0) {
      fetchContent()
    }
  }, [isExpanded, content.length, fetchContent])

  const getLifecycleStateBadge = (state: string) => {
    const stateStyles = {
      DRAFT: 'bg-gray-100 text-gray-800',
      IN_REVIEW: 'bg-yellow-100 text-yellow-800',
      PUBLISHED: 'bg-green-100 text-green-800',
      NEEDS_UPDATE: 'bg-orange-100 text-orange-800',
      ARCHIVED: 'bg-red-100 text-red-800',
      DEPRECATED: 'bg-red-100 text-red-800'
    }

    return stateStyles[state as keyof typeof stateStyles] || 'bg-gray-100 text-gray-800'
  }

  const getContentTypeIcon = () => {
    return <DocumentTextIcon className="h-4 w-4" />
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header - clickable to expand/collapse */}
      <div
        className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div
                className="w-8 h-8 rounded"
                style={{ backgroundColor: domainColor }}
              ></div>
            </div>
            <div className="ml-5 flex-1">
              <h3 className="text-sm font-medium text-gray-500 truncate">
                {domainName}
              </h3>
              <p className="text-lg font-medium text-gray-900">
                {content.length > 0 ? `${content.length} documents` : 'Click to expand'}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expandable content list */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {loading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-pulse">Checking for documents...</div>
            </div>
          )}

          {error && (
            <div className="p-4 text-center">
              <div className="text-red-500 mb-2">
                {error}
              </div>
              <button
                onClick={fetchContent}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-50"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && content.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No published documents found in this domain.
            </div>
          )}

          {!loading && !error && content.length > 0 && (
            <div className="divide-y divide-gray-200">
              {content.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 pt-1">
                      {getContentTypeIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          <a
                            href={`/content/${item.id}`}
                            className="hover:text-blue-600"
                          >
                            {item.title}
                          </a>
                        </h4>
                        <div className="flex items-center space-x-2 ml-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLifecycleStateBadge(item.lifecycleState)}`}>
                            {item.lifecycleState.toLowerCase()}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {item.contentType.toLowerCase()}
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {item.summary}
                      </p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span>By {item.owner.name || item.owner.email}</span>
                        <span className="mx-1">•</span>
                        <span>Updated {new Date(item.updatedAt).toLocaleDateString()}</span>
                        {item.publishedAt && (
                          <>
                            <span className="mx-1">•</span>
                            <span>Published {new Date(item.publishedAt).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}