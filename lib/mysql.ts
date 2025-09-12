import mysql from 'mysql2/promise'
import fs from 'fs'
import { getDatabaseConfig, getCurrentDatabaseInfo, getDualDatabaseConnections } from './database-config'

// Only run on server side
if (typeof window !== 'undefined') {
  throw new Error('MySQL connection cannot be used on client side')
}

// Check if we should use dual database mode
const useDualDB = process.env.USE_DUAL_DB === 'true'
const dbInfo = getCurrentDatabaseInfo()

// Debug environment variables (server-side only)
console.log('🔍 Server-side MySQL env check:', {
  databaseType: dbInfo.type,
  useDualDB: useDualDB,
  localHost: process.env.MYSQL_HOST ? '✅ Set' : '❌ Missing',
  remoteHost: process.env.REMOTE_MYSQL_HOST ? '✅ Set' : '❌ Missing',
  localUser: process.env.MYSQL_USER ? '✅ Set' : '❌ Missing',
  remoteUser: process.env.REMOTE_MYSQL_USER ? '✅ Set' : '❌ Missing',
  localPassword: process.env.MYSQL_PASSWORD ? '✅ Set' : '❌ Missing',
  remotePassword: process.env.REMOTE_MYSQL_PASSWORD ? '✅ Set' : '❌ Missing',
  localDatabase: process.env.MYSQL_DATABASE ? '✅ Set' : '❌ Missing',
  remoteDatabase: process.env.REMOTE_MYSQL_DATABASE ? '✅ Set' : '❌ Missing',
  socket: process.env.MYSQL_SOCKET ? '✅ Set' : '❌ Missing'
})

// Initialize database connections
let mysqlPool: mysql.Pool
let dualConnections: { local: any, remote: any } | null = null

if (useDualDB) {
  // Dual database mode - connect to both local and remote
  console.log('🔄 Initializing dual database connections...')
  dualConnections = getDualDatabaseConnections()
  mysqlPool = dualConnections.local.pool // Use local as primary for backward compatibility
  
  console.log('🔧 Dual MySQL Config:', {
    local: {
      host: dualConnections.local.config.host,
      user: dualConnections.local.config.user,
      database: dualConnections.local.config.database,
      socket: dualConnections.local.config.socket
    },
    remote: {
      host: dualConnections.remote.config.host,
      user: dualConnections.remote.config.user,
      database: dualConnections.remote.config.database,
      ssl: dualConnections.remote.config.ssl
    }
  })
} else {
  // Single database mode (legacy)
  const dbConfig = getDatabaseConfig()
  
  const mysqlConfig: any = {
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+00:00',
    connectTimeout: 10_000,
    enableKeepAlive: true,
  }

  // Configure connection based on database type
  if (dbInfo.type === 'local' && dbConfig.socket && fs.existsSync(dbConfig.socket)) {
    mysqlConfig.socketPath = dbConfig.socket
  } else {
    mysqlConfig.host = dbConfig.host
    mysqlConfig.port = dbConfig.port
    if (dbConfig.ssl) {
      mysqlConfig.ssl = { rejectUnauthorized: false }
    }
  }

  console.log('🔧 Single MySQL Config:', {
    type: dbInfo.type,
    host: mysqlConfig.host,
    user: mysqlConfig.user,
    database: mysqlConfig.database,
    port: mysqlConfig.port,
    socketPath: mysqlConfig.socketPath,
    ssl: mysqlConfig.ssl ? 'Enabled' : 'Disabled'
  })

  mysqlPool = mysql.createPool(mysqlConfig)
}

export { mysqlPool }

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

// Helper function to execute queries on both databases
export async function executeQuery(sql: string, params: any[] = []) {
  const useDualDB = process.env.USE_DUAL_DB === 'true'
  
  if (useDualDB && dualConnections) {
    // Dual database mode - execute on both databases
    console.log('🔄 Executing query on both databases:', sql.substring(0, 50) + '...')
    
    const results = {
      local: { data: null as any, error: null as string | null },
      remote: { data: null as any, error: null as string | null }
    }
    
    // Execute on local database
    try {
      const [localRows] = await dualConnections.local.pool.execute(sql, params)
      results.local = { data: localRows, error: null }
      console.log('✅ Local database query successful')
    } catch (error) {
      results.local = { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }
      console.error('❌ Local database query failed:', error)
    }
    
    // Execute on remote database
    try {
      const [remoteRows] = await dualConnections.remote.pool.execute(sql, params)
      results.remote = { data: remoteRows, error: null }
      console.log('✅ Remote database query successful')
    } catch (error) {
      results.remote = { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }
      console.error('❌ Remote database query failed:', error)
    }
    
    // Return local results as primary (for backward compatibility)
    // But log if there were any issues
    if (results.local.error && results.remote.error) {
      console.error('❌ Both databases failed!')
      return { 
        data: null, 
        error: `Both databases failed. Local: ${results.local.error}, Remote: ${results.remote.error}`,
        details: { local: results.local, remote: results.remote }
      }
    } else if (results.local.error) {
      console.warn('⚠️ Local database failed, but remote succeeded')
    } else if (results.remote.error) {
      console.warn('⚠️ Remote database failed, but local succeeded')
    }
    
    return results.local
  } else {
    // Single database mode (legacy)
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
} 