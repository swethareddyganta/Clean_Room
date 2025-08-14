import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    
    // For now, just log the data and return success
    // In a real application, you would save this to a database
    console.log('Form submission received:', formData)
    
    return NextResponse.json({
      success: true,
      data: formData,
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
