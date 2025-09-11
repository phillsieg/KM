'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SetupPage() {
  const [status, setStatus] = useState<string>('ready')
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const runMigration = async () => {
    setLoading(true)
    setStatus('running')
    setMessage('Creating database schema with raw SQL...')
    
    try {
      const response = await fetch('/api/db-push', { method: 'POST' })
      const data = await response.json()
      
      if (data.success) {
        setStatus('complete')
        setMessage(`✅ Setup complete! Database ready with ${data.domains} domains. Your KM system is ready to use!`)
      } else {
        setStatus('error')
        setMessage(`Database setup failed: ${data.error}`)
      }
    } catch (error) {
      setStatus('error')
      setMessage(`Network error: ${error}`)
    }
    setLoading(false)
  }

  const initializeData = async () => {
    setLoading(true)
    setStatus('initializing')
    setMessage('Adding sample domains and data...')
    
    try {
      const response = await fetch('/api/init-db')
      const data = await response.json()
      
      if (data.success) {
        setStatus('complete')
        setMessage(`Setup complete! Created ${data.domains} domains. Your KM system is ready!`)
      } else {
        setStatus('error')
        setMessage(`Initialization failed: ${data.error}`)
      }
    } catch (error) {
      setStatus('error')
      setMessage(`Network error: ${error}`)
    }
    setLoading(false)
  }

  const checkStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/setup')
      const data = await response.json()
      setMessage(JSON.stringify(data, null, 2))
    } catch (error) {
      setMessage(`Error: ${error}`)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto h-12 w-12 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white font-bold text-lg">KM</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Knowledge Management Setup
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Initialize your database and get started
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            
            {/* Status Display */}
            <div className="text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                status === 'complete' ? 'bg-green-100 text-green-800' :
                status === 'error' ? 'bg-red-100 text-red-800' :
                status === 'running' || status === 'initializing' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {status === 'complete' && '✅ '}
                {status === 'error' && '❌ '}
                {(status === 'running' || status === 'initializing') && '🔄 '}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
              {message && (
                <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">
                  {message}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={runMigration}
                disabled={loading || status === 'complete'}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Setting up...' : '🚀 Setup Database'}
              </button>

              <button
                onClick={initializeData}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Initialize Sample Data
              </button>

              <button
                onClick={checkStatus}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Check Configuration
              </button>
            </div>

            {/* Next Steps */}
            {status === 'complete' && (
              <div className="mt-6 p-4 bg-green-50 rounded-md">
                <h3 className="text-lg font-medium text-green-800 mb-2">🎉 Setup Complete!</h3>
                <p className="text-sm text-green-700 mb-3">
                  Your knowledge management system is ready to use.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Go to Dashboard →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}