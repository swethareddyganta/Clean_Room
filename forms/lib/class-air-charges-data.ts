// Data derived from the user's "Class Air Charges.csv" file.
// This represents the number of air changes per hour for a given standard and classification.
export const classAirChargesData: Record<string, Record<string, string | number>> = {
  // ISO 14644-4 Classifications
  "ISO 9": {
    ISO146444: "5-15",
  },
  "ISO 8": {
    ISO146444: "20-60",
  },
  "ISO 7": {
    ISO146444: "60-150",
  },
  "ISO 6": {
    ISO146444: "150-240",
  },
  "ISO 5": {
    ISO146444: "240-500",
  },
  "ISO 4": {
    ISO146444: "300-600",
  },
  "ISO 3": {
    ISO146444: "400-750",
  },
  "ISO 2": {
    ISO146444: "500-750",
  },
  "ISO 1": {
    ISO146444: "500-750",
  },
  
  // FDA 209E Classifications
  "Class100K": {
    FDA209E: "12-25",
  },
  "Class10K": {
    FDA209E: "30-60",
  },
  "Class1K": {
    FDA209E: "80-130",
  },
  "Class 100": {
    FDA209E: "150-300",
  },
  "Class 10": {
    FDA209E: "180-400",
  },
  "Class 1": {
    FDA209E: "240-500",
  },
  
  // GMP Classifications
  "Grade D (ISO 8 at Rest & Not Defined)": {
    GMP: "20-40",
  },
  "Grade C (ISO 7 at Rest & ISO 8 in Oper.)": {
    GMP: "60-120",
  },
  "Grade B (ISO 5 at Rest & ISO 7 in Oper.)": {
    GMP: "120-180",
  },
  "Grade A (ISO 5 at Rest & ISO 5 in Oper.)": {
    GMP: "180-240",
  },
  
  // JIS B 9920 Classifications
  "JIS Class 9": {
    JISB9920: "10-20",
  },
  "JIS Class 8": {
    JISB9920: "20-60",
  },
  "JIS Class 7": {
    JISB9920: "60-120",
  },
  "JIS Class 6": {
    JISB9920: "120-180",
  },
  "JIS Class 5": {
    JISB9920: "180-240",
  },
  "JIS Class 4": {
    JISB9920: "240-350",
  },
  "JIS Class 3": {
    JISB9920: "350-500",
  },
  "JIS Class 2": {
    JISB9920: "400-600",
  },
  "JIS Class 1": {
    JISB9920: "400-600",
  },
  
  // EU GMP Classifications
  "EU GMP - Grade D (ISO 7 at Rest & ISO 8 in Oper.)": {
    EUGMP: "40-80",
  },
  "EU GMP - Grade C (ISO 7 at Rest & ISO 7 in Oper.)": {
    EUGMP: "80-120",
  },
  "EU GMP - Grade B (ISO 5 at Rest & ISO 7 in Oper.)": {
    EUGMP: "120-180",
  },
  "EU GMP - Grade A (ISO 5 at Rest & ISO 5 in Oper.)": {
    EUGMP: "180-240",
  },
  
  // TGA Classifications
  "3500": {
    TGA: "15-40",
  },
  "350": {
    TGA: "40-80",
  },
  "35": {
    TGA: "80-130",
  },
  "3.5": {
    TGA: "130-300",
  },
  "0.35": {
    TGA: "180-400",
  },
  "0.035": {
    TGA: "240-500",
  },
  
  // BS 5295 Classifications
  "K": {
    BS5295: "12-25",
  },
  "J": {
    BS5295: "30-80",
  },
  "G or H": {
    BS5295: "120-180",
  },
  "E or F": {
    BS5295: "240-350",
  },
  "D": {
    BS5295: "350-600",
  },
  "C": {
    BS5295: "400-600",
  },
  
  // GERMANY VD Classifications
  "6": {
    GERMANYVD: "20-60",
  },
  "5": {
    GERMANYVD: "60-120",
  },
  "4": {
    GERMANYVD: "120-180",
  },
  "3": {
    GERMANYVD: "180-240",
  },
  "2": {
    GERMANYVD: "240-360",
  },
  "1": {
    GERMANYVD: "360-550",
  },
  "0": {
    GERMANYVD: "400-600",
  },
  
  // AFNOR X44101 Classifications
  "4000000": {
    AFNORX44101: "20-50",
  },
  "400000": {
    AFNORX44101: "60-120",
  },
  "4000": {
    AFNORX44101: "120-240",
  },
  
  // NC-Non Classified Classifications
  "20µ": {
    NC: "5-15",
  },
  "15µ": {
    NC: "5-20",
  },
  "10µ": {
    NC: "10-25",
  },
  "5µ": {
    NC: "15-25",
  },
  "1µ": {
    NC: "15-25",
  },
  "No-Filtration": {
    NC: "5-10",
  },
  "Positive Pressure": {
    NC: "5-10",
  },
  "Exhaust": {
    NC: "",
  },
  
  // ISO 14698 Classifications
  "BSL - 1": {
    ISO14698: "20-40",
  },
  "BSL - 2": {
    ISO14698: "60-120",
  },
  "BSL - 3": {
    ISO14698: "120-240",
  },
  "BSL - 4": {
    ISO14698: "180-300",
  },
  
  // SCHEDULE M Classifications
  "GRADE CLASS A": {
    SCHEDULEM: "80-100",
  },
  "GRADE CLASS B": {
    SCHEDULEM: "60-80",
  },
  "GRADE CLASS C": {
    SCHEDULEM: "40-60",
  },
  "GRADE CLASS D": {
    SCHEDULEM: "20-40",
  },
}

// Helper function to get air changes range for a classification and standard
export function getAirChangesRange(classification: string, standard: string): { min: number; max: number; options: string[] } {
  const airChangeValue = classAirChargesData[classification]?.[standard] || classAirChargesData[classification]?.EUGMP || "N/A"
  
  if (typeof airChangeValue === "string") {
    if (airChangeValue.includes("-")) {
      // Range format like "20-25"
      const [min, max] = airChangeValue.split("-").map(Number)
      const options = []
      for (let i = min; i <= max; i++) {
        options.push(i.toString())
      }
      return { min, max, options }
    } else if (airChangeValue === "ULPA") {
      // ULPA doesn't have air changes, it's a filter type
      return { min: 0, max: 0, options: ["ULPA"] }
    } else {
      // Single value like "20"
      const value = Number(airChangeValue)
      return { min: value, max: value, options: [value.toString()] }
    }
  }
  
  return { min: 0, max: 0, options: ["N/A"] }
}

// Helper function to get default air changes value based on system type
export function getDefaultAirChanges(classification: string, standard: string, systemType: string): string {
  const range = getAirChangesRange(classification, standard)
  
  if (range.options.includes("ULPA")) {
    return "ULPA"
  }
  
  if (systemType === "Air-Conditioning System") {
    // For air-conditioning system, use the highest value
    return range.max.toString()
  } else if (systemType === "Ventilation System") {
    // For ventilation system, use the lowest value
    return range.min.toString()
  }
  
  return range.options[0] || "N/A"
}
