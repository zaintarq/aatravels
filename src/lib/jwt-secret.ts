/** Shared JWT secret — env first, then committed deploy default. */
export function getJwtSecret(): string {
  const secret =
    process.env.JWT_SECRET ||
    "4314c65a6485e056506c24bb12a942dcd610decebb8eb7199ebcdc5f82fb4dc4";
  return secret;
}
