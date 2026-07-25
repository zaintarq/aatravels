import { SignJWT, jwtVerify } from "jose";
import { getJwtSecret } from "@/lib/jwt-secret";

const encoder = new TextEncoder();

export interface AdminTokenPayload {
  id: string;
  email: string;
  role: string;
}

function getSecret() {
  return encoder.encode(getJwtSecret());
}

/** Edge-safe admin JWT (jose works on Cloudflare Pages). */
export async function signAdminToken(payload: AdminTokenPayload) {
  return new SignJWT({
    id: payload.id,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
    .sign(getSecret());
}

export async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      id: String(payload.id),
      email: String(payload.email),
      role: String(payload.role),
    };
  } catch {
    return null;
  }
}

export function requireRole(payload: AdminTokenPayload | null, allowed: string[]) {
  if (!payload) return false;
  return allowed.includes(payload.role);
}
