import { NextResponse } from 'next/server'
import { bodService } from '../../../../lib/bod-service'

export async function GET() {
  try {
    const allCalculations = bodService.getAllCalculations()
    
    return NextResponse.json({
      success: true,
      data: {
        totalCalculations: allCalculations.length,
        calculations: allCalculations.map(calc => ({
          id: calc.id,
          status: calc.status,
          progress: calc.progress,
          createdAt: calc.createdAt,
          completedAt: calc.completedAt,
          error: calc.error,
          hasResult: !!calc.result
        }))
      }
    })
    
  } catch (error) {
    console.error('Error getting debug info:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
