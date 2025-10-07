import { NextRequest, NextResponse } from "next/server"
import { seedDatabase } from "@/lib/seed-data"

export async function POST(request: NextRequest) {
    try {
        await seedDatabase()

        return NextResponse.json({
            message: "Database seeded successfully",
            success: true
        })
    } catch (error) {
        console.error("Seed database error:", error)
        return NextResponse.json(
            {
                error: "Failed to seed database",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        )
    }
}