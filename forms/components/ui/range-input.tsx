"use client"

import React from "react"
import { Label } from "./label"
import { Slider } from "./slider"

interface RangeInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  min: number
  max: number
  step: number
  unit: string
  className?: string
}

export function RangeInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  className = ""
}: RangeInputProps) {
  const numericValue = parseFloat(value) || min

  const handleSliderChange = (newValue: number[]) => {
    onChange(newValue[0].toString())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value)
    if (!isNaN(inputValue) && inputValue >= min && inputValue <= max) {
      onChange(inputValue.toString())
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-normal text-gray-700">
        <span dangerouslySetInnerHTML={{ __html: label }} />
      </Label>
      <div className="space-y-3">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Slider
              value={[numericValue]}
              onValueChange={handleSliderChange}
              min={min}
              max={max}
              step={step}
              className="w-full"
            />
          </div>
          <div className="flex items-center space-x-2 min-w-[120px]">
            <input
              type="number"
              value={numericValue}
              onChange={handleInputChange}
              min={min}
              max={max}
              step={step}
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">{unit}</span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{min} {unit}</span>
          <span>{max} {unit}</span>
        </div>
      </div>
    </div>
  )
}
