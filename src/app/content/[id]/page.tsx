import { notFound } from 'next/navigation'
import { AppLayout } from '@/components/layout/app-layout'
import { prisma } from '@/lib/prisma'

interface ContentPageProps {
  params: {
    id: string
  }
}

export default async function ContentPage({ params }: ContentPageProps) {
  const content = await prisma.content.findUnique({
    where: { id: params.id },
    include: {
      domain: true,
      owner: true,
      author: true,
      _count: {
        select: {
          versions: true,
          comments: true
        }
      }
    }
  })

  if (!content) {
    notFound()
  }

  const statusColors = {
    DRAFT: 'bg-gray-100 text-gray-800',
    IN_REVIEW: 'bg-yellow-100 text-yellow-800',
    PUBLISHED: 'bg-green-100 text-green-800',
    NEEDS_UPDATE: 'bg-orange-100 text-orange-800',
    ARCHIVED: 'bg-blue-100 text-blue-800',
    DEPRECATED: 'bg-red-100 text-red-800'
  }

  const sensitivityColors = {
    PUBLIC: 'bg-blue-100 text-blue-800',
    INTERNAL: 'bg-gray-100 text-gray-800',
    CONFIDENTIAL: 'bg-orange-100 text-orange-800',
    RESTRICTED: 'bg-red-100 text-red-800'
  }

  return (
    <AppLayout 
      breadcrumbs={[
        { name: 'Domains', href: '/browse' },
        { name: content.domain.name, href: `/domains/${content.domain.id}` },
        { name: content.title }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h1>
              <p className="text-gray-600">{content.summary}</p>
            </div>
            <div className="flex space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[content.lifecycleState]}`}>
                {content.lifecycleState.replace('_', ' ')}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sensitivityColors[content.sensitivity]}`}>
                {content.sensitivity}
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Type:</span> {content.contentType.replace('_', ' ')}
            </div>
            <div>
              <span className="font-medium">Domain:</span> {content.domain.name}
            </div>
            <div>
              <span className="font-medium">Author:</span> {content.author.name || content.author.email}
            </div>
            <div>
              <span className="font-medium">Created:</span> {new Date(content.createdAt).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Updated:</span> {new Date(content.updatedAt).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Review Cycle:</span> {content.reviewCycle} months
            </div>
          </div>

          {content.effectiveDate && (
            <div className="mt-2 text-sm text-gray-500">
              <span className="font-medium">Effective Date:</span> {new Date(content.effectiveDate).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-900 leading-relaxed">
              {content.body}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end space-x-4">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Edit
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
            Share
          </button>
        </div>
      </div>
    </AppLayout>
  )
}