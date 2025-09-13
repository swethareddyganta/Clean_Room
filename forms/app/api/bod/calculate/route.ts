import { NextRequest, NextResponse } from 'next/server'
import { bodService } from '../../../../lib/bod-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.formData || !body.roomData || !Array.isArray(body.roomData)) {
      return NextResponse.json({
        success: false,
        error: 'formData and roomData are required'
      }, { status: 400 })
    }
    
    // Start BOD calculation using the service
    const calculationId = await bodService.startCalculation({
      formData: body.formData,
      roomData: body.roomData,
      calculationId: body.calculationId
    })
    
    return NextResponse.json({
      success: true,
      data: {
        id: calculationId,
        status: 'pending',
        message: 'BOD calculation started successfully'
      }
    })
    
  } catch (error) {
    console.error('Error starting BOD calculation:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error during BOD calculation'
    }, { status: 500 })
  }
}

// GET endpoint for testing
export async function GET() {
  try {
    const { calculateHVACExample } = await import('../../../../lib/hvac-calculator-engine')
    const exampleResult = calculateHVACExample()
    
    return NextResponse.json({
      success: true,
      data: exampleResult,
      message: 'Example BOD calculation completed'
    })
  } catch (error) {
    console.error('Error in example BOD calculation:', error)
    return NextResponse.json({
      success: false,
      error: 'Error generating example calculation'
    }, { status: 500 })
  }
}
