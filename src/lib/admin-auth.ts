import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function adminAuth(request: NextRequest) {
  const token = await getToken({ req: request })
  
  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  // Check if user has admin role
  const userRole = token.role as string
  if (!userRole || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export function withAdminAuth(handler: (req: NextRequest, context: any) => Promise<NextResponse>) {
  return async (req: NextRequest, context: any) => {
    const authResult = await adminAuth(req)
    if (authResult.status !== 200) {
      return authResult
    }
    return handler(req, context)
  }
}