import { NextRequest, NextResponse } from 'next/server'
import { bodService } from '../../../lib/bod-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const calculationId = searchParams.get('id')
    const format = searchParams.get('format') || 'json'
    
    if (!calculationId) {
      return NextResponse.json({
        success: false,
        error: 'Calculation ID is required'
      }, { status: 400 })
    }
    
    // Get calculation from BOD service
    const calculation = bodService.getCalculation(calculationId)
    
    if (!calculation) {
      return NextResponse.json({
        success: false,
        error: 'Calculation not found'
      }, { status: 404 })
    }
    
    if (calculation.status !== 'completed') {
      return NextResponse.json({
        success: false,
        error: 'Calculation not completed yet'
      }, { status: 400 })
    }
    
    if (!calculation.result) {
      return NextResponse.json({
        success: false,
        error: 'No calculation results available'
      }, { status: 400 })
    }
    
    // Generate download content based on format
    let content: string
    let contentType: string
    let filename: string
    
    switch (format.toLowerCase()) {
      case 'csv':
        content = generateCSV(calculation.result)
        contentType = 'text/csv'
        filename = `BOD_${calculationId}.csv`
        break
        
      case 'json':
      default:
        content = JSON.stringify(calculation.result, null, 2)
        contentType = 'application/json'
        filename = `BOD_${calculationId}.json`
        break
    }
    
    // Return file download
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': content.length.toString()
      }
    })
    
  } catch (error) {
    console.error('Error downloading BOD:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error during download'
    }, { status: 500 })
  }
}

function generateCSV(result: any): string {
  const rows: string[] = []
  
  // Add header
  rows.push('Parameter,Value,Unit')
  
  // Add all parameters
  Object.entries(result).forEach(([key, value]) => {
    if (key === 'assumptions_used') {
      // Handle assumptions array
      if (Array.isArray(value)) {
        value.forEach((assumption, index) => {
          rows.push(`Assumption ${index + 1},"${assumption}",-`)
        })
      }
    } else if (key === 'AHU Size') {
      // Handle AHU Size object
      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          rows.push(`AHU Size - ${subKey},"${subValue}",mm`)
        })
      }
    } else if (typeof value === 'object' && value !== null && 'value' in value && 'unit' in value) {
      // Handle value/unit objects
      rows.push(`${key},"${value.value}","${value.unit}"`)
    } else if (typeof value === 'object' && value !== null && 'method' in value) {
      // Handle motor HP object
      rows.push(`${key},"${value.value}","${value.unit}"`)
      rows.push(`${key} - Method,"${value.method}",-`)
    } else {
      // Handle simple values
      const stringValue = value === null ? 'N/A' : String(value)
      rows.push(`${key},"${stringValue}",-`)
    }
  })
  
  return rows.join('\n')
}
