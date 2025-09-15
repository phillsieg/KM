'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { DomainContentList } from '@/components/content/domain-content-list'

interface Domain {
  id: string
  name: string
  slug: string
  description: string
  color: string
  icon: string
}

export default function BrowsePage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDomains()
  }, [])

  const fetchDomains = async () => {
    try {
      const response = await fetch('/api/domains')
      if (response.ok) {
        const data = await response.json()
        setDomains(data)
      }
    } catch (error) {
      console.error('Error fetching domains:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleDomain = (domainId: string) => {
    const newExpanded = new Set(expandedDomains)
    if (newExpanded.has(domainId)) {
      newExpanded.delete(domainId)
    } else {
      newExpanded.add(domainId)
    }
    setExpandedDomains(newExpanded)
  }

  const expandAll = () => {
    setExpandedDomains(new Set(domains.map(d => d.id)))
  }

  const collapseAll = () => {
    setExpandedDomains(new Set())
  }

  return (
    <AppLayout breadcrumbs={[{ name: 'Browse' }]}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Browse Content</h1>
            <p className="mt-1 text-gray-600">
              Explore all documentation and resources by category
            </p>
          </div>

          {domains.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={expandAll}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Collapse All
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-pulse text-gray-500">Loading domains...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {domains.map((domain) => (
              <DomainContentList
                key={domain.id}
                domainId={domain.id}
                domainName={domain.name}
                domainColor={domain.color}
                isExpanded={expandedDomains.has(domain.id)}
                onToggle={() => toggleDomain(domain.id)}
              />
            ))}
          </div>
        )}

        {!loading && domains.length === 0 && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                No Domains Found
              </h3>
              <p className="text-sm text-gray-500">
                It looks like no content domains have been set up yet. Please contact your administrator to set up the initial domains.
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}