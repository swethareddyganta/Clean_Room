"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FormsRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the forms application running on port 3000 (if different)
    // or show instructions for accessing the forms app
    window.location.href = 'http://localhost:3000'
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md mx-auto text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Redirecting to Forms Application...
        </h1>
        <p className="text-gray-600 mb-4">
          If you're not redirected automatically, the forms application should be running on:
        </p>
        <div className="bg-white rounded-lg p-4 border">
          <p className="font-mono text-sm">
            <a 
              href="http://localhost:3000" 
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              http://localhost:3000
            </a>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            (forms subdirectory application)
          </p>
        </div>
      </div>
    </div>
  )
} 