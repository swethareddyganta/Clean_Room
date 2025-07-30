import mysql from 'mysql2/promise'

// Only run on server side
if (typeof window !== 'undefined') {
  throw new Error('MySQL connection cannot be used on client side')
}

// Debug environment variables (server-side only)
console.log('🔍 Server-side MySQL env check:', {
  MYSQL_HOST: process.env.MYSQL_HOST ? '✅ Set' : '❌ Missing',
  MYSQL_USER: process.env.MYSQL_USER ? '✅ Set' : '❌ Missing',
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD ? '✅ Set' : '❌ Missing',
  MYSQL_DATABASE: process.env.MYSQL_DATABASE ? '✅ Set' : '❌ Missing'
})

const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'clean_room_db',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00'
}

// Create connection pool
export const mysqlPool = mysql.createPool(mysqlConfig)

// Test connection function
export async function testMySQLConnection() {
  try {
    const connection = await mysqlPool.getConnection()
    console.log('✅ MySQL connection successful!')
    connection.release()
    return { success: true }
  } catch (error) {
    console.error('❌ MySQL connection failed:', error)
    return { success: false, error }
  }
}

// Helper function to execute queries
export async function executeQuery(sql: string, params: any[] = []) {
  try {
    const [rows] = await mysqlPool.execute(sql, params)
    return { data: rows, error: null }
  } catch (error) {
    console.error('Query execution error:', error)
    return { data: null, error }
  }
} 