import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");

  // your backend sets this cookie
  const hasAuthCookie = request.cookies.get("authToken");

  if (isDashboard && !hasAuthCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
