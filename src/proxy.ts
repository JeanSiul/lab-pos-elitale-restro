import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  readMobileBearerToken,
  verifyMobileBearerToken,
} from "@/lib/mobile-session";

/** Routes reachable without an authenticated session (benchmark landing + login + admin preview + public guest ordering). */
const PUBLIC_ROUTES = ["/", "/login", "/admin", "/order"];

/** Auth pages a signed-in user should be redirected away from. */
const AUTH_ROUTES = ["/login"];

const SESSION_COOKIE_NAMES = ["restro_session"];
const STAFF_COOKIE_NAME = "restro_staff";
const STAFF_LOGIN_PATTERN = /^\/u\/[^/]+\/login$/;

const PUBLIC_MOBILE_API_PATHS = [
  "/api/mobile/auth/request-otp",
  "/api/mobile/auth/verify-otp",
  "/api/mobile/auth/verify-pin",
];

const matchesRoute = (pathname: string, routes: readonly string[]): boolean =>
  routes.some(
    (route) => pathname === route || (route !== "/" && pathname.startsWith(`${route}/`)),
  );

const hasSession = (request: NextRequest): boolean =>
  SESSION_COOKIE_NAMES.some((name) => Boolean(request.cookies.get(name)?.value));

const hasStaffSession = (request: NextRequest): boolean =>
  Boolean(request.cookies.get(STAFF_COOKIE_NAME)?.value);

const mobileUnauthorized = (): NextResponse =>
  NextResponse.json(
    { error: "Missing or invalid bearer token.", code: "UNAUTHORIZED" },
    { status: 401 },
  );

const handleMobileApi = async (request: NextRequest): Promise<NextResponse> => {
  if (PUBLIC_MOBILE_API_PATHS.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  const token = readMobileBearerToken(request.headers);
  if (!token) return mobileUnauthorized();
  const payload = await verifyMobileBearerToken(token);
  if (!payload) return mobileUnauthorized();
  return NextResponse.next();
};

const handleStaffArea = (request: NextRequest): NextResponse => {
  const { pathname } = request.nextUrl;
  const username = pathname.split("/")[2] ?? "";
  const staffAuthed = hasStaffSession(request);

  if (STAFF_LOGIN_PATTERN.test(pathname)) {
    return staffAuthed
      ? NextResponse.redirect(new URL(`/u/${username}`, request.nextUrl))
      : NextResponse.next();
  }
  return staffAuthed
    ? NextResponse.next()
    : NextResponse.redirect(new URL(`/u/${username}/login`, request.nextUrl));
};

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/mobile/")) {
    return handleMobileApi(request);
  }

  if (pathname.startsWith("/u/")) {
    return handleStaffArea(request);
  }

  const authenticated = hasSession(request);

  if (authenticated && matchesRoute(pathname, AUTH_ROUTES)) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  if (!authenticated && !matchesRoute(pathname, PUBLIC_ROUTES)) {
    const loginUrl = new URL("/login", request.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\..*).*)",
    "/api/mobile/:path*",
  ],
};
