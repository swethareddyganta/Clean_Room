import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql'

export async function GET() {
  try {
    const tables = ['form_submissions', 'user_profiles', 'login_history', 'login_stats', 'user_login_summary']
    const tableData = []

    for (const tableName of tables) {
      try {
        // Get table structure
        const structureResult = await executeQuery(`
          SELECT COLUMN_NAME 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
          ORDER BY ORDINAL_POSITION
        `, [process.env.MYSQL_DATABASE || 'clean_room_db', tableName])

        if (structureResult.error) {
          console.error(`Error getting structure for ${tableName}:`, structureResult.error)
          continue
        }

        const columns = (structureResult.data as any[]).map(col => col.COLUMN_NAME)

        // Get record count
        const countResult = await executeQuery(`SELECT COUNT(*) as count FROM ${tableName}`)
        const count = countResult.data ? (countResult.data as any[])[0]?.count || 0 : 0

        // Get sample data (limit to 10 records for performance)
        // Use appropriate ordering based on table type
        let orderByClause = ''
        if (tableName === 'login_stats') {
          orderByClause = 'ORDER BY login_date DESC'
        } else if (tableName === 'user_login_summary') {
          orderByClause = 'ORDER BY last_login DESC'
        } else {
          orderByClause = 'ORDER BY created_at DESC'
        }
        
        const dataResult = await executeQuery(`SELECT * FROM ${tableName} ${orderByClause} LIMIT 10`)
        const data = dataResult.data || []

        tableData.push({
          name: tableName,
          count: count,
          columns: columns,
          data: data
        })
      } catch (error) {
        console.error(`Error processing table ${tableName}:`, error)
        // Add empty table data if there's an error
        tableData.push({
          name: tableName,
          count: 0,
          columns: [],
          data: []
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: tableData,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Database viewer error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 