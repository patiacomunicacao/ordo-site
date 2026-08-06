import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { COOKIE_NAME } from "@/lib/auth";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

function getSecret() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET ?? "ordo-fallback-secret-please-set-jwt-secret"
  );
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public: login page and its API
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/admin/logout")
  ) {
    return NextResponse.next();
  }

  // Protected: all /admin/* and /api/admin/*
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      await jwtVerify(token, getSecret());
      return NextResponse.next();
    } catch {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
      }
      const res = NextResponse.redirect(new URL("/admin/login", req.url));
      res.cookies.delete(COOKIE_NAME);
      return res;
    }
  }

  // Skip i18n for API routes and files with extensions
  if (pathname.startsWith("/api/") || /\.[^/]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // Apply next-intl for all public routes
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|_vercel).*)"],
};
