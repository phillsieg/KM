'use client'

import {
  DocumentCheckIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'
import { CompactContentCard } from '@/components/content/content-card'
import { Badge } from '@/components/ui/badge'

// Mock data for SME dashboard
const smeData = {
  pendingReviews: [
    {
      id: '1',
      title: 'Updated Security Protocols',
      contentType: 'Policy',
      lifecycleState: 'IN_REVIEW',
      domain: 'Compliance',
      owner: { id: '1', name: 'John Smith', email: 'john@example.com' },
      updatedAt: new Date('2024-01-10'),
      nextReviewDate: new Date('2024-01-15'),
      href: '/content/security-protocols',
    },
    {
      id: '2', 
      title: 'API Integration Guidelines',
      contentType: 'SOP',
      lifecycleState: 'IN_REVIEW',
      domain: 'Engineering',
      owner: { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com' },
      updatedAt: new Date('2024-01-12'),
      nextReviewDate: new Date('2024-01-18'),
      href: '/content/api-guidelines',
    },
  ],
  ownedContent: [
    {
      id: '3',
      title: 'Data Management Standards',
      contentType: 'Standard',
      lifecycleState: 'PUBLISHED',
      domain: 'Engineering',
      owner: { id: 'current', name: 'You', email: 'current@example.com' },
      updatedAt: new Date('2024-01-05'),
      nextReviewDate: new Date('2024-07-05'),
      views: 234,
      href: '/content/data-standards',
    },
  ],
  collaborationRequests: 3,
  domainMetrics: {
    totalContent: 45,
    avgQualityScore: 4.2,
    reviewBacklog: 8,
  }
}

export function SMEDashboard() {
  return (
    <div className="space-y-6">
      {/* SME Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <DocumentCheckIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{smeData.domainMetrics.totalContent}</p>
              <p className="text-sm text-gray-500">Content in your domains</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{smeData.pendingReviews.length}</p>
              <p className="text-sm text-gray-500">Pending reviews</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{smeData.collaborationRequests}</p>
              <p className="text-sm text-gray-500">Collaboration requests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Reviews */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Pending Reviews</h3>
          <Badge variant="warning" size="sm">{smeData.pendingReviews.length} items</Badge>
        </div>
        
        <div className="space-y-4">
          {smeData.pendingReviews.map((item) => (
            <CompactContentCard key={item.id} {...item} />
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View all pending reviews →
          </button>
        </div>
      </div>

      {/* Content You Own/Steward */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Content You Steward</h3>
        
        <div className="space-y-4">
          {smeData.ownedContent.map((item) => (
            <CompactContentCard key={item.id} {...item} />
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View all your content →
          </button>
        </div>
      </div>
    </div>
  )
}