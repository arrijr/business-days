import { Holiday, HolidayType } from "./types";
import { ServiceUnavailableError } from "./errors";

interface NagerHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed?: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear?: number | null;
  types: string[];
}

function getEndpoint(): string {
  return process.env.NAGER_DATE_ENDPOINT || "https://date.nager.at/api/v3";
}

function normalizeType(types: string[] | undefined): HolidayType {
  const first = (types?.[0] ?? "Public").toLowerCase();
  if (first === "public" || first === "bank" || first === "school" || first === "optional" || first === "observance") {
    return first;
  }
  return "public";
}

export async function fetchHolidays(year: number, country: string): Promise<Holiday[]> {
  const url = `${getEndpoint()}/publicholidays/${year}/${country}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { accept: "application/json" },
    });
    if (!res.ok) {
      throw new ServiceUnavailableError(`Nager.Date returned ${res.status}`);
    }
    const raw = (await res.json()) as NagerHoliday[];
    return raw.map((h) => ({
      date: h.date,
      name: h.name,
      local_name: h.localName,
      type: normalizeType(h.types),
      global: h.global,
      regions: h.counties && h.counties.length > 0 ? h.counties : null,
    }));
  } catch (err) {
    if (err instanceof ServiceUnavailableError) throw err;
    throw new ServiceUnavailableError("Failed to reach Nager.Date");
  } finally {
    clearTimeout(timeout);
  }
}

export async function pingNager(): Promise<boolean> {
  const url = `${getEndpoint()}/publicholidays/2026/DE`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { accept: "application/json" } });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
