'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  title: string
  type: string
  url: string
  snippet?: string
}

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      // Mock search results for now
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'API Documentation Standards',
          type: 'SOP',
          url: '/content/api-documentation-standards',
          snippet: 'Guidelines for creating comprehensive API documentation...'
        },
        {
          id: '2',
          title: 'Code Review Process',
          type: 'Policy',
          url: '/content/code-review-process',
          snippet: 'Standard operating procedures for code review workflows...'
        },
        {
          id: '3',
          title: 'Deployment Checklist',
          type: 'Job Aid',
          url: '/content/deployment-checklist',
          snippet: 'Pre-deployment verification steps and requirements...'
        }
      ].filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.snippet?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      setResults(mockResults)
      setIsOpen(true)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        handleSearch(query)
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
    }
  }

  const handleResultClick = (url: string) => {
    router.push(url)
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setIsOpen(true)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Search documentation, policies, SOPs..."
          />
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
        >
          {isLoading ? (
            <div className="px-4 py-2 text-sm text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <>
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result.url)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </p>
                      {result.snippet && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {result.snippet}
                        </p>
                      )}
                    </div>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {result.type}
                    </span>
                  </div>
                </button>
              ))}
              <div className="border-t border-gray-100 px-4 py-2">
                <button
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(query)}`)
                    setIsOpen(false)
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View all results for &ldquo;{query}&rdquo;
                </button>
              </div>
            </>
          ) : query ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}