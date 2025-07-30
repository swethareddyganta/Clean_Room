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
  system: string
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
  ahu_specs: any
  filtration_stages: string
  static_pressure: string
  pressure_drop: any
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
    const submission: FormSubmission = {
      customer_name: formData.customerName,
      customer_address: formData.customerAddress,
      branch_name: formData.branchName,
      project_name: formData.projectName,
      location: formData.location,
      location_data: JSON.stringify(formData.locationData),
      unique_id: formData.uniqueId,
      phone: formData.phone,
      email: formData.email,
      other_info: formData.otherInfo,
      standard: formData.standard,
      classification: formData.classification,
      system: formData.system,
      ac_system: formData.acSystem,
      ventilation_system: formData.ventilationSystem,
      cooling_method: formData.coolingMethod,
      ventilation_type: formData.ventilationType,
      max_temp: formData.maxTemp,
      min_temp: formData.minTemp,
      max_rh: formData.maxRh,
      min_rh: formData.minRh,
      air_changes: formData.airChanges || '',
      filters: JSON.stringify(formData.filters || {}),
      ahu_specs: JSON.stringify(formData.ahuSpecs || []),
      filtration_stages: formData.filtrationStages || '',
      static_pressure: formData.staticPressure || '',
      pressure_drop: JSON.stringify(formData.pressureDrop || []),
    }

    const sql = `
      INSERT INTO form_submissions (
        customer_name, customer_address, branch_name, project_name, location,
        location_data, unique_id, phone, email, other_info, standard,
        classification, system, ac_system, ventilation_system, cooling_method,
        ventilation_type, max_temp, min_temp, max_rh, min_rh, air_changes,
        filters, ahu_specs, filtration_stages, static_pressure, pressure_drop
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      submission.customer_name,
      submission.customer_address,
      submission.branch_name,
      submission.project_name,
      submission.location,
      submission.location_data,
      submission.unique_id,
      submission.phone,
      submission.email,
      submission.other_info,
      submission.standard,
      submission.classification,
      submission.system,
      submission.ac_system,
      submission.ventilation_system,
      submission.cooling_method,
      submission.ventilation_type,
      submission.max_temp,
      submission.min_temp,
      submission.max_rh,
      submission.min_rh,
      submission.air_changes,
      submission.filters,
      submission.ahu_specs,
      submission.filtration_stages,
      submission.static_pressure,
      submission.pressure_drop
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
    const insertedRecord = submissions?.[0]
    
    if (insertedRecord) {
      // Parse JSON fields back to objects
      const parsedRecord = {
        ...insertedRecord,
        location_data: insertedRecord.location_data ? JSON.parse(insertedRecord.location_data) : null,
        filters: insertedRecord.filters ? JSON.parse(insertedRecord.filters) : null,
        ahu_specs: insertedRecord.ahu_specs ? JSON.parse(insertedRecord.ahu_specs) : null,
        pressure_drop: insertedRecord.pressure_drop ? JSON.parse(insertedRecord.pressure_drop) : null
      }
      return { data: parsedRecord as FormSubmission }
    }

    return { data: submission }
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

    // Parse JSON fields back to objects
    const data = (result.data as any[]).map(item => ({
      ...item,
      location_data: item.location_data ? JSON.parse(item.location_data) : null,
      filters: item.filters ? JSON.parse(item.filters) : null,
      ahu_specs: item.ahu_specs ? JSON.parse(item.ahu_specs) : null,
      pressure_drop: item.pressure_drop ? JSON.parse(item.pressure_drop) : null
    }))

    return { data }
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

    const data = result.data as any[]
    if (data.length === 0) {
      return { error: 'Form submission not found' }
    }

    const item = data[0]
    const submission = {
      ...item,
      location_data: item.location_data ? JSON.parse(item.location_data) : null,
      filters: item.filters ? JSON.parse(item.filters) : null,
      ahu_specs: item.ahu_specs ? JSON.parse(item.ahu_specs) : null,
      pressure_drop: item.pressure_drop ? JSON.parse(item.pressure_drop) : null
    }

    return { data: submission }
  } catch (error) {
    console.error('Error in getFormSubmissionById:', error)
    return { error }
  }
} 