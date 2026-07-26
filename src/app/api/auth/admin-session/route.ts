import { NextResponse } from "next/server";
import { signAdminToken } from "@/lib/auth";
import {
  getUserProfileWithToken,
  isAdminFlag,
} from "@/lib/firebase/admin-check";
import { verifyFirebaseIdToken } from "@/lib/firebase/verify-token";

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
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) {
      return NextResponse.json({ error: "Missing token", step: "token" }, { status: 401 });
    }

    const verified = await verifyFirebaseIdToken(token);
    if (!verified) {
      return NextResponse.json({ error: "Invalid Firebase token", step: "verify" }, { status: 401 });
    }

    const profile = await getUserProfileWithToken(verified.uid, token);
    if (!profile) {
      return NextResponse.json(
        {
          error: `No Firestore users/${verified.uid} doc (or read blocked by rules)`,
          step: "profile",
          uid: verified.uid,
        },
        { status: 403 }
      );
    }

    if (!isAdminFlag(profile.isAdmin)) {
      return NextResponse.json(
        {
          error: "isAdmin is not true on this user doc",
          step: "isAdmin",
          uid: verified.uid,
          isAdmin: profile.isAdmin ?? null,
        },
        { status: 403 }
      );
    }

    const jwt = await signAdminToken({
      id: verified.uid,
      email: verified.email || profile.email || "",
      role: "ADMIN",
    });

    const res = NextResponse.json({
      success: true,
      admin: {
        id: verified.uid,
        email: verified.email || profile.email || "",
        username: profile.username || "admin",
        role: "ADMIN",
      },
    });

    res.cookies.set("admin_token", jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Admin session failed",
        step: "exception",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  clearCookie(res);
  return res;
}
