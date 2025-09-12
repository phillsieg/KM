'use client'

import { useState } from 'react'

export default function DebugSignUp() {
  const [formData, setFormData] = useState({
    name: 'Phil Sieg',
    email: 'psieg@metrics-llc.com',
    password: 'testpass123'
  })
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<string>('')
  const [status, setStatus] = useState<number | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const testSignup = async () => {
    setLoading(true)
    setResponse('')
    setStatus(null)

    try {
      console.log('Testing bulletproof signup with:', formData)
      
      const res = await fetch('/api/auth/bulletproof-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const responseText = await res.text()
      setStatus(res.status)
      setResponse(responseText)
      
      console.log('Response status:', res.status)
      console.log('Response text:', responseText)
      
    } catch (err) {
      console.error('Network error:', err)
      setResponse(`Network Error: ${err}`)
      setStatus(0)
    } finally {
      setLoading(false)
    }
  }

  const checkEndpoint = async () => {
    try {
      const res = await fetch('/api/auth/bulletproof-signup')
      const text = await res.text()
      setStatus(res.status)
      setResponse(text)
    } catch (err) {
      setResponse(`Error: ${err}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Debug Signup Test
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Test the bulletproof signup endpoint and see exact responses
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={testSignup}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Signup'}
              </button>
              
              <button
                onClick={checkEndpoint}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                Check Endpoint
              </button>
            </div>
          </div>
        </div>

        {status !== null && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium text-gray-900 mb-2">
              Response (Status: {status})
            </h3>
            <div className="bg-gray-100 p-4 rounded overflow-auto">
              <pre className="text-xs whitespace-pre-wrap">{response}</pre>
            </div>
          </div>
        )}

        <div className="text-center">
          <a 
            href="/auth/signup"
            className="text-blue-600 hover:text-blue-500 underline"
          >
            ← Back to regular signup
          </a>
        </div>
      </div>
    </div>
  )
}