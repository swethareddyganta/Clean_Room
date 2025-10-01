"use client"

import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Checkbox } from "./checkbox"
import { Label } from "./label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

interface HandlingSelectorProps {
  value: string[]
  onChange: (value: string[]) => void
  className?: string
  label?: string
  placeholder?: string
}

const HANDLING_OPTIONS = [
  "Contagious",
  "Non-Contagious",
  "Hazardous",
  "Non-Hazardous",
  "Flammable vapors",
  "Bio-safety"
]

export function HandlingSelector({
  value = [],
  onChange,
  className,
  label = "Handling",
  placeholder = "Select handling types..."
}: HandlingSelectorProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option]
    onChange(newValue)
  }

  const handleRemove = (option: string) => {
    onChange(value.filter((item) => item !== option))
  }

  const handleClearAll = () => {
    onChange([])
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10 p-2"
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {value.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                value.map((option) => (
                  <div
                    key={option}
                    className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                  >
                    <span className="truncate max-w-[150px]">{option}</span>
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(option)
                      }}
                      className="h-4 w-4 p-0 hover:bg-primary/20 rounded cursor-pointer flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </div>
                  </div>
                ))
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="max-h-80 overflow-auto">
            <div className="p-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Select Handling Types</span>
                {value.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="h-6 px-2 text-xs"
                  >
                    Clear All
                  </Button>
                )}
              </div>
              <div className="space-y-1">
                {HANDLING_OPTIONS.map((option) => (
                  <div
                    key={option}
                    className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm cursor-pointer"
                    onClick={() => handleSelect(option)}
                  >
                    <Checkbox
                      checked={value.includes(option)}
                      onChange={() => handleSelect(option)}
                    />
                    <span className="text-sm flex-1">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
