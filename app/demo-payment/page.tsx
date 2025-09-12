"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Home, User, FileText } from "lucide-react"
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'

type CsvRow = Record<string, string | number | boolean | null | undefined>

export default function DemoPaymentPage() {
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>([])
  const [outputUnits, setOutputUnits] = useState<'metric' | 'imperial'>('metric')
  const [bodCalculationId, setBodCalculationId] = useState<string | null>(null)
  const [bodStatus, setBodStatus] = useState<'pending' | 'processing' | 'completed' | 'failed' | null>(null)
  const [bodProgress, setBodProgress] = useState<number>(0)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Clear cookies
      Cookies.remove('token')
      Cookies.remove('role')
      
      // Show success message
      toast.success("Logged out successfully! You have been logged out of your account.")
      
      // Redirect to home page
      router.push('/')
    } catch (error) {
      toast.error("An error occurred during logout.")
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const outs = JSON.parse(localStorage.getItem('selectedOutputs') || '[]')
        setSelectedOutputs(Array.isArray(outs) ? outs : [])
        const units = (localStorage.getItem('outputUnits') as 'metric' | 'imperial') || 'metric'
        setOutputUnits(units)
        const calcId = localStorage.getItem('bodCalculationId')
        if (calcId) setBodCalculationId(calcId)
      } catch {
        setSelectedOutputs([])
      }
    }
  }, [])

  // Poll BOD status every 3s when BOD is selected and we have an ID
  useEffect(() => {
    if (!selectedOutputs.includes('BOD') || !bodCalculationId) return

    let isCancelled = false
    let interval: ReturnType<typeof setInterval> | null = null

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/forms/api/bod/status?id=${encodeURIComponent(bodCalculationId)}`, { cache: 'no-store' })
        const data = await res.json()
        if (!isCancelled && data?.success && data?.data) {
          setBodStatus(data.data.status)
          setBodProgress(Number(data.data.progress || 0))
          if (data.data.status === 'completed') {
            toast.success('BOD is ready to download')
            if (interval) {
              clearInterval(interval)
              interval = null
            }
          }
          if (data.data.status === 'failed') {
            toast.error('BOD calculation failed')
            if (interval) {
              clearInterval(interval)
              interval = null
            }
          }
        }
      } catch (e) {
        // ignore transient errors
      }
    }

    // initial and interval
    fetchStatus()
    interval = setInterval(fetchStatus, 3000)

    return () => {
      isCancelled = true
      if (interval) clearInterval(interval)
    }
  }, [selectedOutputs, bodCalculationId])

  const downloadBOD = async (format: 'json' | 'csv' = 'json') => {
    if (!bodCalculationId) {
      toast.error('No BOD calculation found')
      return
    }
    if (bodStatus !== 'completed') {
      toast.error('BOD not ready yet')
      return
    }
    try {
      const res = await fetch(`/forms/api/bod/download?id=${encodeURIComponent(bodCalculationId)}&format=${format}`)
      if (!res.ok) {
        toast.error('Failed to download BOD')
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bod_${bodCalculationId}.${format}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      toast.error('Download error')
    }
  }

  const createCsvContent = (rows: CsvRow[]): string => {
    if (!rows || rows.length === 0) return ''
    const headers = Array.from(
      rows.reduce<Set<string>>((acc, row) => {
        Object.keys(row || {}).forEach((k) => acc.add(k))
        return acc
      }, new Set<string>())
    )
    const escape = (val: any) => {
      const s = val === null || val === undefined ? '' : String(val)
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}` + '"' : s
    }
    const headerLine = headers.map(escape).join(',')
    const lines = rows.map((row) => headers.map((h) => escape((row as any)[h])).join(','))
    return [headerLine, ...lines].join('\n')
  }

  const buildPlaceholderRows = (output: string): CsvRow[] => {
    // Minimal placeholder content; replace with real calculated data later
    const timestamp = new Date().toISOString()
    return [
      { Output: output, Field: 'Status', Value: 'Demo - Not Calculated' },
      { Output: output, Field: 'GeneratedAt', Value: timestamp },
      { Output: output, Field: 'Units', Value: outputUnits },
      { Output: output, Field: 'Notes', Value: 'Replace with real calculation results' },
    ]
  }

  const downloadCsv = (output: string) => {
    const rows = buildPlaceholderRows(output)
    const csv = createCsvContent(rows)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${output.replace(/\s+/g, '_').toLowerCase()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const downloadAll = () => {
    if (selectedOutputs.length === 0) return
    selectedOutputs.forEach((o) => downloadCsv(o))
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="w-full max-w-2xl text-center space-y-6">
        <h1 className="text-2xl font-semibold">Demo Payment</h1>
        <p className="text-gray-700">This is a placeholder payment page. Integrate a real provider here.</p>

        <div className="rounded-md border p-4 text-left">
          <h2 className="font-medium mb-2">Selected Outputs</h2>
          {selectedOutputs.length === 0 ? (
            <p className="text-sm text-gray-600">No outputs selected. Go back and choose outputs.</p>
          ) : (
            <ul className="list-disc pl-6 text-sm text-gray-700">
              {selectedOutputs.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-sm text-gray-700">Download Units: <span className="font-semibold uppercase">{outputUnits}</span></p>
        </div>

        <div className="rounded-md border p-4 text-left">
          <h2 className="font-medium mb-3">Downloads</h2>

          {/* BOD download controls if selected */}
          {selectedOutputs.includes('BOD') && (
            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">BOD Status</p>
                <span className="text-sm">{bodStatus || 'pending'}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-green-600 rounded"
                  style={{ width: `${Math.min(100, Math.max(0, bodProgress))}%` }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadBOD('json')}
                  disabled={bodStatus !== 'completed'}
                  className="rounded-md bg-green-600 px-4 py-2 text-white disabled:bg-gray-400"
                >
                  Download BOD (JSON)
                </button>
                <button
                  onClick={() => downloadBOD('csv')}
                  disabled={bodStatus !== 'completed'}
                  className="rounded-md bg-green-600 px-4 py-2 text-white disabled:bg-gray-400"
                >
                  Download BOD (CSV)
                </button>
              </div>
            </div>
          )}

          {/* Other outputs keep placeholder CSV for now */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {selectedOutputs.filter(o => o !== 'BOD').map((o) => (
              <button
                key={o}
                onClick={() => downloadCsv(o)}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Download {o}
              </button>
            ))}
          </div>

          {selectedOutputs.filter(o => o !== 'BOD').length > 0 && (
            <p className="mt-2 text-xs text-gray-500">Note: Non-BOD downloads currently contain placeholder data.</p>
          )}
        </div>

        {/* Navigation Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Link href="/forms" className="underline text-blue-700">Back to Form</Link>
          </div>
          
          {/* Account and Navigation Actions */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation & Account</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => router.push('/user/dashboard')}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                <User className="h-6 w-6" />
                <span>Go to Dashboard</span>
              </Button>

              <Button 
                onClick={() => router.push('/')}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                <Home className="h-6 w-6" />
                <span>Go to Home</span>
              </Button>

              <Button 
                onClick={handleLogout}
                variant="destructive"
                className="flex flex-col items-center gap-2 h-auto py-4"
              >
                <LogOut className="h-6 w-6" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


