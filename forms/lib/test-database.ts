import { executeQuery } from './mysql'
import { saveFormSubmission, getFormSubmissions } from './database'

// Test database connection
export async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing MySQL connection...')
    
    // Test basic connection
    const result = await executeQuery('SELECT COUNT(*) as count FROM form_submissions')
    
    if (result.error) {
      console.error('❌ Database connection failed:', result.error)
      return { success: false, error: result.error }
    }
    
    console.log('✅ Database connection successful!')
    const count = (result.data as any[])?.[0]?.count || 0
    console.log('📊 Total records in form_submissions:', count)
    return { success: true, count }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return { success: false, error }
  }
}

// Test saving a sample form
export async function testSaveForm() {
  const sampleFormData = {
    customerName: "Test Customer",
    customerAddress: "123 Test Street, Test City",
    branchName: "Test Branch",
    projectName: "Test Project",
    location: "Test Location",
    locationData: { lat: 40.7128, lng: -74.0060, address: "New York, NY" },
    uniqueId: `TEST-${Date.now()}`,
    phone: "+1234567890",
    email: "test@example.com",
    otherInfo: "This is a test submission",
    standard: "TGA",
    classification: "3500 K",
    system: "Air-Conditioning System",
    acSystem: "Clean Room Air-Conditioning",
    ventilationSystem: "",
    coolingMethod: "Chilled Water",
    ventilationType: "",
    maxTemp: "35",
    minTemp: "15",
    maxRh: "60",
    minRh: "45",
    airChanges: "20",
    filters: { "10 M Supply": true, "5 M Supply": true },
    ahuSpecs: ["25mm Thick Panel & AL Profile"],
    filtrationStages: "2",
    staticPressure: "150",
    pressureDrop: []
  }
  
  try {
    console.log('🧪 Testing form save...')
    const result = await saveFormSubmission(sampleFormData as any)
    
    if (result.error) {
      console.error('❌ Save failed:', result.error)
      return { success: false, error: result.error }
    }
    
    console.log('✅ Form saved successfully:', result.data)
    return { success: true, data: result.data }
    
  } catch (error) {
    console.error('❌ Unexpected save error:', error)
    return { success: false, error }
  }
}

// Test retrieving forms
export async function testGetForms() {
  try {
    console.log('📋 Testing form retrieval...')
    const result = await getFormSubmissions()
    
    if (result.error) {
      console.error('❌ Retrieval failed:', result.error)
      return { success: false, error: result.error }
    }
    
    console.log('✅ Forms retrieved successfully:')
    console.log(`📊 Found ${result.data?.length || 0} form submissions`)
    console.table(result.data?.map(form => ({
      id: form.id,
      unique_id: form.unique_id,
      customer_name: form.customer_name,
      project_name: form.project_name,
      created_at: form.created_at
    })))
    
    return { success: true, data: result.data }
    
  } catch (error) {
    console.error('❌ Unexpected retrieval error:', error)
    return { success: false, error }
  }
}

// Run all tests
export async function runAllDatabaseTests() {
  console.log('🚀 Starting database tests...\n')
  
  const connectionTest = await testDatabaseConnection()
  console.log('\n' + '='.repeat(50) + '\n')
  
  if (connectionTest.success) {
    const saveTest = await testSaveForm()
    console.log('\n' + '='.repeat(50) + '\n')
    
    const retrieveTest = await testGetForms()
    console.log('\n' + '='.repeat(50) + '\n')
    
    console.log('🎉 All database tests completed!')
    return {
      connection: connectionTest.success,
      save: saveTest.success,
      retrieve: retrieveTest.success
    }
  } else {
    console.log('❌ Connection failed, skipping other tests')
    return {
      connection: false,
      save: false,
      retrieve: false
    }
  }
} 