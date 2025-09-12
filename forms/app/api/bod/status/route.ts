import { NextRequest, NextResponse } from 'next/server'
import { bodService } from '../../../../lib/bod-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const calculationId = searchParams.get('id')
    
    if (!calculationId) {
      return NextResponse.json({
        success: false,
        error: 'Calculation ID is required'
      }, { status: 400 })
    }
    
    const calculation = bodService.getCalculation(calculationId)
    
    if (!calculation) {
      return NextResponse.json({
        success: false,
        error: 'Calculation not found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: calculation.id,
        status: calculation.status,
        progress: calculation.progress,
        result: calculation.result,
        error: calculation.error,
        createdAt: calculation.createdAt,
        completedAt: calculation.completedAt
      }
    })
    
  } catch (error) {
    console.error('Error getting BOD status:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, progress, result, error } = body
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Calculation ID is required'
      }, { status: 400 })
    }
    
    // Get existing calculation from BOD service
    const existingCalculation = bodService.getCalculation(id)
    
    if (existingCalculation) {
      // Update existing calculation using the service
      bodService.updateCalculation(id, {
        status: status || existingCalculation.status,
        progress: progress !== undefined ? progress : existingCalculation.progress,
        result: result || existingCalculation.result,
        error: error || existingCalculation.error
      })
    } else {
      // Create new calculation using the service
      bodService.startCalculation({
        formData: {},
        roomData: [],
        calculationId: id
      })
      
      // Update with provided data
      if (status || progress !== undefined || result || error) {
        bodService.updateCalculation(id, {
          status: status || 'pending',
          progress: progress || 0,
          result,
          error
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'BOD status updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating BOD status:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// Helper function to create a new BOD calculation
export function createBODCalculation(id: string) {
  return bodService.startCalculation({
    formData: {},
    roomData: [],
    calculationId: id
  })
}

// Helper function to update BOD calculation status
export function updateBODCalculation(id: string, updates: {
  status?: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number
  result?: any
  error?: string
}) {
  return bodService.updateCalculation(id, updates)
}

// Helper function to get all BOD calculations (for admin purposes)
export function getAllBODCalculations() {
  return bodService.getAllCalculations()
}
