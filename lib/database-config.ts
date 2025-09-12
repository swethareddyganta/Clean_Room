// Dual Database Configuration Manager
// This file manages connections to both local and remote databases simultaneously

import mysql from 'mysql2/promise'
import fs from 'fs'

export interface DatabaseConfig {
  host: string
  user: string
  password: string
  database: string
  port: number
  socket?: string
  ssl?: boolean
}

export interface DatabaseConnection {
  config: DatabaseConfig
  pool: mysql.Pool
  name: string
}

// Get local database configuration
export function getLocalDatabaseConfig(): DatabaseConfig {
  return {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'Ramana1113',
    database: process.env.MYSQL_DATABASE || 'cleanroom_db',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    socket: process.env.MYSQL_SOCKET || '/tmp/mysql.sock'
  }
}

// Get remote database configuration
export function getRemoteDatabaseConfig(): DatabaseConfig {
  return {
    host: process.env.REMOTE_MYSQL_HOST || '103.86.177.38',
    user: process.env.REMOTE_MYSQL_USER || 'atsuser',
    password: process.env.REMOTE_MYSQL_PASSWORD || 'Root1234!',
    database: process.env.REMOTE_MYSQL_DATABASE || 'cleanroom_db',
    port: parseInt(process.env.REMOTE_MYSQL_PORT || '3306', 10),
    ssl: true // Remote connections should use SSL
  }
}

// Create database connection pool
function createDatabasePool(config: DatabaseConfig, name: string): DatabaseConnection {
  const mysqlConfig: any = {
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+00:00',
    connectTimeout: 10_000,
    enableKeepAlive: true,
  }

  // Configure connection based on database type
  if (config.socket && fs.existsSync(config.socket)) {
    // Local database with socket
    mysqlConfig.socketPath = config.socket
  } else {
    // Remote database or local with TCP
    mysqlConfig.host = config.host
    mysqlConfig.port = config.port
    if (config.ssl) {
      mysqlConfig.ssl = { rejectUnauthorized: false }
    }
  }

  return {
    config,
    pool: mysql.createPool(mysqlConfig),
    name
  }
}

// Get both database connections
export function getDualDatabaseConnections(): { local: DatabaseConnection, remote: DatabaseConnection } {
  const localConfig = getLocalDatabaseConfig()
  const remoteConfig = getRemoteDatabaseConfig()
  
  return {
    local: createDatabasePool(localConfig, 'local'),
    remote: createDatabasePool(remoteConfig, 'remote')
  }
}

// Legacy function for backward compatibility
export function getDatabaseConfig(): DatabaseConfig {
  const useRemote = process.env.USE_REMOTE_DB === 'true'
  return useRemote ? getRemoteDatabaseConfig() : getLocalDatabaseConfig()
}

export function getCurrentDatabaseInfo(): { type: 'local' | 'remote' | 'dual', host: string } {
  const useRemote = process.env.USE_REMOTE_DB === 'true'
  const useDual = process.env.USE_DUAL_DB === 'true'
  
  if (useDual) {
    return {
      type: 'dual',
      host: 'localhost + remote'
    }
  }
  
  return {
    type: useRemote ? 'remote' : 'local',
    host: useRemote ? (process.env.REMOTE_MYSQL_HOST || '103.86.177.38') : 'localhost'
  }
}
