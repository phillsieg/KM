'use client'

import {
  ChartBarIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline'
import { Badge } from '@/components/ui/badge'

// Mock data - in real app this would come from API
const kpiData = {
  contentHealth: {
    total: 1247,
    published: 1108,
    needsUpdate: 89,
    overdue: 23,
    inReview: 27,
    trend: 'up',
    trendValue: '+5.2%'
  },
  adoption: {
    activeUsers: 342,
    monthlyViews: 28945,
    searchQueries: 5678,
    documentDownloads: 1234,
    trend: 'up',
    trendValue: '+12.3%'
  },
  knowledgeGaps: [
    { domain: 'Compliance', priority: 'high', gapCount: 12 },
    { domain: 'Engineering', priority: 'medium', gapCount: 8 },
    { domain: 'Operations', priority: 'low', gapCount: 3 },
  ],
  reviewMetrics: {
    avgReviewTime: 3.2,
    onTimeCompletion: 87,
    qualityScore: 4.3,
    reviewerUtilization: 76
  }
}

function MetricCard({ title, value, subtitle, trend, trendValue, icon: Icon, color }: {
  title: string
  value: string | number
  subtitle: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon: React.ElementType
  color: string
}) {
  const TrendIcon = trend === 'up' ? ArrowTrendingUpIcon : trend === 'down' ? ArrowTrendingDownIcon : null

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && trendValue && TrendIcon && (
              <div className={`ml-2 flex items-center text-sm ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendIcon className="h-4 w-4 mr-1" />
                {trendValue}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

function ContentHealthChart() {
  const { contentHealth } = kpiData
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Content Health Overview</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Published Content</span>
          <div className="flex items-center space-x-2">
            <div className="w-32 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-green-500 rounded-full" 
                style={{ width: `${(contentHealth.published / contentHealth.total) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-500">{contentHealth.published}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Needs Update</span>
          <div className="flex items-center space-x-2">
            <div className="w-32 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-yellow-500 rounded-full" 
                style={{ width: `${(contentHealth.needsUpdate / contentHealth.total) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-500">{contentHealth.needsUpdate}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Overdue Reviews</span>
          <div className="flex items-center space-x-2">
            <div className="w-32 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-red-500 rounded-full" 
                style={{ width: `${(contentHealth.overdue / contentHealth.total) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-500">{contentHealth.overdue}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">In Review</span>
          <div className="flex items-center space-x-2">
            <div className="w-32 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-500 rounded-full" 
                style={{ width: `${(contentHealth.inReview / contentHealth.total) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-500">{contentHealth.inReview}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Total Documents</span>
          <span className="font-medium text-gray-900">{contentHealth.total}</span>
        </div>
      </div>
    </div>
  )
}

function KnowledgeGapsWidget() {
  const { knowledgeGaps } = kpiData

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Knowledge Gaps</h3>
        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      </div>

      <div className="space-y-3">
        {knowledgeGaps.map((gap) => (
          <div key={gap.domain} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">{gap.domain}</span>
              <Badge 
                variant={gap.priority === 'high' ? 'error' : gap.priority === 'medium' ? 'warning' : 'success'}
                size="sm"
              >
                {gap.priority}
              </Badge>
            </div>
            <span className="text-sm text-gray-500">{gap.gapCount} gaps</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
          View detailed gap analysis →
        </button>
      </div>
    </div>
  )
}

function ReviewMetricsWidget() {
  const { reviewMetrics } = kpiData

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Review Performance</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{reviewMetrics.avgReviewTime}d</p>
          <p className="text-sm text-gray-500">Avg Review Time</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{reviewMetrics.onTimeCompletion}%</p>
          <p className="text-sm text-gray-500">On-time Completion</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{reviewMetrics.qualityScore}/5</p>
          <p className="text-sm text-gray-500">Quality Score</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900">{reviewMetrics.reviewerUtilization}%</p>
          <p className="text-sm text-gray-500">Reviewer Utilization</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
          View reviewer analytics →
        </button>
      </div>
    </div>
  )
}

export function LeadersDashboard() {
  const { contentHealth, adoption } = kpiData

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Total Content"
          value={contentHealth.total}
          subtitle="Published documents"
          trend={contentHealth.trend as 'up' | 'down'}
          trendValue={contentHealth.trendValue}
          icon={DocumentCheckIcon}
          color="bg-blue-500"
        />
        
        <MetricCard
          title="Active Users"
          value={adoption.activeUsers}
          subtitle="This month"
          trend={adoption.trend as 'up' | 'down'}
          trendValue={adoption.trendValue}
          icon={UserGroupIcon}
          color="bg-green-500"
        />
        
        <MetricCard
          title="Monthly Views"
          value={adoption.monthlyViews.toLocaleString()}
          subtitle="Content engagement"
          trend="up"
          trendValue="+8.2%"
          icon={BookOpenIcon}
          color="bg-purple-500"
        />
        
        <MetricCard
          title="Review Overdue"
          value={contentHealth.overdue}
          subtitle="Needs attention"
          trend="down"
          trendValue="-12%"
          icon={ClockIcon}
          color="bg-red-500"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentHealthChart />
        <KnowledgeGapsWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReviewMetricsWidget />
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Review Overdue Content</span>
                <Badge variant="error" size="sm">{contentHealth.overdue}</Badge>
              </div>
            </button>
            
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Address Knowledge Gaps</span>
                <Badge variant="warning" size="sm">3 domains</Badge>
              </div>
            </button>
            
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Review Analytics Report</span>
                <ChartBarIcon className="h-4 w-4 text-gray-400" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}