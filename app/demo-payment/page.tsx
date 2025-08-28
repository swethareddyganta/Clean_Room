"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

type CsvRow = Record<string, string | number | boolean | null | undefined>

export default function DemoPaymentPage() {
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>([])
  const [outputUnits, setOutputUnits] = useState<'metric' | 'imperial'>('metric')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const outs = JSON.parse(localStorage.getItem('selectedOutputs') || '[]')
        setSelectedOutputs(Array.isArray(outs) ? outs : [])
        const units = (localStorage.getItem('outputUnits') as 'metric' | 'imperial') || 'metric'
        setOutputUnits(units)
      } catch {
        setSelectedOutputs([])
      }
    }
  }, [])

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
          <h2 className="font-medium mb-3">Downloads (Demo CSV)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {selectedOutputs.map((o) => (
              <button
                key={o}
                onClick={() => downloadCsv(o)}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Download {o}
              </button>
            ))}
          </div>
          
          <p className="mt-2 text-xs text-gray-500">Note: These CSV files contain placeholder data for demonstration.</p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Link href="/forms" className="underline text-blue-700">Back to Form</Link>
        </div>
      </div>
    </main>
  )
}


