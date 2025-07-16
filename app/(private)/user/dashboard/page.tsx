"use client"

import React, { useState, useEffect } from "react"
import { FormStepOne } from "../../../../forms/components/form-step-one"
import { FormStepTwo } from "../../../../forms/components/form-step-two"
import { FormStepThree } from "../../../../forms/components/form-step-three"
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
  }, [formData.customerName, formData.projectName])

  return (
    <div>
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
