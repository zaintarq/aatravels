import { NextRequest, NextResponse } from "next/server";
import { verifyAdminTokenEdge } from "@/lib/auth-edge";
import { resolveAdminFromBearer } from "@/lib/firebase/admin-check";
import { currencyFromCountry } from "@/lib/currency";

function applyCurrencyCookie(req: NextRequest, res: NextResponse) {
  if (!req.cookies.get("currency")?.value) {
    const country = req.headers.get("cf-ipcountry");
    const currency = currencyFromCountry(country);
    res.cookies.set("currency", currency, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/admin")) {
    const cookieToken = req.cookies.get("admin_token")?.value;
    const cookieOk = cookieToken ? await verifyAdminTokenEdge(cookieToken) : null;
    if (cookieOk) return applyCurrencyCookie(req, NextResponse.next());

    const bearerOk = await resolveAdminFromBearer(req.headers.get("authorization"));
    if (bearerOk) return applyCurrencyCookie(req, NextResponse.next());

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return applyCurrencyCookie(req, NextResponse.next());
}

export const config = {
  matcher: [
    "/api/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
