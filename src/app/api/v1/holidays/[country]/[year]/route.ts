import { NextRequest, NextResponse } from "next/server";
import { getHolidaysCached } from "@/lib/cache";
import { isSupportedCountry, getCountryName } from "@/lib/countries";
import { checkRateLimit } from "@/lib/ratelimit";
import {
  buildHeaders,
  errorResponse,
  getClientIdentifier,
  handleUnknownError,
} from "@/lib/response";
import { HolidaysResponse } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ country: string; year: string }> }
) {
  try {
    const { country: countryRaw, year: yearRaw } = await ctx.params;
    const country = countryRaw.toUpperCase();
    const year = Number(yearRaw);

    if (!/^[A-Z]{2}$/.test(country) || !isSupportedCountry(country)) {
      return errorResponse(
        "COUNTRY_NOT_SUPPORTED",
        `Country code '${countryRaw}' is not supported`,
        400
      );
    }
    if (!Number.isInteger(year) || year < 2020 || year > 2030) {
      return errorResponse("INVALID_YEAR", "Year must be between 2020 and 2030", 400);
    }

    const rl = await checkRateLimit(getClientIdentifier(req));
    if (!rl.success) {
      return errorResponse("RATE_LIMIT_EXCEEDED", "Rate limit exceeded", 429, {
        "X-RateLimit-Remaining": "0",
      });
    }

    const { holidays, cached } = await getHolidaysCached(country, year);

    const body: HolidaysResponse = {
      country,
      country_name: getCountryName(country),
      year,
      count: holidays.length,
      holidays,
    };

    return NextResponse.json(body, {
      headers: buildHeaders({
        cache: cached ? "HIT" : "MISS",
        remaining: rl.remaining,
      }),
    });
  } catch (err) {
    return handleUnknownError(err);
  }
}
