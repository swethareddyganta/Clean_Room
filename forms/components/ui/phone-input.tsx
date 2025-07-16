"use client"

import React from "react"
import PhoneInput from "react-phone-number-input"
import { cn } from "../../lib/utils"

interface PhoneInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  error?: boolean
  disabled?: boolean
}

export function PhoneInputField({
  value,
  onChange,
  placeholder = "Enter phone number",
  className,
  error,
  disabled
}: PhoneInputProps) {
  const handleChange = (phoneValue: any) => {
    if (onChange) {
      onChange(phoneValue || "")
    }
  }

  return (
    <PhoneInput
      international
      defaultCountry="US"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        error && "border-destructive focus-visible:ring-destructive",
        className
      )}
      disabled={disabled}
    />
  )
} 