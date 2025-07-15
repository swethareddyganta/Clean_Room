import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Fetches the all-time highest and lowest temperatures for a given location using Meteostat API via RapidAPI.
 * @param {number} lat - Latitude of the location
 * @param {number} lon - Longitude of the location
 * @param {string} apiKey - RapidAPI key for Meteostat
 * @returns {Promise<{ max: number | null, min: number | null }>} - The all-time max and min temperatures (in Celsius)
 */
export async function fetchAllTimeMaxMinTemperature(lat: number, lon: number, apiKey: string): Promise<{ max: number | null, min: number | null }> {
  // 1. Find nearest station
  const stationRes = await fetch(`https://meteostat.p.rapidapi.com/stations/nearby?lat=${lat}&lon=${lon}&limit=1`, {
    headers: {
      'x-rapidapi-host': 'meteostat.p.rapidapi.com',
      'x-rapidapi-key': apiKey,
    },
  })
  const stationData = await stationRes.json()
  const stationId = stationData?.data?.[0]?.id
  if (!stationId) return { max: null, min: null }

  // 2. Fetch daily data in chunks (Meteostat may limit range per request)
  // We'll try to fetch from 1970-01-01 to today in 10-year chunks
  const startYear = 1970
  const endYear = new Date().getFullYear()
  let maxTemp: number | null = null
  let minTemp: number | null = null

  for (let year = startYear; year <= endYear; year += 10) {
    const start = `${year}-01-01`
    const end = `${Math.min(year + 9, endYear)}-12-31`
    const dailyRes = await fetch(`https://meteostat.p.rapidapi.com/stations/daily?station=${stationId}&start=${start}&end=${end}`, {
      headers: {
        'x-rapidapi-host': 'meteostat.p.rapidapi.com',
        'x-rapidapi-key': apiKey,
      },
    })
    const dailyData = await dailyRes.json()
    if (Array.isArray(dailyData?.data)) {
      for (const day of dailyData.data) {
        if (typeof day.tmax === 'number') {
          if (maxTemp === null || day.tmax > maxTemp) maxTemp = day.tmax
        }
        if (typeof day.tmin === 'number') {
          if (minTemp === null || day.tmin < minTemp) minTemp = day.tmin
        }
      }
    }
  }

  return { max: maxTemp, min: minTemp }
}
