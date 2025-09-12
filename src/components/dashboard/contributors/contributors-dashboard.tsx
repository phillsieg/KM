'use client'

import {
  DocumentPlusIcon,
  StarIcon,
  BookOpenIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline'
import { CompactContentCard } from '@/components/content/content-card'

const contributorData = {
  stats: {
    contentCreated: 12,
    avgRating: 4.3,
    totalViews: 2456,
    achievements: 3,
  },
  recentContent: [
    {
      id: '1',
      title: 'Testing Best Practices',
      contentType: 'SOP',
      lifecycleState: 'PUBLISHED',
      domain: 'Engineering',
      owner: { id: 'current', name: 'You', email: 'current@example.com' },
      updatedAt: new Date('2024-01-15'),
      views: 89,
      href: '/content/testing-practices',
    },
  ],
  learningRecommendations: [
    'Advanced Git Workflows',
    'Security Review Process',
    'Technical Writing Guidelines',
  ]
}

export function ContributorsDashboard() {
  return (
    <div className="space-y-6">
      {/* Contributor Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <DocumentPlusIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-semibold text-gray-900">{contributorData.stats.contentCreated}</p>
          <p className="text-sm text-gray-500">Content Created</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <StarIcon className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-semibold text-gray-900">{contributorData.stats.avgRating}/5</p>
          <p className="text-sm text-gray-500">Avg Rating</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <BookOpenIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-semibold text-gray-900">{contributorData.stats.totalViews.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Views</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <TrophyIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-semibold text-gray-900">{contributorData.stats.achievements}</p>
          <p className="text-sm text-gray-500">Achievements</p>
        </div>
      </div>

      {/* Recent Content */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Recent Content</h3>
        <div className="space-y-4">
          {contributorData.recentContent.map((item) => (
            <CompactContentCard key={item.id} {...item} />
          ))}
        </div>
      </div>

      {/* Learning Recommendations */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Learning</h3>
        <div className="space-y-2">
          {contributorData.learningRecommendations.map((item, index) => (
            <div key={index} className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
              <BookOpenIcon className="h-5 w-5 text-blue-500 mr-3" />
              <span className="text-sm font-medium text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}