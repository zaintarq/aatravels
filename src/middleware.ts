import { NextRequest, NextResponse } from "next/server";
import { verifyAdminTokenEdge } from "@/lib/auth-edge";
import { resolveAdminFromBearer } from "@/lib/firebase/admin-check";

/**
 * Only gate /api/admin. Dashboard pages use client Firebase isAdmin
 * (cookie session was failing on Cloudflare and blocked staff login).
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const cookieToken = req.cookies.get("admin_token")?.value;
  const cookieOk = cookieToken ? await verifyAdminTokenEdge(cookieToken) : null;
  if (cookieOk) return NextResponse.next();

  const bearerOk = await resolveAdminFromBearer(req.headers.get("authorization"));
  if (bearerOk) return NextResponse.next();

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
