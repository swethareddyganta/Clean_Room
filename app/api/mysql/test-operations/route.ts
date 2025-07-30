import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql'

export async function GET() {
  try {
    const results = {
      connection: false,
      tables: false,
      insert: false,
      select: false,
      errors: [] as string[]
    }

    // Test 1: Connection
    try {
      const connectionResult = await executeQuery('SELECT 1 as test')
      if (connectionResult.data) {
        results.connection = true
      }
    } catch (error) {
      results.errors.push(`Connection failed: ${error}`)
    }

    // Test 2: Check if tables exist
    try {
      const tablesResult = await executeQuery(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME IN ('user_profiles', 'form_submissions', 'login_history')
      `, [process.env.MYSQL_DATABASE || 'clean_room_db'])
      
      if (tablesResult.data) {
        const tables = tablesResult.data as any[]
        results.tables = tables.length >= 3
        if (tables.length < 3) {
          results.errors.push(`Missing tables. Found: ${tables.map(t => t.TABLE_NAME).join(', ')}`)
        }
      }
    } catch (error) {
      results.errors.push(`Table check failed: ${error}`)
    }

    // Test 3: Insert test record
    try {
      const testData = {
        customer_name: 'Test Customer',
        customer_address: 'Test Address',
        branch_name: 'Test Branch',
        project_name: 'Test Project',
        location: 'Test Location',
        unique_id: `test-${Date.now()}`,
        standard: 'Test Standard',
        classification: 'Test Classification',
        system: 'Test System',
        max_temp: '25',
        min_temp: '20',
        max_rh: '60',
        min_rh: '40'
      }

      const insertSql = `
        INSERT INTO form_submissions (
          customer_name, customer_address, branch_name, project_name, location, unique_id,
          standard, classification, system_type, max_temp, min_temp, max_rh, min_rh
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      
      const insertParams = [
        testData.customer_name,
        testData.customer_address,
        testData.branch_name,
        testData.project_name,
        testData.location,
        testData.unique_id,
        testData.standard,
        testData.classification,
        testData.system,
        testData.max_temp,
        testData.min_temp,
        testData.max_rh,
        testData.min_rh
      ]

      const insertResult = await executeQuery(insertSql, insertParams)
      if (insertResult.data) {
        results.insert = true
      }
    } catch (error) {
      results.errors.push(`Insert test failed: ${error}`)
    }

    // Test 4: Select test record
    try {
      const selectResult = await executeQuery('SELECT COUNT(*) as count FROM form_submissions')
      if (selectResult.data) {
        results.select = true
      }
    } catch (error) {
      results.errors.push(`Select test failed: ${error}`)
    }

    return NextResponse.json({
      success: results.connection && results.tables && results.insert && results.select,
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Unexpected error testing MySQL operations',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 