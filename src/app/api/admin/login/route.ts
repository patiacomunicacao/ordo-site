import { NextRequest, NextResponse } from "next/server";
import { signToken, COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { password } = (await req.json()) as { password?: string };

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "Servidor não configurado" }, { status: 503 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

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
