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

// Comprehensive list of all country codes with accurate data
const countryCodes = [
  { code: "+1", country: "US", name: "United States", flag: "🇺🇸" },
  { code: "+1", country: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "+7", country: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "+7", country: "KZ", name: "Kazakhstan", flag: "🇰🇿" },
  { code: "+20", country: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "+27", country: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "+30", country: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "+31", country: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "+32", country: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "+33", country: "FR", name: "France", flag: "🇫🇷" },
  { code: "+34", country: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "+36", country: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "+39", country: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "+40", country: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "+41", country: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "+43", country: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "+44", country: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+45", country: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "+46", country: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "+48", country: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "+49", country: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "+51", country: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "+52", country: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "+53", country: "CU", name: "Cuba", flag: "🇨🇺" },
  { code: "+54", country: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "+55", country: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "+56", country: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "+58", country: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "+60", country: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "+61", country: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "+62", country: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "+63", country: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "+64", country: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "+65", country: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "+66", country: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "+81", country: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "+84", country: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "+86", country: "CN", name: "China", flag: "🇨🇳" },
  { code: "+90", country: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "+91", country: "IN", name: "India", flag: "🇮🇳" },
  { code: "+92", country: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "+93", country: "AF", name: "Afghanistan", flag: "🇦🇫" },
  { code: "+94", country: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "+95", country: "MM", name: "Myanmar", flag: "🇲🇲" },
  { code: "+98", country: "IR", name: "Iran", flag: "🇮🇷" },
  { code: "+212", country: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "+213", country: "DZ", name: "Algeria", flag: "🇩🇿" },
  { code: "+216", country: "TN", name: "Tunisia", flag: "🇹🇳" },
  { code: "+218", country: "LY", name: "Libya", flag: "🇱🇾" },
  { code: "+220", country: "GM", name: "Gambia", flag: "🇬🇲" },
  { code: "+221", country: "SN", name: "Senegal", flag: "🇸🇳" },
  { code: "+222", country: "MR", name: "Mauritania", flag: "🇲🇷" },
  { code: "+223", country: "ML", name: "Mali", flag: "🇲🇱" },
  { code: "+224", country: "GN", name: "Guinea", flag: "🇬🇳" },
  { code: "+225", country: "CI", name: "Ivory Coast", flag: "🇨🇮" },
  { code: "+226", country: "BF", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "+227", country: "NE", name: "Niger", flag: "🇳🇪" },
  { code: "+228", country: "TG", name: "Togo", flag: "🇹🇬" },
  { code: "+229", country: "BJ", name: "Benin", flag: "🇧🇯" },
  { code: "+230", country: "MU", name: "Mauritius", flag: "🇲🇺" },
  { code: "+231", country: "LR", name: "Liberia", flag: "🇱🇷" },
  { code: "+232", country: "SL", name: "Sierra Leone", flag: "🇸🇱" },
  { code: "+233", country: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "+234", country: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "+235", country: "TD", name: "Chad", flag: "🇹🇩" },
  { code: "+236", country: "CF", name: "Central African Republic", flag: "🇨🇫" },
  { code: "+237", country: "CM", name: "Cameroon", flag: "🇨🇲" },
  { code: "+238", country: "CV", name: "Cape Verde", flag: "🇨🇻" },
  { code: "+239", country: "ST", name: "São Tomé and Príncipe", flag: "🇸🇹" },
  { code: "+240", country: "GQ", name: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "+241", country: "GA", name: "Gabon", flag: "🇬🇦" },
  { code: "+242", country: "CG", name: "Republic of the Congo", flag: "🇨🇬" },
  { code: "+243", country: "CD", name: "Democratic Republic of the Congo", flag: "🇨🇩" },
  { code: "+244", country: "AO", name: "Angola", flag: "🇦🇴" },
  { code: "+245", country: "GW", name: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "+246", country: "IO", name: "British Indian Ocean Territory", flag: "🇮🇴" },
  { code: "+247", country: "AC", name: "Ascension Island", flag: "🇦🇨" },
  { code: "+248", country: "SC", name: "Seychelles", flag: "🇸🇨" },
  { code: "+249", country: "SD", name: "Sudan", flag: "🇸🇩" },
  { code: "+250", country: "RW", name: "Rwanda", flag: "🇷🇼" },
  { code: "+251", country: "ET", name: "Ethiopia", flag: "🇪🇹" },
  { code: "+252", country: "SO", name: "Somalia", flag: "🇸🇴" },
  { code: "+253", country: "DJ", name: "Djibouti", flag: "🇩🇯" },
  { code: "+254", country: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "+255", country: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "+256", country: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "+257", country: "BI", name: "Burundi", flag: "🇧🇮" },
  { code: "+258", country: "MZ", name: "Mozambique", flag: "🇲🇿" },
  { code: "+260", country: "ZM", name: "Zambia", flag: "🇿🇲" },
  { code: "+261", country: "MG", name: "Madagascar", flag: "🇲🇬" },
  { code: "+262", country: "RE", name: "Réunion", flag: "🇷🇪" },
  { code: "+263", country: "ZW", name: "Zimbabwe", flag: "🇿🇼" },
  { code: "+264", country: "NA", name: "Namibia", flag: "🇳🇦" },
  { code: "+265", country: "MW", name: "Malawi", flag: "🇲🇼" },
  { code: "+266", country: "LS", name: "Lesotho", flag: "🇱🇸" },
  { code: "+267", country: "BW", name: "Botswana", flag: "🇧🇼" },
  { code: "+268", country: "SZ", name: "Eswatini", flag: "🇸🇿" },
  { code: "+269", country: "KM", name: "Comoros", flag: "🇰🇲" },
  { code: "+290", country: "SH", name: "Saint Helena", flag: "🇸🇭" },
  { code: "+291", country: "ER", name: "Eritrea", flag: "🇪🇷" },
  { code: "+297", country: "AW", name: "Aruba", flag: "🇦🇼" },
  { code: "+298", country: "FO", name: "Faroe Islands", flag: "🇫🇴" },
  { code: "+299", country: "GL", name: "Greenland", flag: "🇬🇱" },
  { code: "+350", country: "GI", name: "Gibraltar", flag: "🇬🇮" },
  { code: "+351", country: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "+352", country: "LU", name: "Luxembourg", flag: "🇱🇺" },
  { code: "+353", country: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "+354", country: "IS", name: "Iceland", flag: "🇮🇸" },
  { code: "+355", country: "AL", name: "Albania", flag: "🇦🇱" },
  { code: "+356", country: "MT", name: "Malta", flag: "🇲🇹" },
  { code: "+357", country: "CY", name: "Cyprus", flag: "🇨🇾" },
  { code: "+358", country: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "+359", country: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "+370", country: "LT", name: "Lithuania", flag: "🇱🇹" },
  { code: "+371", country: "LV", name: "Latvia", flag: "🇱🇻" },
  { code: "+372", country: "EE", name: "Estonia", flag: "🇪🇪" },
  { code: "+373", country: "MD", name: "Moldova", flag: "🇲🇩" },
  { code: "+374", country: "AM", name: "Armenia", flag: "🇦🇲" },
  { code: "+375", country: "BY", name: "Belarus", flag: "🇧🇾" },
  { code: "+376", country: "AD", name: "Andorra", flag: "🇦🇩" },
  { code: "+377", country: "MC", name: "Monaco", flag: "🇲🇨" },
  { code: "+378", country: "SM", name: "San Marino", flag: "🇸🇲" },
  { code: "+380", country: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "+381", country: "RS", name: "Serbia", flag: "🇷🇸" },
  { code: "+382", country: "ME", name: "Montenegro", flag: "🇲🇪" },
  { code: "+383", country: "XK", name: "Kosovo", flag: "🇽🇰" },
  { code: "+385", country: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "+386", country: "SI", name: "Slovenia", flag: "🇸🇮" },
  { code: "+387", country: "BA", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "+389", country: "MK", name: "North Macedonia", flag: "🇲🇰" },
  { code: "+420", country: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "+421", country: "SK", name: "Slovakia", flag: "🇸🇰" },
  { code: "+423", country: "LI", name: "Liechtenstein", flag: "🇱🇮" },
  { code: "+500", country: "FK", name: "Falkland Islands", flag: "🇫🇰" },
  { code: "+501", country: "BZ", name: "Belize", flag: "🇧🇿" },
  { code: "+502", country: "GT", name: "Guatemala", flag: "🇬🇹" },
  { code: "+503", country: "SV", name: "El Salvador", flag: "🇸🇻" },
  { code: "+504", country: "HN", name: "Honduras", flag: "🇭🇳" },
  { code: "+505", country: "NI", name: "Nicaragua", flag: "🇳🇮" },
  { code: "+506", country: "CR", name: "Costa Rica", flag: "🇨🇷" },
  { code: "+507", country: "PA", name: "Panama", flag: "🇵🇦" },
  { code: "+508", country: "PM", name: "Saint Pierre and Miquelon", flag: "🇵🇲" },
  { code: "+509", country: "HT", name: "Haiti", flag: "🇭🇹" },
  { code: "+590", country: "GP", name: "Guadeloupe", flag: "🇬🇵" },
  { code: "+591", country: "BO", name: "Bolivia", flag: "🇧🇴" },
  { code: "+592", country: "GY", name: "Guyana", flag: "🇬🇾" },
  { code: "+593", country: "EC", name: "Ecuador", flag: "🇪🇨" },
  { code: "+594", country: "GF", name: "French Guiana", flag: "🇬🇫" },
  { code: "+595", country: "PY", name: "Paraguay", flag: "🇵🇾" },
  { code: "+596", country: "MQ", name: "Martinique", flag: "🇲🇶" },
  { code: "+597", country: "SR", name: "Suriname", flag: "🇸🇷" },
  { code: "+598", country: "UY", name: "Uruguay", flag: "🇺🇾" },
  { code: "+599", country: "CW", name: "Curaçao", flag: "🇨🇼" },
  { code: "+670", country: "TL", name: "East Timor", flag: "🇹🇱" },
  { code: "+672", country: "NF", name: "Norfolk Island", flag: "🇳🇫" },
  { code: "+673", country: "BN", name: "Brunei", flag: "🇧🇳" },
  { code: "+674", country: "NR", name: "Nauru", flag: "🇳🇷" },
  { code: "+675", country: "PG", name: "Papua New Guinea", flag: "🇵🇬" },
  { code: "+676", country: "TO", name: "Tonga", flag: "🇹🇴" },
  { code: "+677", country: "SB", name: "Solomon Islands", flag: "🇸🇧" },
  { code: "+678", country: "VU", name: "Vanuatu", flag: "🇻🇺" },
  { code: "+679", country: "FJ", name: "Fiji", flag: "🇫🇯" },
  { code: "+680", country: "PW", name: "Palau", flag: "🇵🇼" },
  { code: "+681", country: "WF", name: "Wallis and Futuna", flag: "🇼🇫" },
  { code: "+682", country: "CK", name: "Cook Islands", flag: "🇨🇰" },
  { code: "+683", country: "NU", name: "Niue", flag: "🇳🇺" },
  { code: "+684", country: "AS", name: "American Samoa", flag: "🇦🇸" },
  { code: "+685", country: "WS", name: "Samoa", flag: "🇼🇸" },
  { code: "+686", country: "KI", name: "Kiribati", flag: "🇰🇮" },
  { code: "+687", country: "NC", name: "New Caledonia", flag: "🇳🇨" },
  { code: "+688", country: "TV", name: "Tuvalu", flag: "🇹🇻" },
  { code: "+689", country: "PF", name: "French Polynesia", flag: "🇵🇫" },
  { code: "+690", country: "TK", name: "Tokelau", flag: "🇹🇰" },
  { code: "+691", country: "FM", name: "Micronesia", flag: "🇫🇲" },
  { code: "+692", country: "MH", name: "Marshall Islands", flag: "🇲🇭" },
  { code: "+850", country: "KP", name: "North Korea", flag: "🇰🇵" },
  { code: "+852", country: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { code: "+853", country: "MO", name: "Macau", flag: "🇲🇴" },
  { code: "+855", country: "KH", name: "Cambodia", flag: "🇰🇭" },
  { code: "+856", country: "LA", name: "Laos", flag: "🇱🇦" },
  { code: "+880", country: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "+886", country: "TW", name: "Taiwan", flag: "🇹🇼" },
  { code: "+960", country: "MV", name: "Maldives", flag: "🇲🇻" },
  { code: "+961", country: "LB", name: "Lebanon", flag: "🇱🇧" },
  { code: "+962", country: "JO", name: "Jordan", flag: "🇯🇴" },
  { code: "+963", country: "SY", name: "Syria", flag: "🇸🇾" },
  { code: "+964", country: "IQ", name: "Iraq", flag: "🇮🇶" },
  { code: "+965", country: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "+966", country: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+967", country: "YE", name: "Yemen", flag: "🇾🇪" },
  { code: "+968", country: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "+970", country: "PS", name: "Palestine", flag: "🇵🇸" },
  { code: "+971", country: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+972", country: "IL", name: "Israel", flag: "🇮🇱" },
  { code: "+973", country: "BH", name: "Bahrain", flag: "🇧🇭" },
  { code: "+974", country: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "+975", country: "BT", name: "Bhutan", flag: "🇧🇹" },
  { code: "+976", country: "MN", name: "Mongolia", flag: "🇲🇳" },
  { code: "+977", country: "NP", name: "Nepal", flag: "🇳🇵" },
  { code: "+992", country: "TJ", name: "Tajikistan", flag: "🇹🇯" },
  { code: "+993", country: "TM", name: "Turkmenistan", flag: "🇹🇲" },
  { code: "+994", country: "AZ", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "+995", country: "GE", name: "Georgia", flag: "🇬🇪" },
  { code: "+996", country: "KG", name: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "+998", country: "UZ", name: "Uzbekistan", flag: "🇺🇿" }
]
  .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by country name for keyboard navigation

// Log the number of countries for verification
console.log(`📞 Phone Input: ${countryCodes.length} countries loaded`)

export function PhoneInputField({
  value = "",
  onChange,
  placeholder = "Enter phone number",
  className,
  error,
  disabled
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState("US") // Store country code instead of phone code
  
  // Parse existing value to extract country code and number
  React.useEffect(() => {
    if (value) {
      const matchedCountry = countryCodes.find(country => value.startsWith(country.code))
      if (matchedCountry) {
        setSelectedCountry(matchedCountry.country)
      }
    }
  }, [value])

  const currentCountry = countryCodes.find(country => country.country === selectedCountry) || countryCodes[0]
  const phoneNumber = value ? value.replace(currentCountry.code, "").trim() : ""

  const handlePhoneChange = (phoneValue: string) => {
    const cleanPhone = phoneValue.replace(/[^\d\s\-\(\)]/g, "") // Allow digits, spaces, dashes, parentheses
    const fullPhone = cleanPhone ? `${currentCountry.code} ${cleanPhone}` : ""
    onChange?.(fullPhone)
  }

  const handleCountryChange = (newCountryCode: string) => {
    setSelectedCountry(newCountryCode)
    const newCountry = countryCodes.find(country => country.country === newCountryCode)
    if (newCountry) {
      const cleanPhone = phoneNumber.trim()
      const fullPhone = cleanPhone ? `${newCountry.code} ${cleanPhone}` : ""
      onChange?.(fullPhone)
    }
  }

  return (
    <div className={cn("flex", className)}>
      <Select value={selectedCountry} onValueChange={handleCountryChange} disabled={disabled}>
        <SelectTrigger className="w-24 rounded-r-none border-r-0 focus:z-10">
          <SelectValue>
            <span className="flex items-center gap-1">
              <span>{currentCountry.flag}</span>
              <span className="text-xs">{currentCountry.code}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-60" position="popper">
          {countryCodes.map((country, index) => (
            <SelectItem 
              key={`${country.country}-${index}`} 
              value={country.country}
              textValue={country.name} // This enables keyboard search by country name
            >
              <span className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span className="text-xs">{country.code}</span>
                <span className="text-xs text-muted-foreground truncate">{country.name}</span>
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