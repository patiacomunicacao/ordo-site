import { SignJWT, jwtVerify } from "jose";
import { createHash, timingSafeEqual } from "crypto";

export const COOKIE_NAME = "ordo_admin_token";

const MIN_SECRET_LENGTH = 32;

/**
 * Chave de assinatura das sessões do admin. Não há valor padrão: sem uma
 * JWT_SECRET forte, qualquer pessoa com acesso ao código poderia forjar tokens.
 * Retorna null quando a variável está ausente ou curta demais.
 */
export function getSecret(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    console.error(
      `[auth] JWT_SECRET ausente ou com menos de ${MIN_SECRET_LENGTH} caracteres — admin bloqueado`
    );
    return null;
  }
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: Record<string, unknown>): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error("JWT_SECRET não configurada");
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<boolean> {
  const secret = getSecret();
  if (!secret) return false;
  try {
    await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

/** Compara senhas em tempo constante (hash antes para igualar o tamanho). */
export function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}
