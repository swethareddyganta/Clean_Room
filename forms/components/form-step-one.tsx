"use client"

import type React from "react"
import type { FC } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { ArrowRight } from "lucide-react"
import { PhoneInputField } from "./ui/phone-input"
import { LocationSelector } from "./ui/location-selector"
import { isValidEmail, isValidPhoneNumber } from "../lib/validation"
import { useToast } from "../hooks/use-toast"
import type { FormData } from "../app/page"

interface Props {
  formData: FormData
  updateFormData: (field: keyof FormData, value: any) => void
  onNext: () => void
}

const FormSection: FC<{ title: string; children: React.ReactNode; stepNumber: number }> = ({
  title,
  children,
  stepNumber,
}) => (
  <div className="border-b border-gray-200/80 p-6 sm:p-8">
    <h3 className="mb-6 text-lg font-semibold text-gray-800">
      <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
        {stepNumber}
      </span>
      {title}
    </h3>
    <div className="pl-10">{children}</div>
  </div>
)

export const FormStepOne: FC<Props> = ({ formData, updateFormData, onNext }) => {
  const { toast } = useToast()

  const handleNext = () => {
    const errors: string[] = []

    // Validate required fields with specific messages
    if (!formData.customerName?.trim()) {
      errors.push("Customer Name")
    }

    if (!formData.customerAddress?.trim()) {
      errors.push("Customer Address")
    }

    if (!formData.branchName?.trim()) {
      errors.push("Unit / Branch Name")
    }

    if (!formData.projectName?.trim()) {
      errors.push("Project / Product Name")
    }

    if (!formData.location?.trim() || !formData.locationData) {
      errors.push("Location Selection")
    }

    // Show all validation errors at once
    if (errors.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in the following required fields: ${errors.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    // Validate email if provided
    if (formData.email && !isValidEmail(formData.email)) {
      toast({
        title: "Invalid Email Address",
        description: `"${formData.email}" is not a valid email address. Please check the format and try again.`,
        variant: "destructive",
      })
      return
    }

    // Validate phone if provided
    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: `"${formData.phone}" is not a valid phone number. Please include country code if needed.`,
        variant: "destructive",
      })
      return
    }

    // Success message
    toast({
      title: "Step 1 Completed",
      description: "All required fields are filled. Proceeding to Step 2...",
    })

    onNext()
  }

  return (
    <div>
      <FormSection title="Customer Details" stepNumber={1}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
          <div>
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => updateFormData("customerName", e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="customerAddress">Customer Address *</Label>
            <Input
              id="customerAddress"
              value={formData.customerAddress}
              onChange={(e) => updateFormData("customerAddress", e.target.value)}
              className="mt-1"
              required
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Project Information" stepNumber={2}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
          <div>
            <Label htmlFor="branchName">Unit / Branch Name or Place *</Label>
            <Input
              id="branchName"
              value={formData.branchName}
              onChange={(e) => updateFormData("branchName", e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="projectName">Project / Product / Block Name *</Label>
            <Input
              id="projectName"
              value={formData.projectName}
              onChange={(e) => updateFormData("projectName", e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div className="md:col-span-2">
            <LocationSelector
              value={formData.locationData}
              onChange={async (location) => {
                updateFormData("locationData", location)
                if (location) {
                  updateFormData("location", location.address || `${location.lat}, ${location.lng}`)
                  // Fetch historical min/max temperature extremes from Open-Meteo
                  try {
                    // Get all available historical data from earliest records to current date
                    const endDate = new Date()
                    const startDate = new Date(1940, 0, 1) 
                    const startDateStr = startDate.toISOString().split('T')[0]
                    const endDateStr = endDate.toISOString().split('T')[0]
                    
                    const response = await fetch(
                      `https://archive-api.open-meteo.com/v1/archive?latitude=${location.lat}&longitude=${location.lng}&start_date=${startDateStr}&end_date=${endDateStr}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
                    )
                    const data = await response.json()
                    
                    if (data && data.daily && data.daily.temperature_2m_min && data.daily.temperature_2m_max) {
                      // Find the absolute maximum and minimum temperatures from all historical data
                      const allMaxTemps = data.daily.temperature_2m_max.filter((temp: number) => temp !== null && !isNaN(temp))
                      const allMinTemps = data.daily.temperature_2m_min.filter((temp: number) => temp !== null && !isNaN(temp))
                      
                      if (allMaxTemps.length > 0 && allMinTemps.length > 0) {
                        const historicalMax = Math.max(...allMaxTemps)
                        const historicalMin = Math.min(...allMinTemps)
                        
                        updateFormData("maxTemp", historicalMax.toFixed(1))
                        updateFormData("minTemp", historicalMin.toFixed(1))
                        
                        const yearsOfData = endDate.getFullYear() - startDate.getFullYear()
                        toast({
                          title: "Historical Temperature Data Updated",
                          description: `All-time temperature range (${yearsOfData}+ years): ${historicalMin.toFixed(1)}°C to ${historicalMax.toFixed(1)}°C`,
                        })
                      }
                    }
                  } catch (error) {
                    console.error("Failed to fetch historical temperature data:", error)
                    // Fallback to current forecast if historical data fails
                    try {
                      const fallbackResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&daily=temperature_2m_min,temperature_2m_max&timezone=auto`)
                      const fallbackData = await fallbackResponse.json()
                      if (fallbackData && fallbackData.daily && fallbackData.daily.temperature_2m_min && fallbackData.daily.temperature_2m_max) {
                        updateFormData("minTemp", fallbackData.daily.temperature_2m_min[0].toString())
                        updateFormData("maxTemp", fallbackData.daily.temperature_2m_max[0].toString())
                      }
                    } catch (fallbackError) {
                      console.error("Failed to fetch fallback temperature data:", fallbackError)
                    }
                  }
                } else {
                  updateFormData("location", "")
                }
              }}
              placeholder="Search for address, city, or landmark..."
              label="Location Selection *"
            />
          </div>
          <div>
            <Label htmlFor="uniqueId">Unique ID (Auto-Generated)</Label>
            <Input id="uniqueId" value={formData.uniqueId} disabled className="mt-1" />
          </div>
        </div>
      </FormSection>

      <FormSection title="Contact & Other Details" stepNumber={3}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <PhoneInputField
              value={formData.phone}
              onChange={(value) => updateFormData("phone", value || "")}
              className="mt-1"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <Label htmlFor="email">Email ID</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="otherInfo">Others (Any)</Label>
            <Textarea
              id="otherInfo"
              value={formData.otherInfo}
              onChange={(e) => updateFormData("otherInfo", e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
      </FormSection>

      <div className="flex justify-end bg-gray-50 px-6 py-4">
        <Button onClick={handleNext} size="lg" className="rounded-full">
          Next Step <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
