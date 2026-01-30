// HVAC Calculator Engine - Excel Formula Exact Match
// Converted from Python to TypeScript/Node.js
// This implementation matches the Python calculations exactly

// =========================
// Type Definitions
// =========================
export interface RoomInput {
  roomName: string
  length_m: number
  width_m: number
  height_m: number
  people: number
  eqpt_kw: number
  light_w_sqft: number
  inf_hr: number
  fresh_air_factor: number // percent 0-100
  exhaust_factor: number // percent 0-100
  tC_inside: number | "Amb" | "Ambient" // °C or "Amb"
  rh_inside: number // percent 0-100
  t_out_maxC: number // °C
  rh_out: number // percent 0-100
  klass: string // e.g., "ISO 7", "GRADE C", "10K", "NC"
  acph: number // air changes per hour
  chilled_or_dx: "C" | "D" // Chilled or DX
}

export interface RoomResult {
  roomName: string
  klass_raw: string
  AH_mode: string
  X_area_sqft: number
  Y_volume_ft3: number
  Z_room_cfm: number
  AA_fa_cfm: number
  AB_ea_cfm: number
  AC_cfm: number | "Ambient"
  AD_deh_cfm: number | "Ambient"
  AE_res_cfm: number
  AF_terminal_sft: number
  AG_res_tr: number | "Ambient"
  AI_room_tr: number | "Ambient"
  AJ_cfm_tr: number | "Ambient"
  AR_stages: number
  AM_static: number
  CF_latent_btuh: number
  CE_sensible_btuh: number
  CG_total_btuh: number
}

export interface ZoneResult {
  AK_ahu_cfm: number
  AL_W_mm: number
  AL_H_mm: number
  AL_L_mm: number
  AM_static_pa: number
  AN_blower_model: number | "Refer"
  AO_motor_hp: number | "Refer"
  AP_coil_rows: number | "Amb"
  AQ_sum_ag: number
  AR_max_stages: number
  AS_calculated: number
  AT_calculated: number
  AU_height_mm: number
  AV_calculated: number
}

// =========================
// Helper Functions
// =========================
function ceilTo(x: number, step: number): number {
  return step <= 0 ? x : Math.ceil(x / step) * step
}

function isNumberLike(v: any): boolean {
  if (typeof v === "number") return !isNaN(v)
  if (typeof v === "string") {
    const trimmed = v.trim()
    if (trimmed.toLowerCase() === "amb" || trimmed.toLowerCase() === "ambient") return false
    return !isNaN(parseFloat(trimmed))
  }
  return false
}

function asPercent(v: number): number {
  return v > 1.0 ? v / 100.0 : v
}

function cToF(c: number): number {
  return (c * 9.0) / 5.0 + 32.0
}

function fmt(x: any, spec: string = ".1f"): string {
  try {
    const num = typeof x === "number" ? x : parseFloat(x)
    if (isNaN(num)) return String(x)
    return num.toFixed(parseInt(spec.replace(".", "").replace("f", "")) || 1)
  } catch {
    return String(x)
  }
}

// =========================
// Psychrometrics
// =========================
function vaporPressureHpa(tc: number): number {
  return 6.1078 * Math.pow(10, (7.5 * tc) / (237.3 + tc))
}

function humidityRatioGPerKg(tc: number, rhPercent: number): number {
  const rh = Math.max(0.0, Math.min(100.0, rhPercent))
  const pv = vaporPressureHpa(tc)
  const num = 0.622 * 7000.0 * (rh / 100.0) * pv
  const den = 1013.25 - pv * (rh / 100.0)
  return den !== 0 ? num / den : 0.0
}

// =========================
// AF Formula (Excel Exact Match)
// =========================
function supplyModuleArea(aeCfm: number, klass: any): number {
  const s = String(klass).trim().toUpperCase()
  
  let divisor: number
  if (s === "ISO 6" || s === "GRADE B" || s === "1K" || s === "1000") {
    divisor = 175
  } else if (s === "ISO 5" || s === "GRADE A" || s === "100") {
    divisor = 100
  } else if (s === "ISO 7" || s === "GRADE C" || s === "10K" || s === "10000") {
    divisor = 250
  } else if (s === "ISO 8" || s === "GRADE D" || s === "100K" || s === "100000") {
    divisor = 250
  } else if (s === "NC" || s === "20 MICRON" || s === "5 MICRON" || s === "N C") {
    divisor = 350
  } else {
    return 0.0
  }
  
  const val = aeCfm / divisor
  return ceilTo(val, 2.0)
}

// =========================
// AR/AM Mappings
// =========================
const STANDARD_MAPPINGS: Record<string, {
  stages_temp: number
  stages_amb: number
  static_temp: number
  static_amb: number
}> = {
  ISO5: { stages_temp: 4, stages_amb: 5, static_temp: 150, static_amb: 135 },
  ISO6: { stages_temp: 3, stages_amb: 4, static_temp: 125, static_amb: 110 },
  ISO7: { stages_temp: 3, stages_amb: 4, static_temp: 125, static_amb: 110 },
  ISO8: { stages_temp: 4, stages_amb: 5, static_temp: 150, static_amb: 135 },
  GRADEA: { stages_temp: 4, stages_amb: 5, static_temp: 150, static_amb: 135 },
  GRADEB: { stages_temp: 3, stages_amb: 4, static_temp: 125, static_amb: 110 },
  GRADEC: { stages_temp: 3, stages_amb: 4, static_temp: 125, static_amb: 110 },
  GRADED: { stages_temp: 4, stages_amb: 5, static_temp: 150, static_amb: 135 },
  NC: { stages_temp: 3, stages_amb: 3, static_temp: 125, static_amb: 90 },
}

function detectArAmClass(raw: any): string {
  const s = String(raw).trim().toUpperCase()
  
  if (s === "ISO 5" || s === "GRADE A" || s === "100") {
    return "ISO5"
  } else if (s === "ISO 6" || s === "GRADE B" || s === "1K" || s === "1000") {
    return "ISO6"
  } else if (s === "ISO 7" || s === "GRADE C" || s === "10K" || s === "10000") {
    return "ISO7"
  } else if (s === "ISO 8" || s === "GRADE D" || s === "100K" || s === "100000") {
    return "ISO8"
  } else if (s.includes("GRADE A")) {
    return "GRADEA"
  } else if (s.includes("GRADE B")) {
    return "GRADEB"
  } else if (s.includes("GRADE C")) {
    return "GRADEC"
  } else if (s.includes("GRADE D")) {
    return "GRADED"
  }
  
  return "NC"
}

function filtrationStages(klass: any, nIsNumber: boolean): number {
  const key = detectArAmClass(klass)
  const params = STANDARD_MAPPINGS[key] || STANDARD_MAPPINGS["NC"]
  return nIsNumber ? params.stages_temp : params.stages_amb
}

function staticPressureFromStages(klass: any, nIsNumber: boolean): number {
  const key = detectArAmClass(klass)
  const params = STANDARD_MAPPINGS[key] || STANDARD_MAPPINGS["NC"]
  return nIsNumber ? params.static_temp : params.static_amb
}

// =========================
// AP Calculation
// =========================
function calculateAP(
  AQ: number,
  N: any,
  AL_W: number,
  AL_H: number,
  maxAG: number
): number | "Amb" {
  if (AQ === 0 && (N === "Amb" || N === "Ambient")) {
    return "Amb"
  }
  
  const baseArea = ((AL_W - 250) * (AL_H - 150) * 10.76) / (1000 * 1000)
  const area1_5x = ((AL_W - 250) * (AL_H - 150) * 10.76 * 1.5) / (1000 * 1000)
  const area2x = ((AL_W - 250) * (AL_H - 150) * 10.76 * 2) / (1000 * 1000)
  
  if (baseArea >= maxAG) {
    return 4
  } else if (area1_5x >= maxAG) {
    return 6
  } else if (area2x >= maxAG) {
    return 8
  } else {
    return 0
  }
}

// =========================
// AHU Selection
// =========================
function blowerModel(cfm: number): number | "Refer" {
  if (cfm <= 1300) return 200
  if (cfm <= 1600) return 225
  if (cfm <= 2100) return 250
  if (cfm <= 2700) return 280
  if (cfm <= 3450) return 315
  if (cfm <= 4250) return 355
  if (cfm <= 5250) return 400
  if (cfm <= 6750) return 450
  if (cfm <= 8500) return 500
  if (cfm <= 10750) return 560
  if (cfm <= 13500) return 630
  if (cfm <= 17000) return 710
  if (cfm <= 21500) return 800
  if (cfm <= 27000) return 900
  if (cfm <= 34000) return 1000
  if (cfm <= 43000) return 1120
  if (cfm <= 49000) return 1200
  if (cfm <= 68000) return 1450
  return "Refer"
}

function motorHpSelection(akCfm: number, amSp: number): number | "Refer" {
  const x = (akCfm * amSp) / (6356 * 0.7 * 0.9 * 1.1 * 25.4)
  const sizes = [1, 1.5, 2, 3, 5, 7.5, 10, 12.5, 15, 20, 25, 30, 40, 50, 60, 75]
  
  for (const s of sizes) {
    if (x <= s) {
      return s
    }
  }
  return "Refer"
}

function ahuWidthHeightByCfm(ahuCfm: number): { width_mm: number; height_mm: number } {
  let width: number, height: number
  
  if (ahuCfm <= 2000) {
    width = 950
    height = 950
  } else if (ahuCfm <= 3000) {
    width = 1150
    height = 1100
  } else if (ahuCfm <= 8000) {
    width = 1550
    height = 1200
  } else if (ahuCfm <= 10000) {
    width = 1750
    height = 1550
  } else if (ahuCfm <= 18000) {
    width = 2050
    height = 1750
  } else if (ahuCfm <= 32000) {
    width = 2900
    height = 2050
  } else if (ahuCfm <= 40000) {
    width = 3600
    height = 2900
  } else {
    width = 4000
    height = 3600
  }
  
  return { width_mm: width, height_mm: height }
}

function al19BaseByAn(an: any): number {
  let anv: number
  try {
    anv = typeof an === "number" ? an : parseInt(String(an))
  } catch {
    return 2500
  }
  
  if (anv <= 280) return 1200
  if (anv <= 315) return 1600
  if (anv === 355 || anv === 400) return 1650
  if (anv === 450 || anv === 500) return 1700
  if (anv === 560) return 1800
  if (anv === 630) return 2000
  if (anv === 710) return 2200
  return 2500
}

function al19AddByAr(ar: any): number {
  let arv: number
  try {
    arv = typeof ar === "number" ? ar : parseInt(String(ar))
  } catch {
    return 0
  }
  
  const mapping: Record<number, number> = { 2: 1800, 3: 2300, 4: 3300 }
  return mapping[arv] || 0
}

function al19AddByAp(ap: any): number {
  if (typeof ap === "string") return 0
  
  let apv: number
  try {
    apv = typeof ap === "number" ? ap : parseFloat(String(ap))
  } catch {
    return 0
  }
  
  if (apv <= 4) return 600
  if (apv <= 6) return 800
  if (apv <= 8) return 1000
  return 0
}

function AL19(an: any, ar: any, ap: any): number {
  return al19BaseByAn(an) + al19AddByAr(ar) + al19AddByAp(ap)
}

function AL_LFromAL19(al19Value: number): number {
  return al19Value < 4000 ? al19Value : al19Value + 400
}

// =========================
// Room Calculations
// =========================
export function computeRoom(room: RoomInput): RoomResult {
  const E = room.length_m
  const F = room.width_m
  const G = room.height_m
  const H = room.people
  const I = room.eqpt_kw
  const J = room.light_w_sqft
  const K = room.inf_hr
  const Lp = asPercent(room.fresh_air_factor)
  const Mp = asPercent(room.exhaust_factor)
  const N = room.tC_inside
  const O = room.rh_inside
  const P = room.t_out_maxC
  const Q = room.rh_out
  const R = room.klass
  const S = room.acph
  const AH_mode = String(room.chilled_or_dx).trim().toUpperCase()

  const nIsNum = isNumberLike(N)
  const nFloat = nIsNum ? (typeof N === "number" ? N : parseFloat(String(N))) : 0.0

  // X = length × width (converted to sqft)
  const X = E * F * 10.76
  
  // Y = area × height (converted to ft³)
  const Y = X * G * 3.28
  
  // Z = Y * S / 60 (Room CFM)
  const Z = (Y * S) / 60.0
  
  const AA = Z * Lp
  const AB = nIsNum ? Z * Mp : Z

  const W_out = humidityRatioGPerKg(P, Q)
  const W_in = nIsNum ? humidityRatioGPerKg(nFloat, O) : 0.0
  const BP = W_out - W_in

  // AC calculation
  const AC = nIsNum
    ? ((AA * 0.075 * 60.0) / 2.20462) * (BP / 7000.0)
    : "Ambient"

  // Latent heat calculations
  const CA = H * 200.0 * 0.68 * BP
  const CB = K * 375.0 * 0.68 * BP
  const CC = (AA + AB) * 0.68 * BP
  const CD = (Z - AA) * 0.68 * BP
  const CF_latent = CA + CB + CC + CD

  // AD (Dehumid CFM)
  let AD: number | "Ambient"
  if (nIsNum) {
    const denom = 0.68 * BP
    AD = denom !== 0 ? ceilTo(CF_latent / denom, 25.0) : 0
  } else {
    AD = "Ambient"
  }

  const baseAe = AD === "Ambient" ? 0.0 : Number(AD)
  const AE = ceilTo(Math.max(Z + AA, baseAe), 25.0)
  const AF = supplyModuleArea(AE, R)

  // Sensible heat calculations
  const BA = nIsNum ? cToF(nFloat + 8.0) - cToF(nFloat) : 0.0
  const BB = nIsNum ? cToF(P) - cToF(nFloat) : 0.0
  const BQ = (E * G * 10.76 * 2.0 + F * G * 2.0 * 10.76) * BA * 0.45
  const BS = (E * F * 10.76) * BA * 0.45
  const BU = H * 285.0 * 1.08 * BB
  const BV = I * 1000.0 * 3.41
  const BW = J * X * 3.412
  const BX = K * 1.08 * 375.0 * BA
  const BY = (AA + AB) * 1.08 * BB
  const CE_sensible = BQ + BU + BV + BW + BX + BY
  const CG_total = CE_sensible + CF_latent

  // AG, AI, AJ calculations
  const AI = nIsNum ? ceilTo(CE_sensible / 12000.0, 0.5) : "Ambient"
  const divisor = AH_mode === "C" ? 400.0 : 300.0
  const AJ = nIsNum ? ceilTo(AE / divisor, 0.5) : "Ambient"
  
  let AG: number | "Ambient"
  if (nIsNum) {
    const aiVal = typeof AI === "number" ? AI : 0
    const ajVal = typeof AJ === "number" ? AJ : 0
    AG = ceilTo(Math.max(aiVal, ajVal), 0.5)
  } else {
    AG = "Ambient"
  }

  const AR = filtrationStages(R, nIsNum)
  const AM = staticPressureFromStages(R, nIsNum)

  return {
    roomName: room.roomName,
    klass_raw: R,
    AH_mode,
    X_area_sqft: X,
    Y_volume_ft3: Y,
    Z_room_cfm: Z,
    AA_fa_cfm: AA,
    AB_ea_cfm: AB,
    AC_cfm: AC,
    AD_deh_cfm: AD,
    AE_res_cfm: AE,
    AF_terminal_sft: AF,
    AG_res_tr: AG,
    AI_room_tr: AI,
    AJ_cfm_tr: AJ,
    AR_stages: AR,
    AM_static: AM,
    CF_latent_btuh: CF_latent,
    CE_sensible_btuh: CE_sensible,
    CG_total_btuh: CG_total,
  }
}

// =========================
// Zone Aggregation (AK-AV)
// =========================
export function computeZone(rooms: RoomResult[]): ZoneResult {
  const sumAe = rooms
    .filter((r) => typeof r.AE_res_cfm === "number")
    .reduce((sum, r) => sum + Number(r.AE_res_cfm), 0)
  const AK = ceilTo(sumAe, 250.0)

  const maxAM = Math.max(
    ...rooms
      .filter((r) => typeof r.AM_static === "number")
      .map((r) => Number(r.AM_static)),
    0
  )
  const maxAR = Math.max(...rooms.map((r) => r.AR_stages), 0)
  
  const maxAG = Math.max(
    ...rooms
      .filter((r) => typeof r.AG_res_tr === "number")
      .map((r) => Number(r.AG_res_tr)),
    0.0
  )
  
  const maxAI = Math.max(
    ...rooms
      .filter((r) => typeof r.AI_room_tr === "number")
      .map((r) => Number(r.AI_room_tr)),
    0.0
  )
  
  const maxAJ = Math.max(
    ...rooms
      .filter((r) => typeof r.AJ_cfm_tr === "number")
      .map((r) => Number(r.AJ_cfm_tr)),
    0.0
  )

  // AQ = SUM of AG column
  const AQ = rooms
    .filter((r) => typeof r.AG_res_tr === "number")
    .reduce((sum, r) => sum + Number(r.AG_res_tr), 0)

  // AS = MAX(AI, AJ) * 24/6
  const AS = Math.max(maxAI, maxAJ) * (24.0 / 6.0)

  const AN = blowerModel(AK)
  const AO = typeof AN === "number" ? motorHpSelection(AK, maxAM) : "Refer"

  const wh = ahuWidthHeightByCfm(AK)
  const AL_W = wh.width_mm
  const AL_H = wh.height_mm

  const firstRoomN = rooms[0]?.klass_raw || "Amb"
  const AP = calculateAP(maxAR, firstRoomN, AL_W, AL_H, maxAG)

  const AL19_val = AL19(AN, maxAR, AP)
  const AL_L = AL_LFromAL19(AL19_val)

  // AT = max(maxAJ, maxAK) * (24/6)
  const maxAK = 0
  const AT = Math.max(maxAJ, maxAK) * (24.0 / 6.0)

  // AU = Fixed value 2.0
  const AU = 2.0

  // AV = SQRT((4 * AS * 0.00006309) / (3.14 * AU)) * 1000
  const AV = Math.sqrt((4 * AS * 0.00006309) / (Math.PI * AU)) * 1000

  return {
    AK_ahu_cfm: AK,
    AL_W_mm: AL_W,
    AL_H_mm: AL_H,
    AL_L_mm: AL_L,
    AM_static_pa: maxAM,
    AN_blower_model: AN,
    AO_motor_hp: AO,
    AP_coil_rows: AP,
    AQ_sum_ag: AQ,
    AR_max_stages: maxAR,
    AS_calculated: AS,
    AT_calculated: AT,
    AU_height_mm: AU,
    AV_calculated: AV,
  }
}
