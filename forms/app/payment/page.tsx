"use client"

import { useEffect } from "react"

export default function PaymentPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.replace('/demo-payment')
    }
  }, [])

  return (
    <main className="flex min-h-[50vh] items-center justify-center p-8">
      <div className="text-center text-gray-700">
        <p>Redirecting to demo payment page…</p>
      </div>
    </main>
  )
}


