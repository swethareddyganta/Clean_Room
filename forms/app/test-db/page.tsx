"use client"

import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { RefreshCw, Database, CheckCircle, XCircle, Eye, TestTube } from 'lucide-react'
import { runAllDatabaseTests, testDatabaseConnection } from '../../lib/test-database'
import { getFormSubmissions, type FormSubmission } from '../../lib/database'

export default function TestDatabasePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleRunTests = async () => {
    setIsLoading(true)
    try {
      const results = await runAllDatabaseTests()
      setTestResults(results)
      if (results.connection) {
        setConnectionStatus('success')
      } else {
        setConnectionStatus('error')
      }
    } catch (error) {
      console.error('Test failed:', error)
      setConnectionStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewSubmissions = async () => {
    setIsLoading(true)
    try {
      const result = await getFormSubmissions()
      if (result.data) {
        setSubmissions(result.data)
        setConnectionStatus('success')
      } else {
        setConnectionStatus('error')
      }
    } catch (error) {
      console.error('Failed to load submissions:', error)
      setConnectionStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestConnection = async () => {
    setIsLoading(true)
    try {
      const result = await testDatabaseConnection()
      if (result.success) {
        setConnectionStatus('success')
      } else {
        setConnectionStatus('error')
      }
    } catch (error) {
      setConnectionStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <Database className="inline-block mr-3 h-8 w-8" />
            Database Testing & Management
          </h1>
          <p className="text-gray-600">
            Test your Supabase database connection and view form submissions
          </p>
        </div>

        {/* Connection Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Connection Status
              {connectionStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {connectionStatus === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                onClick={handleTestConnection} 
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
                Test Connection
              </Button>
              <Button 
                onClick={handleRunTests} 
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <TestTube className="h-4 w-4 mr-2" />}
                Run Full Database Tests
              </Button>
              <Button 
                onClick={handleViewSubmissions} 
                disabled={isLoading}
                variant="secondary"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Eye className="h-4 w-4 mr-2" />}
                View All Submissions
              </Button>
            </div>

            {connectionStatus !== 'idle' && (
              <div className="mt-4">
                <Badge 
                  variant={connectionStatus === 'success' ? 'default' : 'destructive'}
                  className="text-sm"
                >
                  {connectionStatus === 'success' 
                    ? '✅ Database Connected' 
                    : '❌ Connection Failed'
                  }
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {testResults.connection ? '✅' : '❌'}
                  </div>
                  <div className="font-semibold">Connection</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {testResults.save ? '✅' : '❌'}
                  </div>
                  <div className="font-semibold">Save Data</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {testResults.retrieve ? '✅' : '❌'}
                  </div>
                  <div className="font-semibold">Retrieve Data</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Submissions */}
        {submissions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Form Submissions ({submissions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Unique ID</th>
                      <th className="text-left p-2">Customer</th>
                      <th className="text-left p-2">Project</th>
                      <th className="text-left p-2">System</th>
                      <th className="text-left p-2">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-xs">{submission.unique_id}</td>
                        <td className="p-2">{submission.customer_name}</td>
                        <td className="p-2">{submission.project_name}</td>
                        <td className="p-2">
                          <Badge variant="outline">{submission.system}</Badge>
                        </td>
                        <td className="p-2 text-gray-500">
                          {new Date(submission.created_at || '').toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Database Access Instructions</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <h4>1. Supabase Dashboard (Web Interface)</h4>
            <ul>
              <li>Go to: <a href="/mysql-test" target="_blank" className="text-blue-600 hover:underline">MySQL Database Test</a></li>
              <li>Navigate to "Table Editor" to see your data</li>
              <li>Use "SQL Editor" to run custom queries</li>
            </ul>

            <h4>2. Direct Database Query</h4>
            <p>Use the SQL Editor in Supabase to run queries like:</p>
            <code className="block bg-gray-100 p-2 rounded text-xs">
              SELECT * FROM form_submissions ORDER BY created_at DESC;
            </code>

            <h4>3. Environment Check</h4>
            <p>Make sure your .env.local file contains:</p>
            <ul>
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_API_KEY</li>
              <li>SUPABASE_URL</li>
              <li>SUPABASE_API_KEY</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 