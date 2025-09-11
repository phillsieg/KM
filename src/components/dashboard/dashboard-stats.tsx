'use client'

import { 
  DocumentTextIcon, 
  EyeIcon, 
  ClockIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'

const stats = [
  {
    name: 'Total Content',
    value: '2,847',
    change: '+12%',
    changeType: 'positive',
    icon: DocumentTextIcon,
    description: 'Published documents'
  },
  {
    name: 'Page Views',
    value: '14,329',
    change: '+8%',
    changeType: 'positive',
    icon: EyeIcon,
    description: 'This month'
  },
  {
    name: 'Pending Reviews',
    value: '23',
    change: '-5%',
    changeType: 'positive',
    icon: ClockIcon,
    description: 'Awaiting approval'
  },
  {
    name: 'Overdue Reviews',
    value: '7',
    change: '+2',
    changeType: 'negative',
    icon: ExclamationTriangleIcon,
    description: 'Require attention'
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200"
        >
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </div>
                  </dd>
                  <dd className="text-sm text-gray-500 mt-1">
                    {stat.description}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}