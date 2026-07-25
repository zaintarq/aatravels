/** Shared isAdmin parsing (safe for client + server). */
export function parseIsAdmin(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (typeof value === "number" && value === 1) return true;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return v === "yes" || v === "true" || v === "1" || v === "y";
  }
  return false;
}

export function isAdminFlag(value: unknown): boolean {
  return parseIsAdmin(value);
}
