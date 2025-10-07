import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        console.log('Checking credentials for:', email)

        const user = await db.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: true,
                isActive: true
            }
        })

        if (!user) {
            console.log('User not found')
            return NextResponse.json({ success: false, error: 'User not found' })
        }

        console.log('User found:', { id: user.id, email: user.email, role: user.role, isActive: user.isActive })

        if (!user.isActive) {
            console.log('User is not active')
            return NextResponse.json({ success: false, error: 'User not active' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        console.log('Password valid:', isPasswordValid)

        if (!isPasswordValid) {
            return NextResponse.json({ success: false, error: 'Invalid password' })
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        })
    } catch (error) {
        console.error("Credential check error:", error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 })
    }
}