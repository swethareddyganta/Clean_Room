// Comprehensive HVAC Calculation Engine
// Implements all calculations according to the specified formulas and rounding rules

export interface HVACInputs {
  roomName: string
  lengthMtrs: number // m
  widthMtrs: number // m
  heightMtrs: number // m
  peopleNos: number // integer
  eqptLoadKW: number // kW
  lightingWSft: number // W/ft²
  noOfInfHr: number // air changes per hour due to infiltration
  freshAir: number // percent 0-100
  exhaust: number // percent 0-100
  tInC: number // °C (Required inside)
  rhIn: number // % (e.g., 55 means 55%)
  peakMaxTempOutC: number // °C
  rhOut: number // % (e.g., 60 means 60%)
  class: string // e.g., "ISO 6", "GRADE B", "1K", "100", "ISO 7", "NC", etc.
  acph: number // air changes per hour
  peakMinTempOutC?: number // °C (optional)
}

export interface HVACOutput {
  room_name: string
  Area: { value: number; unit: string }
  Volume: { value: number; unit: string }
  "Room Cfm": { value: number; unit: string }
  FA: { value: number; unit: string }
  EA: { value: number; unit: string }
  "Rem. Water vapour Kg/hr": { value: number; unit: string }
  "Deh. Cfm": { value: number; unit: string }
  "Res. Cfm": { value: number; unit: string }
  "Room Terminal Supply Module in Sft": { value: number; unit: string }
  "Res. Cooling Load in TR": { value: number; unit: string }
  "Room AC load in TR": { value: number; unit: string }
  "Cfm AC load in TR": { value: number; unit: string }
  "AHU Cfm": { value: number; unit: string }
  "AHU Size": {
    Width_mm: number
    Height_mm: number
    Length_mm: number
    AM_blower_code: string
  }
  "Static Pressure": { value: number | null; unit: string }
  "Blower Model BDB": string
  "Motor Selected in Hp": { value: number | null; unit: string; method: string }
  "No. of Rows of Cooling Coil": number | null
  "AHU Cooling Load in TR": { value: number; unit: string }
  "No. Of Stages of Filtr.": number
  "Chilled water in GPM": { value: number; unit: string }
  "Chilled water in L/s": { value: number; unit: string }
  "Flow Velocity in m/s": { value: number; unit: string }
  "Pipe Size in mm": number
  "Hot Water/Steam in GPM": { value: number | null; unit: string }
  "Hot water/Steam in L/s": { value: number | null; unit: string }
  "Flow Velocity": { value: number | null; unit: string }
  "Pipe Size": number | null
  assumptions_used: string[]
}

// Constants
const CONSTANTS = {
  // Psychrometrics
  ATMOSPHERIC_PRESSURE: 1013.25, // mb
  WATER_AIR_MOLECULAR_RATIO: 0.622,
  AIR_DENSITY: 0.075, // lb/ft³
  
  // Unit conversions
  M3_TO_FT3: 35.3147,
  LB_TO_KG: 0.45359237,
  KG_TO_LB: 2.20462,
  TR_TO_BTU_HR: 12000,
  TR_TO_KW: 3.517,
  GPM_TO_LS: 0.0630902,
  
  // Design deltas
  DEFAULT_AIR_SENSIBLE_DELTA_T: 10, // °F
  DEFAULT_CHILLED_WATER_DELTA_T: 10, // °F
  
  // Efficiencies
  FAN_EFFICIENCY: 0.6, // 60%
  MOTOR_EFFICIENCY: 0.9, // 90%
  
  // Velocity targets
  CHILLED_WATER_VELOCITY: 2.0, // m/s
  HOT_WATER_VELOCITY: 1.6, // m/s
  
  // Defaults
  DEFAULT_FILTER_STAGES: 2,
  DEFAULT_COIL_ROWS: 4
}

// Utility functions
function roundUpTo(value: number, increment: number): number {
  return Math.ceil(value / increment) * increment
}

function roundToNearest(value: number, increment: number): number {
  return Math.round(value / increment) * increment
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// Psychrometric calculations
function calculateSaturationVaporPressure(tempC: number): number {
  // Tetens formula: P_ws = 6.1078 * 10^(7.5*T_C / (237.3 + T_C))
  return 6.1078 * Math.pow(10, (7.5 * tempC) / (237.3 + tempC))
}

function calculateHumidityRatio(tempC: number, rhPercent: number): number {
  const rhFrac = clamp(rhPercent / 100, 0, 1)
  const pws = calculateSaturationVaporPressure(tempC)
  const pw = rhFrac * pws
  return (CONSTANTS.WATER_AIR_MOLECULAR_RATIO * pw) / (CONSTANTS.ATMOSPHERIC_PRESSURE - pw)
}

// AHU sizing functions
function getAHUWidth(ahuCFM: number): number {
  if (ahuCFM <= 2000) return 950
  if (ahuCFM <= 3000) return 1150
  if (ahuCFM <= 8000) return 1550
  if (ahuCFM <= 10000) return 1750
  if (ahuCFM <= 18000) return 2050
  if (ahuCFM <= 32000) return 2900
  if (ahuCFM <= 40000) return 3600
  return 4000
}

function getAHUHeight(ahuCFM: number): number {
  if (ahuCFM <= 2000) return 950
  if (ahuCFM <= 4000) return 1100
  if (ahuCFM <= 6000) return 1250
  if (ahuCFM <= 10000) return 1550
  if (ahuCFM <= 15000) return 1750
  if (ahuCFM <= 24000) return 2050
  if (ahuCFM <= 40000) return 2900
  return 3600
}

function getAHULength(ahuCFM: number, filterStages: number, coilRows: number): number {
  // Base length by AM
  let baseLength = 2500 // default
  if (ahuCFM <= 315) baseLength = 1600
  else if (ahuCFM <= 355) baseLength = 1650
  else if (ahuCFM <= 400) baseLength = 1650
  else if (ahuCFM <= 450) baseLength = 1700
  else if (ahuCFM <= 500) baseLength = 1700
  else if (ahuCFM <= 560) baseLength = 1800
  else if (ahuCFM <= 630) baseLength = 2000
  else if (ahuCFM <= 710) baseLength = 2200
  
  // Filter adder
  let filterAdder = 0
  if (filterStages === 1) filterAdder = 0
  else if (filterStages === 2) filterAdder = 1800
  else if (filterStages === 3) filterAdder = 2300
  else if (filterStages === 4) filterAdder = 3300
  else filterAdder = 3300 // default for >4 stages
  
  // Coil adder
  let coilAdder = 600
  if (coilRows <= 4) coilAdder = 600
  else if (coilRows <= 6) coilAdder = 800
  else if (coilRows <= 8) coilAdder = 1000
  else coilAdder = 1200
  
  return baseLength + filterAdder + coilAdder
}

function getBlowerModel(ahuCFM: number): string {
  if (ahuCFM <= 1300) return "200"
  if (ahuCFM <= 1600) return "225"
  if (ahuCFM <= 2100) return "250"
  if (ahuCFM <= 2700) return "280"
  if (ahuCFM <= 3450) return "315"
  if (ahuCFM <= 4250) return "355"
  if (ahuCFM <= 5250) return "400"
  if (ahuCFM <= 6750) return "450"
  if (ahuCFM <= 8500) return "500"
  if (ahuCFM <= 10750) return "560"
  if (ahuCFM <= 13500) return "630"
  if (ahuCFM <= 17000) return "710"
  if (ahuCFM <= 21500) return "800"
  if (ahuCFM <= 27000) return "900"
  if (ahuCFM <= 34000) return "1000"
  if (ahuCFM <= 43000) return "1120"
  if (ahuCFM <= 49000) return "1200"
  if (ahuCFM <= 68000) return "1450"
  return "Refer"
}

function getRoomTerminalSupplyFactor(classification: string): number {
  const classLower = classification.toLowerCase()
  
  // ISO 5/6, GRADE A/B, 100, 1K
  if (classLower.includes('iso 5') || classLower.includes('iso 6') ||
      classLower.includes('grade a') || classLower.includes('grade b') ||
      classLower.includes('100') || classLower.includes('1k')) {
    return 1/100
  }
  
  // ISO 7/8, GRADE C/D, 10K, 100K
  if (classLower.includes('iso 7') || classLower.includes('iso 8') ||
      classLower.includes('grade c') || classLower.includes('grade d') ||
      classLower.includes('10k') || classLower.includes('100k')) {
    return 1/250
  }
  
  // NC, 20 Micron, 5 Micron, N C
  if (classLower.includes('nc') || classLower.includes('micron') ||
      classLower.includes('n c')) {
    return 1/350
  }
  
  return 0
}

function calculatePipeSize(flowLps: number, velocityMs: number): number {
  // Q = A * V, where A = π * D² / 4
  // D = sqrt(4 * Q / (π * V))
  const qM3s = flowLps / 1000
  const dReq = Math.sqrt((4 * qM3s) / (Math.PI * velocityMs))
  const dMm = dReq * 1000
  
  // Round up to next standard pipe size
  const standardSizes = [15, 20, 25, 32, 40, 50, 65, 80, 100, 125, 150, 200, 250, 300, 350, 400, 450, 500]
  
  for (const size of standardSizes) {
    if (size >= dMm) return size
  }
  
  return Math.ceil(dMm / 50) * 50 // fallback
}

export function calculateHVAC(inputs: HVACInputs): HVACOutput {
  const assumptions: string[] = []
  
  // Clamp RH values
  const rhInClamped = clamp(inputs.rhIn, 0, 100)
  const rhOutClamped = clamp(inputs.rhOut, 0, 100)
  
  if (rhInClamped !== inputs.rhIn) {
    assumptions.push(`RH(in) clamped from ${inputs.rhIn}% to ${rhInClamped}%`)
  }
  if (rhOutClamped !== inputs.rhOut) {
    assumptions.push(`RH(out) clamped from ${inputs.rhOut}% to ${rhOutClamped}%`)
  }
  
  // 1. Geometry & base airflows
  const area = inputs.lengthMtrs * inputs.widthMtrs
  const volume = area * inputs.heightMtrs
  const volumeFt3 = volume * CONSTANTS.M3_TO_FT3
  
  // 2. Room CFM
  const roomCFM = (volumeFt3 * inputs.acph) / 60
  
  // 3. Fresh Air and Exhaust
  const fa = roomCFM * (inputs.freshAir / 100)
  const ea = roomCFM * (inputs.exhaust / 100)
  
  // 4. Psychrometric calculations
  const win = calculateHumidityRatio(inputs.tInC, rhInClamped)
  const wout = calculateHumidityRatio(inputs.peakMaxTempOutC, rhOutClamped)
  const deltaW = wout - win
  
  // 5. Moisture removal
  const dryAirMassFlowLbHr = fa * CONSTANTS.AIR_DENSITY * 60
  const removalKgHr = (dryAirMassFlowLbHr / CONSTANTS.KG_TO_LB) * deltaW
  
  // 6. Dehumidified CFM calculation
  // Moisture load components in CFM-equivalent
  const peopleMoisture = inputs.peopleNos * 200 * 0.68 * deltaW
  const infiltrationMoisture = inputs.noOfInfHr * 375 * 0.68 * deltaW
  const generatedFA = roomCFM * (inputs.freshAir / 100) * 0.68 * deltaW
  const generatedReturn = roomCFM * (inputs.exhaust / 100) * 0.68 * deltaW
  
  const moistureLoad = peopleMoisture + infiltrationMoisture + generatedFA + generatedReturn
  const dehCFM = roundUpTo(moistureLoad / (0.68 * deltaW), 25)
  
  // 7. Resultant CFM
  const resCFM = roundUpTo(Math.max(roomCFM + fa, dehCFM), 25)
  
  // 8. Room Terminal Supply Module
  const factor = getRoomTerminalSupplyFactor(inputs.class)
  const rtsFt2 = factor > 0 ? roundUpTo(resCFM * factor, 2) : 0
  
  // 9. Cooling loads
  const qPeopleKW = 0.13 * inputs.peopleNos
  const qPeopleBTU = qPeopleKW * 3412
  
  const qEquipmentBTU = inputs.eqptLoadKW * 3412
  
  const areaFt2 = area * 10.764 // m² to ft²
  const qLightingKW = (inputs.lightingWSft * areaFt2) / 1000
  const qLightingBTU = qLightingKW * 3412
  
  const totalSensibleBTU = qPeopleBTU + qEquipmentBTU + qLightingBTU
  
  // 10. Cooling load in TR
  const resTR = roundToNearest(Math.max(totalSensibleBTU / CONSTANTS.TR_TO_BTU_HR, resCFM / 400), 0.5)
  const roomACLoadTR = resTR
  const cfmACLoadTR = roundToNearest(resCFM / 400, 0.5)
  
  // 11. AHU calculations
  const ahuCFM = roundUpTo(resCFM, 250)
  const ahuTR = resTR
  
  // 12. AHU sizing
  const filterStages = CONSTANTS.DEFAULT_FILTER_STAGES
  const coilRows = CONSTANTS.DEFAULT_COIL_ROWS
  assumptions.push(`Using default ${filterStages} filter stages`)
  assumptions.push(`Using default ${coilRows} coil rows`)
  
  const ahuWidth = getAHUWidth(ahuCFM)
  const ahuHeight = getAHUHeight(ahuCFM)
  const ahuLength = getAHULength(ahuCFM, filterStages, coilRows)
  
  // 13. Blower and motor
  const blowerModel = getBlowerModel(ahuCFM)
  const amBlowerCode = blowerModel
  
  // Motor calculation (physics method - requires static pressure)
  let motorHP: number | null = null
  let motorMethod = "null"
  
  // Note: Static pressure not provided in inputs, so motor calculation is skipped
  assumptions.push("Static pressure not provided - motor HP calculation skipped")
  
  // 14. Chilled water calculations
  const chwGPM = (ahuTR * 24) / CONSTANTS.DEFAULT_CHILLED_WATER_DELTA_T
  const chwLs = chwGPM * CONSTANTS.GPM_TO_LS
  
  // 15. Pipe sizing
  const pipeSizeMm = calculatePipeSize(chwLs, CONSTANTS.CHILLED_WATER_VELOCITY)
  const flowVelocityMs = CONSTANTS.CHILLED_WATER_VELOCITY
  
  // 16. Hot water (not provided in inputs)
  const hwGPM: number | null = null
  const hwLs: number | null = null
  const hwFlowVelocity: number | null = null
  const hwPipeSize: number | null = null
  assumptions.push("Hot water/steam load not provided - hot water calculations skipped")
  
  return {
    room_name: inputs.roomName,
    Area: { value: Math.round(area * 100) / 100, unit: "m^2" },
    Volume: { value: Math.round(volume * 100) / 100, unit: "m^3" },
    "Room Cfm": { value: Math.round(roomCFM), unit: "CFM" },
    FA: { value: Math.round(fa), unit: "CFM" },
    EA: { value: Math.round(ea), unit: "CFM" },
    "Rem. Water vapour Kg/hr": { value: Math.round(removalKgHr * 100) / 100, unit: "kg/hr" },
    "Deh. Cfm": { value: dehCFM, unit: "CFM" },
    "Res. Cfm": { value: resCFM, unit: "CFM" },
    "Room Terminal Supply Module in Sft": { value: rtsFt2, unit: "ft^2" },
    "Res. Cooling Load in TR": { value: resTR, unit: "TR" },
    "Room AC load in TR": { value: roomACLoadTR, unit: "TR" },
    "Cfm AC load in TR": { value: cfmACLoadTR, unit: "TR" },
    "AHU Cfm": { value: ahuCFM, unit: "CFM" },
    "AHU Size": {
      Width_mm: ahuWidth,
      Height_mm: ahuHeight,
      Length_mm: ahuLength,
      AM_blower_code: amBlowerCode
    },
    "Static Pressure": { value: null, unit: "in.w.g." },
    "Blower Model BDB": blowerModel,
    "Motor Selected in Hp": { value: motorHP, unit: "HP", method: motorMethod },
    "No. of Rows of Cooling Coil": coilRows,
    "AHU Cooling Load in TR": { value: ahuTR, unit: "TR" },
    "No. Of Stages of Filtr.": filterStages,
    "Chilled water in GPM": { value: Math.round(chwGPM * 100) / 100, unit: "GPM" },
    "Chilled water in L/s": { value: Math.round(chwLs * 100) / 100, unit: "L/s" },
    "Flow Velocity in m/s": { value: flowVelocityMs, unit: "m/s" },
    "Pipe Size in mm": pipeSizeMm,
    "Hot Water/Steam in GPM": { value: hwGPM, unit: "GPM" },
    "Hot water/Steam in L/s": { value: hwLs, unit: "L/s" },
    "Flow Velocity": { value: hwFlowVelocity, unit: "m/s" },
    "Pipe Size": hwPipeSize,
    assumptions_used: assumptions
  }
}

// Example usage function
export function calculateHVACExample(): HVACOutput {
  const exampleInputs: HVACInputs = {
    roomName: "Example Room",
    lengthMtrs: 6,
    widthMtrs: 5,
    heightMtrs: 3,
    peopleNos: 4,
    eqptLoadKW: 2,
    lightingWSft: 1.5,
    noOfInfHr: 0.5,
    freshAir: 20,
    exhaust: 10,
    tInC: 23,
    rhIn: 55,
    peakMaxTempOutC: 35,
    rhOut: 60,
    class: "ISO 7",
    acph: 10,
    peakMinTempOutC: 25
  }
  
  return calculateHVAC(exampleInputs)
}
