"use client"

import React, { useState, useEffect } from "react"
import { FormStepOne } from "../../../../forms/components/form-step-one"
import { FormStepTwo } from "../../../../forms/components/form-step-two"
import { FormStepThree } from "../../../../forms/components/form-step-three"
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
  standard: "TGA",
  classification: "3500 K",
  system: "Air-Conditioning System",
  acSystem: "Clean Room Air-Conditioning",
  ventilationSystem: "",
  coolingMethod: "Chilled Water",
  ventilationType: "",
  maxTemp: "24",
  minTemp: "20",
  maxRh: "60",
  minRh: "45",
  airChanges: "N/A",
  filters: {
    "10 M Supply": true,
    "10 M Exhaust": true,
    "5 M Supply": true,
    "1 M Supply": true,
  },
  ahuSpecs: [
    "25mm Thick Panel & AL Profile",
    "Panels with both side 24G Precoated GI Sheet",
    "Aluminium Profile VCD for Fresh Air- Supply Air & Return Air",
    "Fire Control Damper for Supply & Return Air",
    "Variable Frequency Drive (VFD) - Not Required",
    "Pressure Guage (0-25mm) for 5 Micr Filter Section",
  ],
  filtrationStages: "4",
  staticPressure: "145",
  pressureDrop: [], // You may want to import a default if needed
}

function UserDashboardPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)

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
      {step === 3 && (
        <FormStepThree
          formData={formData}
          updateFormData={updateFormData}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  )
}

export default UserDashboardPage
