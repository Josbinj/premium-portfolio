import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretString = process.env.JWT_SECRET || "default_super_secret_key_change_in_production";
const JWT_SECRET = new TextEncoder().encode(secretString);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── HTTPS Enforcement ───────────────────────────────────────────
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") === "http" &&
    !request.url.startsWith("http://localhost")
  ) {
    const httpsUrl = new URL(request.url);
    httpsUrl.protocol = "https:";
    return NextResponse.redirect(httpsUrl, 301);
  }
  
  // ─── Authentication ───────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    const authToken = request.cookies.get("auth_token");
    let isAuthenticated = false;

    if (authToken) {
      try {
        await jwtVerify(authToken.value, JWT_SECRET);
        isAuthenticated = true;
      } catch (err) {
        isAuthenticated = false;
      }
    }

    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

  // ─── Security Headers ────────────────────────────────────────────
  // These protect against XSS, clickjacking, MIME sniffing, and more.

  // Prevent clickjacking — only allow embedding on same origin
  response.headers.set("X-Frame-Options", "SAMEORIGIN");

  // Block MIME-type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Enable browser XSS filter
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Control referrer information sent with requests
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions Policy — restrict browser features
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  // Strict Transport Security — force HTTPS (2 years)
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // Content Security Policy — restrict resource loading
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com",
    "frame-src 'self' https://calendly.com",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

// Only apply to page routes, not static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|images|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)).*)",
  ],
};
