import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateVpaSchema = z.object({
    isDefault: z.boolean()
})

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ vpaId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const resolvedParams = await params
        const { vpaId } = resolvedParams
        const body = await request.json()
        const validatedData = updateVpaSchema.parse(body)

        // Check if VPA belongs to the user
        const vpa = await db.userSavedVpa.findFirst({
            where: {
                id: vpaId,
                userId: session.user.id
            }
        })

        if (!vpa) {
            return NextResponse.json(
                { error: 'VPA not found' },
                { status: 404 }
            )
        }

        // If setting as default, remove default from other VPAs
        if (validatedData.isDefault) {
            await db.userSavedVpa.updateMany({
                where: {
                    userId: session.user.id,
                    isDefault: true,
                    id: { not: vpaId }
                },
                data: { isDefault: false }
            })
        }

        const updatedVpa = await db.userSavedVpa.update({
            where: { id: vpaId },
            data: { isDefault: validatedData.isDefault }
        })

        return NextResponse.json({ vpa: updatedVpa })
    } catch (error) {
        console.error('Error updating VPA:', error)

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

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ vpaId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        const resolvedParams = await params
        const { vpaId } = resolvedParams

        // Check if VPA belongs to the user
        const vpa = await db.userSavedVpa.findFirst({
            where: {
                id: vpaId,
                userId: session.user.id
            }
        })

        if (!vpa) {
            return NextResponse.json(
                { error: 'VPA not found' },
                { status: 404 }
            )
        }

        await db.userSavedVpa.delete({
            where: { id: vpaId }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting VPA:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}