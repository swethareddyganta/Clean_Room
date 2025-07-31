'use server'

import { saveFormSubmission } from '../../lib/database'

export async function submitHVACForm(formData: any) {
  try {
    const result = await saveFormSubmission(formData)
    
    if (result.error) {
      return { 
        success: false, 
        message: result.error.message || 'Failed to save form data. Please try again.' 
      }
    }

    return { 
      success: true, 
      message: 'HVAC calculations have been saved to the database!',
      data: result.data 
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    return { 
      success: false, 
      message: 'An unexpected error occurred. Please try again.' 
    }
  }
} 