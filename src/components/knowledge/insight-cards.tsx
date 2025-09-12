'use client'

import { useState } from 'react'
import {
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  TagIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  BookmarkIcon,
  ShareIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import { Badge } from '@/components/ui/badge'
import { getInitials, formatRelativeTime } from '@/lib/utils'

interface InsightCard {
  id: string
  title: string
  description: string
  lessonLearned: string
  gotchas?: string | null
  bestPractices?: string | null
  tags: string[]
  domain?: {
    id: string
    name: string
    color: string
  }
  content?: {
    id: string
    title: string
    href: string
  }
  author: {
    id: string
    name: string | null
    email: string
    image?: string | null
  }
  upvotes: number
  downvotes: number
  views: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
  // User interaction state
  hasUpvoted?: boolean
  hasBookmarked?: boolean
}

// Mock data for insight cards
const mockInsightCards: InsightCard[] = [
  {
    id: '1',
    title: 'Database Migration Rollback Strategy',
    description: 'Essential practices for safely rolling back database schema changes in production environments.',
    lessonLearned: 'Always create a rollback script before running any database migration. Test the rollback process in staging first. Keep migrations small and atomic to minimize risk.',
    gotchas: 'Rolling back data migrations can cause data loss if not planned properly. Foreign key constraints may prevent rollback. Always backup before migration.',
    bestPractices: '1. Use transaction blocks for migrations 2. Test rollback in staging 3. Have a communication plan 4. Monitor performance impact 5. Keep deployments during low-traffic periods',
    tags: ['database', 'migration', 'deployment', 'rollback'],
    domain: { id: 'engineering', name: 'Engineering', color: 'bg-blue-500' },
    content: { id: 'db-migration-guide', title: 'Database Migration Guide', href: '/content/db-migration-guide' },
    author: { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com' },
    upvotes: 42,
    downvotes: 3,
    views: 156,
    featured: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    hasUpvoted: false,
    hasBookmarked: true,
  },
  {
    id: '2',
    title: 'Incident Response Communication',
    description: 'Effective communication strategies during critical system outages and incidents.',
    lessonLearned: 'Clear, frequent communication during incidents prevents panic and builds trust. Designate a single communication lead to avoid conflicting messages.',
    gotchas: 'Over-communication can be as harmful as under-communication. Avoid technical jargon when communicating with non-technical stakeholders.',
    bestPractices: 'Update status page every 15 minutes. Use templated messages. Brief leadership separately from public updates. Document timeline for post-mortem.',
    tags: ['incident-response', 'communication', 'operations'],
    domain: { id: 'operations', name: 'Operations', color: 'bg-green-500' },
    author: { id: '2', name: 'Mike Chen', email: 'mike@example.com' },
    upvotes: 28,
    downvotes: 1,
    views: 89,
    featured: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    hasUpvoted: true,
    hasBookmarked: false,
  },
  {
    id: '3',
    title: 'Code Review Blind Spots',
    description: 'Common issues that get missed during code reviews and how to catch them.',
    lessonLearned: 'Focus on business logic and edge cases, not just syntax. Security vulnerabilities often hide in seemingly innocent code changes.',
    gotchas: 'Large PRs hide problems. Reviewers get review fatigue. Time pressure leads to rubber-stamp approvals.',
    bestPractices: 'Keep PRs under 400 lines. Use automated tools for style. Review security implications. Test error handling paths.',
    tags: ['code-review', 'quality', 'security'],
    domain: { id: 'engineering', name: 'Engineering', color: 'bg-blue-500' },
    author: { id: '3', name: 'Alex Rodriguez', email: 'alex@example.com' },
    upvotes: 35,
    downvotes: 2,
    views: 124,
    featured: false,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    hasUpvoted: false,
    hasBookmarked: false,
  },
]

const insightTypes = [
  { 
    key: 'lessonLearned', 
    title: 'Lesson Learned', 
    icon: LightBulbIcon, 
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  { 
    key: 'gotchas', 
    title: 'Gotchas', 
    icon: ExclamationTriangleIcon, 
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  { 
    key: 'bestPractices', 
    title: 'Best Practices', 
    icon: CheckCircleIcon, 
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
]

interface InsightCardProps {
  insight: InsightCard
  onVote?: (id: string, type: 'up' | 'down') => void
  onBookmark?: (id: string) => void
  compact?: boolean
}

function InsightCardComponent({ insight, onVote, onBookmark, compact = false }: InsightCardProps) {
  const handleVote = (type: 'up' | 'down') => {
    onVote?.(insight.id, type)
  }

  const handleBookmark = () => {
    onBookmark?.(insight.id)
  }

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              insight.domain?.color || 'bg-gray-500'
            }`}>
              <LightBulbIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
              {insight.title}
            </h4>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {insight.description}
            </p>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{insight.author.name || insight.author.email}</span>
                <span>•</span>
                <span>{formatRelativeTime(insight.createdAt)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-xs text-gray-500">
                  <HeartIcon className="h-3 w-3 mr-1" />
                  {insight.upvotes}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <EyeIcon className="h-3 w-3 mr-1" />
                  {insight.views}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {insight.domain && (
                <Badge variant="secondary" size="sm">
                  {insight.domain.name}
                </Badge>
              )}
              {insight.featured && (
                <Badge variant="info" size="sm">
                  <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {insight.title}
            </h3>
            <p className="text-sm text-gray-600">
              {insight.description}
            </p>
          </div>
          
          <button
            onClick={handleBookmark}
            className={`ml-4 p-2 rounded-lg ${
              insight.hasBookmarked 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            } transition-colors`}
          >
            {insight.hasBookmarked ? (
              <BookmarkSolidIcon className="h-5 w-5" />
            ) : (
              <BookmarkIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Tags */}
        {insight.tags.length > 0 && (
          <div className="flex items-center space-x-2 mt-4">
            <TagIcon className="h-4 w-4 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {insight.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Insights Content */}
      <div className="px-6 pb-4 space-y-4">
        {insightTypes.map((type) => {
          const content = insight[type.key as keyof InsightCard] as string
          if (!content) return null
          
          const IconComponent = type.icon
          
          return (
            <div key={type.key} className={`rounded-lg p-4 ${type.bgColor}`}>
              <div className="flex items-start space-x-3">
                <IconComponent className={`h-5 w-5 ${type.color} flex-shrink-0 mt-0.5`} />
                <div className="flex-1">
                  <h4 className={`text-sm font-medium ${type.color} mb-2`}>
                    {type.title}
                  </h4>
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {content}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Related Content */}
      {insight.content && (
        <div className="px-6 pb-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center space-x-2">
              <BookOpenIcon className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Related Content:</span>
              <a
                href={insight.content.href}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                {insight.content.title}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Card Footer */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                {insight.author.image ? (
                  <img 
                    src={insight.author.image} 
                    alt={insight.author.name || insight.author.email}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <span className="text-xs font-medium text-gray-600">
                    {getInitials(insight.author.name || insight.author.email)}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{insight.author.name || insight.author.email}</span>
                <span className="mx-1">•</span>
                <span>{formatRelativeTime(insight.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <EyeIcon className="h-4 w-4" />
              <span>{insight.views} views</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleVote('up')}
              className={`flex items-center space-x-1 text-sm ${
                insight.hasUpvoted ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}
            >
              {insight.hasUpvoted ? (
                <HeartSolidIcon className="h-4 w-4" />
              ) : (
                <HeartIcon className="h-4 w-4" />
              )}
              <span>{insight.upvotes}</span>
            </button>

            <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
              <ChatBubbleLeftIcon className="h-4 w-4" />
              <span>Comment</span>
            </button>

            <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
              <ShareIcon className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface InsightCardsProps {
  domainId?: string
  contentId?: string
  featured?: boolean
  limit?: number
  compact?: boolean
  className?: string
}

export function InsightCards({ 
  domainId, 
  contentId, 
  featured = false, 
  limit,
  compact = false,
  className = '' 
}: InsightCardsProps) {
  const [insights, setInsights] = useState<InsightCard[]>(mockInsightCards)

  // Filter insights based on props
  let filteredInsights = insights
  if (domainId) {
    filteredInsights = filteredInsights.filter(insight => insight.domain?.id === domainId)
  }
  if (contentId) {
    filteredInsights = filteredInsights.filter(insight => insight.content?.id === contentId)
  }
  if (featured) {
    filteredInsights = filteredInsights.filter(insight => insight.featured)
  }
  if (limit) {
    filteredInsights = filteredInsights.slice(0, limit)
  }

  const handleVote = (id: string, type: 'up' | 'down') => {
    setInsights(prev => 
      prev.map(insight => {
        if (insight.id === id) {
          const newInsight = { ...insight }
          if (type === 'up') {
            if (insight.hasUpvoted) {
              newInsight.upvotes -= 1
              newInsight.hasUpvoted = false
            } else {
              newInsight.upvotes += 1
              newInsight.hasUpvoted = true
            }
          }
          return newInsight
        }
        return insight
      })
    )
  }

  const handleBookmark = (id: string) => {
    setInsights(prev => 
      prev.map(insight => 
        insight.id === id 
          ? { ...insight, hasBookmarked: !insight.hasBookmarked }
          : insight
      )
    )
  }

  if (filteredInsights.length === 0) {
    return null
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {filteredInsights.map((insight) => (
        <InsightCardComponent
          key={insight.id}
          insight={insight}
          onVote={handleVote}
          onBookmark={handleBookmark}
          compact={compact}
        />
      ))}
    </div>
  )
}

// Standalone featured insights widget
export function FeaturedInsights({ limit = 3, className = '' }: { limit?: number, className?: string }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Featured Insights</h3>
        <ArrowTrendingUpIcon className="h-5 w-5 text-blue-500" />
      </div>
      
      <InsightCards featured={true} limit={limit} compact={true} />
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <a
          href="/insights"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View all insights →
        </a>
      </div>
    </div>
  )
}