import { NextRequest, NextResponse } from "next/server";
import { signToken, getSecret, passwordMatches, COOKIE_NAME } from "@/lib/auth";
import { getLockoutSeconds, recordFailure, clearFailures } from "@/lib/login-throttle";

export const runtime = "nodejs";

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function lockedResponse(seconds: number): NextResponse {
  const minutes = Math.ceil(seconds / 60);
  return NextResponse.json(
    { error: `Muitas tentativas. Tente novamente em ${minutes} min.` },
    { status: 429, headers: { "Retry-After": String(seconds) } }
  );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || !getSecret()) {
    return NextResponse.json({ error: "Servidor não configurado" }, { status: 503 });
  }

  let password: unknown;
  try {
    ({ password } = (await req.json()) as { password?: unknown });
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }
  if (typeof password !== "string" || !password) {
    return NextResponse.json({ error: "Informe a senha" }, { status: 400 });
  }

  const ip = clientIp(req);
  const lockout = await getLockoutSeconds(ip);
  if (lockout > 0) return lockedResponse(lockout);

  if (!passwordMatches(password, adminPassword)) {
    await recordFailure(ip);
    const nowLocked = await getLockoutSeconds(ip);
    if (nowLocked > 0) return lockedResponse(nowLocked);
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  await clearFailures(ip);
  const token = await signToken({ sub: "admin" });
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
  return res;
}
