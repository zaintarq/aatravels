import { NextResponse } from "next/server";
import { signAdminToken } from "@/lib/auth";
import { resolveAdminFromBearer } from "@/lib/firebase/admin-check";

export const runtime = "edge";

function clearCookie(res: NextResponse) {
  res.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/** Exchange a Firebase ID token for an admin session cookie — only if Firestore isAdmin is yes/true. */
export async function POST(req: Request) {
  const admin = await resolveAdminFromBearer(req.headers.get("authorization"));
  if (!admin) {
    return NextResponse.json(
      { error: "Not an admin account. In Firestore users/{uid} set isAdmin to true (boolean) or yes." },
      { status: 403 }
    );
  }

  const token = await signAdminToken({
    id: admin.uid,
    email: admin.email,
    role: "ADMIN",
  });

  const res = NextResponse.json({
    success: true,
    admin: { id: admin.uid, email: admin.email, username: admin.username, role: "ADMIN" },
  });

  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  clearCookie(res);
  return res;
}
