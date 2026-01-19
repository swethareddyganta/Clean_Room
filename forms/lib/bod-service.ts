// BOD (Bill of Design) Service
// Integrates with the existing form system to generate BOD calculations

import { computeRoom, computeZone, RoomInput, RoomResult, ZoneResult } from './hvac-calculator-excel-match'

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
  
  // Convert form data to HVAC inputs (Excel Match format)
  private convertFormDataToHVACInputs(formData: any, roomData: any[]): RoomInput[] {
    return roomData.map((room, index) => {
      // Determine if inside temperature is a number or "Amb"
      let tC_inside: number | "Amb" | "Ambient"
      const inTemp = room.inTempC || formData.requiredInsideTemp
      if (inTemp === null || inTemp === undefined || inTemp === "" || String(inTemp).toLowerCase() === "amb" || String(inTemp).toLowerCase() === "ambient") {
        tC_inside = "Amb"
      } else {
        tC_inside = parseFloat(String(inTemp)) || "Amb"
      }

      // Determine cooling method
      const coolingMethod = formData.coolingMethod || room.coolingMethod || "C"
      const chilled_or_dx: "C" | "D" = (coolingMethod === "DX" || coolingMethod === "D" || String(coolingMethod).toUpperCase() === "DX") ? "D" : "C"

      return {
        roomName: room.roomName || `Room ${index + 1}`,
        length_m: parseFloat(room.length) || 0,
        width_m: parseFloat(room.width) || 0,
        height_m: parseFloat(room.height) || 3,
        people: parseInt(room.occupancy) || 1,
        eqpt_kw: parseFloat(room.equipmentLoadKW) || 0,
        light_w_sqft: parseFloat(room.lightingLoadWSqft) || 1.75,
        inf_hr: parseFloat(room.infiltrationHr) || 0.5, // Default infiltration
        fresh_air_factor: parseFloat(room.freshAirPercentage) || parseFloat(formData.freshAirPercentage) || 10,
        exhaust_factor: parseFloat(room.exhaustAirCFM) || parseFloat(room.exhaustPercentage) || 0,
        tC_inside,
        rh_inside: parseFloat(room.requiredRH) || parseFloat(formData.minRh) || 40,
        t_out_maxC: parseFloat(room.outTempC) || parseFloat(formData.maxTemp) || 50,
        rh_out: parseFloat(room.outsideRH) || parseFloat(formData.maxRh) || 85,
        klass: room.classification || formData.classification || 'ISO 8',
        acph: parseFloat(room.noOfAirChanges) || parseFloat(formData.airChanges) || 40,
        chilled_or_dx
      }
    })
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
    console.log('Starting BOD calculation process for ID:', calculationId)
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
      console.log('Processing BOD calculation for ID:', calculationId)
      
      // Update status to processing
      this.updateCalculation(calculationId, {
        status: 'processing',
        progress: 10
      })
      
      console.log('Updated status to processing for ID:', calculationId)
      
      // Convert form data to HVAC inputs
      console.log('Converting form data to HVAC inputs...')
      console.log('Form data:', request.formData)
      console.log('Room data:', request.roomData)
      
      const hvacInputs = this.convertFormDataToHVACInputs(request.formData, request.roomData)
      console.log('Converted HVAC inputs:', hvacInputs)
      
      this.updateCalculation(calculationId, {
        progress: 30
      })
      
      // Perform calculations for each room using Excel Match calculator
      console.log('Starting HVAC calculations for', hvacInputs.length, 'rooms')
      const roomResults: RoomResult[] = []
      for (let i = 0; i < hvacInputs.length; i++) {
        console.log(`Calculating HVAC for room ${i + 1}/${hvacInputs.length}`)
        const result = computeRoom(hvacInputs[i])
        console.log(`HVAC result for room ${i + 1}:`, result)
        roomResults.push(result)
        
        // Update progress
        const progress = 30 + ((i + 1) / hvacInputs.length) * 50
        this.updateCalculation(calculationId, {
          progress: Math.round(progress)
        })
      }
      
      // Calculate zone aggregation
      console.log('Calculating zone aggregation...')
      const zoneResult = computeZone(roomResults)
      console.log('Zone result:', zoneResult)
      
      this.updateCalculation(calculationId, {
        progress: 85
      })
      
      // Generate summary
      console.log('Generating summary...')
      const summary = this.generateSummary(roomResults, zoneResult, request.formData)
      console.log('Generated summary:', summary)
      
      this.updateCalculation(calculationId, {
        progress: 95
      })
      
      // Complete calculation
      console.log('Completing BOD calculation for ID:', calculationId)
      this.updateCalculation(calculationId, {
        status: 'completed',
        progress: 100,
        result: {
          summary,
          roomResults,
          zoneResult,
          formData: request.formData,
          generatedAt: new Date().toISOString()
        },
        completedAt: new Date()
      })
      console.log('BOD calculation completed successfully for ID:', calculationId)
      
    } catch (error) {
      console.error('Error in BOD calculation process:', error)
      throw new Error(`BOD calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  // Generate summary from room results and zone result
  private generateSummary(roomResults: RoomResult[], zoneResult: ZoneResult, formData: any): any {
    const totalArea = roomResults.reduce((sum, r) => sum + r.X_area_sqft, 0)
    const totalVolume = roomResults.reduce((sum, r) => sum + r.Y_volume_ft3, 0)
    const totalCFM = roomResults.reduce((sum, r) => sum + r.AE_res_cfm, 0)
    
    const totalTR = roomResults
      .filter((r) => typeof r.AG_res_tr === "number")
      .reduce((sum, r) => sum + Number(r.AG_res_tr), 0)
    
    const totalLatentBTU = roomResults.reduce((sum, r) => sum + r.CF_latent_btuh, 0)
    const totalSensibleBTU = roomResults.reduce((sum, r) => sum + r.CE_sensible_btuh, 0)
    const totalBTU = roomResults.reduce((sum, r) => sum + r.CG_total_btuh, 0)
    
    return {
      projectName: formData.projectName,
      customerName: formData.customerName,
      location: formData.location,
      totalRooms: roomResults.length,
      totalArea: { value: Math.round(totalArea * 100) / 100, unit: 'ft²' },
      totalVolume: { value: Math.round(totalVolume * 100) / 100, unit: 'ft³' },
      totalCFM: { value: totalCFM, unit: 'CFM' },
      totalTR: { value: Math.round(totalTR * 100) / 100, unit: 'TR' },
      totalLatentBTU: { value: Math.round(totalLatentBTU), unit: 'BTU/h' },
      totalSensibleBTU: { value: Math.round(totalSensibleBTU), unit: 'BTU/h' },
      totalBTU: { value: Math.round(totalBTU), unit: 'BTU/h' },
      // Zone aggregation results
      zone: {
        ahuCFM: zoneResult.AK_ahu_cfm,
        ahuSize: {
          width: zoneResult.AL_W_mm,
          height: zoneResult.AL_H_mm,
          length: zoneResult.AL_L_mm,
        },
        blowerModel: zoneResult.AN_blower_model,
        motorHP: zoneResult.AO_motor_hp,
        staticPressure: zoneResult.AM_static_pa,
        coilRows: zoneResult.AP_coil_rows,
        maxStages: zoneResult.AR_max_stages,
        sumAG: zoneResult.AQ_sum_ag,
        calculatedAS: zoneResult.AS_calculated,
        calculatedAT: zoneResult.AT_calculated,
        calculatedAV: zoneResult.AV_calculated,
      },
      averageCFMPerRoom: { value: Math.round(totalCFM / roomResults.length), unit: 'CFM' },
      averageTRPerRoom: { value: Math.round((totalTR / roomResults.length) * 100) / 100, unit: 'TR' }
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

