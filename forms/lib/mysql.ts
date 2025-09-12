// Re-export the main dual database connection
// This ensures forms use the same dual database system as the main app
export { mysqlPool, executeQuery, testMySQLConnection } from '../../lib/mysql'