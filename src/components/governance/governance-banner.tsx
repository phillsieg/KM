'use client'

import {
  CheckCircleIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ClockIcon,
  EyeIcon,
  LinkIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid'
import { Badge, LifecycleStateBadge, SensitivityBadge } from '@/components/ui/badge'
import { formatRelativeTime, getInitials } from '@/lib/utils'

interface Approver {
  id: string
  name: string | null
  email: string
  image?: string | null
  role: string
}

interface LinkedRegulation {
  id: string
  title: string
  reference: string
  href?: string
  type: 'regulation' | 'standard' | 'policy' | 'law'
}

interface GovernanceBannerProps {
  contentId: string
  lifecycleState: string
  sensitivity: string
  approvedBy?: Approver | null
  approvedAt?: Date | null
  lastReviewedAt?: Date | null
  nextReviewDate?: Date | null
  linkedRegulations?: LinkedRegulation[]
  decisionRationale?: string | null
  publishedAt?: Date | null
  version?: string
  className?: string
}

const sensitivityConfig = {
  PUBLIC: {
    icon: InformationCircleIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: 'This content is publicly accessible.'
  },
  INTERNAL: {
    icon: ShieldCheckIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    description: 'This content is for internal use only.'
  },
  RESTRICTED: {
    icon: ExclamationTriangleIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: 'This content has restricted access.'
  }
}

const regulationTypeConfig = {
  regulation: { label: 'Regulation', color: 'bg-red-100 text-red-800' },
  standard: { label: 'Standard', color: 'bg-blue-100 text-blue-800' },
  policy: { label: 'Policy', color: 'bg-purple-100 text-purple-800' },
  law: { label: 'Law', color: 'bg-gray-100 text-gray-800' },
}

export function GovernanceBanner({
  contentId,
  lifecycleState,
  sensitivity,
  approvedBy,
  approvedAt,
  lastReviewedAt,
  nextReviewDate,
  linkedRegulations = [],
  decisionRationale,
  publishedAt,
  version,
  className = ''
}: GovernanceBannerProps) {
  const sensitivityInfo = sensitivityConfig[sensitivity as keyof typeof sensitivityConfig] || sensitivityConfig.INTERNAL
  const SensitivityIcon = sensitivityInfo.icon

  const isOverdueForReview = nextReviewDate && new Date() > nextReviewDate
  const isDueSoon = nextReviewDate && !isOverdueForReview && 
    (nextReviewDate.getTime() - new Date().getTime()) < (7 * 24 * 60 * 60 * 1000) // 7 days

  const showGovernanceBanner = approvedBy || linkedRegulations.length > 0 || decisionRationale || sensitivity === 'RESTRICTED'

  if (!showGovernanceBanner && lifecycleState === 'PUBLISHED') {
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Sensitivity Banner */}
      {(sensitivity === 'RESTRICTED' || sensitivity === 'INTERNAL') && (
        <div className={`rounded-lg p-4 border ${sensitivityInfo.bgColor} ${sensitivityInfo.borderColor}`}>
          <div className="flex items-center space-x-3">
            <SensitivityIcon className={`h-6 w-6 ${sensitivityInfo.color}`} />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className={`text-sm font-medium ${sensitivityInfo.color}`}>
                  {sensitivity.charAt(0) + sensitivity.slice(1).toLowerCase()} Content
                </h3>
                <SensitivityBadge sensitivity={sensitivity} size="sm" />
              </div>
              <p className={`text-sm mt-1 ${sensitivityInfo.color.replace('600', '700')}`}>
                {sensitivityInfo.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Governance Banner */}
      {showGovernanceBanner && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">Governance Information</h3>
              </div>
              <div className="flex items-center space-x-2">
                <LifecycleStateBadge state={lifecycleState} size="sm" />
                {version && (
                  <Badge variant="secondary" size="sm">
                    v{version}
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Approval Information */}
              {approvedBy && approvedAt && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center">
                    <CheckCircleSolidIcon className="h-4 w-4 text-green-500 mr-1" />
                    Approved By
                  </h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      {approvedBy.image ? (
                        <img 
                          src={approvedBy.image} 
                          alt={approvedBy.name || approvedBy.email}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <span className="text-xs font-medium text-green-800">
                          {getInitials(approvedBy.name || approvedBy.email)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {approvedBy.name || approvedBy.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {approvedBy.role} • {formatRelativeTime(approvedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Review Information */}
              {(lastReviewedAt || nextReviewDate) && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center">
                    <ClockIcon className="h-4 w-4 text-gray-500 mr-1" />
                    Review Status
                  </h4>
                  <div className="space-y-1">
                    {lastReviewedAt && (
                      <p className="text-sm text-gray-600">
                        Last reviewed {formatRelativeTime(lastReviewedAt)}
                      </p>
                    )}
                    {nextReviewDate && (
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-600">Next review:</p>
                        <span className={`text-sm ${
                          isOverdueForReview 
                            ? 'text-red-600 font-medium' 
                            : isDueSoon 
                            ? 'text-yellow-600 font-medium' 
                            : 'text-gray-600'
                        }`}>
                          {isOverdueForReview 
                            ? `Overdue (${formatRelativeTime(nextReviewDate)})` 
                            : nextReviewDate.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Publication Information */}
              {publishedAt && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center">
                    <CalendarDaysIcon className="h-4 w-4 text-gray-500 mr-1" />
                    Publication
                  </h4>
                  <p className="text-sm text-gray-600">
                    Published {formatRelativeTime(publishedAt)}
                  </p>
                </div>
              )}
            </div>

            {/* Decision Rationale */}
            {decisionRationale && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Decision Rationale</h4>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-900">{decisionRationale}</p>
                </div>
              </div>
            )}

            {/* Linked Regulations */}
            {linkedRegulations.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <LinkIcon className="h-4 w-4 text-gray-500 mr-1" />
                  Linked Compliance Requirements
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {linkedRegulations.map((regulation) => {
                    const typeConfig = regulationTypeConfig[regulation.type]
                    
                    return (
                      <div key={regulation.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant="secondary" size="sm" className={typeConfig.color}>
                                {typeConfig.label}
                              </Badge>
                              <span className="text-xs text-gray-500">{regulation.reference}</span>
                            </div>
                            <h5 className="text-sm font-medium text-gray-900 truncate">
                              {regulation.title}
                            </h5>
                          </div>
                          {regulation.href && (
                            <a
                              href={regulation.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                              title="View regulation"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Governance Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    View Audit Trail
                  </button>
                  <button className="text-sm font-medium text-gray-600 hover:text-gray-800">
                    Download Compliance Report
                  </button>
                </div>
                
                <div className="text-xs text-gray-500">
                  Document ID: {contentId}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Alert */}
      {(isOverdueForReview || isDueSoon) && (
        <div className={`rounded-lg p-4 border ${
          isOverdueForReview 
            ? 'bg-red-50 border-red-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className={`h-6 w-6 ${
              isOverdueForReview ? 'text-red-600' : 'text-yellow-600'
            }`} />
            <div className="flex-1">
              <h3 className={`text-sm font-medium ${
                isOverdueForReview ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {isOverdueForReview ? 'Review Overdue' : 'Review Due Soon'}
              </h3>
              <p className={`text-sm mt-1 ${
                isOverdueForReview ? 'text-red-700' : 'text-yellow-700'
              }`}>
                {isOverdueForReview 
                  ? `This content review was due ${formatRelativeTime(nextReviewDate!)} and requires immediate attention.`
                  : `This content is due for review on ${nextReviewDate!.toLocaleDateString()}.`}
              </p>
            </div>
            <button className={`px-3 py-1 text-xs font-medium rounded-md ${
              isOverdueForReview 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-yellow-600 text-white hover:bg-yellow-700'
            }`}>
              Schedule Review
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Simplified governance summary for cards/lists
export function GovernanceSummary({
  approvedBy,
  approvedAt,
  linkedRegulations = [],
  className = ''
}: Pick<GovernanceBannerProps, 'approvedBy' | 'approvedAt' | 'linkedRegulations' | 'className'>) {
  if (!approvedBy && linkedRegulations.length === 0) {
    return null
  }

  return (
    <div className={`flex items-center space-x-4 text-xs text-gray-500 ${className}`}>
      {approvedBy && approvedAt && (
        <div className="flex items-center space-x-1">
          <CheckCircleIcon className="h-3 w-3 text-green-500" />
          <span>Approved by {approvedBy.name || approvedBy.email}</span>
        </div>
      )}
      
      {linkedRegulations.length > 0 && (
        <div className="flex items-center space-x-1">
          <ShieldCheckIcon className="h-3 w-3 text-blue-500" />
          <span>{linkedRegulations.length} compliance link{linkedRegulations.length > 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  )
}