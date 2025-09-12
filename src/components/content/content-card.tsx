import React from 'react'
import Link from 'next/link'
import { 
  EyeIcon, 
  UserIcon, 
  ShieldCheckIcon,
  CalendarIcon,
  ClockIcon 
} from '@heroicons/react/24/outline'
import {
  LifecycleStateBadge,
  ContentTypeBadge,
  ReviewDateBadge,
  SensitivityBadge
} from '@/components/ui/badge'
import { formatRelativeTime, getInitials } from '@/lib/utils'

interface ContentOwner {
  id: string
  name: string | null
  email: string
  image?: string | null
}

interface ContentCardProps {
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
  owner: ContentOwner
  steward?: ContentOwner | null
  approvedBy?: ContentOwner | null
  views?: number
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date | null
  nextReviewDate?: Date | null
  approvedAt?: Date | null
  href: string
  className?: string
}

export function ContentCard({
  title,
  summary,
  contentType,
  lifecycleState,
  sensitivity,
  domain,
  owner,
  steward,
  approvedBy,
  views,
  updatedAt,
  publishedAt,
  nextReviewDate,
  approvedAt,
  href,
  className = ''
}: ContentCardProps) {
  const isOverdue = nextReviewDate ? new Date() > nextReviewDate : false

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="p-6">
        {/* Header with badges */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <Link href={href} className="group">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2">
                {title}
              </h3>
            </Link>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{summary}</p>
          </div>
          
          {/* Lifecycle and sensitivity indicators */}
          <div className="flex flex-col items-end space-y-2 ml-4">
            <LifecycleStateBadge state={lifecycleState} size="sm" />
            <SensitivityBadge sensitivity={sensitivity} size="sm" />
          </div>
        </div>

        {/* Content metadata */}
        <div className="flex items-center space-x-3 mb-4">
          <ContentTypeBadge type={contentType} size="sm" />
          <span className="text-sm text-gray-500">{domain.name}</span>
          {views && (
            <div className="flex items-center text-sm text-gray-500">
              <EyeIcon className="h-4 w-4 mr-1" />
              {views.toLocaleString()} views
            </div>
          )}
        </div>

        {/* Ownership and stewardship */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <UserIcon className="h-4 w-4 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-800">
                {owner.image ? (
                  <img 
                    src={owner.image} 
                    alt={owner.name || owner.email}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  getInitials(owner.name || owner.email)
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {owner.name || owner.email}
                </p>
                <p className="text-xs text-gray-500">Owner</p>
              </div>
            </div>
          </div>

          {steward && (
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-4 w-4 text-gray-400" />
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium text-green-800">
                  {steward.image ? (
                    <img 
                      src={steward.image} 
                      alt={steward.name || steward.email}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    getInitials(steward.name || steward.email)
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {steward.name || steward.email}
                  </p>
                  <p className="text-xs text-gray-500">Steward</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dates and review information */}
        <div className="border-t border-gray-100 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
            <div className="space-y-1">
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>Updated {formatRelativeTime(updatedAt)}</span>
              </div>
              {publishedAt && (
                <div className="text-xs">
                  Published {formatRelativeTime(publishedAt)}
                </div>
              )}
            </div>

            <div className="space-y-1">
              {nextReviewDate && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Review due</span>
                  </div>
                  <ReviewDateBadge 
                    date={nextReviewDate} 
                    isOverdue={isOverdue}
                    size="sm" 
                  />
                </div>
              )}
              
              {approvedBy && approvedAt && (
                <div className="text-xs">
                  Approved by {approvedBy.name || approvedBy.email} 
                  <span className="ml-1">{formatRelativeTime(approvedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ContentCardGridProps {
  content: ContentCardProps[]
  className?: string
}

export function ContentCardGrid({ content, className = '' }: ContentCardGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {content.map((item) => (
        <ContentCard key={item.id} {...item} />
      ))}
    </div>
  )
}

interface CompactContentCardProps {
  id: string
  title: string
  contentType: string
  lifecycleState: string
  domain: string
  owner: ContentOwner
  updatedAt: Date
  nextReviewDate?: Date | null
  views?: number
  href: string
  className?: string
}

export function CompactContentCard({
  title,
  contentType,
  lifecycleState,
  domain,
  owner,
  updatedAt,
  nextReviewDate,
  views,
  href,
  className = ''
}: CompactContentCardProps) {
  const isOverdue = nextReviewDate ? new Date() > nextReviewDate : false

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <Link href={href} className="group">
            <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
              {title}
            </h4>
          </Link>
          
          <div className="flex items-center space-x-2 mt-2">
            <ContentTypeBadge type={contentType} size="sm" />
            <LifecycleStateBadge state={lifecycleState} size="sm" />
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>{domain}</span>
              <span>By {owner.name || owner.email}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              {views && (
                <div className="flex items-center">
                  <EyeIcon className="h-3 w-3 mr-1" />
                  {views}
                </div>
              )}
              <span>{formatRelativeTime(updatedAt)}</span>
            </div>
          </div>
        </div>
        
        {nextReviewDate && (
          <div className="ml-3">
            <ReviewDateBadge 
              date={nextReviewDate} 
              isOverdue={isOverdue}
              size="sm" 
            />
          </div>
        )}
      </div>
    </div>
  )
}