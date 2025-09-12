import { AppLayout } from '@/components/layout/app-layout'
import { RoleBasedDashboard } from '@/components/dashboard/role-based-dashboard'

export default function Home() {
  return (
    <AppLayout sidebar={false}>
      <RoleBasedDashboard />
    </AppLayout>
  )
}
