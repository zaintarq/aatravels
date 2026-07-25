import { NextResponse } from "next/server";
import { getAllHotels } from "@/data/hotels";
import { requireRole, verifyAdminToken } from "@/lib/auth";

export const runtime = "edge";

async function getAdminFromCookie(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
  return match ? verifyAdminToken(decodeURIComponent(match[1])) : null;
}

export async function GET(req: Request) {
  const admin = await getAdminFromCookie(req);
  if (!requireRole(admin, ["SUPER_ADMIN", "ADMIN", "EDITOR"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ hotels: getAllHotels() });
}

export async function POST() {
  return NextResponse.json(
    { error: "Hotel CMS writes will sync to Firestore. Edit src/data/hotels.ts for now." },
    { status: 501 }
  );
}
