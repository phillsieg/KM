'use client'

import { useSession } from 'next-auth/react'
import { DashboardStats } from './dashboard-stats'
import { RecentActivity } from './recent-activity'
import { PopularContent } from './popular-content'
import { QuickActions } from './quick-actions'
import { RoleBasedTiles } from './role-based-tiles'

// Dashboard layouts for different roles
interface DashboardSection {
  id: string
  component: React.ComponentType
  title?: string
  colspan?: 1 | 2 | 3
  order?: number
}

interface DashboardLayout {
  title: string
  subtitle: string
  sections: DashboardSection[]
}

// Import role-specific components (we'll create these)
import { LeadersDashboard } from './leaders/leaders-dashboard'
import { SMEDashboard } from './sme/sme-dashboard'  
import { ContributorsDashboard } from './contributors/contributors-dashboard'
import { ReviewersDashboard } from './reviewers/reviewers-dashboard'
import { NovicePortal } from './novice/novice-portal'

const dashboardLayouts: Record<string, DashboardLayout> = {
  ADMIN: {
    title: 'System Administration Dashboard',
    subtitle: 'Monitor system health and manage platform operations',
    sections: [
      { id: 'stats', component: DashboardStats, colspan: 3, order: 1 },
      { id: 'leaders', component: LeadersDashboard, colspan: 2, order: 2 },
      { id: 'activity', component: RecentActivity, colspan: 1, order: 3 },
      { id: 'quick-actions', component: QuickActions, colspan: 1, order: 4 },
      { id: 'popular', component: PopularContent, colspan: 1, order: 5 },
      { id: 'tiles', component: RoleBasedTiles, colspan: 1, order: 6 },
    ]
  },
  
  OWNER: {
    title: 'Leadership Dashboard',
    subtitle: 'Strategic oversight and knowledge management metrics',
    sections: [
      { id: 'leaders', component: LeadersDashboard, colspan: 3, order: 1 },
      { id: 'stats', component: DashboardStats, colspan: 2, order: 2 },
      { id: 'tiles', component: RoleBasedTiles, colspan: 1, order: 3 },
      { id: 'activity', component: RecentActivity, colspan: 2, order: 4 },
      { id: 'popular', component: PopularContent, colspan: 1, order: 5 },
    ]
  },

  STEWARD: {
    title: 'Subject Matter Expert Dashboard',
    subtitle: 'Manage content reviews and domain expertise',
    sections: [
      { id: 'sme', component: SMEDashboard, colspan: 2, order: 1 },
      { id: 'stats', component: DashboardStats, colspan: 1, order: 2 },
      { id: 'reviewers', component: ReviewersDashboard, colspan: 2, order: 3 },
      { id: 'tiles', component: RoleBasedTiles, colspan: 1, order: 4 },
      { id: 'popular', component: PopularContent, colspan: 1, order: 5 },
      { id: 'activity', component: RecentActivity, colspan: 2, order: 6 },
    ]
  },

  CONTRIBUTOR: {
    title: 'Contributor Dashboard', 
    subtitle: 'Track your contributions and discover learning opportunities',
    sections: [
      { id: 'contributors', component: ContributorsDashboard, colspan: 2, order: 1 },
      { id: 'quick-actions', component: QuickActions, colspan: 1, order: 2 },
      { id: 'popular', component: PopularContent, colspan: 1, order: 3 },
      { id: 'tiles', component: RoleBasedTiles, colspan: 1, order: 4 },
      { id: 'activity', component: RecentActivity, colspan: 1, order: 5 },
    ]
  },

  VISITOR: {
    title: 'Welcome to Knowledge Hub',
    subtitle: 'Quick-start portal and learning resources',
    sections: [
      { id: 'novice', component: NovicePortal, colspan: 3, order: 1 },
      { id: 'tiles', component: RoleBasedTiles, colspan: 2, order: 2 },
      { id: 'popular', component: PopularContent, colspan: 1, order: 3 },
    ]
  },
}

export function RoleBasedDashboard() {
  const { data: session } = useSession()
  const userRole = session?.user?.role || 'VISITOR'
  const layout = dashboardLayouts[userRole] || dashboardLayouts.VISITOR
  
  // Sort sections by order
  const sortedSections = [...layout.sections].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{layout.title}</h1>
        <p className="mt-1 text-gray-600">{layout.subtitle}</p>
      </div>

      {/* Dynamic grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-max">
        {sortedSections.map((section) => {
          const Component = section.component
          const colspanClass = {
            1: 'lg:col-span-1',
            2: 'lg:col-span-2', 
            3: 'lg:col-span-3',
          }[section.colspan || 1]

          return (
            <div key={section.id} className={colspanClass}>
              {section.title && (
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {section.title}
                </h2>
              )}
              <Component />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Fallback components for roles that need simple layouts
export function SimpleRoleBasedDashboard() {
  const { data: session } = useSession()
  const userRole = session?.user?.role || 'VISITOR'
  
  // For roles that don't need complex layouts, use the original layout
  if (!['ADMIN', 'OWNER', 'STEWARD'].includes(userRole)) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Welcome to your knowledge management hub
          </p>
        </div>

        <DashboardStats />
        <RoleBasedTiles />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <QuickActions />
            <PopularContent />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>
      </div>
    )
  }

  return <RoleBasedDashboard />
}

// Hook for getting role-specific dashboard data
export function useRoleDashboardData() {
  const { data: session } = useSession()
  const userRole = session?.user?.role || 'VISITOR'
  
  return {
    userRole,
    isLeader: ['ADMIN', 'OWNER'].includes(userRole),
    isSME: userRole === 'STEWARD', 
    isContributor: userRole === 'CONTRIBUTOR',
    isReviewer: ['STEWARD', 'OWNER', 'ADMIN'].includes(userRole),
    isNovice: userRole === 'VISITOR',
    canViewAnalytics: ['ADMIN', 'OWNER', 'STEWARD'].includes(userRole),
    canManageUsers: ['ADMIN', 'OWNER'].includes(userRole),
    canReviewContent: ['STEWARD', 'OWNER', 'ADMIN'].includes(userRole),
  }
}