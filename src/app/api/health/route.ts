import { NextResponse } from "next/server";
import { pingNager } from "@/lib/nager";
import { COUNTRY_NAMES } from "@/lib/countries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const reachable = await pingNager();
  return NextResponse.json({
    status: reachable ? "ok" : "degraded",
    nager_reachable: reachable,
    countries_supported: Object.keys(COUNTRY_NAMES).length,
    timestamp: new Date().toISOString(),
  });
}
