"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { CheckCircle, FileText, Download, Share2, Database, Plus, Trash2, Calculator } from "lucide-react"
import { useRouter } from "next/navigation"
import { sampleRoomData } from "../lib/sample-hvac-data"
import { HVACCalculator, type RoomData, type CalculationResults } from "../lib/hvac-calculations"
import { useToast } from "./ui/use-toast"
import type { FormData } from "../app/page"

interface Props {
  formData: FormData
  updateFormData: (field: keyof FormData, value: any) => void
  onBack: () => void
  onComplete?: (calculations?: any) => void
}

export default function FormStepThree({ formData, updateFormData, onBack, onComplete }: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const [rooms, setRooms] = useState<Partial<RoomData>[]>([])
  const [calculations, setCalculations] = useState<CalculationResults | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric')
  const OUTPUT_OPTIONS = [
    "BOQ",
    "BOD",
    "Budget Estimation",
    "Analysis Report",
    "Feasibility Report",
    "Cap X (Capital Expenditure)",
    "Op X (Operational Expenditure)",
    "Data Visualization",
  ]
  const OUTPUT_UNIT_PRICE = 10
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>([])
  const [outputUnits, setOutputUnits] = useState<'metric' | 'imperial'>('metric')

  // Initialize with sample data
  useEffect(() => {
    if (rooms.length === 0) {
      setRooms([sampleRoomData[0]])
    }
  }, [rooms.length])

  const addRoom = () => {
    const newRoom: Partial<RoomData> = {
      roomName: `Room ${rooms.length + 1}`,
      length: 0,
      width: 0,
      height: 9,
      standard: formData.standard,
      classification: formData.classification,
      noOfAirChanges: 40,
      occupancy: 1,
      equipmentLoadKW: 0,
      lightingLoadWSqft: 1.75,
      freshAirPercentage: 10,
      exhaustAirCFM: 0,
      inTempC: 24,
      requiredRH: 40,
      outsideRH: 85,
      outTempF: 122,
      insideTempF: 75.2,
      outTempC: 50,
      deltaTempF: 46.8,
      grainsBeforeCoil: 502.5390781,
      grainsAfterCoil: 51.89502281,
      deltaGrains: 450.6440553,
      staticPressure: 24,
      finalFiltration: "100K",
      plenumHEPA: "Gene/Entry",
      terminalHEPA100K: "Gene/Entry",
      terminalHEPA1K: "Gene/Entry",
    }
    setRooms([...rooms, newRoom])
  }

  const removeRoom = (index: number) => {
    const newRooms = rooms.filter((_, i) => i !== index)
    setRooms(newRooms)
  }

  const updateRoom = (index: number, field: keyof RoomData, value: any) => {
    const newRooms = [...rooms]
    newRooms[index] = { ...newRooms[index], [field]: value }
    setRooms(newRooms)
  }

  const calculateHVAC = async () => {
    setIsCalculating(true)
    try {
      // Create HVAC calculator with current rooms
      const calculator = new HVACCalculator(rooms)
      const results = calculator.calculateAll()
      setCalculations(results)
      
      toast({
        title: "Calculations Complete",
        description: `Calculated ${results.roomBreakdown.length} rooms with total area of ${results.totalArea.toFixed(2)} sq m.`,
      })
    } catch (error) {
      console.error('HVAC calculation error:', error)
      toast({
        title: "Calculation Error",
        description: "Failed to calculate HVAC requirements. Please check your room data.",
        variant: "destructive",
      })
    } finally {
      setIsCalculating(false)
    }
  }

  const handleOutputSelect = async (outputType: string) => {
    try {
      if (!calculations) {
        await calculateHVAC()
      }
      toast({
        title: outputType,
        description: `Preparing ${outputType}...`,
      })
    } catch (error) {
      // Already handled in calculateHVAC
    }
  }

  const handleSubmit = async () => {
    try {
      // Include room data in form submission
      const submissionData = {
        ...formData,
        rooms: rooms,
        calculations: calculations
      }

      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      const result = await response.json()

              if (result.success) {
          toast({
            title: "Success!",
            description: "Your clean room specification has been submitted successfully.",
          })
          if (onComplete) {
            onComplete(calculations)
          }
        } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit form. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleOutputSelection = (label: string, checked: boolean) => {
    setSelectedOutputs((prev) => {
      const set = new Set(prev)
      if (checked) {
        set.add(label)
      } else {
        set.delete(label)
      }
      return Array.from(set)
    })
  }

  const proceedToPayment = async () => {
    if (selectedOutputs.length === 0) {
      toast({
        title: "No outputs selected",
        description: "Please select at least one output to continue.",
        variant: "destructive",
      })
      return
    }
    // Ensure calculations are available before proceeding
    if (!calculations) {
      await calculateHVAC()
    }
    const totalPrice = selectedOutputs.length * OUTPUT_UNIT_PRICE
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedOutputs', JSON.stringify(selectedOutputs))
      localStorage.setItem('outputsTotalPrice', JSON.stringify(totalPrice))
      localStorage.setItem('outputUnits', outputUnits)
    }
    router.push('/payment')
  }

  const generateReport = () => {
    if (!calculations) {
      toast({
        title: "No Calculations",
        description: "Please run HVAC calculations first.",
        variant: "destructive",
      })
      return
    }

    const report = {
      title: "Clean Room HVAC Specification Report",
      customer: formData.customerName,
      project: formData.projectName,
      location: formData.location,
      specifications: {
        standard: formData.standard,
        classification: formData.classification,
        system: formData.system,
        temperature: `${formData.minTemp}°C - ${formData.maxTemp}°C`,
        humidity: `${formData.minRh}% - ${formData.maxRh}%`,
        airChanges: formData.airChanges,
      },
      calculations: {
        totalArea: calculations.totalArea,
        totalVolume: calculations.totalVolume,
        totalCFM: calculations.totalCFM,
        totalACLoad: calculations.totalACLoad,
        totalChilledWater: calculations.totalChilledWater,
        totalPowerConsumption: calculations.totalPowerConsumption,
      },
      rooms: calculations.roomBreakdown,
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `clean-room-hvac-spec-${formData.uniqueId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Report Generated",
      description: "Your HVAC specification report has been downloaded.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Calculator className="mx-auto h-16 w-16 text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Room Specifications & HVAC Calculations
        </h2>
        <p className="text-gray-600">
          Add rooms and calculate HVAC requirements for your clean room facility.
        </p>
      </div>

      {/* Room Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Room Specifications
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm">Input Units</Label>
                <div className="flex gap-1">
                  <Button type="button" size="sm" variant={unitSystem === 'metric' ? 'default' : 'outline'} onClick={() => setUnitSystem('metric')}>Metric</Button>
                  <Button type="button" size="sm" variant={unitSystem === 'imperial' ? 'default' : 'outline'} onClick={() => setUnitSystem('imperial')}>Imperial</Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Output Units</Label>
                <div className="flex gap-1">
                  <Button type="button" size="sm" variant={outputUnits === 'metric' ? 'default' : 'outline'} onClick={() => setOutputUnits('metric')}>Metric</Button>
                  <Button type="button" size="sm" variant={outputUnits === 'imperial' ? 'default' : 'outline'} onClick={() => setOutputUnits('imperial')}>Imperial</Button>
                </div>
              </div>
              <Button onClick={addRoom} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Room
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rooms.map((room, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Room {index + 1}</CardTitle>
                    <Button
                      onClick={() => removeRoom(index)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`room-name-${index}`}>Room Name</Label>
                      <Input
                        id={`room-name-${index}`}
                        value={room.roomName || ''}
                        onChange={(e) => updateRoom(index, 'roomName', e.target.value)}
                        placeholder="e.g., Milling Room"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`room-length-${index}`}>Length ({unitSystem === 'metric' ? 'm' : 'ft'})</Label>
                      <Input
                        id={`room-length-${index}`}
                        type="number"
                        value={room.length || ''}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value) || 0
                          const meters = unitSystem === 'imperial' ? v * 0.3048 : v
                          updateRoom(index, 'length', meters)
                        }}
                        placeholder={unitSystem === 'metric' ? '8' : '26.2'}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`room-width-${index}`}>Width ({unitSystem === 'metric' ? 'm' : 'ft'})</Label>
                      <Input
                        id={`room-width-${index}`}
                        type="number"
                        value={room.width || ''}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value) || 0
                          const meters = unitSystem === 'imperial' ? v * 0.3048 : v
                          updateRoom(index, 'width', meters)
                        }}
                        placeholder={unitSystem === 'metric' ? '9' : '29.5'}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`room-height-${index}`}>Height ({unitSystem === 'metric' ? 'm' : 'ft'})</Label>
                      <Input
                        id={`room-height-${index}`}
                        type="number"
                        value={room.height || ''}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value) || 0
                          const feet = unitSystem === 'metric' ? v * 3.28084 : v
                          updateRoom(index, 'height', feet)
                        }}
                        placeholder={unitSystem === 'metric' ? '3' : '10'}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`room-occupancy-${index}`}>Occupancy</Label>
                      <Input
                        id={`room-occupancy-${index}`}
                        type="number"
                        value={room.occupancy || ''}
                        onChange={(e) => updateRoom(index, 'occupancy', parseInt(e.target.value) || 0)}
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`room-air-changes-${index}`}>No. of infiltrations per hour</Label>
                      <Input
                        id={`room-air-changes-${index}`}
                        type="number"
                        value={room.noOfAirChanges || ''}
                        onChange={(e) => updateRoom(index, 'noOfAirChanges', parseInt(e.target.value) || 0)}
                        placeholder="40"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`room-fresh-air-${index}`}>Fresh air (%)</Label>
                      <Input
                        id={`room-fresh-air-${index}`}
                        type="number"
                        value={room.freshAirPercentage || ''}
                        onChange={(e) => updateRoom(index, 'freshAirPercentage', parseFloat(e.target.value) || 0)}
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`room-exhaust-air-${index}`}>Exhaust air ({unitSystem === 'metric' ? 'm³/s' : 'CFM'})</Label>
                      <Input
                        id={`room-exhaust-air-${index}`}
                        type="number"
                        value={room.exhaustAirCFM || ''}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value) || 0
                          const cfm = unitSystem === 'metric' ? v * 2118.88 : v
                          updateRoom(index, 'exhaustAirCFM', cfm)
                        }}
                        placeholder={unitSystem === 'metric' ? '0.3' : '635'}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`room-lighting-${index}`}>{unitSystem === 'metric' ? 'Lightning load in W/m²' : 'Lightning load in WPSF'}</Label>
                      <Input
                        id={`room-lighting-${index}`}
                        type="number"
                        value={room.lightingLoadWSqft || ''}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value) || 0
                          const wPerSqft = unitSystem === 'metric' ? v / 10.7639 : v
                          updateRoom(index, 'lightingLoadWSqft', wPerSqft)
                        }}
                        placeholder={unitSystem === 'metric' ? '18.8' : '1.75'}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calculation Results */}
      {calculations && (
        <Card className="bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              HVAC Calculation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">{calculations.totalArea.toFixed(1)}</div>
                <div className="text-sm text-green-600">Total Area (sq m)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">{calculations.totalCFM.toFixed(0)}</div>
                <div className="text-sm text-green-600">Total CFM</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">{calculations.totalACLoad.toFixed(1)}</div>
                <div className="text-sm text-green-600">Total AC Load (TR)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">{calculations.totalPowerConsumption.toFixed(1)}</div>
                <div className="text-sm text-green-600">Power (kW)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Outputs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 text-sm mb-4">
              After entering the room details, choose the outputs you’d like to generate.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {OUTPUT_OPTIONS.map((label) => {
                const checked = selectedOutputs.includes(label)
                return (
                  <div key={label} className="flex items-center space-x-3 rounded-md border bg-white p-3">
                    <Checkbox id={`out-${label}`} checked={checked} onCheckedChange={(c) => toggleOutputSelection(label, Boolean(c))} />
                    <Label htmlFor={`out-${label}`} className="flex-1 cursor-pointer">
                      {label}
                    </Label>
                    <span className="text-sm text-gray-600">${OUTPUT_UNIT_PRICE}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Label className="text-sm">Download units</Label>
              <Select value={outputUnits} onValueChange={(v) => setOutputUnits(v as 'metric' | 'imperial')}>
                <SelectTrigger className="h-9 w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (SI)</SelectItem>
                  <SelectItem value="imperial">Imperial (US)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Selected: <span className="font-semibold">{selectedOutputs.length}</span>
              </div>
              <div className="text-base font-semibold text-blue-900">
                Total: ${selectedOutputs.length * OUTPUT_UNIT_PRICE}
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={proceedToPayment} disabled={rooms.length === 0} className="w-full sm:w-auto" size="lg">
                Proceed to Payment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button onClick={onBack} variant="outline" className="flex-1 sm:flex-none">
            ← Back to Previous Step
          </Button>
          
          {calculations && (
            <Button 
              onClick={() => {
                toast({
                  title: "Form Completed!",
                  description: "Your clean room specification has been submitted successfully. You can now view your submissions in the dashboard.",
                })
                if (onComplete) onComplete(calculations)
              }} 
              className="flex-1 sm:flex-none"
            >
              ✓ Complete Form & View Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 