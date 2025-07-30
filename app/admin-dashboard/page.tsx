"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { History, Users, Database, Settings } from 'lucide-react'

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users, monitor system activity, and view analytics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Login History Card */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
            <h3 className="flex items-center text-lg font-semibold mb-4">
              <History className="h-5 w-5 mr-2 text-blue-600" />
              Login History
            </h3>
            <p className="text-gray-600 mb-4">
              View user login attempts, track authentication patterns, and monitor security.
            </p>
            <Link href="/login-history">
              <Button className="w-full">
                View Login History
              </Button>
            </Link>
          </div>

          {/* Environment Check Card */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
            <h3 className="flex items-center text-lg font-semibold mb-4">
              <Database className="h-5 w-5 mr-2 text-green-600" />
              Database Status
            </h3>
            <p className="text-gray-600 mb-4">
              Check environment variables and database connectivity status.
            </p>
            <Link href="/env-check">
              <Button variant="outline" className="w-full">
                Check Environment
              </Button>
            </Link>
          </div>

          {/* User Management Card */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
            <h3 className="flex items-center text-lg font-semibold mb-4">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              User Management
            </h3>
            <p className="text-gray-600 mb-4">
              Manage user accounts, roles, and permissions in the system.
            </p>
            <Link href="/login-history">
              <Button variant="outline" className="w-full">
                Manage Users
              </Button>
            </Link>
          </div>

          {/* Forms Application Card */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
            <h3 className="flex items-center text-lg font-semibold mb-4">
              <Settings className="h-5 w-5 mr-2 text-orange-600" />
              Forms Application
            </h3>
            <p className="text-gray-600 mb-4">
              Access the HVAC Clean Room forms application for project submissions.
            </p>
            <Link href="/forms">
              <Button variant="outline" className="w-full">
                Open Forms App
              </Button>
            </Link>
          </div>

          {/* System Settings Card */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
            <h3 className="flex items-center text-lg font-semibold mb-4">
              <Settings className="h-5 w-5 mr-2 text-red-600" />
              System Settings
            </h3>
            <p className="text-gray-600 mb-4">
              Configure system settings, security policies, and application preferences.
            </p>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/login-history">
                <Button variant="outline" className="w-full justify-start">
                  <History className="h-4 w-4 mr-2" />
                  View Recent Logins
                </Button>
              </Link>
              <Link href="/env-check">
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Check Database
                </Button>
              </Link>
              <Link href="/user/dashboard">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  User Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 