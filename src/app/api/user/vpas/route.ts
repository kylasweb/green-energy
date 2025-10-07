import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { upiService } from '@/lib/upi-service'
import { z } from 'zod'

const createVpaSchema = z.object({
    vpa: z.string().min(1, 'UPI VPA is required'),
    isDefault: z.boolean().optional()
})

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const savedVpas = await db.userSavedVpa.findMany({
            where: { userId: session.user.id },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' }
            ]
        })

        return NextResponse.json({ vpas: savedVpas })
    } catch (error) {
        console.error('Error fetching saved VPAs:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const validatedData = createVpaSchema.parse(body)

        // Validate VPA format
        if (!upiService.validateVpa(validatedData.vpa)) {
            return NextResponse.json(
                { error: 'Invalid UPI VPA format' },
                { status: 400 }
            )
        }

        // Check if VPA already exists for this user
        const existingVpa = await db.userSavedVpa.findUnique({
            where: {
                userId_vpa: {
                    userId: session.user.id,
                    vpa: validatedData.vpa
                }
            }
        })

        if (existingVpa) {
            return NextResponse.json(
                { error: 'VPA already exists' },
                { status: 400 }
            )
        }

        // If setting as default, remove default from other VPAs
        if (validatedData.isDefault) {
            await db.userSavedVpa.updateMany({
                where: {
                    userId: session.user.id,
                    isDefault: true
                },
                data: { isDefault: false }
            })
        }

        const savedVpa = await db.userSavedVpa.create({
            data: {
                userId: session.user.id,
                vpa: validatedData.vpa,
                isDefault: validatedData.isDefault || false
            }
        })

        return NextResponse.json({ vpa: savedVpa })
    } catch (error) {
        console.error('Error creating saved VPA:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input data', details: error.issues },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}