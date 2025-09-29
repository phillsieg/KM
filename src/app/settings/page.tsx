'use client'

import { useAuth } from '@/hooks/useAuth'
import {
  CogIcon,
  BellIcon,
  EyeIcon,
  ShieldCheckIcon,
  UserIcon,
  KeyIcon
} from '@heroicons/react/24/outline'

export default function SettingsPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Not Logged In</h1>
          <p className="text-gray-600">Please log in to access settings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and system settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Account</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Manage your account information, profile settings, and personal details.
          </p>
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            Manage Account
          </button>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShieldCheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Security</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Configure authentication settings, password management, and security preferences.
          </p>
          <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
            Security Settings
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BellIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Control email notifications, alerts, and communication preferences.
          </p>
          <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 transition-colors">
            Notification Settings
          </button>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <EyeIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Privacy</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Manage data privacy settings, visibility preferences, and sharing options.
          </p>
          <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
            Privacy Settings
          </button>
        </div>

        {/* API Access */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <KeyIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">API Access</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Generate API keys, manage integrations, and configure external access.
          </p>
          <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
            API Settings
          </button>
        </div>

        {/* System Preferences */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <CogIcon className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Customize your experience with theme, language, and interface settings.
          </p>
          <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
            System Settings
          </button>
        </div>
      </div>

      {/* Current User Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Current Session</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">User:</span>
            <div className="text-blue-700">{user.name || 'No name set'}</div>
          </div>
          <div>
            <span className="font-medium text-blue-800">Email:</span>
            <div className="text-blue-700">{user.email}</div>
          </div>
          <div>
            <span className="font-medium text-blue-800">Role:</span>
            <div className="text-blue-700">{user.role || 'Not assigned'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}