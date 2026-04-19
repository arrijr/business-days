import { NextRequest, NextResponse } from "next/server";
import { getHolidaysCached } from "@/lib/cache";
import { isSupportedCountry } from "@/lib/countries";
import { checkRateLimit } from "@/lib/ratelimit";
import {
  buildHeaders,
  errorResponse,
  getClientIdentifier,
  handleUnknownError,
} from "@/lib/response";
import { CalculateResponse, Holiday } from "@/lib/types";
import { addBusinessDays, formatDate, parseISODate } from "@/lib/business-days";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startStr = searchParams.get("start") ?? "";
    const daysStr = searchParams.get("days") ?? "";
    const countryRaw = searchParams.get("country") ?? "";
    const directionRaw = (searchParams.get("direction") ?? "forward").toLowerCase();
    const country = countryRaw.toUpperCase();

    const start = parseISODate(startStr);
    if (!start) {
      return errorResponse("INVALID_DATE", "Invalid date format — use YYYY-MM-DD", 400);
    }
    const days = Number(daysStr);
    if (!Number.isInteger(days) || days < 1 || days > 365) {
      return errorResponse(
        "INVALID_PARAMETER",
        "Parameter 'days' must be an integer between 1 and 365",
        400
      );
    }
    if (!/^[A-Z]{2}$/.test(country) || !isSupportedCountry(country)) {
      return errorResponse(
        "COUNTRY_NOT_SUPPORTED",
        `Country code '${countryRaw}' is not supported`,
        400
      );
    }
    if (directionRaw !== "forward" && directionRaw !== "backward") {
      return errorResponse(
        "INVALID_PARAMETER",
        "Parameter 'direction' must be 'forward' or 'backward'",
        400
      );
    }
    const direction = directionRaw as "forward" | "backward";

    const rl = await checkRateLimit(getClientIdentifier(req));
    if (!rl.success) {
      return errorResponse("RATE_LIMIT_EXCEEDED", "Rate limit exceeded", 429, {
        "X-RateLimit-Remaining": "0",
      });
    }

    const startYear = start.getUTCFullYear();
    const offsetYear = direction === "forward" ? startYear + 1 : startYear - 1;

    const yearsToLoad = new Set<number>([startYear]);
    if (offsetYear >= 2020 && offsetYear <= 2030) yearsToLoad.add(offsetYear);

    const results = await Promise.all(
      [...yearsToLoad].map((y) => getHolidaysCached(country, y))
    );
    const holidays: Holiday[] = results.flatMap((r) => r.holidays);
    const anyMiss = results.some((r) => !r.cached);

    const { resultDate, skippedDates } = addBusinessDays(
      start,
      days,
      holidays,
      direction
    );

    const body: CalculateResponse = {
      start_date: startStr,
      country,
      days_requested: days,
      direction,
      result_date: formatDate(resultDate),
      skipped_dates: skippedDates,
    };

    return NextResponse.json(body, {
      headers: buildHeaders({
        cache: anyMiss ? "MISS" : "HIT",
        remaining: rl.remaining,
      }),
    });
  } catch (err) {
    return handleUnknownError(err);
  }
}
