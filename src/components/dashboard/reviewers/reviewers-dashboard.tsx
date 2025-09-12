'use client'

import {
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { ReviewStatusBadge } from '@/components/ui/badge'

const reviewerData = {
  stats: {
    assignedReviews: 8,
    completedThisMonth: 15,
    avgReviewTime: 2.3,
    approvalRate: 87,
  },
  pendingAssignments: [
    {
      id: '1',
      title: 'Emergency Response Procedures',
      type: 'Policy',
      assignedDate: new Date('2024-01-10'),
      dueDate: new Date('2024-01-17'),
      priority: 'high',
      author: 'Jane Doe',
    },
    {
      id: '2',
      title: 'Code Review Guidelines Update',
      type: 'SOP',
      assignedDate: new Date('2024-01-12'),
      dueDate: new Date('2024-01-19'),
      priority: 'medium',
      author: 'John Smith',
    },
  ]
}

export function ReviewersDashboard() {
  return (
    <div className="space-y-6">
      {/* Review Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <ClipboardDocumentCheckIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-semibold text-gray-900">{reviewerData.stats.assignedReviews}</p>
          <p className="text-sm text-gray-500">Assigned Reviews</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-semibold text-gray-900">{reviewerData.stats.completedThisMonth}</p>
          <p className="text-sm text-gray-500">Completed This Month</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <ClockIcon className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-semibold text-gray-900">{reviewerData.stats.avgReviewTime}d</p>
          <p className="text-sm text-gray-500">Avg Review Time</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
          <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-white text-sm font-medium">{reviewerData.stats.approvalRate}%</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{reviewerData.stats.approvalRate}%</p>
          <p className="text-sm text-gray-500">Approval Rate</p>
        </div>
      </div>

      {/* Pending Assignments */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Review Assignments</h3>
        
        <div className="space-y-4">
          {reviewerData.pendingAssignments.map((assignment) => {
            const daysUntilDue = Math.ceil((assignment.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            const isOverdue = daysUntilDue < 0
            const isDueSoon = daysUntilDue <= 2 && daysUntilDue >= 0
            
            return (
              <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{assignment.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {assignment.type} • By {assignment.author}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Assigned {assignment.assignedDate.toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <ReviewStatusBadge 
                      status={assignment.priority === 'high' ? 'REJECTED' : 'PENDING'} 
                      size="sm"
                    />
                    <span className={`text-xs ${
                      isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : 
                       isDueSoon ? `Due in ${daysUntilDue} days` : 
                       `Due ${assignment.dueDate.toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 space-x-2">
                  <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200">
                    View
                  </button>
                  <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
                    Review
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View all review assignments →
          </button>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Review Quality Metrics</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Thoroughness Score</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: '92%' }} />
              </div>
              <span className="text-sm text-gray-500">92%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Feedback Quality</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: '88%' }} />
              </div>
              <span className="text-sm text-gray-500">88%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Timeliness</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '76%' }} />
              </div>
              <span className="text-sm text-gray-500">76%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}