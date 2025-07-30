"use client"

export default function EnvCheckPage() {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_API_KEY: process.env.NEXT_PUBLIC_SUPABASE_API_KEY,
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Environment Variables Check
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Client-side Environment Variables</h2>
          
          <div className="space-y-3">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-4">
                <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {key}
                </div>
                <div className="flex items-center space-x-2">
                  {value ? (
                    <>
                      <span className="text-green-600 text-2xl">✅</span>
                      <span className="text-sm text-gray-600">
                        {value.substring(0, 30)}...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-red-600 text-2xl">❌</span>
                      <span className="text-sm text-red-600">Not set</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• All environment variables should show ✅</li>
              <li>• If any show ❌, check your .env.local file</li>
              <li>• Restart the development server after making changes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 