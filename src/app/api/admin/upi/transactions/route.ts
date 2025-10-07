import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { upiService } from '@/lib/upi-service'
import { UpiPaymentStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            )
        }

        const { searchParams } = new URL(request.url)

        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const status = searchParams.get('status') as UpiPaymentStatus | null
        const orderId = searchParams.get('orderId')
        const userEmail = searchParams.get('userEmail')
        const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
        const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined

        const params: any = { page, limit }

        if (status) params.status = status
        if (orderId) params.orderId = orderId
        if (startDate) params.startDate = startDate
        if (endDate) params.endDate = endDate

        // If filtering by user email, we need to find the user first
        let userId: string | undefined
        if (userEmail) {
            const { db } = await import('@/lib/db')
            const user = await db.user.findUnique({
                where: { email: userEmail },
                select: { id: true }
            })
            if (user) userId = user.id
            else {
                // If user not found with email, return empty results
                return NextResponse.json({
                    transactions: [],
                    pagination: { page: 1, limit, total: 0, pages: 0 }
                })
            }
        }

        if (userId) params.userId = userId

        const result = await upiService.getTransactions(params)

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error fetching UPI transactions:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}