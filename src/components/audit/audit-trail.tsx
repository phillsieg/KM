'use client'

import { useState } from 'react'
import {
  ClockIcon,
  UserIcon,
  DocumentIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftIcon,
  TagIcon,
  LinkIcon,
  TrashIcon,
  ArchiveBoxIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime, getInitials } from '@/lib/utils'

interface AuditEntry {
  id: string
  userId: string
  userName: string | null
  userEmail: string
  userRole: string
  userImage?: string | null
  action: string
  resource: string
  resourceId: string
  timestamp: Date
  ipAddress?: string
  userAgent?: string
  oldValues?: Record<string, unknown>
  newValues?: Record<string, unknown>
  metadata?: Record<string, unknown>
  description?: string
  category: 'content' | 'access' | 'approval' | 'system' | 'compliance' | 'security'
  severity: 'low' | 'medium' | 'high' | 'critical'
  success: boolean
}

interface DecisionEntry {
  id: string
  title: string
  description: string
  rationale: string
  decidedBy: {
    id: string
    name: string | null
    email: string
    role: string
    image?: string | null
  }
  decidedAt: Date
  impact: 'low' | 'medium' | 'high'
  category: 'content' | 'policy' | 'technical' | 'compliance'
  stakeholders: string[]
  relatedContent?: string[]
  followUpRequired: boolean
  followUpDate?: Date | null
}

// Mock data for audit entries
const mockAuditEntries: AuditEntry[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Sarah Johnson',
    userEmail: 'sarah@example.com',
    userRole: 'STEWARD',
    action: 'CONTENT_APPROVED',
    resource: 'Content',
    resourceId: 'content-123',
    timestamp: new Date('2024-01-15T14:30:00Z'),
    ipAddress: '192.168.1.100',
    newValues: { lifecycleState: 'PUBLISHED', approvedBy: 'user1' },
    description: 'Approved content for publication after review',
    category: 'approval',
    severity: 'medium',
    success: true,
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Mike Chen',
    userEmail: 'mike@example.com',
    userRole: 'CONTRIBUTOR',
    action: 'CONTENT_UPDATED',
    resource: 'Content',
    resourceId: 'content-123',
    timestamp: new Date('2024-01-14T09:15:00Z'),
    oldValues: { title: 'Old Title', summary: 'Old summary' },
    newValues: { title: 'New Title', summary: 'Updated summary' },
    description: 'Updated content title and summary',
    category: 'content',
    severity: 'low',
    success: true,
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Alex Rodriguez',
    userEmail: 'alex@example.com',
    userRole: 'ADMIN',
    action: 'SENSITIVE_ACCESS',
    resource: 'Content',
    resourceId: 'content-123',
    timestamp: new Date('2024-01-13T16:45:00Z'),
    ipAddress: '10.0.1.50',
    metadata: { accessReason: 'Compliance audit', documentSensitivity: 'RESTRICTED' },
    description: 'Accessed restricted compliance document for audit purposes',
    category: 'security',
    severity: 'high',
    success: true,
  },
  {
    id: '4',
    userId: 'system',
    userName: 'System',
    userEmail: 'system@example.com',
    userRole: 'SYSTEM',
    action: 'AUTO_REVIEW_REMINDER',
    resource: 'Content',
    resourceId: 'content-123',
    timestamp: new Date('2024-01-12T08:00:00Z'),
    metadata: { reviewDueDate: '2024-01-20', notificationSent: true },
    description: 'Automated review reminder sent to content stewards',
    category: 'system',
    severity: 'low',
    success: true,
  }
]

const mockDecisions: DecisionEntry[] = [
  {
    id: '1',
    title: 'Adoption of New Security Protocol',
    description: 'Decision to implement enhanced security measures for handling sensitive customer data',
    rationale: 'Recent security assessments revealed vulnerabilities in current data handling processes. New protocol addresses GDPR compliance requirements and reduces breach risk by 85%.',
    decidedBy: {
      id: 'user1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'Security Director',
    },
    decidedAt: new Date('2024-01-10T10:00:00Z'),
    impact: 'high',
    category: 'compliance',
    stakeholders: ['Engineering Team', 'Compliance Officer', 'Data Protection Officer'],
    relatedContent: ['security-protocol-v2', 'gdpr-compliance-guide'],
    followUpRequired: true,
    followUpDate: new Date('2024-02-10T00:00:00Z'),
  },
  {
    id: '2',
    title: 'Deprecation of Legacy API Documentation',
    description: 'Decision to remove outdated API documentation and redirect to new versioned docs',
    rationale: 'Legacy documentation was causing confusion among developers and contained security vulnerabilities. New documentation is more comprehensive and follows current best practices.',
    decidedBy: {
      id: 'user2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'Technical Lead',
    },
    decidedAt: new Date('2024-01-08T15:30:00Z'),
    impact: 'medium',
    category: 'technical',
    stakeholders: ['Development Team', 'API Users', 'Technical Writers'],
    relatedContent: ['api-docs-v3', 'migration-guide'],
    followUpRequired: false,
  }
]

const actionConfig = {
  CONTENT_CREATED: { icon: DocumentIcon, color: 'text-blue-600', label: 'Created' },
  CONTENT_UPDATED: { icon: PencilIcon, color: 'text-yellow-600', label: 'Updated' },
  CONTENT_APPROVED: { icon: CheckCircleIcon, color: 'text-green-600', label: 'Approved' },
  CONTENT_REJECTED: { icon: XCircleIcon, color: 'text-red-600', label: 'Rejected' },
  CONTENT_PUBLISHED: { icon: DocumentIcon, color: 'text-blue-600', label: 'Published' },
  CONTENT_ARCHIVED: { icon: ArchiveBoxIcon, color: 'text-gray-600', label: 'Archived' },
  CONTENT_DELETED: { icon: TrashIcon, color: 'text-red-600', label: 'Deleted' },
  CONTENT_VIEWED: { icon: EyeIcon, color: 'text-gray-500', label: 'Viewed' },
  CONTENT_DOWNLOADED: { icon: ArrowDownTrayIcon, color: 'text-green-500', label: 'Downloaded' },
  COMMENT_ADDED: { icon: ChatBubbleLeftIcon, color: 'text-blue-500', label: 'Commented' },
  TAG_ADDED: { icon: TagIcon, color: 'text-purple-500', label: 'Tagged' },
  LINK_ADDED: { icon: LinkIcon, color: 'text-indigo-500', label: 'Linked' },
  SENSITIVE_ACCESS: { icon: ShieldCheckIcon, color: 'text-red-600', label: 'Sensitive Access' },
  AUTO_REVIEW_REMINDER: { icon: ClockIcon, color: 'text-yellow-500', label: 'Review Reminder' },
}

const severityConfig = {
  low: { color: 'bg-gray-100 text-gray-800', label: 'Low' },
  medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
  high: { color: 'bg-orange-100 text-orange-800', label: 'High' },
  critical: { color: 'bg-red-100 text-red-800', label: 'Critical' },
}

const categoryConfig = {
  content: { color: 'bg-blue-100 text-blue-800', label: 'Content' },
  access: { color: 'bg-green-100 text-green-800', label: 'Access' },
  approval: { color: 'bg-purple-100 text-purple-800', label: 'Approval' },
  system: { color: 'bg-gray-100 text-gray-800', label: 'System' },
  compliance: { color: 'bg-red-100 text-red-800', label: 'Compliance' },
  security: { color: 'bg-orange-100 text-orange-800', label: 'Security' },
}

interface AuditTrailProps {
  resourceId?: string
  userId?: string
  showDecisions?: boolean
  limit?: number
  className?: string
}

export function AuditTrail({
  resourceId,
  userId,
  showDecisions = true,
  limit,
  className = ''
}: AuditTrailProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)
  const [showSystemEvents, setShowSystemEvents] = useState(false)

  // Filter audit entries
  let filteredEntries = mockAuditEntries
  if (resourceId) {
    filteredEntries = filteredEntries.filter(entry => entry.resourceId === resourceId)
  }
  if (userId) {
    filteredEntries = filteredEntries.filter(entry => entry.userId === userId)
  }
  if (selectedCategory !== 'all') {
    filteredEntries = filteredEntries.filter(entry => entry.category === selectedCategory)
  }
  if (!showSystemEvents) {
    filteredEntries = filteredEntries.filter(entry => entry.userId !== 'system')
  }
  if (limit) {
    filteredEntries = filteredEntries.slice(0, limit)
  }

  const toggleExpanded = (entryId: string) => {
    setExpandedEntry(expandedEntry === entryId ? null : entryId)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Audit Trail</h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete history of actions and decisions
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={showSystemEvents}
              onChange={(e) => setShowSystemEvents(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span>Show system events</span>
          </label>
          
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
            Export Trail
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({filteredEntries.length})
        </button>
        
        {Object.entries(categoryConfig).map(([category, config]) => {
          const count = mockAuditEntries.filter(entry => entry.category === category).length
          if (count === 0) return null
          
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === category ? config.color : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {config.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Decision History */}
      {showDecisions && mockDecisions.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Decision History</h3>
          
          <div className="space-y-4">
            {mockDecisions.map((decision) => (
              <div key={decision.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{decision.title}</h4>
                      <Badge 
                        variant={decision.impact === 'high' ? 'error' : decision.impact === 'medium' ? 'warning' : 'success'}
                        size="sm"
                      >
                        {decision.impact} impact
                      </Badge>
                      <Badge variant="secondary" size="sm">
                        {decision.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{decision.description}</p>
                    
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <p className="text-sm font-medium text-blue-900 mb-1">Rationale:</p>
                      <p className="text-sm text-blue-800">{decision.rationale}</p>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-xs text-gray-500">
                      <div className="flex items-center space-x-2">
                        <UserIcon className="h-3 w-3" />
                        <span>{decision.decidedBy.name} ({decision.decidedBy.role})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-3 w-3" />
                        <span>{formatRelativeTime(decision.decidedAt)}</span>
                      </div>
                      <div>
                        Stakeholders: {decision.stakeholders.join(', ')}
                      </div>
                    </div>
                    
                    {decision.followUpRequired && decision.followUpDate && (
                      <div className="mt-2 text-xs text-orange-600">
                        Follow-up required by {decision.followUpDate.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Entries */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Log</h3>
          
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h4 className="mt-2 text-sm font-medium text-gray-900">No audit entries</h4>
              <p className="mt-1 text-sm text-gray-500">
                No activity has been recorded for the selected filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry) => {
                const actionInfo = actionConfig[entry.action as keyof typeof actionConfig] || {
                  icon: InformationCircleIcon,
                  color: 'text-gray-600',
                  label: entry.action,
                }
                const ActionIcon = actionInfo.icon
                const isExpanded = expandedEntry === entry.id
                
                return (
                  <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${entry.success ? 'bg-green-50' : 'bg-red-50'}`}>
                        <ActionIcon className={`h-4 w-4 ${entry.success ? actionInfo.color : 'text-red-600'}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="text-sm font-medium text-gray-900">
                                {actionInfo.label}
                              </p>
                              <Badge 
                                variant="secondary" 
                                size="sm"
                                className={categoryConfig[entry.category].color}
                              >
                                {categoryConfig[entry.category].label}
                              </Badge>
                              <Badge 
                                size="sm"
                                className={severityConfig[entry.severity].color}
                              >
                                {severityConfig[entry.severity].label}
                              </Badge>
                            </div>
                            
                            {entry.description && (
                              <p className="text-sm text-gray-600 mb-2">{entry.description}</p>
                            )}
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                  {entry.userImage ? (
                                    <img 
                                      src={entry.userImage} 
                                      alt={entry.userName || entry.userEmail}
                                      className="w-6 h-6 rounded-full"
                                    />
                                  ) : (
                                    <span className="text-xs font-medium text-gray-600">
                                      {getInitials(entry.userName || entry.userEmail)}
                                    </span>
                                  )}
                                </div>
                                <span>{entry.userName || entry.userEmail}</span>
                                <span>({entry.userRole})</span>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <ClockIcon className="h-3 w-3" />
                                <span>{formatRelativeTime(entry.timestamp)}</span>
                              </div>
                              
                              {entry.ipAddress && (
                                <span>IP: {entry.ipAddress}</span>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => toggleExpanded(entry.id)}
                            className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                          >
                            {isExpanded ? (
                              <ChevronDownIcon className="h-4 w-4" />
                            ) : (
                              <ChevronRightIcon className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        
                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                            {entry.oldValues && Object.keys(entry.oldValues).length > 0 && (
                              <div>
                                <h5 className="text-xs font-medium text-gray-900 mb-1">Previous Values:</h5>
                                <div className="bg-red-50 rounded p-2 text-xs font-mono">
                                  <pre>{JSON.stringify(entry.oldValues, null, 2)}</pre>
                                </div>
                              </div>
                            )}
                            
                            {entry.newValues && Object.keys(entry.newValues).length > 0 && (
                              <div>
                                <h5 className="text-xs font-medium text-gray-900 mb-1">New Values:</h5>
                                <div className="bg-green-50 rounded p-2 text-xs font-mono">
                                  <pre>{JSON.stringify(entry.newValues, null, 2)}</pre>
                                </div>
                              </div>
                            )}
                            
                            {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                              <div>
                                <h5 className="text-xs font-medium text-gray-900 mb-1">Additional Information:</h5>
                                <div className="bg-blue-50 rounded p-2 text-xs font-mono">
                                  <pre>{JSON.stringify(entry.metadata, null, 2)}</pre>
                                </div>
                              </div>
                            )}
                            
                            {entry.userAgent && (
                              <div className="text-xs text-gray-500">
                                <span className="font-medium">User Agent:</span> {entry.userAgent}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Compact audit summary for cards
export function AuditSummary({
  lastActivity,
  totalEvents,
  className = ''
}: {
  lastActivity?: Date
  totalEvents?: number
  className?: string
}) {
  return (
    <div className={`flex items-center space-x-4 text-xs text-gray-500 ${className}`}>
      <div className="flex items-center space-x-1">
        <ClockIcon className="h-3 w-3" />
        <span>
          Last activity {lastActivity ? formatRelativeTime(lastActivity) : 'unknown'}
        </span>
      </div>
      
      {totalEvents && (
        <div className="flex items-center space-x-1">
          <DocumentIcon className="h-3 w-3" />
          <span>{totalEvents} events</span>
        </div>
      )}
    </div>
  )
}