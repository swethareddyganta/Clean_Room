"use client"

import { useState, useEffect } from "react"
import { ProgressStepper } from "../components/progress-stepper"
import { FormStepOne } from "../components/form-step-one"
import { FormStepTwo } from "../components/form-step-two"
import FormStepThree from "../components/form-step-three"
import FormCompletion from "../components/form-completion"
import { ArrantHeader } from "../components/arrant-header"
import { pressureDropData, type standardsData, filterOptions } from "../lib/standards-data"
import { classAirChargesData, getDefaultAirChanges } from "../lib/class-air-charges-data"
import { useToast } from "../components/ui/use-toast"

export type PressureDropItem = {
  initialValue: string
  code: string
  description: string
  pressureDrop: string
  guageSelected: string
  selected: boolean
}

export type FormData = {
  // Step 1
  customerName: string
  customerAddress: string
  branchName: string
  projectName: string
  location: string
  locationData?: { lat: number; lng: number; address?: string }
  uniqueId: string
  phone: string
  email: string
  otherInfo: string
  // Step 2
  standard: keyof (typeof standardsData)["headers"]
  classification: string
  system: string
  airHeatingSystemType: string
  airCoolingSystemType: string
  ventilationSystemType: string
  ventilationSystemDetails: string
  heatingMethod: string
  coolingMethod: string
  maxTemp: string
  minTemp: string
  maxRh: string
  minRh: string
  requiredInsideTemp: string
  requiredInsideHumidity: string
  airChanges: string // New field
  filterType: "supply" | "exhaust"
  filters: Record<string, boolean>
  ahuSpecs: Record<string, string>
  plantRoomDistance: string
  filtrationStages: string
  staticPressure: string
  pressureDrop: PressureDropItem[]
}

export default function ModernForm() {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [calculations, setCalculations] = useState<any>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  
  // Handle URL parameters after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const stepParam = urlParams.get('step')
      if (stepParam) {
        setStep(parseInt(stepParam))
      }
    }
  }, [])

  // Test toast on mount
  useEffect(() => {
    toast({
      title: "Welcome",
      description: "Form is ready. Please fill in the required fields.",
    })
  }, [toast])
  const [formData, setFormData] = useState<FormData>({
    // Step 1 Data
    customerName: "",
    customerAddress: "",
    branchName: "",
    projectName: "",
    location: "",
    locationData: undefined,
    uniqueId: "",
    phone: "",
    email: "",
    otherInfo: "",
    // Step 2 Data
    standard: "ISO146444",
    classification: "ISO 9",
    system: "airHeatingSystem",
    airHeatingSystemType: "",
    airCoolingSystemType: "",
    ventilationSystemType: "",
    ventilationSystemDetails: "",
    heatingMethod: "",
    coolingMethod: "",
    maxTemp: "", // Will be populated from all-time historical data for location
    minTemp: "", // Will be populated from all-time historical data for location
    maxRh: "60",
    minRh: "45",
    requiredInsideTemp: "",
    requiredInsideHumidity: "",
    airChanges: "N/A", // Initial value
    filterType: "supply",
    filters: {},
    ahuSpecs: {
      "Panel Thickness & Profile": "25mm Thick Panel & Al. Profile",
      "Panel Construction": "Panels with both side 24G Precoated GI Sheet",
      "Air Handling Construction": "Aluminium Profile VCD for Fresh Air- Supply Air &  Return Air",
      "Fire Control": "Fire Control Damper for Supply & Return Air",
      "Variable Frequency Drive": "Not Required",
      "Pressure Gauge": "Pressure Guage (0-25mm) for 5 Micr Filter Section",
      "Virus Burner": "Required",
      "Door interlocking systems for air locks and corridor areas": "Required",
      "Humidistat": "Not Required",
      "Thermostat": "Not Required",
      "Flow-control Valve": "Not Required",
      "Y-strainer": "Not Required",
      "Purge Wall": "Not Required",
      "Pipe Configuration": "Single Pipe",
      "Flow Velocity - Chilled Water/Brine/DX/Hot Water": "0.5-2.5 m/s",
                "Flow Velocity - Steam": "3 m/s - 25 m/s",
      "BMS Monitoring": "Not Required",
      "EMS Monitoring": "Not Required",
    },
      plantRoomDistance: "50",
    filtrationStages: "0",
    staticPressure: "145",
  pressureDrop: pressureDropData,
  })

  const validateStep = (stepNumber: number): { isValid: boolean; missingFields: string[] } => {
    const missingFields: string[] = []
    
    if (stepNumber === 1) {
      const step1Fields = ['customerName', 'customerAddress', 'branchName', 'projectName']
      step1Fields.forEach(field => {
        const value = formData[field as keyof FormData]
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          missingFields.push(field)
        }
      })
      
      // Special validation for location - check both location string and locationData
      if (!formData.location?.trim() || !formData.locationData) {
        missingFields.push('location')
      }
    } else if (stepNumber === 2) {
      const step2Fields = ['standard', 'classification', 'system', 'maxTemp', 'minTemp', 'maxRh', 'minRh', 'requiredInsideTemp', 'requiredInsideHumidity']
      step2Fields.forEach(field => {
        const value = formData[field as keyof FormData]
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          missingFields.push(field)
        }
      })
      
      // Additional validation for conditional fields
      if (formData.system === "airHeatingSystem") {
        if (!formData.airHeatingSystemType || formData.airHeatingSystemType.trim() === '') missingFields.push('airHeatingSystemType')
        if (!formData.heatingMethod || formData.heatingMethod.trim() === '') missingFields.push('heatingMethod')
      } else if (formData.system === "airCoolingSystem") {
        if (!formData.airCoolingSystemType || formData.airCoolingSystemType.trim() === '') missingFields.push('airCoolingSystemType')
        if (!formData.coolingMethod || formData.coolingMethod.trim() === '') missingFields.push('coolingMethod')
      } else if (formData.system === "ventilationSystem") {
        if (!formData.ventilationSystemType || formData.ventilationSystemType.trim() === '') missingFields.push('ventilationSystemType')
      }
    }
    
    return { isValid: missingFields.length === 0, missingFields }
  }

  const handleStepClick = (targetStep: number) => {
    // Check if we can navigate to the target step
    for (let step = 1; step < targetStep; step++) {
      const validation = validateStep(step)
      if (!validation.isValid) {
        // Navigate to the first step with missing fields
        setStep(step)
        const fieldNames = validation.missingFields.map(field => {
          const fieldMap: Record<string, string> = {
            'customerName': 'Customer Name',
            'customerAddress': 'Customer Address', 
            'branchName': 'Unit / Branch Name',
            'projectName': 'Project / Product Name',
            'location': 'Location Selection',
            'standard': 'Standard',
            'classification': 'Classification',
            'system': 'System Type',
            'maxTemp': 'Maximum Temperature',
            'minTemp': 'Minimum Temperature',
            'maxRh': 'Maximum Relative Humidity',
            'minRh': 'Minimum Relative Humidity',
            'airHeatingSystemType': 'Air-Heating System Type',
            'airCoolingSystemType': 'Air-Cooling System Type',
            'ventilationSystemType': 'Ventilation System Type',
            'heatingMethod': 'Heating Method',
            'coolingMethod': 'Cooling Method'
          }
          return fieldMap[field] || field
        })
        toast({
          variant: "destructive",
          title: `Step ${step} Incomplete`,
          description: `Please complete the following fields: ${fieldNames.join(', ')}`,
        })
        return
      }
    }
    
    // If all previous steps are valid, navigate to target step
    setStep(targetStep)
    toast({
      title: "Navigation Successful",
      description: `Moved to Step ${targetStep}`,
    })
  }

  const handleNext = () => {
    const validation = validateStep(step)
    if (!validation.isValid) {
      const fieldNames = validation.missingFields.map(field => {
        const fieldMap: Record<string, string> = {
          'customerName': 'Customer Name',
          'customerAddress': 'Customer Address', 
          'branchName': 'Unit / Branch Name',
          'projectName': 'Project / Product Name',
          'location': 'Location Selection',
          'standard': 'Standard',
          'classification': 'Classification',
          'system': 'System Type',
          'maxTemp': 'Maximum Temperature',
          'minTemp': 'Minimum Temperature',
          'maxRh': 'Maximum Relative Humidity',
          'minRh': 'Minimum Relative Humidity',
          'acSystem': 'AC System Type',
          'coolingMethod': 'Cooling Method',
          'ventilationType': 'Ventilation Type'
        }
        return fieldMap[field] || field
      })
      toast({
        variant: "destructive",
        title: "Required Fields Missing",
        description: `Please fill in the following required fields: ${fieldNames.join(', ')}`,
      })
      return
    }
    setStep((prev) => Math.min(prev + 1, 3))
    toast({
      title: `Step ${step} Completed`,
      description: `All required fields are filled. Moving to Step ${step + 1}...`,
    })
  }
  
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1))

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Auto-calculation and conditional logic
  useEffect(() => {
    // 1. Generate unique ID based on customer name and project name
    if (formData.customerName && formData.projectName) {
      const customerPrefix = formData.customerName
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 3)
      
      const projectPrefix = formData.projectName
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 3)
      
      const uniqueId = `${customerPrefix}${projectPrefix}${Date.now().toString().slice(-4)}`
      updateFormData("uniqueId", uniqueId)
    }



    // 3. Auto-calculate static pressure
    const totalPressure = formData.pressureDrop
      .filter((item) => item.selected)
      .reduce((sum, item) => {
        const pressureValue = Number.parseInt(item.initialValue, 10)
        return sum + (isNaN(pressureValue) ? 0 : pressureValue)
      }, 0)
    updateFormData("staticPressure", totalPressure.toString())

    // 4. Conditional logic for systems
    if (formData.system === "airHeatingSystem") {
      if (formData.airCoolingSystemType !== "") {
        updateFormData("airCoolingSystemType", "")
      }
      if (formData.ventilationSystemType !== "") {
        updateFormData("ventilationSystemType", "")
      }
    } else if (formData.system === "airCoolingSystem") {
      if (formData.airHeatingSystemType !== "") {
        updateFormData("airHeatingSystemType", "")
      }
      if (formData.ventilationSystemType !== "") {
        updateFormData("ventilationSystemType", "")
      }
      if (formData.coolingMethod !== "") {
        updateFormData("coolingMethod", "")
      }
      // Reset AHU specs to default values
      updateFormData("ahuSpecs", {
        "Panel Thickness & Profile": "25mm Thick Panel & Al. Profile",
        "Panel Construction": "Panels with both side 24G Precoated GI Sheet",
        "Air Handling Construction": "Aluminium Profile VCD for Fresh Air- Supply Air &  Return Air",
        "Fire Control": "Fire Control Damper for Supply & Return Air",
        "Variable Frequency Drive": "Not Required",
        "Pressure Gauge": "Pressure Guage (0-25mm) for 5 Micr Filter Section",
        "Virus Burner": "Required",
        "Door interlocking systems for air locks and corridor areas": "Required",
        "Humidistat": "Not Required",
        "Thermostat": "Not Required",
        "Flow-control Valve": "Not Required",
        "Y-strainer": "Not Required",
        "Purge Wall": "Not Required",
        "Pipe Configuration": "Single Pipe",
        "Flow Velocity - Chilled Water/Brine/DX/Hot Water": "0.5-2.5 m/s",
        "Flow Velocity - Steam": "3 m/s - 25 m/s",
        "BMS Monitoring": "Not Required",
        "EMS Monitoring": "Not Required",
      })
    } else if (formData.system === "ventilationSystem") {
      if (formData.airHeatingSystemType !== "") {
        updateFormData("airHeatingSystemType", "")
      }
      if (formData.airCoolingSystemType !== "") {
        updateFormData("airCoolingSystemType", "")
      }
      if (formData.ventilationSystemDetails !== "") {
        updateFormData("ventilationSystemDetails", "")
      }
    }

    // 5. Auto-calculate Air Changes
    const defaultAirChanges = getDefaultAirChanges(formData.classification, formData.standard, formData.system)
    updateFormData("airChanges", defaultAirChanges)

    // 6. Auto-calculate filtration stages based on individual filter selections
    const calculateFiltrationStages = (filters: Record<string, boolean>) => {
      // Count each selected filter as one stage
      const selectedFiltersCount = Object.values(filters).filter(Boolean).length
      return selectedFiltersCount
    }
    
    // Always calculate filtration stages (even if 0)
    const activeStages = calculateFiltrationStages(formData.filters)
    console.log('Calculating filtration stages:', { filters: formData.filters, activeStages, current: formData.filtrationStages })
    
    // Force update if different
    if (formData.filtrationStages !== activeStages.toString()) {
      console.log('Updating filtration stages from', formData.filtrationStages, 'to', activeStages.toString())
      updateFormData("filtrationStages", activeStages.toString())
    }
  }, [formData.customerName, formData.projectName, formData.filters, formData.pressureDrop, formData.system, formData.classification, formData.standard])



  return (
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <ArrantHeader />
        <ProgressStepper currentStep={step} formData={formData} onStepClick={handleStepClick} />
        <div className="mt-10 rounded-xl border border-gray-200/80 bg-white shadow-sm">
          {step === 1 && <FormStepOne formData={formData} updateFormData={updateFormData} onNext={handleNext} />}
          {step === 2 && <FormStepTwo formData={formData} updateFormData={updateFormData} onBack={handleBack} onNext={handleNext} />}
          {step === 3 && !isCompleted && (
            <FormStepThree 
              formData={formData} 
              updateFormData={updateFormData} 
              onBack={handleBack} 
              onComplete={(calcResults) => {
                setCalculations(calcResults)
                setIsCompleted(true)
                toast({
                  title: "Form Completed!",
                  description: "Your clean room specification has been submitted successfully.",
                })
              }} 
            />
          )}
          {isCompleted && (
            <FormCompletion 
              formData={formData}
              calculations={calculations}
              onViewDashboard={() => {
                // Navigate to dashboard or show submissions
                window.location.href = '/user/dashboard'
              }}
              onNewForm={() => {
                setStep(1)
                setIsCompleted(false)
                setCalculations(null)
              }}
            />
          )}
        </div>
      </div>
    </main>
  )
}
