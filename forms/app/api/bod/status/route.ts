import { NextRequest, NextResponse } from 'next/server'
import { bodService } from '../../../lib/bod-service'

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
    
    const existingCalculation = bodCalculations.get(id)
    
    if (existingCalculation) {
      // Update existing calculation
      existingCalculation.status = status || existingCalculation.status
      existingCalculation.progress = progress !== undefined ? progress : existingCalculation.progress
      existingCalculation.result = result || existingCalculation.result
      existingCalculation.error = error || existingCalculation.error
      
      if (status === 'completed' || status === 'failed') {
        existingCalculation.completedAt = new Date()
      }
      
      bodCalculations.set(id, existingCalculation)
    } else {
      // Create new calculation
      bodCalculations.set(id, {
        id,
        status: status || 'pending',
        progress: progress || 0,
        result,
        error,
        createdAt: new Date(),
        completedAt: status === 'completed' || status === 'failed' ? new Date() : undefined
      })
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
  bodCalculations.set(id, {
    id,
    status: 'pending',
    progress: 0,
    createdAt: new Date()
  })
  return id
}

// Helper function to update BOD calculation status
export function updateBODCalculation(id: string, updates: {
  status?: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number
  result?: any
  error?: string
}) {
  const calculation = bodCalculations.get(id)
  if (calculation) {
    Object.assign(calculation, updates)
    if (updates.status === 'completed' || updates.status === 'failed') {
      calculation.completedAt = new Date()
    }
    bodCalculations.set(id, calculation)
  }
  return calculation
}

// Helper function to get all BOD calculations (for admin purposes)
export function getAllBODCalculations() {
  return Array.from(bodCalculations.values())
}
