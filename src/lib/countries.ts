export const COUNTRY_NAMES: Record<string, string> = {
  AD: "Andorra", AL: "Albania", AM: "Armenia", AR: "Argentina", AT: "Austria",
  AU: "Australia", AX: "Åland Islands", BA: "Bosnia and Herzegovina", BB: "Barbados",
  BE: "Belgium", BG: "Bulgaria", BJ: "Benin", BO: "Bolivia", BR: "Brazil",
  BS: "Bahamas", BW: "Botswana", BY: "Belarus", BZ: "Belize", CA: "Canada",
  CH: "Switzerland", CL: "Chile", CN: "China", CO: "Colombia", CR: "Costa Rica",
  CU: "Cuba", CY: "Cyprus", CZ: "Czechia", DE: "Germany", DK: "Denmark",
  DO: "Dominican Republic", EC: "Ecuador", EE: "Estonia", EG: "Egypt",
  ES: "Spain", FI: "Finland", FO: "Faroe Islands", FR: "France", GA: "Gabon",
  GB: "United Kingdom", GD: "Grenada", GE: "Georgia", GG: "Guernsey", GI: "Gibraltar",
  GL: "Greenland", GM: "Gambia", GR: "Greece", GT: "Guatemala", GY: "Guyana",
  HN: "Honduras", HR: "Croatia", HT: "Haiti", HU: "Hungary", ID: "Indonesia",
  IE: "Ireland", IM: "Isle of Man", IS: "Iceland", IT: "Italy", JE: "Jersey",
  JM: "Jamaica", JP: "Japan", KG: "Kyrgyzstan", KR: "South Korea", KZ: "Kazakhstan",
  LI: "Liechtenstein", LS: "Lesotho", LT: "Lithuania", LU: "Luxembourg", LV: "Latvia",
  MA: "Morocco", MC: "Monaco", MD: "Moldova", ME: "Montenegro", MG: "Madagascar",
  MK: "North Macedonia", MN: "Mongolia", MS: "Montserrat", MT: "Malta", MX: "Mexico",
  MZ: "Mozambique", NA: "Namibia", NE: "Niger", NG: "Nigeria", NI: "Nicaragua",
  NL: "Netherlands", NO: "Norway", NZ: "New Zealand", PA: "Panama", PE: "Peru",
  PG: "Papua New Guinea", PH: "Philippines", PL: "Poland", PR: "Puerto Rico",
  PT: "Portugal", PY: "Paraguay", RO: "Romania", RS: "Serbia", RU: "Russia",
  SE: "Sweden", SG: "Singapore", SI: "Slovenia", SJ: "Svalbard and Jan Mayen",
  SK: "Slovakia", SM: "San Marino", SR: "Suriname", SV: "El Salvador",
  TN: "Tunisia", TR: "Turkey", UA: "Ukraine", US: "United States", UY: "Uruguay",
  VA: "Vatican City", VE: "Venezuela", VN: "Vietnam", ZA: "South Africa",
  ZW: "Zimbabwe",
};

export function isSupportedCountry(code: string): boolean {
  return code in COUNTRY_NAMES;
}

export function getCountryName(code: string): string {
  return COUNTRY_NAMES[code] ?? code;
}
