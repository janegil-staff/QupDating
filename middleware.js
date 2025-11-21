// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/register"];

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow static files and API routes
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Redirect if not authenticated
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🔒 Admin-only guard
  if (pathname.startsWith("/admin")) {
    if (!token.isAdmin) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/discover/:path*",
    "/profile/:path*",
    "/matches/:path*",
    "/events/:path*",
    "/admin/:path*", // 👈 protect admin routes
  ],
};
