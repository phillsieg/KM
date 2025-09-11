import { AppLayout } from '@/components/layout/app-layout'

export default function BookmarksPage() {
  return (
    <AppLayout breadcrumbs={[{ name: 'Bookmarks' }]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookmarks</h1>
          <p className="mt-1 text-gray-600">
            Your saved documents and frequently accessed content
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No bookmarks yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start bookmarking documents to keep track of important content.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Browse Content
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}