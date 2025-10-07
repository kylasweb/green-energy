import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { upiService } from '@/lib/upi-service'
import { z } from 'zod'

const initiatePaymentSchema = z.object({
    orderId: z.string().min(1, 'Order ID is required'),
    vpa: z.string().min(1, 'UPI VPA is required'),
    amount: z.number().positive('Amount must be positive'),
    currency: z.string().optional()
})

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
        const validatedData = initiatePaymentSchema.parse(body)

        // Validate VPA format
        if (!upiService.validateVpa(validatedData.vpa)) {
            return NextResponse.json(
                { error: 'Invalid UPI VPA format' },
                { status: 400 }
            )
        }

        const result = await upiService.initiatePayment({
            orderId: validatedData.orderId,
            userId: session.user.id,
            vpa: validatedData.vpa,
            amount: validatedData.amount,
            currency: validatedData.currency
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error('UPI Payment initiation error:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input data', details: error.issues },
                { status: 400 }
            )
        }

        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}