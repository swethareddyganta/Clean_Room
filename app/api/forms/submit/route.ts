import { NextRequest, NextResponse } from 'next/server'
import { saveFormSubmission } from '@/lib/database-mysql'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    
    const result = await saveFormSubmission(formData)
    
    if (result.error) {
      console.error('Error saving form submission:', result.error)
      return NextResponse.json({
        success: false,
        error: result.error.message || 'Failed to save form submission'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Form submitted successfully'
    })

  } catch (error) {
    console.error('Unexpected error in form submission:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
} 