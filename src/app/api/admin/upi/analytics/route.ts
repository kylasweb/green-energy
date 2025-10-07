import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
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

        const { db } = await import('@/lib/db')
        const { searchParams } = new URL(request.url)

        // Default to last 30 days if no dates provided
        const endDate = searchParams.get('endDate')
            ? new Date(searchParams.get('endDate')!)
            : new Date()
        const startDate = searchParams.get('startDate')
            ? new Date(searchParams.get('startDate')!)
            : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

        // Basic metrics
        const [
            totalTransactions,
            successfulTransactions,
            failedTransactions,
            totalVolume,
            successfulVolume,
            refundedTransactions,
            refundedVolume
        ] = await Promise.all([
            // Total transactions in period
            db.upiTransaction.count({
                where: {
                    createdAt: { gte: startDate, lte: endDate }
                }
            }),

            // Successful transactions
            db.upiTransaction.count({
                where: {
                    status: UpiPaymentStatus.SUCCESS,
                    createdAt: { gte: startDate, lte: endDate }
                }
            }),

            // Failed transactions
            db.upiTransaction.count({
                where: {
                    status: UpiPaymentStatus.FAILED,
                    createdAt: { gte: startDate, lte: endDate }
                }
            }),

            // Total volume
            db.upiTransaction.aggregate({
                where: {
                    createdAt: { gte: startDate, lte: endDate }
                },
                _sum: { amount: true }
            }),

            // Successful volume
            db.upiTransaction.aggregate({
                where: {
                    status: UpiPaymentStatus.SUCCESS,
                    createdAt: { gte: startDate, lte: endDate }
                },
                _sum: { amount: true }
            }),

            // Refunded transactions
            db.upiTransaction.count({
                where: {
                    status: UpiPaymentStatus.REFUNDED,
                    createdAt: { gte: startDate, lte: endDate }
                }
            }),

            // Refunded volume
            db.upiTransaction.aggregate({
                where: {
                    status: UpiPaymentStatus.REFUNDED,
                    createdAt: { gte: startDate, lte: endDate }
                },
                _sum: { amount: true }
            })
        ])

        // Daily transaction trends
        const dailyTrends = await db.$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as total_transactions,
        COUNT(CASE WHEN status = 'SUCCESS' THEN 1 END) as successful_transactions,
        COALESCE(SUM(amount), 0) as total_volume,
        COALESCE(SUM(CASE WHEN status = 'SUCCESS' THEN amount END), 0) as successful_volume
      FROM upi_transactions
      WHERE "createdAt" >= ${startDate} AND "createdAt" <= ${endDate}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `

        // Top VPA usage
        const topVpas = await db.upiTransaction.groupBy({
            by: ['vpa'],
            where: {
                status: UpiPaymentStatus.SUCCESS,
                createdAt: { gte: startDate, lte: endDate }
            },
            _count: { vpa: true },
            _sum: { amount: true },
            orderBy: { _count: { vpa: 'desc' } },
            take: 10
        })

        // Calculate success rate
        const successRate = totalTransactions > 0
            ? (successfulTransactions / totalTransactions) * 100
            : 0

        // Calculate average transaction value
        const avgTransactionValue = successfulTransactions > 0
            ? (successfulVolume._sum.amount || 0) / successfulTransactions
            : 0

        const analytics = {
            summary: {
                totalTransactions,
                successfulTransactions,
                failedTransactions,
                refundedTransactions,
                successRate: Math.round(successRate * 100) / 100,
                totalVolume: totalVolume._sum.amount || 0,
                successfulVolume: successfulVolume._sum.amount || 0,
                refundedVolume: refundedVolume._sum.amount || 0,
                avgTransactionValue: Math.round(avgTransactionValue * 100) / 100
            },
            trends: {
                daily: dailyTrends
            },
            topVpas: topVpas.map(vpa => ({
                vpa: vpa.vpa,
                transactionCount: vpa._count.vpa,
                totalAmount: vpa._sum.amount || 0
            })),
            period: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            }
        }

        return NextResponse.json(analytics)
    } catch (error) {
        console.error('Error fetching UPI analytics:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}