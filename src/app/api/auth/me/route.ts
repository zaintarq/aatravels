import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const payload = token ? await verifyAdminToken(token) : null;
  if (!payload) return NextResponse.json({ admin: null }, { status: 401 });
  return NextResponse.json({ admin: payload });
}
