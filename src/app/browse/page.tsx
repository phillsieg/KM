import { AppLayout } from '@/components/layout/app-layout'

export default function BrowsePage() {
  return (
    <AppLayout breadcrumbs={[{ name: 'Browse' }]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Content</h1>
          <p className="mt-1 text-gray-600">
            Explore all documentation and resources by category
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Domain cards */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Engineering
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      245 documents
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Operations
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      189 documents
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Compliance
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      156 documents
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Content Browser Coming Soon
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                The content browser will allow you to explore all documents, filter by type,
                and search within specific domains.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}