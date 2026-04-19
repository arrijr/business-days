export type HolidayType = "public" | "bank" | "school" | "optional" | "observance";

export interface Holiday {
  date: string;
  name: string;
  local_name: string;
  type: HolidayType;
  global: boolean;
  regions: string[] | null;
}

export interface SkippedDate {
  date: string;
  reason: "public_holiday" | "weekend";
}

export interface HolidaysResponse {
  country: string;
  country_name: string;
  year: number;
  count: number;
  holidays: Holiday[];
}

export interface IsBusinessDayResponse {
  date: string;
  country: string;
  is_business_day: boolean;
  reason: "public_holiday" | "weekend" | null;
  holiday_name: string | null;
}

export interface CalculateResponse {
  start_date: string;
  country: string;
  days_requested: number;
  direction: "forward" | "backward";
  result_date: string;
  skipped_dates: SkippedDate[];
}
