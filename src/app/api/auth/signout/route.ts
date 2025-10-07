import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function POST(request: NextRequest) {
    try {
        // Clear the session token
        const response = NextResponse.json({ success: true })

        // Clear the NextAuth session cookie
        response.cookies.set('next-auth.session-token', '', {
            expires: new Date(0),
            path: '/',
            httpOnly: true
        })

        // Also clear the CSRF token
        response.cookies.set('next-auth.csrf-token', '', {
            expires: new Date(0),
            path: '/',
            httpOnly: true
        })

        return response
    } catch (error) {
        console.error("Signout error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}