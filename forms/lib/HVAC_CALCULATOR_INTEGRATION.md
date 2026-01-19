# HVAC Calculator Excel Match Integration

## Overview

This document describes the integration of the Python HVAC calculation engine (converted to TypeScript) into the Clean Room project. The new calculator matches Excel formulas exactly and provides both room-level and zone-level calculations.

## Files Created/Modified

### New Files
1. **`forms/lib/hvac-calculator-excel-match.ts`**
   - TypeScript implementation of the Python HVAC calculator
   - Provides `computeRoom()` for individual room calculations
   - Provides `computeZone()` for zone aggregation (AK-AV calculations)
   - Matches Excel formulas exactly

### Modified Files
1. **`forms/lib/bod-service.ts`**
   - Updated to use the new Excel Match calculator
   - Now returns both room results and zone results
   - Enhanced summary includes zone aggregation data

2. **`forms/app/api/bod/calculate/route.ts`**
   - Updated GET endpoint to use new calculator for testing

## Key Features

### Room Calculations (X-AH)
- **X**: Area in square feet
- **Y**: Volume in cubic feet
- **Z**: Room CFM
- **AA**: Fresh Air CFM
- **AB**: Exhaust Air CFM
- **AC**: CFM calculation
- **AD**: Dehumidification CFM
- **AE**: Resultant CFM
- **AF**: Terminal Supply Module area
- **AG**: Resultant Cooling Load in TR
- **AI**: Room AC load in TR
- **AJ**: CFM AC load in TR
- **AR**: Filtration stages
- **AM**: Static pressure (Pa)

### Zone Aggregation (AK-AV)
- **AK**: AHU CFM (sum of all rooms, rounded to 250)
- **AL_W/AL_H/AL_L**: AHU dimensions (mm)
- **AM**: Maximum static pressure
- **AN**: Blower model selection
- **AO**: Motor HP selection
- **AP**: Coil rows calculation
- **AQ**: Sum of AG values
- **AR**: Maximum filtration stages
- **AS/AT/AV**: Calculated values for sizing

## Usage

### Basic Room Calculation

```typescript
import { computeRoom, RoomInput } from './lib/hvac-calculator-excel-match'

const roomInput: RoomInput = {
  roomName: "Clean Room 1",
  length_m: 6,
  width_m: 5,
  height_m: 3,
  people: 4,
  eqpt_kw: 2,
  light_w_sqft: 1.5,
  inf_hr: 0.5,
  fresh_air_factor: 20, // percent
  exhaust_factor: 10, // percent
  tC_inside: 23, // or "Amb" for ambient
  rh_inside: 55, // percent
  t_out_maxC: 35,
  rh_out: 60, // percent
  klass: "ISO 7",
  acph: 10,
  chilled_or_dx: "C" // "C" for Chilled, "D" for DX
}

const roomResult = computeRoom(roomInput)
```

### Zone Calculation

```typescript
import { computeZone } from './lib/hvac-calculator-excel-match'

const roomResults = [roomResult1, roomResult2, roomResult3]
const zoneResult = computeZone(roomResults)
```

### Using BOD Service

```typescript
import { bodService } from './lib/bod-service'

const calculationId = await bodService.startCalculation({
  formData: {
    projectName: "Project Name",
    customerName: "Customer Name",
    classification: "ISO 7",
    maxTemp: "35",
    minTemp: "25",
    maxRh: "60",
    minRh: "45",
    coolingMethod: "C",
    // ... other form data
  },
  roomData: [
    {
      roomName: "Room 1",
      length: 6,
      width: 5,
      height: 3,
      occupancy: 4,
      equipmentLoadKW: 2,
      lightingLoadWSqft: 1.5,
      freshAirPercentage: 20,
      exhaustAirCFM: 0,
      inTempC: 23,
      requiredRH: 55,
      outTempC: 35,
      outsideRH: 60,
      classification: "ISO 7",
      noOfAirChanges: 10,
      // ... other room data
    }
  ]
})

// Check status
const status = bodService.getCalculation(calculationId)
```

## API Endpoints

### POST `/forms/api/bod/calculate`
Starts a BOD calculation asynchronously.

**Request:**
```json
{
  "formData": { /* form data object */ },
  "roomData": [ /* array of room objects */ ],
  "calculationId": "optional-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "calculation-id",
    "status": "pending"
  }
}
```

### GET `/forms/api/bod/status?id={calculationId}`
Gets the status and results of a calculation.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "calculation-id",
    "status": "completed",
    "progress": 100,
    "result": {
      "summary": { /* summary object */ },
      "roomResults": [ /* array of room results */ ],
      "zoneResult": { /* zone aggregation result */ }
    }
  }
}
```

## Key Differences from Old Calculator

1. **Excel Formula Match**: All calculations match Excel formulas exactly
2. **Zone Aggregation**: Includes zone-level calculations (AK-AV)
3. **Ambient Support**: Properly handles "Amb" (ambient) temperature mode
4. **Filtration Stages**: Automatically calculates based on classification and temperature mode
5. **Static Pressure**: Automatically determined from classification
6. **AHU Sizing**: Includes width, height, and length calculations
7. **Blower & Motor**: Automatic selection based on CFM and static pressure

## Classification Mappings

The calculator supports the following classifications:
- ISO 5 / GRADE A / 100
- ISO 6 / GRADE B / 1K / 1000
- ISO 7 / GRADE C / 10K / 10000
- ISO 8 / GRADE D / 100K / 100000
- NC / 20 MICRON / 5 MICRON / N C

Each classification has different:
- Filtration stages (temp vs ambient)
- Static pressure requirements
- Terminal supply module divisors

## Notes

- The old calculator (`hvac-calculator-engine.ts`) is still available for backward compatibility
- The new calculator is now the default for BOD calculations
- All calculations use metric inputs but may output in mixed units (CFM, ft², etc.) to match Excel format
- Zone calculations aggregate multiple rooms into a single AHU configuration
