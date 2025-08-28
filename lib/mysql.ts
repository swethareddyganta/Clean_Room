import mysql from 'mysql2/promise'
import fs from 'fs'

// Only run on server side
if (typeof window !== 'undefined') {
  throw new Error('MySQL connection cannot be used on client side')
}

// Debug environment variables (server-side only)
console.log('🔍 Server-side MySQL env check:', {
  MYSQL_HOST: process.env.MYSQL_HOST ? '✅ Set' : '❌ Missing',
  MYSQL_USER: process.env.MYSQL_USER ? '✅ Set' : '❌ Missing',
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD ? '✅ Set' : '❌ Missing',
  MYSQL_DATABASE: process.env.MYSQL_DATABASE ? '✅ Set' : '❌ Missing',
  MYSQL_SOCKET: process.env.MYSQL_SOCKET ? '✅ Set' : '❌ Missing',
})

const resolvedHost = (process.env.MYSQL_HOST || '').trim() || '127.0.0.1'
const isLocalHost = resolvedHost === 'localhost' || resolvedHost === '127.0.0.1'
const socketFromEnv = process.env.MYSQL_SOCKET

// Build base config
const mysqlConfig: any = {
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'clean_room_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
  connectTimeout: 10_000,
  enableKeepAlive: true,
}

// Prefer explicit socket if provided and exists
if (socketFromEnv && fs.existsSync(socketFromEnv)) {
  mysqlConfig.socketPath = socketFromEnv
} else {
  // Otherwise use TCP; normalize localhost to 127.0.0.1 to avoid IPv6 or socket quirks
  mysqlConfig.host = resolvedHost === 'localhost' ? '127.0.0.1' : resolvedHost
  mysqlConfig.port = parseInt(process.env.MYSQL_PORT || '3306', 10)
  if (!isLocalHost) {
    mysqlConfig.ssl = { rejectUnauthorized: false }
  }
}

console.log('🔧 MySQL Config:', {
  host: mysqlConfig.host,
  user: mysqlConfig.user,
  database: mysqlConfig.database,
  port: mysqlConfig.port,
  socketPath: mysqlConfig.socketPath,
})

// Create connection pool
export const mysqlPool = mysql.createPool(mysqlConfig)

// Test connection function
export async function testMySQLConnection() {
  try {
    const connection = await mysqlPool.getConnection()
    console.log('✅ MySQL connection successful')
    console.log('📊 Server info:', connection.config.host, ':', connection.config.port)
    connection.release()
    return { success: true, message: 'Connection successful' }
  } catch (error) {
    console.error('❌ MySQL connection failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }
  }
}

// Helper function to execute queries
export async function executeQuery(sql: string, params: any[] = []) {
  try {
    const [rows] = await mysqlPool.execute(sql, params)
    return { data: rows, error: null }
  } catch (error) {
    console.error('❌ Query execution failed:', error)
    // Helpful hint for EADDRNOTAVAIL
    if ((error as any)?.code === 'EADDRNOTAVAIL') {
      console.error('💡 Hint: EADDRNOTAVAIL often means the MySQL host is unreachable or invalid. Try:')
      console.error('   - Use MYSQL_HOST=127.0.0.1 for local DB (not localhost)')
      console.error('   - Ensure the DB is listening on the specified interface and port')
      console.error('   - If using a socket, set MYSQL_SOCKET to the correct path')
    }
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }
  }
} 