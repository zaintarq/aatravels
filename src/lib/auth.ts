import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();

export interface AdminTokenPayload {
  id: string;
  email: string;
  role: string;
}

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return encoder.encode(secret);
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
