"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RefreshCw, History, User, Calendar, MapPin, Monitor, Clock } from 'lucide-react'
import { getLoginStats, getUserLoginSummary } from '@/actions/users-mysql'

interface LoginHistoryRecord {
  id: string
  user_id: string
  email: string
  user_name: string
  user_role: string
  login_time: string
  ip_address?: string
  user_agent?: string
  device_info?: string
  location?: string
  success: boolean
  failure_reason?: string
  session_duration?: number
  logout_time?: string
}

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  is_active: boolean
  created_at: string
  last_login?: string
}

export default function LoginHistoryPage() {
  const [loginHistory, setLoginHistory] = useState<LoginHistoryRecord[]>([])
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'history' | 'users'>('history')
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all')

  const fetchLoginHistory = async () => {
    setIsLoading(true)
    try {
      // Fetch login statistics from MySQL
      const loginStatsResult = await getLoginStats()
      if (loginStatsResult.data) {
        setLoginHistory(loginStatsResult.data)
      }

      // Fetch user login summary from MySQL
      const userSummaryResult = await getUserLoginSummary()
      if (userSummaryResult.data) {
        setUserProfiles(userSummaryResult.data)
      }

    } catch (error) {
      console.error('Unexpected error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLoginHistory()
  }, [])

  const filteredHistory = loginHistory.filter(record => {
    if (filter === 'success') return record.success
    if (filter === 'failed') return !record.success
    return true
  })

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getSuccessRate = () => {
    if (loginHistory.length === 0) return 0
    const successCount = loginHistory.filter(record => record.success).length
    return Math.round((successCount / loginHistory.length) * 100)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <History className="inline-block mr-3 h-8 w-8" />
            Login History & User Management
          </h1>
          <p className="text-gray-600">
            Monitor user login activities and manage user accounts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{userProfiles.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <History className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Login Attempts</p>
                <p className="text-2xl font-bold">{loginHistory.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{getSuccessRate()}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">
                  {userProfiles.filter(user => user.is_active).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Login History
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                User Profiles
              </button>
            </nav>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {activeTab === 'history' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filter === 'all'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('success')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filter === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Successful
                </button>
                <button
                  onClick={() => setFilter('failed')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filter === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Failed
                </button>
              </div>
            )}
          </div>
          
          <Button onClick={fetchLoginHistory} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'history' ? (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Login History ({filteredHistory.length} records)</h3>
            </div>
            <div className="p-6">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8">
                  <History className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No login history</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Login history tracking may not be set up yet, or no logins have occurred.
                  </p>
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> To track login history, you need to create the login_history table.
                      Check the instructions below.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">User</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Role</th>
                        <th className="text-left p-3">Login Time</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">IP Address</th>
                        <th className="text-left p-3">Device</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.map((record) => (
                        <tr key={record.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">{record.user_name}</td>
                          <td className="p-3">{record.email}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              record.user_role === 'admin' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {record.user_role}
                            </span>
                          </td>
                          <td className="p-3">{formatDateTime(record.login_time)}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              record.success 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {record.success ? 'Success' : 'Failed'}
                            </span>
                          </td>
                          <td className="p-3">{record.ip_address || 'N/A'}</td>
                          <td className="p-3">{record.device_info || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">User Profiles ({userProfiles.length} users)</h3>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Name</th>
                      <th className="text-left p-3">Email</th>
                      <th className="text-left p-3">Role</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Created</th>
                      <th className="text-left p-3">Last Login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userProfiles.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{user.name}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-3">{formatDateTime(user.created_at)}</td>
                        <td className="p-3">{user.last_login ? formatDateTime(user.last_login) : 'Never'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Setup Instructions</h3>
          </div>
          <div className="p-6">
            <div className="prose prose-sm max-w-none">
              <h4>1. Create Login History Table</h4>
              <p>Run this SQL in your Supabase SQL Editor:</p>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
                {`-- See login-history-schema.sql file for complete setup`}
              </pre>
              
              <h4>2. Database Access</h4>
              <ul>
                <li>Go to: <a href="/mysql-test" target="_blank" className="text-blue-600 hover:underline">MySQL Database Test</a></li>
                <li>Use Table Editor to view data</li>
                <li>Use SQL Editor to run queries</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 