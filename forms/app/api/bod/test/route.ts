import { NextRequest, NextResponse } from 'next/server'
import { bodService } from '../../../../lib/bod-service'

export async function GET() {
  try {
    // Test with minimal data
    const testFormData = {
      projectName: 'Test Project',
      customerName: 'Test Customer',
      location: 'Test Location',
      classification: 'ISO 8'
    }
    
    const testRoomData = [
      {
        roomName: 'Test Room',
        length: '10',
        width: '10', 
        height: '3',
        occupancy: '1',
        equipmentLoadKW: '0',
        lightingLoadWSqft: '1.75',
        freshAirPercentage: '10',
        inTempC: '24',
        requiredRH: '40',
        outTempC: '50',
        outsideRH: '85',
        classification: 'ISO 8',
        noOfAirChanges: '40'
      }
    ]
    
    console.log('Starting test BOD calculation...')
    const calculationId = await bodService.startCalculation({
      formData: testFormData,
      roomData: testRoomData,
      calculationId: `TEST_${Date.now()}`
    })
    
    console.log('Test BOD calculation started with ID:', calculationId)
    
    // Wait a bit for processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const status = bodService.getCalculation(calculationId)
    
    return NextResponse.json({
      success: true,
      data: {
        calculationId,
        status,
        message: 'Test BOD calculation completed'
      }
    })
    
  } catch (error) {
    console.error('Error in test BOD calculation:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
