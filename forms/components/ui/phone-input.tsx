"use client"

import React, { useState } from "react"
import { Input } from "./input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { cn } from "../../lib/utils"

interface PhoneInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  error?: boolean
  disabled?: boolean
}

const countryCodes = [
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
]

export function PhoneInputField({
  value = "",
  onChange,
  placeholder = "Enter phone number",
  className,
  error,
  disabled
}: PhoneInputProps) {
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1")
  
  // Parse existing value to extract country code and number
  React.useEffect(() => {
    if (value) {
      const matchedCode = countryCodes.find(country => value.startsWith(country.code))
      if (matchedCode) {
        setSelectedCountryCode(matchedCode.code)
      }
    }
  }, [value])

  const phoneNumber = value ? value.replace(selectedCountryCode, "").trim() : ""

  const handlePhoneChange = (phoneValue: string) => {
    const cleanPhone = phoneValue.replace(/[^\d\s\-\(\)]/g, "") // Allow digits, spaces, dashes, parentheses
    const fullPhone = cleanPhone ? `${selectedCountryCode} ${cleanPhone}` : ""
    onChange?.(fullPhone)
  }

  const handleCountryChange = (newCode: string) => {
    setSelectedCountryCode(newCode)
    const cleanPhone = phoneNumber.trim()
    const fullPhone = cleanPhone ? `${newCode} ${cleanPhone}` : ""
    onChange?.(fullPhone)
  }

  return (
    <div className={cn("flex", className)}>
      <Select value={selectedCountryCode} onValueChange={handleCountryChange} disabled={disabled}>
        <SelectTrigger className="w-20 rounded-r-none border-r-0 focus:z-10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {countryCodes.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <span className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.code}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={phoneNumber}
        onChange={(e) => handlePhoneChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "rounded-l-none border-l-0 focus:z-10",
          error && "border-destructive focus-visible:ring-destructive"
        )}
        disabled={disabled}
      />
    </div>
  )
} 