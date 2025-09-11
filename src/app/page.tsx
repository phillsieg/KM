import { AppLayout } from '@/components/layout/app-layout'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { PopularContent } from '@/components/dashboard/popular-content'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { RoleBasedTiles } from '@/components/dashboard/role-based-tiles'

export default function Home() {
  return (
    <AppLayout sidebar={true}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Welcome to your knowledge management hub
          </p>
        </div>

        {/* Stats Overview */}
        <DashboardStats />

        {/* Role-based tiles */}
        <RoleBasedTiles />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {/* Quick Actions */}
            <QuickActions />
            
            {/* Popular Content */}
            <PopularContent />
          </div>
          
          <div>
            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
