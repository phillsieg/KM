'use client'

import { useState } from 'react'
import {
  LightBulbIcon,
  PlusIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Badge } from '@/components/ui/badge'
import { getInitials } from '@/lib/utils'

interface TipHeuristic {
  id: string
  title: string
  content: string
  category: 'TIP' | 'HEURISTIC' | 'BEST_PRACTICE' | 'GOTCHA' | 'WORKAROUND'
  author: {
    id: string
    name: string | null
    email: string
    image?: string | null
  }
  upvotes: number
  downvotes: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
  hasUpvoted?: boolean
  hasDownvoted?: boolean
}

// Mock data for tips and heuristics
const mockTips: TipHeuristic[] = [
  {
    id: '1',
    title: 'Always Test API Endpoints in Isolation',
    content: 'When debugging API issues, create minimal test cases that isolate the specific endpoint. This helps you identify whether the issue is in your code, the API itself, or the integration layer.',
    category: 'TIP',
    author: { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com' },
    upvotes: 23,
    downvotes: 2,
    featured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    hasUpvoted: false,
  },
  {
    id: '2',
    title: 'Database Connection Pool Gotcha',
    content: 'Watch out for connection pool exhaustion when running long database migrations. Always use proper connection management and consider running migrations during low-traffic periods.',
    category: 'GOTCHA',
    author: { id: '2', name: 'Mike Chen', email: 'mike@example.com' },
    upvotes: 18,
    downvotes: 0,
    featured: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    hasUpvoted: true,
  },
  {
    id: '3',
    title: 'Code Review Heuristic: Focus on Intent',
    content: 'When reviewing code, first understand the intent before diving into implementation details. Ask yourself: "What is this code trying to achieve?" This helps you provide more meaningful feedback.',
    category: 'HEURISTIC',
    author: { id: '3', name: 'Alex Rodriguez', email: 'alex@example.com' },
    upvotes: 31,
    downvotes: 1,
    featured: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    hasUpvoted: false,
  },
  {
    id: '4',
    title: 'Temporary Fix for SSL Certificate Issues',
    content: 'If you encounter SSL certificate validation errors in development, you can temporarily disable verification. Remember to re-enable it before production deployment.',
    category: 'WORKAROUND',
    author: { id: '4', name: 'Lisa Park', email: 'lisa@example.com' },
    upvotes: 12,
    downvotes: 5,
    featured: false,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    hasUpvoted: false,
  },
]

const categoryConfig = {
  TIP: {
    icon: LightBulbIcon,
    color: 'bg-yellow-100 text-yellow-800',
    bgColor: 'bg-yellow-50',
    label: 'Tip'
  },
  HEURISTIC: {
    icon: SparklesIcon,
    color: 'bg-purple-100 text-purple-800',
    bgColor: 'bg-purple-50',
    label: 'Heuristic'
  },
  BEST_PRACTICE: {
    icon: HeartIcon,
    color: 'bg-green-100 text-green-800',
    bgColor: 'bg-green-50',
    label: 'Best Practice'
  },
  GOTCHA: {
    icon: ExclamationTriangleIcon,
    color: 'bg-red-100 text-red-800',
    bgColor: 'bg-red-50',
    label: 'Gotcha'
  },
  WORKAROUND: {
    icon: WrenchScrewdriverIcon,
    color: 'bg-blue-100 text-blue-800',
    bgColor: 'bg-blue-50',
    label: 'Workaround'
  },
}

interface TipsHeuristicsProps {
  domainId: string
  domainName: string
}

export function TipsHeuristics({ domainId, domainName }: TipsHeuristicsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [tips, setTips] = useState<TipHeuristic[]>(mockTips)

  const filteredTips = selectedCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory)

  const featuredTips = tips.filter(tip => tip.featured)

  const handleVote = (tipId: string, voteType: 'up' | 'down') => {
    setTips(prevTips => 
      prevTips.map(tip => {
        if (tip.id === tipId) {
          const newTip = { ...tip }
          
          if (voteType === 'up') {
            if (tip.hasUpvoted) {
              newTip.upvotes -= 1
              newTip.hasUpvoted = false
            } else {
              newTip.upvotes += 1
              newTip.hasUpvoted = true
              if (tip.hasDownvoted) {
                newTip.downvotes -= 1
                newTip.hasDownvoted = false
              }
            }
          } else {
            if (tip.hasDownvoted) {
              newTip.downvotes -= 1
              newTip.hasDownvoted = false
            } else {
              newTip.downvotes += 1
              newTip.hasDownvoted = true
              if (tip.hasUpvoted) {
                newTip.upvotes -= 1
                newTip.hasUpvoted = false
              }
            }
          }
          
          return newTip
        }
        return tip
      })
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Tips & Heuristics</h2>
          <p className="text-sm text-gray-600 mt-1">
            Community knowledge and practical insights for {domainName}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Tip
        </button>
      </div>

      {/* Featured Tips */}
      {featuredTips.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <SparklesIcon className="h-5 w-5 text-purple-500 mr-2" />
            Featured Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredTips.slice(0, 2).map((tip) => {
              const config = categoryConfig[tip.category]
              const IconComponent = config.icon
              
              return (
                <div key={tip.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${config.bgColor}`}>
                      <IconComponent className={`h-4 w-4 ${config.color.split(' ')[1]} ${config.color.split(' ')[2]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">{tip.title}</h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{tip.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          by {tip.author.name || tip.author.email}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" size="sm">{config.label}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({tips.length})
        </button>
        {Object.entries(categoryConfig).map(([category, config]) => {
          const count = tips.filter(tip => tip.category === category).length
          if (count === 0) return null
          
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === category
                  ? config.color
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {config.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Tips List */}
      <div className="space-y-4">
        {filteredTips.map((tip) => {
          const config = categoryConfig[tip.category]
          const IconComponent = config.icon
          
          return (
            <div key={tip.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${config.bgColor}`}>
                  <IconComponent className={`h-5 w-5 ${config.color.split(' ')[1]} ${config.color.split(' ')[2]}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{tip.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" size="sm">{config.label}</Badge>
                        {tip.featured && (
                          <Badge variant="info" size="sm">
                            <SparklesIcon className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mt-3">{tip.content}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          {tip.author.image ? (
                            <img 
                              src={tip.author.image} 
                              alt={tip.author.name || tip.author.email}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <span className="text-xs font-medium text-gray-600">
                              {getInitials(tip.author.name || tip.author.email)}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{tip.author.name || tip.author.email}</span>
                          <span className="mx-1">•</span>
                          <span>{tip.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleVote(tip.id, 'up')}
                        className={`flex items-center space-x-1 text-sm ${
                          tip.hasUpvoted ? 'text-green-600' : 'text-gray-500 hover:text-green-600'
                        }`}
                      >
                        {tip.hasUpvoted ? (
                          <HeartSolidIcon className="h-4 w-4" />
                        ) : (
                          <HeartIcon className="h-4 w-4" />
                        )}
                        <span>{tip.upvotes}</span>
                      </button>
                      
                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                        <ChatBubbleLeftIcon className="h-4 w-4" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredTips.length === 0 && (
        <div className="text-center py-12">
          <LightBulbIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tips yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Be the first to share your knowledge and insights for this category.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add First Tip
          </button>
        </div>
      )}
    </div>
  )
}