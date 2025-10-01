"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Label } from "./label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

interface ExhaustImpactSelectorProps {
  filterType?: string
  handlingTypes?: string[]
  exhaustImpactPercentage: string
  bioSafetyLevel: string
  onExhaustImpactChange: (value: string) => void
  onBioSafetyLevelChange: (value: string) => void
  className?: string
}

const BIO_SAFETY_LEVELS = [
  { value: "level1", label: "Level 1 - 30%" },
  { value: "level2", label: "Level 2 - 50%" },
  { value: "level3", label: "Level 3 - 75%" },
  { value: "level4", label: "Level 4 - 100%" },
]

const generatePercentageOptions = (maxPercentage: number) => {
  const options = []
  for (let i = 0; i <= maxPercentage; i += 5) {
    options.push({ value: i.toString(), label: `${i}%` })
  }
  return options
}

export function ExhaustImpactSelector({
  filterType = "supply",
  handlingTypes = [],
  exhaustImpactPercentage,
  bioSafetyLevel,
  onExhaustImpactChange,
  onBioSafetyLevelChange,
  className
}: ExhaustImpactSelectorProps) {
  const hasBioSafety = handlingTypes?.includes("Bio-safety") || false
  const hasFlammableVapors = handlingTypes?.includes("Flammable vapors") || false
  const hasContagious = handlingTypes?.includes("Contagious") || false
  
  const shouldShowExhaustImpact = filterType === "exhaust" && (hasBioSafety || hasFlammableVapors || hasContagious)

  if (!shouldShowExhaustImpact) {
    return null
  }

  // Determine max percentage based on handling types
  let maxPercentage = 0
  if (hasBioSafety) maxPercentage = 100
  if (hasFlammableVapors || hasContagious) maxPercentage = Math.max(maxPercentage, 50)

  const percentageOptions = generatePercentageOptions(maxPercentage)

  return (
    <div className={cn("mb-6 p-4 bg-blue-50 rounded-md border", className)}>
      <div className="flex items-center justify-between mb-4">
        <Label className="text-sm font-medium text-blue-700">Impact of Exhaust</Label>
      </div>
      
      <div className="space-y-4">
        {/* Bio-safety Level Selection */}
        {hasBioSafety && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-blue-700">Bio-safety Level</Label>
            <Select value={bioSafetyLevel} onValueChange={onBioSafetyLevelChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select bio-safety level..." />
              </SelectTrigger>
              <SelectContent>
                {BIO_SAFETY_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-blue-600">Select the appropriate bio-safety level for your facility</p>
          </div>
        )}

        {/* Exhaust Impact Percentage */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-blue-700">
            Exhaust Impact Percentage
            {hasBioSafety && hasFlammableVapors && hasContagious && " (0-100%)"}
            {hasBioSafety && !hasFlammableVapors && !hasContagious && " (0-100%)"}
            {!hasBioSafety && (hasFlammableVapors || hasContagious) && " (0-50%)"}
          </Label>
          <Select value={exhaustImpactPercentage} onValueChange={onExhaustImpactChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select exhaust impact percentage..." />
            </SelectTrigger>
            <SelectContent>
              {percentageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-blue-600">
            {hasBioSafety && "Bio-safety: 0-100% | "}
            {hasFlammableVapors && "Flammable vapors: 0-50% | "}
            {hasContagious && "Contagious: 0-50%"}
          </p>
        </div>
      </div>
    </div>
  )
}
