import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  let token;
  try {
    token = await getToken({ req: request });
  } catch (error) {
    console.error("Error getting token:", error);
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }

    const userRole = token.role as string
    if (!userRole || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
}