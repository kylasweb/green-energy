import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { upiService } from '@/lib/upi-service'
import { z } from 'zod'

const RefundRequestSchema = z.object({
    transactionId: z.string().min(1, 'Transaction ID is required'),
    amount: z.number().positive('Amount must be positive').optional(),
    reason: z.string().min(1, 'Refund reason is required')
})

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ transactionId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            )
        }

        const resolvedParams = await params
        const body = await request.json()

        const validationResult = RefundRequestSchema.safeParse({
            transactionId: resolvedParams.transactionId,
            ...body
        })

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: 'Invalid request data',
                    details: validationResult.error.issues
                },
                { status: 400 }
            )
        }

        const { transactionId, amount, reason } = validationResult.data

        const result = await upiService.initiateRefund(
            transactionId,
            amount,
            reason
        )

        return NextResponse.json(result)
    } catch (error: any) {
        console.error('Error processing refund:', error)

        if (error.message === 'Transaction not found') {
            return NextResponse.json(
                { error: 'Transaction not found' },
                { status: 404 }
            )
        }

        if (error.message === 'Transaction not eligible for refund') {
            return NextResponse.json(
                { error: 'Transaction not eligible for refund' },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}