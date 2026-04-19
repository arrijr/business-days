import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/api/v1/:path*"],
};

export function middleware(req: NextRequest) {
  const expected = process.env.RAPIDAPI_PROXY_SECRET;
  if (!expected) {
    return NextResponse.json(
      { error: "Server misconfiguration: proxy secret not set", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
  const provided = req.headers.get("x-rapidapi-proxy-secret");
  if (provided !== expected) {
    return NextResponse.json(
      { error: "Forbidden: direct access not allowed. Use RapidAPI.", code: "FORBIDDEN" },
      { status: 403 }
    );
  }
  return NextResponse.next();
}
