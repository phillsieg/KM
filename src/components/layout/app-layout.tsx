'use client'

import { Header } from './header'
import { Sidebar } from './sidebar'
import { Breadcrumbs } from './breadcrumbs'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: React.ReactNode
  sidebar?: boolean
  breadcrumbs?: Array<{ name: string; href?: string }>
  className?: string
}

export function AppLayout({ 
  children, 
  sidebar = true, 
  breadcrumbs,
  className 
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {sidebar && <Sidebar />}
        
        <main className={cn('flex-1', sidebar && 'lg:ml-64')}>
          {breadcrumbs && (
            <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          )}
          
          <div className={cn('px-4 sm:px-6 lg:px-8 py-8', className)}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}