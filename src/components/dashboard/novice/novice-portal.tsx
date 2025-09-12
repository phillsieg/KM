'use client'

import Link from 'next/link'
import {
  AcademicCapIcon,
  MapIcon,
  UserGroupIcon,
  BookOpenIcon,
  PlayIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

const quickStartData = {
  welcomeSteps: [
    { id: 1, title: 'Explore the Knowledge Base', completed: false, href: '/browse' },
    { id: 2, title: 'Search for Information', completed: false, href: '/search' },
    { id: 3, title: 'Read Company Policies', completed: false, href: '/domains/compliance' },
    { id: 4, title: 'Create Your First Content', completed: false, href: '/create' },
  ],
  learningPaths: [
    {
      id: '1',
      title: 'New Employee Essentials',
      description: 'Must-read policies and procedures for all new hires',
      duration: '2 hours',
      progress: 0,
      modules: 8,
      href: '/domains/compliance',
    },
    {
      id: '2',
      title: 'Safety and Operations',
      description: 'Essential safety protocols and operational procedures',
      duration: '1.5 hours',
      progress: 0,
      modules: 6,
      href: '/domains/operations',
    },
    {
      id: '3',
      title: 'Technical Documentation',
      description: 'Engineering standards and best practices',
      duration: '3 hours',
      progress: 0,
      modules: 12,
      href: '/domains/engineering',
    },
  ],
  expertContacts: [
    {
      name: 'Sarah Johnson',
      role: 'HR Business Partner',
      domain: 'Human Resources',
      expertise: ['Policies', 'Benefits', 'Onboarding'],
      avatar: null,
    },
    {
      name: 'Mike Chen',
      role: 'Safety Coordinator',
      domain: 'Operations',
      expertise: ['Safety Protocols', 'Incident Response', 'Training'],
      avatar: null,
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Technical Lead',
      domain: 'Engineering',
      expertise: ['Best Practices', 'Code Standards', 'Documentation'],
      avatar: null,
    },
  ],
  recentlyViewed: [
    'Employee Handbook',
    'Office Safety Guidelines',
    'IT Security Policy',
  ]
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

export function NovicePortal() {
  const completedSteps = quickStartData.welcomeSteps.filter(step => step.completed).length
  const totalSteps = quickStartData.welcomeSteps.length
  const progressPercentage = (completedSteps / totalSteps) * 100

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to the Knowledge Hub! 👋</h2>
        <p className="text-blue-100 mb-4">
          Let&apos;s get you started with these 4 essential steps to unlock the full potential of our knowledge management system.
        </p>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="bg-blue-400 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-medium">
            {completedSteps}/{totalSteps} steps completed
          </span>
        </div>
      </div>

      {/* Quick Start Checklist - Enhanced */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200 shadow-lg">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-blue-900 mb-2">🚀 Your 4-Step Journey Starts Here!</h3>
          <p className="text-blue-700">Complete these essential steps to unlock the full power of our knowledge system</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickStartData.welcomeSteps.map((step, index) => (
            <Link
              key={step.id}
              href={step.href}
              className="group relative bg-white p-6 rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-200 transform hover:scale-105"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                {step.completed ? (
                  <CheckCircleIcon className="h-5 w-5 text-white" />
                ) : (
                  <span className="text-sm font-bold text-white">{step.id}</span>
                )}
              </div>

              {/* Step Content */}
              <div className="pt-2">
                <h4 className={`text-lg font-semibold mb-2 ${
                  step.completed ? 'text-gray-500 line-through' : 'text-gray-900 group-hover:text-blue-600'
                }`}>
                  {step.title}
                </h4>
                
                {/* Step Description */}
                <p className="text-sm text-gray-600 mb-3">
                  {index === 0 && "Discover existing knowledge and find what you need"}
                  {index === 1 && "Learn to quickly find specific information across all content"}
                  {index === 2 && "Understand important policies and compliance requirements"}
                  {index === 3 && "Contribute your knowledge and help others learn"}
                </p>

                {/* Progress Indicator */}
                <div className="flex items-center justify-between">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    step.completed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800 group-hover:bg-blue-200'
                  }`}>
                    {step.completed ? '✓ Completed' : 'Get Started →'}
                  </div>
                  
                  {!step.completed && (
                    <div className="text-2xl group-hover:animate-bounce">
                      {index === 0 && "🔍"}
                      {index === 1 && "⚡"}
                      {index === 2 && "📋"}
                      {index === 3 && "✨"}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Progress Summary */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-200">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">{completedSteps}</span>
            </div>
            <span className="text-sm font-medium text-blue-900">
              {completedSteps}/{totalSteps} steps completed • {Math.round(progressPercentage)}% done!
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Paths */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <AcademicCapIcon className="h-5 w-5 text-blue-500 mr-2" />
            Recommended Learning Paths
          </h3>
          
          <div className="space-y-4">
            {quickStartData.learningPaths.map((path) => (
              <Link
                key={path.id}
                href={path.href}
                className="block p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{path.title}</h4>
                  <PlayIcon className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 mb-3">{path.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{path.modules} modules • {path.duration}</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Start
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link
              href="/browse"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Browse all content →
            </Link>
          </div>
        </div>

        {/* Expert Contacts */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <UserGroupIcon className="h-5 w-5 text-green-500 mr-2" />
            Meet Your Expert Contacts
          </h3>
          
          <div className="space-y-4">
            {quickStartData.expertContacts.map((expert, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {expert.avatar ? (
                    <img 
                      src={expert.avatar} 
                      alt={expert.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-600">
                      {getInitials(expert.name)}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{expert.name}</p>
                  <p className="text-xs text-gray-500">{expert.role} • {expert.domain}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {expert.expertise.slice(0, 2).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {skill}
                      </span>
                    ))}
                    {expert.expertise.length > 2 && (
                      <span className="text-xs text-gray-400">
                        +{expert.expertise.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
                
                <button className="text-xs font-medium text-blue-600 hover:text-blue-800">
                  Contact
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link
              href="/browse"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Browse knowledge domains →
            </Link>
          </div>
        </div>
      </div>

      {/* Recently Viewed & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <BookOpenIcon className="h-5 w-5 text-purple-500 mr-2" />
            Recently Viewed
          </h3>
          
          <div className="space-y-2">
            {quickStartData.recentlyViewed.map((item, index) => (
              <div key={index} className="flex items-center p-2 rounded hover:bg-gray-50">
                <BookOpenIcon className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <MapIcon className="h-5 w-5 text-red-500 mr-2" />
            Quick Navigation
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/search"
              className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-center"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-sm">🔍</span>
              </div>
              <span className="text-xs font-medium text-gray-700">Search</span>
            </Link>
            
            <Link
              href="/browse"
              className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-center"
            >
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-sm">📚</span>
              </div>
              <span className="text-xs font-medium text-gray-700">Browse</span>
            </Link>
            
            <Link
              href="/create"
              className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-center"
            >
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-sm">➕</span>
              </div>
              <span className="text-xs font-medium text-gray-700">Create</span>
            </Link>
            
            <Link
              href="/bookmarks"
              className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-center"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-sm">🔖</span>
              </div>
              <span className="text-xs font-medium text-gray-700">Bookmarks</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}