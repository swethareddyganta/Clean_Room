"use client"

import { useState } from 'react'

export default function MySQLTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  const [envStatus, setEnvStatus] = useState<any>(null)

  const checkEnvironment = () => {
    const envVars = {
      MYSQL_HOST: process.env.MYSQL_HOST,
      MYSQL_USER: process.env.MYSQL_USER,
      MYSQL_PASSWORD: process.env.MYSQL_PASSWORD ? '✅ Set' : '❌ Missing',
      MYSQL_DATABASE: process.env.MYSQL_DATABASE,
      MYSQL_PORT: process.env.MYSQL_PORT,
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'
    }
    setEnvStatus(envVars)
  }

  const testMySQLConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/mysql/test-connection')
      const result = await response.json()
      setTestResults(result)
    } catch (error) {
      setTestResults({ error: 'Failed to test connection' })
    } finally {
      setIsLoading(false)
    }
  }

  const testDatabaseOperations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/mysql/test-operations')
      const result = await response.json()
      setTestResults(result)
    } catch (error) {
      setTestResults({ error: 'Failed to test operations' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          MySQL Database Testing
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Environment Check */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <button
              onClick={checkEnvironment}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            >
              Check Environment
            </button>
            
            {envStatus && (
              <div className="space-y-2">
                {Object.entries(envStatus).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-mono text-sm">{key}:</span>
                    <span className={value === '❌ Missing' ? 'text-red-600' : 'text-green-600'}>
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Connection Test */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Database Connection</h2>
            <button
              onClick={testMySQLConnection}
              disabled={isLoading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 mb-4"
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </button>
            
            {testResults && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Results:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Database Operations Test */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Database Operations</h2>
          <button
            onClick={testDatabaseOperations}
            disabled={isLoading}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Operations'}
          </button>
        </div>

        {/* Setup Instructions */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">MySQL Setup Instructions</h2>
          <div className="prose prose-sm max-w-none">
            <h3>1. Install MySQL</h3>
            <ul>
              <li>Download and install MySQL Server</li>
              <li>Create a database: <code>CREATE DATABASE clean_room_db;</code></li>
              <li>Create a user or use root (not recommended for production)</li>
            </ul>

            <h3>2. Run Database Schema</h3>
            <ul>
              <li>Open MySQL client or workbench</li>
              <li>Run the SQL from <code>mysql-schema.sql</code></li>
            </ul>

            <h3>3. Configure Environment</h3>
            <ul>
              <li>Copy <code>mysql-env-example.txt</code> to <code>.env.local</code></li>
              <li>Update with your MySQL credentials</li>
              <li>Restart your development server</li>
            </ul>

            <h3>4. Test Connection</h3>
            <ul>
              <li>Use the buttons above to test your setup</li>
              <li>Check the console for detailed error messages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 