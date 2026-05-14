import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "ordo_admin_token";

function getSecret() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET ?? "ordo-fallback-secret-please-set-jwt-secret"
  );
}

export async function signToken(payload: Record<string, unknown>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}
