import { NextRequest, NextResponse } from 'next/server'
import { upiService } from '@/lib/upi-service'

export async function POST(request: NextRequest) {
    try {
        const signature = request.headers.get('x-webhook-signature')

        if (!signature) {
            return NextResponse.json(
                { error: 'Webhook signature missing' },
                { status: 400 }
            )
        }

        const payload = await request.json()

        const result = await upiService.handleWebhook(payload, signature)

        return NextResponse.json(result)
    } catch (error) {
        console.error('Webhook handling error:', error)

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