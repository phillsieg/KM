'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout/app-layout'
import { Button } from '@/components/ui/button'

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
      const response = await fetch('/api/domains')
      if (response.ok) {
        const data = await response.json()
        setDomains(data)
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, domainId: data[0].id }))
        }
      }
    } catch (error) {
      console.error('Error fetching domains:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
                Domain *
              </label>
              <select
                id="domainId"
                name="domainId"
                required
                value={formData.domainId}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a domain</option>
                {domains.map(domain => (
                  <option key={domain.id} value={domain.id}>
                    {domain.name}
                  </option>
                ))}
              </select>
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
            <textarea
              id="content"
              name="content"
              required
              rows={12}
              value={formData.content}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter the document content..."
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
              {loading ? 'Creating...' : 'Create Document'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}