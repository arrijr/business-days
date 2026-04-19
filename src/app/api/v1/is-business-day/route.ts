import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { getHolidaysCached } from "@/lib/cache";
import { isSupportedCountry } from "@/lib/countries";
import { checkRateLimit } from "@/lib/ratelimit";
import {
  buildHeaders,
  errorResponse,
  getClientIdentifier,
  handleUnknownError,
} from "@/lib/response";
import { IsBusinessDayResponse } from "@/lib/types";
import { findHoliday, isWeekend, parseISODate } from "@/lib/business-days";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date") ?? "";
    const countryRaw = searchParams.get("country") ?? "";
    const country = countryRaw.toUpperCase();

    const date = parseISODate(dateStr);
    if (!date) {
      return errorResponse("INVALID_DATE", "Invalid date format — use YYYY-MM-DD", 400);
    }
    if (!/^[A-Z]{2}$/.test(country) || !isSupportedCountry(country)) {
      return errorResponse(
        "COUNTRY_NOT_SUPPORTED",
        `Country code '${countryRaw}' is not supported`,
        400
      );
    }

    const rl = await checkRateLimit(getClientIdentifier(req));
    if (!rl.success) {
      return errorResponse("RATE_LIMIT_EXCEEDED", "Rate limit exceeded", 429, {
        "X-RateLimit-Remaining": "0",
      });
    }

    const redis = getRedis();
    const cacheKey = `bizday:${dateStr}:${country}`;
    const cached = await redis.get<IsBusinessDayResponse>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: buildHeaders({ cache: "HIT", remaining: rl.remaining }),
      });
    }

    const year = date.getUTCFullYear();
    const { holidays } = await getHolidaysCached(country, year);

    let body: IsBusinessDayResponse;
    if (isWeekend(date)) {
      body = {
        date: dateStr,
        country,
        is_business_day: false,
        reason: "weekend",
        holiday_name: null,
      };
    } else {
      const h = findHoliday(date, holidays);
      if (h) {
        body = {
          date: dateStr,
          country,
          is_business_day: false,
          reason: "public_holiday",
          holiday_name: h.name,
        };
      } else {
        body = {
          date: dateStr,
          country,
          is_business_day: true,
          reason: null,
          holiday_name: null,
        };
      }
    }

    await redis.set(cacheKey, body, { ex: 60 * 60 * 24 });

    return NextResponse.json(body, {
      headers: buildHeaders({ cache: "MISS", remaining: rl.remaining }),
    });
  } catch (err) {
    return handleUnknownError(err);
  }
}
