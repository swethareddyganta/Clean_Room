import { executeQuery } from './mysql'

// Only run on server side
if (typeof window !== 'undefined') {
  throw new Error('Database functions cannot be used on client side')
}

export interface FormSubmission {
  id?: string
  customer_name: string
  customer_address: string
  branch_name: string
  project_name: string
  location: string
  location_data?: any
  unique_id: string
  phone?: string
  email?: string
  other_info?: string
  standard: string
  classification: string
  system_type: string
  ac_system?: string
  ventilation_system?: string
  cooling_method?: string
  ventilation_type?: string
  max_temp: string
  min_temp: string
  max_rh: string
  min_rh: string
  air_changes: string
  filters: any
  ahu_specs: string[]
  filtration_stages: string
  static_pressure: string
  pressure_drop: any[]
  created_at?: string
  updated_at?: string
}

export interface FormData {
  customerName: string
  customerAddress: string
  branchName: string
  projectName: string
  location: string
  locationData?: any
  uniqueId: string
  phone?: string
  email?: string
  otherInfo?: string
  standard: string
  classification: string
  system: string
  acSystem?: string
  ventilationSystem?: string
  coolingMethod?: string
  ventilationType?: string
  maxTemp: string
  minTemp: string
  maxRh: string
  minRh: string
  airChanges?: string
  filters?: any
  ahuSpecs?: string[]
  filtrationStages?: string
  staticPressure?: string
  pressureDrop?: any[]
}

export async function saveFormSubmission(formData: FormData): Promise<{ data?: FormSubmission; error?: any }> {
  try {
    const sql = `
      INSERT INTO form_submissions (
        customer_name, customer_address, branch_name, project_name, location, location_data,
        unique_id, phone, email, other_info, standard, classification, system_type, ac_system,
        ventilation_system, cooling_method, ventilation_type, max_temp, min_temp, max_rh,
        min_rh, air_changes, filters, ahu_specs, filtration_stages, static_pressure, pressure_drop
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    
    const params = [
      formData.customerName,
      formData.customerAddress,
      formData.branchName,
      formData.projectName,
      formData.location,
      JSON.stringify(formData.locationData),
      formData.uniqueId,
      formData.phone,
      formData.email,
      formData.otherInfo,
      formData.standard,
      formData.classification,
      formData.system,
      formData.acSystem,
      formData.ventilationSystem,
      formData.coolingMethod,
      formData.ventilationType,
      formData.maxTemp,
      formData.minTemp,
      formData.maxRh,
      formData.minRh,
      formData.airChanges,
      JSON.stringify(formData.filters),
      JSON.stringify(formData.ahuSpecs),
      formData.filtrationStages,
      formData.staticPressure,
      JSON.stringify(formData.pressureDrop)
    ]

    const result = await executeQuery(sql, params)
    
    if (result.error) {
      console.error('Error saving form submission:', result.error)
      return { error: result.error }
    }

    // Get the inserted record
    const getSql = 'SELECT * FROM form_submissions WHERE unique_id = ?'
    const getResult = await executeQuery(getSql, [formData.uniqueId])
    
    if (getResult.error) {
      return { error: getResult.error }
    }

    const submissions = getResult.data as any[]
    return { data: submissions?.[0] as FormSubmission }
  } catch (error) {
    console.error('Error in saveFormSubmission:', error)
    return { error }
  }
}

export async function getFormSubmissions(): Promise<{ data?: FormSubmission[]; error?: any }> {
  try {
    const sql = 'SELECT * FROM form_submissions ORDER BY created_at DESC'
    const result = await executeQuery(sql)
    
    if (result.error) {
      console.error('Error fetching form submissions:', result.error)
      return { error: result.error }
    }

    return { data: result.data as FormSubmission[] }
  } catch (error) {
    console.error('Error in getFormSubmissions:', error)
    return { error }
  }
}

export async function getFormSubmissionById(id: string): Promise<{ data?: FormSubmission; error?: any }> {
  try {
    const sql = 'SELECT * FROM form_submissions WHERE id = ?'
    const result = await executeQuery(sql, [id])
    
    if (result.error) {
      console.error('Error fetching form submission:', result.error)
      return { error: result.error }
    }

    const submissions = result.data as any[]
    return { data: submissions?.[0] as FormSubmission }
  } catch (error) {
    console.error('Error in getFormSubmissionById:', error)
    return { error }
  }
}

export async function getLoginHistory(): Promise<{ data?: any[]; error?: any }> {
  try {
    const sql = 'SELECT * FROM login_history ORDER BY login_time DESC LIMIT 100'
    const result = await executeQuery(sql)
    
    if (result.error) {
      console.error('Error fetching login history:', result.error)
      return { error: result.error }
    }

    return { data: result.data as any[] }
  } catch (error) {
    console.error('Error in getLoginHistory:', error)
    return { error }
  }
}

export async function getUserProfiles(): Promise<{ data?: any[]; error?: any }> {
  try {
    const sql = 'SELECT * FROM user_profiles ORDER BY created_at DESC'
    const result = await executeQuery(sql)
    
    if (result.error) {
      console.error('Error fetching user profiles:', result.error)
      return { error: result.error }
    }

    return { data: result.data as any[] }
  } catch (error) {
    console.error('Error in getUserProfiles:', error)
    return { error }
  }
} 