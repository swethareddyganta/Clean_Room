import { NextResponse } from 'next/server'
import { testMySQLConnection } from '@/lib/mysql'

export async function GET() {
  try {
    const result = await testMySQLConnection()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'MySQL connection successful',
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'MySQL connection failed',
        error: result.error,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Unexpected error testing MySQL connection',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 