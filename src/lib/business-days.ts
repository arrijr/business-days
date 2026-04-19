import { Holiday, SkippedDate } from "./types";

export function formatDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISODate(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== m - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }
  return dt;
}

export function isWeekend(date: Date): boolean {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
}

export function findHoliday(date: Date, holidays: Holiday[]): Holiday | null {
  const iso = formatDate(date);
  return holidays.find((h) => h.date === iso && h.type === "public" && h.global) ?? null;
}

export function isBusinessDay(date: Date, holidays: Holiday[]): boolean {
  if (isWeekend(date)) return false;
  return findHoliday(date, holidays) === null;
}

export function addDays(date: Date, n: number): Date {
  const d = new Date(date.getTime());
  d.setUTCDate(d.getUTCDate() + n);
  return d;
}

export function addBusinessDays(
  start: Date,
  days: number,
  holidays: Holiday[],
  direction: "forward" | "backward"
): { resultDate: Date; skippedDates: SkippedDate[] } {
  const step = direction === "forward" ? 1 : -1;
  const skipped: SkippedDate[] = [];
  let current = new Date(start.getTime());
  let counted = 0;

  while (counted < days) {
    current = addDays(current, step);
    if (isWeekend(current)) {
      skipped.push({ date: formatDate(current), reason: "weekend" });
      continue;
    }
    const h = findHoliday(current, holidays);
    if (h) {
      skipped.push({ date: formatDate(current), reason: "public_holiday" });
      continue;
    }
    counted++;
  }

  return { resultDate: current, skippedDates: skipped };
}
