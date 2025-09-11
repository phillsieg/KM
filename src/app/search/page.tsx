import { AppLayout } from '@/components/layout/app-layout'
import { SearchBar } from '@/components/search/search-bar'

export default function SearchPage() {
  return (
    <AppLayout breadcrumbs={[{ name: 'Search' }]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Search</h1>
          <p className="mt-1 text-gray-600">
            Find documents, policies, and procedures across all domains
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <SearchBar className="mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Content Type</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">SOPs</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Policies</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Job Aids</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Domain</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Engineering</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Operations</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Compliance</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Status</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Published</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">In Review</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Draft</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Search
            </button>
            <button className="ml-2 text-gray-500 hover:text-gray-700">
              Clear filters
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Search Results</h3>
          <p className="text-gray-500">Enter a search query to see results.</p>
        </div>
      </div>
    </AppLayout>
  )
}