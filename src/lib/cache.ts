import { getRedis } from "./redis";
import { Holiday } from "./types";
import { fetchHolidays } from "./nager";

export function ttlUntilEndOfYear(year: number): number {
  const now = Math.floor(Date.now() / 1000);
  const endOfYear = Math.floor(Date.UTC(year, 11, 31, 23, 59, 59) / 1000);
  const diff = endOfYear - now;
  return diff > 60 ? diff : 60 * 60 * 24;
}

export function holidaysKey(country: string, year: number): string {
  return `holidays:${country}:${year}`;
}

export async function getHolidaysCached(
  country: string,
  year: number
): Promise<{ holidays: Holiday[]; cached: boolean }> {
  const redis = getRedis();
  const key = holidaysKey(country, year);
  const cached = await redis.get<Holiday[]>(key);
  if (cached && Array.isArray(cached)) {
    return { holidays: cached, cached: true };
  }
  const holidays = await fetchHolidays(year, country);
  await redis.set(key, holidays, { ex: ttlUntilEndOfYear(year) });
  return { holidays, cached: false };
}
