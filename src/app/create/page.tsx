'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'
import { 
  DocumentArrowUpIcon, 
  PencilIcon, 
  CloudArrowUpIcon,
  DocumentIcon
} from '@heroicons/react/24/outline'

interface Domain {
  id: string
  name: string
}

const contentTypes = [
  { value: 'SOP', label: 'Standard Operating Procedure (SOP)' },
  { value: 'POLICY', label: 'Policy' },
  { value: 'STANDARD', label: 'Standard' },
  { value: 'GUIDELINE', label: 'Guideline' },
  { value: 'PROCEDURE', label: 'Procedure' },
  { value: 'WORK_INSTRUCTION', label: 'Work Instruction' },
  { value: 'JOB_AID', label: 'Job Aid' },
  { value: 'TEMPLATE', label: 'Template' },
  { value: 'CHECKLIST', label: 'Checklist' },
  { value: 'FAQ', label: 'FAQ' },
  { value: 'TRAINING_MATERIAL', label: 'Training Material' }
]

const sensitivityLevels = [
  { value: 'PUBLIC', label: 'Public' },
  { value: 'INTERNAL', label: 'Internal' },
  { value: 'CONFIDENTIAL', label: 'Confidential' },
  { value: 'RESTRICTED', label: 'Restricted' }
]

export default function CreateDocumentPage() {
  const router = useRouter()
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'create' | 'upload'>('create')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    contentType: 'SOP',
    domainId: '',
    sensitivity: 'INTERNAL',
    reviewCycle: 12,
    effectiveDate: ''
  })

  useEffect(() => {
    fetchDomains()
  }, [])

  const fetchDomains = async () => {
    try {
      console.log('Fetching domains from /api/domains...')
      const response = await fetch('/api/domains')
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Domains received:', data)
        setDomains(data)
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, domainId: data[0].id }))
        }
      } else {
        const errorData = await response.json()
        console.error('Failed to fetch domains:', errorData)
        alert('Failed to load domains. Please try refreshing the page.')
      }
    } catch (error) {
      console.error('Error fetching domains:', error)
      alert('Error loading domains. Please check your connection and try again.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // Extract title from filename
      const fileName = file.name.replace(/\.[^/.]+$/, "")
      setFormData(prev => ({ 
        ...prev, 
        title: fileName,
        contentType: getContentTypeFromFile(file.name)
      }))
      
      // Read file content for supported types
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        if (file.type.includes('text') || file.name.endsWith('.md')) {
          setFormData(prev => ({ ...prev, content }))
        }
      }
      reader.readAsText(file)
    }
  }

  const getContentTypeFromFile = (filename: string): string => {
    const ext = filename.toLowerCase().split('.').pop()
    switch (ext) {
      case 'pdf': return 'POLICY'
      case 'doc': 
      case 'docx': return 'SOP'
      case 'txt': 
      case 'md': return 'STANDARD'
      case 'xls':
      case 'xlsx': return 'TEMPLATE'
      default: return 'SOP'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Import at the top to avoid dynamic import issues
      const { supabase } = await import('@/lib/supabase')

      // Get auth headers
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      // Add Supabase auth token if available
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.access_token) {
            headers.authorization = `Bearer ${session.access_token}`
          }
        } catch (error) {
          console.error('Error getting Supabase session:', error)
        }
      }

      const response = await fetch('/api/content', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newContent = await response.json()
        router.push(`/content/${newContent.id}`)
      } else {
        const error = await response.json()
        alert(`Error creating document: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating document:', error)
      alert('An error occurred while creating the document')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout breadcrumbs={[{ name: 'Create Document' }]}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create New Document</h1>
          <p className="mt-1 text-gray-600">
            Add a new document to the knowledge management system
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <PencilIcon className="h-4 w-4 inline mr-2" />
                Create from Scratch
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <DocumentArrowUpIcon className="h-4 w-4 inline mr-2" />
                Upload Document
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'upload' && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="text-center">
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="mx-auto flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <CloudArrowUpIcon className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX, TXT, MD, XLS, XLSX (MAX. 10MB)
                      </p>
                    </div>
                  </div>
                </label>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx,.txt,.md,.xls,.xlsx"
                  onChange={handleFileUpload}
                />
              </div>
              
              {uploadedFile && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-center">
                    <DocumentIcon className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm text-green-800 font-medium">
                      {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    File uploaded successfully! Fill in the details below and submit.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter document title"
            />
          </div>

          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
              Summary *
            </label>
            <textarea
              id="summary"
              name="summary"
              required
              rows={3}
              value={formData.summary}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Brief summary of the document"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 mb-1">
                Content Type *
              </label>
              <select
                id="contentType"
                name="contentType"
                required
                value={formData.contentType}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {contentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="domainId" className="block text-sm font-medium text-gray-700 mb-1">
                Domain * {domains.length === 0 && <span className="text-red-500">(Loading...)</span>}
              </label>
              <select
                id="domainId"
                name="domainId"
                required
                value={formData.domainId}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={domains.length === 0}
              >
                <option value="">
                  {domains.length === 0 ? 'Loading domains...' : 'Select a domain'}
                </option>
                {domains.map(domain => (
                  <option key={domain.id} value={domain.id}>
                    {domain.name}
                  </option>
                ))}
              </select>
              {domains.length === 0 && (
                <p className="mt-1 text-sm text-red-600">
                  If domains don&apos;t load, please refresh the page or check console for errors.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="sensitivity" className="block text-sm font-medium text-gray-700 mb-1">
                Sensitivity Level
              </label>
              <select
                id="sensitivity"
                name="sensitivity"
                value={formData.sensitivity}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {sensitivityLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="reviewCycle" className="block text-sm font-medium text-gray-700 mb-1">
                Review Cycle (months)
              </label>
              <input
                type="number"
                id="reviewCycle"
                name="reviewCycle"
                min="1"
                max="60"
                value={formData.reviewCycle}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 mb-1">
              Effective Date
            </label>
            <input
              type="date"
              id="effectiveDate"
              name="effectiveDate"
              value={formData.effectiveDate}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            {uploadedFile && activeTab === 'upload' && !uploadedFile.type.includes('text') && !uploadedFile.name.endsWith('.md') && (
              <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <DocumentIcon className="h-4 w-4 inline mr-1" />
                  <strong>Note:</strong> File content cannot be previewed for this file type. 
                  The document will be stored as an attachment. Please provide a summary or description in the content field.
                </p>
              </div>
            )}
            <textarea
              id="content"
              name="content"
              required
              rows={12}
              value={formData.content}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder={
                uploadedFile && activeTab === 'upload' 
                  ? "Add a description or summary of the uploaded document..."
                  : "Enter the document content..."
              }
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading 
                ? (activeTab === 'upload' ? 'Uploading...' : 'Creating...') 
                : (activeTab === 'upload' ? 'Upload Document' : 'Create Document')
              }
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}