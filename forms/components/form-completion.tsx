"use client"

import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { CheckCircle, FileText, Database, Download, Share2, ArrowRight, Home } from "lucide-react"
import { useToast } from "./ui/use-toast"
import type { FormData } from "../app/page"

interface Props {
  formData: FormData
  calculations?: any
  onViewDashboard?: () => void
  onNewForm?: () => void
}

export default function FormCompletion({ formData, calculations, onViewDashboard, onNewForm }: Props) {
  const { toast } = useToast()

  const generateFinalReport = () => {
    const report = {
      title: "Clean Room HVAC Specification Report",
      customer: formData.customerName,
      project: formData.projectName,
      location: formData.location,
      uniqueId: formData.uniqueId,
      specifications: {
        standard: formData.standard,
        classification: formData.classification,
        system: formData.system,
        temperature: `${formData.minTemp}°C - ${formData.maxTemp}°C`,
        humidity: `${formData.minRh}% - ${formData.maxRh}%`,
        airChanges: formData.airChanges,
      },
      calculations: calculations || {},
      timestamp: new Date().toISOString(),
      status: "SUBMITTED"
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `clean-room-spec-${formData.uniqueId}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Report Downloaded",
      description: "Your final specification report has been downloaded.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Specification Submitted Successfully!
        </h2>
        <p className="text-gray-600 text-lg">
          Your clean room HVAC specification has been saved to the database.
        </p>
        <Badge variant="secondary" className="mt-4 text-sm">
          Unique ID: {formData.uniqueId}
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <FileText className="h-5 w-5" />
              Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><span className="font-semibold">Customer:</span> {formData.customerName}</div>
            <div><span className="font-semibold">Project:</span> {formData.projectName}</div>
            <div><span className="font-semibold">Location:</span> {formData.location}</div>
          </CardContent>
        </Card>

        {/* Technical Specifications */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Database className="h-5 w-5" />
              Technical Specs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><span className="font-semibold">Standard:</span> {formData.standard}</div>
            <div><span className="font-semibold">Classification:</span> {formData.classification}</div>
            <div><span className="font-semibold">System:</span> {formData.system}</div>
          </CardContent>
        </Card>

        {/* Calculations Summary */}
        {calculations && (
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <CheckCircle className="h-5 w-5" />
                HVAC Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><span className="font-semibold">Total Area:</span> {calculations.totalArea?.toFixed(1)} sq m</div>
              <div><span className="font-semibold">Total CFM:</span> {calculations.totalCFM?.toFixed(0)}</div>
              <div><span className="font-semibold">AC Load:</span> {calculations.totalACLoad?.toFixed(1)} TR</div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                onClick={generateFinalReport} 
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                <Download className="h-6 w-6" />
                <span>Download Final Report</span>
              </Button>

              <Button 
                onClick={onViewDashboard}
                className="flex flex-col items-center gap-2 h-auto py-4 bg-blue-600 hover:bg-blue-700"
              >
                <Database className="h-6 w-6" />
                <span>View All Submissions</span>
              </Button>

              <Button 
                onClick={onNewForm}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                <FileText className="h-6 w-6" />
                <span>Create New Specification</span>
              </Button>

              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                <Home className="h-6 w-6" />
                <span>Go to Home</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Message */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-green-800 font-medium">
              Your specification has been successfully submitted and is now available in the database.
            </p>
            <p className="text-green-700 text-sm mt-2">
              You can view, edit, or download your specifications anytime from the dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 