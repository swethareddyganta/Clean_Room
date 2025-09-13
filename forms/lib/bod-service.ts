// BOD (Bill of Design) Service
// Integrates with the existing form system to generate BOD calculations

import { calculateHVAC, HVACInputs } from './hvac-calculator-engine'

export interface BODCalculationRequest {
  formData: any // Form data from the multi-step form
  roomData: any[] // Room specifications from step 3
  calculationId?: string
}

export interface BODCalculationResult {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  result?: any
  error?: string
  createdAt: Date
  completedAt?: Date
}

export class BODService {
  private static instance: BODService
  private calculations = new Map<string, BODCalculationResult>()
  
  static getInstance(): BODService {
    if (!BODService.instance) {
      BODService.instance = new BODService()
    }
    return BODService.instance
  }
  
  // Convert form data to HVAC inputs
  private convertFormDataToHVACInputs(formData: any, roomData: any[]): HVACInputs[] {
    return roomData.map((room, index) => ({
      roomName: room.roomName || `Room ${index + 1}`,
      lengthMtrs: parseFloat(room.length) || 0,
      widthMtrs: parseFloat(room.width) || 0,
      heightMtrs: parseFloat(room.height) || 3,
      peopleNos: parseInt(room.occupancy) || 1,
      eqptLoadKW: parseFloat(room.equipmentLoadKW) || 0,
      lightingWSft: parseFloat(room.lightingLoadWSqft) || 1.75,
      noOfInfHr: 0.5, // Default infiltration
      freshAir: parseFloat(room.freshAirPercentage) || 10,
      exhaust: 0, // Default exhaust
      tInC: parseFloat(room.inTempC) || 24,
      rhIn: parseFloat(room.requiredRH) || 40,
      peakMaxTempOutC: parseFloat(room.outTempC) || 50,
      rhOut: parseFloat(room.outsideRH) || 85,
      class: room.classification || formData.classification || 'ISO 8',
      acph: parseFloat(room.noOfAirChanges) || 40,
      peakMinTempOutC: parseFloat(room.outTempC) - 10 || 40
    }))
  }
  
  // Start BOD calculation
  async startCalculation(request: BODCalculationRequest): Promise<string> {
    const calculationId = request.calculationId || this.generateCalculationId()
    
    // Initialize calculation
    const calculation: BODCalculationResult = {
      id: calculationId,
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    }
    
    this.calculations.set(calculationId, calculation)
    
    // Start processing asynchronously
    this.processCalculation(calculationId, request).catch(error => {
      console.error('BOD calculation error:', error)
      this.updateCalculation(calculationId, {
        status: 'failed',
        error: error.message,
        completedAt: new Date()
      })
    })
    
    return calculationId
  }
  
  // Process BOD calculation
  private async processCalculation(calculationId: string, request: BODCalculationRequest): Promise<void> {
    try {
      // Update status to processing
      this.updateCalculation(calculationId, {
        status: 'processing',
        progress: 10
      })
      
      // Convert form data to HVAC inputs
      const hvacInputs = this.convertFormDataToHVACInputs(request.formData, request.roomData)
      
      this.updateCalculation(calculationId, {
        progress: 30
      })
      
      // Perform calculations for each room
      const results = []
      for (let i = 0; i < hvacInputs.length; i++) {
        const result = calculateHVAC(hvacInputs[i])
        results.push(result)
        
        // Update progress
        const progress = 30 + ((i + 1) / hvacInputs.length) * 60
        this.updateCalculation(calculationId, {
          progress: Math.round(progress)
        })
      }
      
      // Generate summary
      const summary = this.generateSummary(results, request.formData)
      
      this.updateCalculation(calculationId, {
        progress: 95
      })
      
      // Complete calculation
      this.updateCalculation(calculationId, {
        status: 'completed',
        progress: 100,
        result: {
          summary,
          roomResults: results,
          formData: request.formData,
          generatedAt: new Date().toISOString()
        },
        completedAt: new Date()
      })
      
    } catch (error) {
      throw new Error(`BOD calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  // Generate summary from room results
  private generateSummary(results: any[], formData: any): any {
    const totalArea = results.reduce((sum, result) => sum + result.Area.value, 0)
    const totalVolume = results.reduce((sum, result) => sum + result.Volume.value, 0)
    const totalCFM = results.reduce((sum, result) => sum + result['AHU Cfm'].value, 0)
    const totalTR = results.reduce((sum, result) => sum + result['AHU Cooling Load in TR'].value, 0)
    const totalChilledWater = results.reduce((sum, result) => sum + result['Chilled water in GPM'].value, 0)
    
    return {
      projectName: formData.projectName,
      customerName: formData.customerName,
      location: formData.location,
      totalRooms: results.length,
      totalArea: { value: Math.round(totalArea * 100) / 100, unit: 'm^2' },
      totalVolume: { value: Math.round(totalVolume * 100) / 100, unit: 'm^3' },
      totalCFM: { value: totalCFM, unit: 'CFM' },
      totalTR: { value: totalTR, unit: 'TR' },
      totalChilledWater: { value: Math.round(totalChilledWater * 100) / 100, unit: 'GPM' },
      averageCFMPerRoom: { value: Math.round(totalCFM / results.length), unit: 'CFM' },
      averageTRPerRoom: { value: Math.round((totalTR / results.length) * 100) / 100, unit: 'TR' }
    }
  }
  
  // Get calculation status
  getCalculation(calculationId: string): BODCalculationResult | undefined {
    return this.calculations.get(calculationId)
  }
  
  // Update calculation
  updateCalculation(calculationId: string, updates: Partial<BODCalculationResult>): void {
    const calculation = this.calculations.get(calculationId)
    if (calculation) {
      Object.assign(calculation, updates)
      this.calculations.set(calculationId, calculation)
    }
  }
  
  // Generate unique calculation ID
  private generateCalculationId(): string {
    return `BOD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  // Get all calculations (for admin purposes)
  getAllCalculations(): BODCalculationResult[] {
    return Array.from(this.calculations.values())
  }
  
  // Clean up old calculations (older than 24 hours)
  cleanupOldCalculations(): void {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    for (const [id, calculation] of this.calculations.entries()) {
      if (calculation.createdAt < twentyFourHoursAgo) {
        this.calculations.delete(id)
      }
    }
  }
}

// Export singleton instance
export const bodService = BODService.getInstance()

