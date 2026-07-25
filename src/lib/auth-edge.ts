import { jwtVerify } from "jose";
import { getJwtSecret } from "@/lib/jwt-secret";

export interface AdminTokenPayload {
  id: string;
  email: string;
  role: string;
}

const encoder = new TextEncoder();

export async function verifyAdminTokenEdge(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(getJwtSecret()));
    return {
      id: String(payload.id),
      email: String(payload.email),
      role: String(payload.role),
    };
  } catch {
    return null;
  }
}
