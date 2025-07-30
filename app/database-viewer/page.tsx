"use client"

import { useState, useEffect } from "react"

interface DatabaseRecord {
  [key: string]: any
}

interface TableData {
  name: string
  count: number
  data: DatabaseRecord[]
  columns: string[]
}

export default function DatabaseViewerPage() {
  const [tables, setTables] = useState<TableData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("form_submissions")

  useEffect(() => {
    fetchDatabaseData()
  }, [])

  const fetchDatabaseData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch all table data from API
      const response = await fetch('/api/database/view-all')
      const result = await response.json()
      
      if (result.success) {
        setTables(result.data)
      } else {
        setError(result.error || 'Failed to fetch database data')
      }
    } catch (err) {
      setError('Failed to connect to database')
    } finally {
      setLoading(false)
    }
  }

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A'
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading database data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchDatabaseData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Viewer</h1>
        <p className="text-gray-600">View and manage your clean room specification database</p>
      </div>

      {/* Database Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {tables.map((table) => (
          <div key={table.name} className="border-2 border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{table.name}</h3>
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                {table.count} records
              </span>
            </div>
            <button 
              onClick={() => setActiveTab(table.name)}
              className="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
            >
              View Data
            </button>
          </div>
        ))}
      </div>

      {/* Table Data Viewer */}
      <div className="border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Table Data</h2>
            <button 
              onClick={fetchDatabaseData}
              className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
        
        <div className="p-4">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-4 border-b border-gray-200">
            {tables.map((table) => (
              <button
                key={table.name}
                onClick={() => setActiveTab(table.name)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                  activeTab === table.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {table.name}
              </button>
            ))}
          </div>
          
          {/* Table Content */}
          {tables.map((table) => (
            <div key={table.name} className={activeTab === table.name ? 'block' : 'hidden'}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{table.name}</h3>
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                  {table.count} records
                </span>
              </div>
              
              {table.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        {table.columns.map((column) => (
                          <th key={column} className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.data.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {table.columns.map((column) => (
                            <td key={column} className="border border-gray-300 px-3 py-2 text-sm">
                              {column.includes('created_at') || column.includes('updated_at') 
                                ? formatDate(formatValue(row[column]))
                                : formatValue(row[column])
                              }
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No data available in this table
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 