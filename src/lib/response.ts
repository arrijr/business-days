import { NextResponse } from "next/server";
import { ApiError, ErrorCode } from "./errors";

export function errorResponse(
  code: ErrorCode,
  message: string,
  status: number,
  extraHeaders: Record<string, string> = {}
): NextResponse {
  return NextResponse.json(
    { error: message, code },
    { status, headers: extraHeaders }
  );
}

export function handleUnknownError(err: unknown): NextResponse {
  if (err instanceof ApiError) {
    return errorResponse(err.code, err.message, err.status);
  }
  console.error("[business-days] unexpected error", err);
  return errorResponse("INTERNAL_ERROR", "Internal server error", 500);
}

export function buildHeaders(opts: {
  cache: "HIT" | "MISS";
  remaining: number;
}): Record<string, string> {
  return {
    "X-Cache": opts.cache,
    "X-RateLimit-Remaining": String(opts.remaining),
  };
}

export function getClientIdentifier(req: Request): string {
  const proxy = req.headers.get("x-rapidapi-user");
  if (proxy) return `user:${proxy}`;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "anon";
  return `ip:${ip}`;
}
