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

  const fetchContent = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/content?domain=${domainId}&public=true`)
      if (!response.ok) {
        throw new Error('Failed to fetch content')
      }

      const data = await response.json()
      setContent(data)
    } catch (err) {
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
                {content.length > 0 ? `${content.length} documents` : 'Loading...'}
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
              <div className="animate-pulse">Loading documents...</div>
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-red-500">
              Error: {error}
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