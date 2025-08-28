"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DemoPaymentRedirect() {
  const router = useRouter()
  useEffect(() => {
    // Replace this URL with an actual demo checkout if desired
    window.location.replace("/demo-payment")
  }, [router])

  return (
    <main className="flex min-h-[50vh] items-center justify-center p-8">
      <div className="text-center text-gray-700">
        <p>Redirecting to demo payment page…</p>
      </div>
    </main>
  )
}


