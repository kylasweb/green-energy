import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = token.role as string
    if (!userRole || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({
      user: {
        id: token.sub,
        name: token.name,
        email: token.email,
        role: token.role,
        avatar: token.picture
      }
    })
  } catch (error) {
    console.error("Admin auth error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}