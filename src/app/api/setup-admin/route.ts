import { NextRequest, NextResponse } from "next/server"
import { createAdminUser } from "@/lib/create-admin"

export async function POST(request: NextRequest) {
  try {
    const adminUser = await createAdminUser()
    return NextResponse.json({
      message: "Admin user created successfully",
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      }
    })
  } catch (error) {
    console.error("Setup admin error:", error)
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    )
  }
}