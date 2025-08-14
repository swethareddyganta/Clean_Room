"use client"

import React, { useState, useEffect } from "react"
import { FormStepOne } from "../../../../forms/components/form-step-one"
import { FormStepTwo } from "../../../../forms/components/form-step-two"
import FormStepThree from "../../../../forms/components/form-step-three"
import FormCompletion from "../../../../forms/components/form-completion"
import { LogoutButton } from "@/components/ui/logout-button"
import type { FormData } from "../../../../forms/app/page"

const initialFormData: FormData = {
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
    airChanges: "N/A",
    filterType: "supply",
    filters: {},
  ahuSpecs: {
    "Panel Thickness & Profile": "25mm Thick Panel & Al. Profile",
    "Panel Construction": "Panels with both side 24G Precoated GI Sheet",
    "Air Handling Construction": "Aluminium Profile VCD for Fresh Air- Supply Air & Return Air",
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
  pressureDrop: [], // You may want to import a default if needed
}

function UserDashboardPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [calculations, setCalculations] = useState<any>(null)
  const [isCompleted, setIsCompleted] = useState(false)

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }))
  }

  // Auto-generate unique ID when customer name and project name are filled
  useEffect(() => {
    if (formData.customerName && formData.projectName) {
      // Convert to camelCase and remove spaces
      const toCamelCase = (str: string) => {
        return str
          .split(' ')
          .map((word, index) => {
            if (index === 0) {
              return word.toLowerCase()
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          })
          .join('')
      }
      
      const customerName = toCamelCase(formData.customerName)
      const projectName = toCamelCase(formData.projectName)
      
      // Generate random 6-digit number
      const randomNumber = Math.floor(100000 + Math.random() * 900000)
      
      const uniqueId = `${customerName}_${projectName}_${randomNumber}`
      updateFormData("uniqueId", uniqueId)
    }
  }, [formData.customerName, formData.projectName])

  return (
    <div>
      {/* Project Title Header */}
      <div className="text-center py-6 border-b border-border mb-6 relative">
        {/* Arrant Dynamics Logo - Top Left */}
        <div className="absolute top-6 left-6">
          <img 
            src="/Arrant Logo -1.jpg" 
            alt="Arrant Dynamics Logo" 
            className="h-16 w-auto"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-primary">STERI Clean Air - HVAC Matrix</h1>
        <p className="text-muted-foreground mt-2">Arrant Dynamics, a division of Arrant Tech IND, Pvt. Ltd.</p>
        
        {/* Logout Button - positioned in top right */}
        <div className="absolute top-6 right-6">
          <LogoutButton variant="outline" size="sm" />
        </div>
      </div>
      
      {step === 1 && (
        <FormStepOne
          formData={formData}
          updateFormData={updateFormData}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <FormStepTwo
          formData={formData}
          updateFormData={updateFormData}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && !isCompleted && (
        <FormStepThree
          formData={formData}
          updateFormData={updateFormData}
          onBack={() => setStep(2)}
          onComplete={(calcResults) => {
            setCalculations(calcResults)
            setIsCompleted(true)
            console.log("Form completed successfully")
          }}
        />
      )}
      {isCompleted && (
        <FormCompletion 
          formData={formData}
          calculations={calculations}
          onViewDashboard={() => {
            // Stay on dashboard, maybe show submissions
            console.log("View dashboard")
          }}
          onNewForm={() => {
            setStep(1)
            setIsCompleted(false)
            setCalculations(null)
          }}
        />
      )}
    </div>
  )
}

export default UserDashboardPage
