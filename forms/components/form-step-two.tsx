"use client"

import type React from "react"
import { useMemo } from "react"
import type { FC } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { ArrowLeft } from "lucide-react"
import type { FormData, PressureDropItem } from "../app/page"
import { standardsData, filterOptions, ahuSpecOptions } from "../lib/standards-data"
import { getAirChangesRange, getDefaultAirChanges } from "../lib/class-air-charges-data"

interface Props {
  formData: FormData
  updateFormData: (field: keyof FormData, value: any) => void
  onBack: () => void
  onNext: () => void
}

const FormSection: FC<{ title: string; children: React.ReactNode; stepNumber?: number }> = ({
  title,
  children,
  stepNumber,
}) => (
  <div className="border-b border-gray-200/80 p-6 sm:p-8">
    <h3 className="mb-6 text-lg font-semibold text-gray-800">
      {stepNumber && (
        <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
          {stepNumber}
        </span>
      )}
      {title}
    </h3>
    <div className={stepNumber ? "pl-10" : ""}>{children}</div>
  </div>
)

export const FormStepTwo: FC<Props> = ({ formData, updateFormData, onBack, onNext }) => {
  const router = useRouter()
  
  const classificationOptions = useMemo(() => {
    return standardsData.rows.map((row) => row[formData.standard]).filter(Boolean) as string[]
  }, [formData.standard])

  // Calculate air changes options based on classification and standard
  const airChangesRange = useMemo(() => {
    return getAirChangesRange(formData.classification, formData.standard)
  }, [formData.classification, formData.standard])

  const handleStandardChange = (value: string) => {
    const standardKey = value as keyof typeof standardsData.headers
    updateFormData("standard", standardKey)

    const newClassifications = standardsData.rows.map((row) => row[standardKey]).filter(Boolean) as string[]
    updateFormData("classification", newClassifications[0] || "")
  }

  const handleClassificationChange = (value: string) => {
    updateFormData("classification", value)
    
    // Auto-calculate air changes based on new classification and current system
    const defaultAirChanges = getDefaultAirChanges(value, formData.standard, formData.system)
    updateFormData("airChanges", defaultAirChanges)
  }

  const handleSystemChange = (value: string) => {
    updateFormData("system", value)
    
    // Auto-calculate air changes based on current classification and new system
    const defaultAirChanges = getDefaultAirChanges(formData.classification, formData.standard, value)
    updateFormData("airChanges", defaultAirChanges)
    
    // Reset dependent fields when system changes
    if (value === "airHeatingSystem") {
      updateFormData("airCoolingSystemType", "")
      updateFormData("ventilationSystemType", "")
      updateFormData("airHeatingSystemType", "")
      updateFormData("heatingMethod", "")
    } else if (value === "airCoolingSystem") {
      updateFormData("airHeatingSystemType", "")
      updateFormData("ventilationSystemType", "")
      updateFormData("airCoolingSystemType", "")
      updateFormData("coolingMethod", "")
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
      })
    } else if (value === "ventilationSystem") {
      updateFormData("airHeatingSystemType", "")
      updateFormData("airCoolingSystemType", "")
      updateFormData("ventilationSystemType", "")
      updateFormData("ventilationSystemDetails", "")
    }
  }

  const handlePressureDropChange = (index: number, field: keyof PressureDropItem, value: any) => {
    const newPressureDrop = [...formData.pressureDrop]
    ;(newPressureDrop[index] as any)[field] = value
    updateFormData("pressureDrop", newPressureDrop)
  }

  const handleNext = () => {
    onNext();
  }

  return (
    <div>
      <FormSection title="Standard & System Configuration" stepNumber={4}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
          {/* Standard & Classification */}
          <div>
            <Label>Standard *</Label>
            <Select value={formData.standard} onValueChange={handleStandardChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(standardsData.headers).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Classification *</Label>
            <Select
              value={formData.classification}
              onValueChange={handleClassificationChange}
              disabled={classificationOptions.length === 0}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {classificationOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* System Selection */}
          <div>
            <Label>System *</Label>
            <Select 
              value={formData.system} 
              onValueChange={handleSystemChange}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="airHeatingSystem">Air-Heating System</SelectItem>
                <SelectItem value="airCoolingSystem">Air-Cooling System</SelectItem>
                <SelectItem value="ventilationSystem">Ventilation System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Fields based on System Selection */}
          {formData.system === "airHeatingSystem" && (
            <>
              <div>
                <Label>Air-Heating System Type *</Label>
                <Select value={formData.airHeatingSystemType} onValueChange={(value) => updateFormData("airHeatingSystemType", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleanroomAirHeatingSystem">Cleanroom Air-Heating System</SelectItem>
                    <SelectItem value="comfortAirHeatingSystem">Comfort Air-Heating System</SelectItem>
                    <SelectItem value="nonClassifiedAirHeatingSystem">Non-Classified Air-Heating System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Heating Method *</Label>
                <Select value={formData.heatingMethod} onValueChange={(value) => updateFormData("heatingMethod", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotWater">Hot Water</SelectItem>
                    <SelectItem value="steam">Steam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {formData.system === "airCoolingSystem" && (
            <>
              <div>
                <Label>Air-Cooling System Type *</Label>
                <Select value={formData.airCoolingSystemType} onValueChange={(value) => updateFormData("airCoolingSystemType", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleanroomAirCoolingSystem">Cleanroom Air-Cooling System</SelectItem>
                    <SelectItem value="comfortAirCoolingSystem">Comfort Air-Cooling System</SelectItem>
                    <SelectItem value="nonClassifiedAirCoolingSystem">Non-Classified Air-Cooling System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.airCoolingSystemType && (
                <div>
                  <Label>Cooling Method *</Label>
                  <Select value={formData.coolingMethod} onValueChange={(value) => updateFormData("coolingMethod", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chilledWater">Chilled Water</SelectItem>
                      <SelectItem value="brine">Brine</SelectItem>
                      <SelectItem value="dx">DX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          {formData.system === "ventilationSystem" && (
            <>
              <div>
                <Label>Ventilation System Type *</Label>
                <Select value={formData.ventilationSystemType} onValueChange={(value) => updateFormData("ventilationSystemType", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleanroomVentilationSystem">Cleanroom Ventilation System</SelectItem>
                    <SelectItem value="nonClassifiedVentilationSystem">Non-Classified Ventilation System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.ventilationSystemType && (
              <div>
                <Label>Ventilation System Details</Label>
                <Input
                    value={formData.ventilationSystemDetails || ""}
                    onChange={(e) => updateFormData("ventilationSystemDetails", e.target.value)}
                  className="mt-1"
                  placeholder="Enter ventilation system details..."
                />
              </div>
              )}
            </>
          )}
        </div>
      </FormSection>

      <FormSection title="Atmospheric Air-Conditions of the Selected Region" stepNumber={5}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-7">
          <div>
            <Label>Max Temp (°C) *</Label>
            {formData.system === "ventilationSystem" ? (
              <div className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded text-center text-gray-700 font-medium">
                Ambient
              </div>
            ) : (
            <Input
              value={formData.maxTemp}
              onChange={(e) => updateFormData("maxTemp", e.target.value)}
              className="mt-1"
              placeholder="All-time maximum"
              required
              title="All-time highest temperature ever recorded for the selected location"
            />
            )}
            <p className="text-xs text-gray-500 mt-1">All-time maximum for location</p>
          </div>
          <div>
            <Label>Min Temp (°C) *</Label>
            {formData.system === "ventilationSystem" ? (
              <div className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded text-center text-gray-700 font-medium">
                Ambient
              </div>
              ) : (
            <Input
              value={formData.minTemp}
              onChange={(e) => updateFormData("minTemp", e.target.value)}
              className="mt-1"
              placeholder="All-time minimum"
              required
              title="All-time lowest temperature ever recorded for the selected location"
            />
            )}
            <p className="text-xs text-gray-500 mt-1">All-time minimum for location</p>
          </div>
          <div>
            <Label>Max RH% *</Label>
            {formData.system === "ventilationSystem" ? (
              <div className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded text-center text-gray-700 font-medium">
                Ambient
              </div>
            ) : (
            <Input 
              value={formData.maxRh} 
              onChange={(e) => updateFormData("maxRh", e.target.value)} 
              className="mt-1" 
              placeholder="e.g., 60"
              required 
            />
            )}
          </div>
          <div>
            <Label>Min RH% *</Label>
            {formData.system === "ventilationSystem" ? (
              <div className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded text-center text-center text-gray-700 font-medium">
                Ambient
              </div>
            ) : (
            <Input 
              value={formData.minRh} 
              onChange={(e) => updateFormData("minRh", e.target.value)} 
              className="mt-1" 
              placeholder="e.g., 45"
              required 
            />
            )}
          </div>
          <div>
            <Label>Required Inside Temperature (°C)</Label>
            {formData.system === "ventilationSystem" ? (
              <div className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded text-center text-gray-700 font-medium">
                Ambient
              </div>
            ) : (
              <Input 
                value={formData.requiredInsideTemp || ""} 
                onChange={(e) => updateFormData("requiredInsideTemp", e.target.value)} 
                className="mt-1" 
                placeholder="e.g., 22"
                required 
              />
            )}
          </div>
          <div>
            <Label>Required Inside Humidity (RH%)</Label>
            {formData.system === "ventilationSystem" ? (
              <div className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded text-center text-gray-700 font-medium">
                Ambient
              </div>
            ) : (
              <Input 
                value={formData.requiredInsideHumidity || ""} 
                onChange={(e) => updateFormData("requiredInsideHumidity", e.target.value)} 
                className="mt-1" 
                placeholder="e.g., 55"
                required 
              />
            )}
          </div>
          <div>
            <Label>Air Changes / Hr</Label>
            {formData.system === "ventilationSystem" ? (
              <div className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded text-center text-gray-700 font-medium">
                Ambient
              </div>
            ) : (
              <Select 
                value={formData.airChanges} 
                onValueChange={(value) => updateFormData("airChanges", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select air changes..." />
                </SelectTrigger>
                <SelectContent>
                  {airChangesRange.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
            {formData.system !== "ventilationSystem" && airChangesRange.options.length > 1 && (
              <p className="text-xs text-gray-500 mt-1">
                Range: {airChangesRange.min}-{airChangesRange.max} air changes/hr
              </p>
            )}
          </div>
        </div>
      </FormSection>

      <FormSection title="Filtration & AHU Details" stepNumber={6}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Filtration Checkboxes */}
          <div>
            <Label className="mb-4 block font-medium">Filtration</Label>
            
            {/* Filter Type Selection */}
            <div className="mb-6 p-4 bg-blue-50 rounded-md border">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-blue-700">
                  Filter Type Selection
                </Label>
                <Select 
                  value={formData.filterType || "supply"} 
                  onValueChange={(value) => {
                    updateFormData("filterType", value)
                    // Reset filters when changing filter type
                    updateFormData("filters", {})
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select filter type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supply">Supply</SelectItem>
                    <SelectItem value="exhaust">Exhaust</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-blue-600 mt-1">Select whether filters are for supply or exhaust air</p>
            </div>
            
            <div className="space-y-6">
              {/* 1. Fresh-air filters */}
              <div className="rounded-md border border-gray-200 p-4">
                <h4 className="mb-3 font-medium text-gray-800">{filterOptions[formData.filterType || "supply"].freshAirFilters.title}</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {filterOptions[formData.filterType || "supply"].freshAirFilters.options.map((filter) => (
                    <div key={filter} className="flex items-center space-x-2">
                      <Checkbox
                        id={filter.replace(/\s+/g, "-")}
                        checked={!!formData.filters[filter]}
                        onCheckedChange={(checked) =>
                          updateFormData("filters", { ...formData.filters, [filter]: checked })
                        }
                      />
                      <Label htmlFor={filter.replace(/\s+/g, "-")} className="text-sm font-normal">
                        {filter}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Return-air filter */}
              <div className="rounded-md border border-gray-200 p-4">
                <h4 className="mb-3 font-medium text-gray-800">{filterOptions[formData.filterType || "supply"].returnAirFilters.title}</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {filterOptions[formData.filterType || "supply"].returnAirFilters.options.map((filter) => (
                    <div key={filter} className="flex items-center space-x-2">
                      <Checkbox
                        id={filter.replace(/\s+/g, "-")}
                        checked={!!formData.filters[filter]}
                        onCheckedChange={(checked) =>
                          updateFormData("filters", { ...formData.filters, [filter]: checked })
                        }
                      />
                      <Label htmlFor={filter.replace(/\s+/g, "-")} className="text-sm font-normal">
                        {filter}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Fine-filter */}
              <div className="rounded-md border border-gray-200 p-4">
                <h4 className="mb-3 font-medium text-gray-800">{filterOptions[formData.filterType || "supply"].fineFilters.title}</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {filterOptions[formData.filterType || "supply"].fineFilters.options.map((filter) => (
                    <div key={filter} className="flex items-center space-x-2">
                      <Checkbox
                        id={filter.replace(/\s+/g, "-")}
                        checked={!!formData.filters[filter]}
                        onCheckedChange={(checked) =>
                          updateFormData("filters", { ...formData.filters, [filter]: checked })
                        }
                      />
                      <Label htmlFor={filter.replace(/\s+/g, "-")} className="text-sm font-normal">
                        {filter}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Super fine filter */}
              <div className="rounded-md border border-gray-200 p-4">
                <h4 className="mb-3 font-medium text-gray-800">{filterOptions[formData.filterType || "supply"].superFineFilters.title}</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {filterOptions[formData.filterType || "supply"].superFineFilters.options.map((filter) => (
                    <div key={filter} className="flex items-center space-x-2">
                    <Checkbox
                      id={filter.replace(/\s+/g, "-")}
                      checked={!!formData.filters[filter]}
                      onCheckedChange={(checked) =>
                        updateFormData("filters", { ...formData.filters, [filter]: checked })
                      }
                    />
                    <Label htmlFor={filter.replace(/\s+/g, "-")} className="text-sm font-normal">
                      {filter}
                    </Label>
                  </div>
                ))}
              </div>
              </div>

              {/* 5. Terminal filters */}
              <div className="rounded-md border border-gray-200 p-4">
                <h4 className="mb-3 font-medium text-gray-800">{filterOptions[formData.filterType || "supply"].terminalFilters.title}</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {filterOptions[formData.filterType || "supply"].terminalFilters.options.map((filter) => (
                    <div key={filter} className="flex items-center space-x-2">
                    <Checkbox
                      id={filter.replace(/\s+/g, "-")}
                      checked={!!formData.filters[filter]}
                      onCheckedChange={(checked) =>
                        updateFormData("filters", { ...formData.filters, [filter]: checked })
                      }
                    />
                    <Label htmlFor={filter.replace(/\s+/g, "-")} className="text-sm font-normal">
                      {filter}
                    </Label>
                  </div>
                ))}
                </div>
              </div>
            </div>
          </div>



          {/* AHU Specs */}
          <div>
            <Label className="mb-4 block font-medium">AHU Construction Specifications</Label>
            
            {/* Plant Room Distance */}
            <div className="mb-6 p-4 bg-gray-50 rounded-md border">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">
                  Plant Room Distance
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="30"
                    max="100"
                    value={formData.plantRoomDistance || "50"}
                    onChange={(e) => updateFormData("plantRoomDistance", e.target.value)}
                    className="w-32 text-center"
                    placeholder="50"
                  />
                  <span className="text-sm text-gray-500">meters</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Range: 30-100 meters (Default: 50m)</p>
            </div>
            
            <div className="space-y-4 rounded-md border bg-white p-4 shadow-sm">
              {/* Basic AHU Specifications - Always visible */}
              {Object.entries(ahuSpecOptions).filter(([category]) => 
                !["Humidistat", "Thermostat", "Flow-control Valve", "Y-strainer", "Purge Wall", "Pipe Configuration", "Flow Velocity - Chilled Water/Brine/DX/Hot Water", "Flow Velocity - Steam"].includes(category)
              ).map(([category, options]) => (
                <div key={category} className="flex items-center justify-between">
                  <Label className="text-sm font-normal text-gray-700 w-1/2">
                    {category}
                  </Label>
                  <Select 
                    value={formData.ahuSpecs[category] || ""} 
                    onValueChange={(value) => {
                      const newSpecs = { ...formData.ahuSpecs, [category]: value }
                      updateFormData("ahuSpecs", newSpecs)
                    }}
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue>
                        {formData.ahuSpecs[category] || "Select specification..."}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              {/* Additional AHU Specifications - Only visible for Air-Cooling and Air-Heating systems */}
              {(formData.system === "airCoolingSystem" || formData.system === "airHeatingSystem") && (
                <>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-800 mb-3">Additional Specifications for {formData.system === "airCoolingSystem" ? "Air-Cooling" : "Air-Heating"} System</h4>
                  </div>
                  
                  {Object.entries(ahuSpecOptions).filter(([category]) => 
                    ["Humidistat", "Thermostat", "Flow-control Valve", "Y-strainer", "Purge Wall", "Pipe Configuration", "Flow Velocity - Chilled Water/Brine/DX/Hot Water", "Flow Velocity - Steam"].includes(category)
                  ).map(([category, options]) => (
                    <div key={category} className="flex items-center justify-between">
                      <Label className="text-sm font-normal text-gray-700 w-1/2">
                        {category}
                      </Label>
                      <Select 
                        value={formData.ahuSpecs[category] || ""} 
                        onValueChange={(value) => {
                          const newSpecs = { ...formData.ahuSpecs, [category]: value }
                          updateFormData("ahuSpecs", newSpecs)
                        }}
                      >
                        <SelectTrigger className="w-64">
                          <SelectValue>
                            {formData.ahuSpecs[category] || "Select specification..."}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Calculated Fields */}
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
          <div>
            <Label>No. of Filtration Stages in AHU</Label>
            <Input value={formData.filtrationStages} disabled className="mt-1 bg-gray-100 font-semibold" />
          </div>
          <div>
            <Label>Static Pressure of AHU (Auto Generation)</Label>
            <Input value={formData.staticPressure} disabled className="mt-1 bg-gray-100 font-semibold" />
          </div>
        </div>
      </FormSection>



      <div className="p-6 pt-0 sm:p-8 sm:pt-0">
        <div className="rounded-md bg-blue-50 p-4">
          <Label className="text-sm font-semibold text-blue-800">Selected Class</Label>
          <p className="font-mono text-blue-900">
            {formData.standard} Standard And Class - {formData.classification || "N/A"}
          </p>
        </div>
      </div>

      <div className="flex justify-between border-t border-gray-200/80 bg-gray-50 px-6 py-4">
        <Button type="button" variant="outline" onClick={onBack} size="lg" className="rounded-full bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button type="button" onClick={handleNext} size="lg" className="rounded-full">
          Next Step
        </Button>
      </div>
    </div>
  )
}
