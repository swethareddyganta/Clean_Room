"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { CheckCircle, FileText, Download, Share2, Database, Plus, Trash2, Calculator } from "lucide-react"
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
  const [rooms, setRooms] = useState<Partial<RoomData>[]>([])
  const [calculations, setCalculations] = useState<CalculationResults | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Initialize with sample data
  useEffect(() => {
    if (rooms.length === 0) {
      setRooms([...sampleRoomData])
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
            <Button onClick={addRoom} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
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
                      <Label htmlFor={`room-length-${index}`}>Length (m)</Label>
                      <Input
                        id={`room-length-${index}`}
                        type="number"
                        value={room.length || ''}
                        onChange={(e) => updateRoom(index, 'length', parseFloat(e.target.value) || 0)}
                        placeholder="8"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`room-width-${index}`}>Width (m)</Label>
                      <Input
                        id={`room-width-${index}`}
                        type="number"
                        value={room.width || ''}
                        onChange={(e) => updateRoom(index, 'width', parseFloat(e.target.value) || 0)}
                        placeholder="9"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`room-height-${index}`}>Height (ft)</Label>
                      <Input
                        id={`room-height-${index}`}
                        type="number"
                        value={room.height || ''}
                        onChange={(e) => updateRoom(index, 'height', parseFloat(e.target.value) || 0)}
                        placeholder="9"
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
                      <Label htmlFor={`room-equipment-${index}`}>Equipment Load (kW)</Label>
                      <Input
                        id={`room-equipment-${index}`}
                        type="number"
                        value={room.equipmentLoadKW || ''}
                        onChange={(e) => updateRoom(index, 'equipmentLoadKW', parseFloat(e.target.value) || 0)}
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`room-air-changes-${index}`}>Air Changes/Hour</Label>
                      <Input
                        id={`room-air-changes-${index}`}
                        type="number"
                        value={room.noOfAirChanges || ''}
                        onChange={(e) => updateRoom(index, 'noOfAirChanges', parseInt(e.target.value) || 0)}
                        placeholder="40"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`room-temp-${index}`}>Temperature (°C)</Label>
                      <Input
                        id={`room-temp-${index}`}
                        type="number"
                        value={room.inTempC || ''}
                        onChange={(e) => updateRoom(index, 'inTempC', parseFloat(e.target.value) || 0)}
                        placeholder="24"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`room-rh-${index}`}>Required RH (%)</Label>
                      <Input
                        id={`room-rh-${index}`}
                        type="number"
                        value={room.requiredRH || ''}
                        onChange={(e) => updateRoom(index, 'requiredRH', parseFloat(e.target.value) || 0)}
                        placeholder="40"
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
        {/* Step 1: Calculate HVAC */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Step 1: Calculate HVAC Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 text-sm mb-4">
              Run calculations to determine HVAC specifications for your clean room facility.
            </p>
            <Button 
              onClick={calculateHVAC} 
              disabled={isCalculating || rooms.length === 0}
              className="w-full sm:w-auto"
              size="lg"
            >
              <Calculator className="h-5 w-5 mr-2" />
              {isCalculating ? "Calculating..." : "Calculate HVAC Requirements"}
            </Button>
          </CardContent>
        </Card>

        {/* Step 2: Download Report (only show after calculations) */}
        {calculations && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900 flex items-center gap-2">
                <Download className="h-5 w-5" />
                Step 2: Download Detailed Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800 text-sm mb-4">
                Generate and download a comprehensive HVAC specification report for your records.
              </p>
              <Button 
                onClick={generateReport} 
                variant="outline"
                className="w-full sm:w-auto"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Download HVAC Report
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Submit Specification (only show after calculations) */}
        {calculations && (
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-900 flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Step 3: Submit Specification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-800 text-sm mb-4">
                Submit your complete clean room specification to the database for processing.
              </p>
              <Button 
                onClick={handleSubmit} 
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Submit Clean Room Specification
              </Button>
            </CardContent>
          </Card>
        )}

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