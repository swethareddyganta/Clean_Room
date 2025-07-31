"use client"

export default function EnvCheckPage() {
  const envVars = {
    JWT_SECRET: process.env.JWT_SECRET,
    MYSQL_HOST: process.env.MYSQL_HOST || 'localhost',
    MYSQL_PORT: process.env.MYSQL_PORT || '3306',
    MYSQL_USER: process.env.MYSQL_USER || 'root',
    MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'clean_room_db',
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Environment Variables Check
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">MySQL Database Configuration</h2>
          
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
                        {key === 'JWT_SECRET' ? 'Set (hidden)' : value}
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
              <li>• JWT_SECRET is required for authentication</li>
              <li>• MySQL configuration is read from database-config.json</li>
              <li>• Make sure MySQL server is running locally</li>
              <li>• Check that the clean_room_db database exists</li>
            </ul>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Note:</h3>
            <p className="text-sm text-yellow-800">
              This application now uses MySQL instead of Supabase. The database configuration 
              is managed through the database-config.json file in the root directory.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 