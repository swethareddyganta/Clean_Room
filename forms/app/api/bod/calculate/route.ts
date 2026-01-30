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
    const { computeRoom, computeZone } = await import('../../../../lib/hvac-calculator-excel-match')
    
    // Example room input
    const exampleRoom = {
      roomName: "Example Clean Room",
      length_m: 6,
      width_m: 5,
      height_m: 3,
      people: 4,
      eqpt_kw: 2,
      light_w_sqft: 1.5,
      inf_hr: 0.5,
      fresh_air_factor: 20,
      exhaust_factor: 10,
      tC_inside: 23,
      rh_inside: 55,
      t_out_maxC: 35,
      rh_out: 60,
      klass: "ISO 7",
      acph: 10,
      chilled_or_dx: "C" as const
    }
    
    const roomResult = computeRoom(exampleRoom)
    const zoneResult = computeZone([roomResult])
    
    return NextResponse.json({
      success: true,
      data: {
        roomResult,
        zoneResult,
        message: 'Example BOD calculation completed using Excel Match calculator'
      }
    })
  } catch (error) {
    console.error('Error in example BOD calculation:', error)
    return NextResponse.json({
      success: false,
      error: 'Error generating example calculation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
