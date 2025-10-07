import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            )
        }

        // Get dashboard statistics
        const [
            totalProducts,
            totalOrders,
            totalCustomers,
            totalRevenue,
            pendingOrders,
            lowStockProducts,
            recentOrders,
            topProducts
        ] = await Promise.all([
            // Total products count
            db.product.count({ where: { isActive: true } }),

            // Total orders count
            db.order.count(),

            // Total customers count
            db.user.count({ where: { role: 'CUSTOMER' } }),

            // Total revenue (sum of completed orders)
            db.order.aggregate({
                where: { status: 'DELIVERED' },
                _sum: { total: true }
            }),

            // Pending orders count
            db.order.count({ where: { status: 'PENDING' } }),

            // Low stock products count (products with stock <= 10)
            db.product.count({
                where: {
                    stockQuantity: { lte: 10 }
                }
            }),

            // Recent orders (last 10)
            db.order.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    orderNumber: true,
                    customerName: true,
                    total: true,
                    status: true,
                    createdAt: true
                }
            }),

            // Top products by order count
            db.product.findMany({
                take: 5,
                include: {
                    orderItems: {
                        select: {
                            quantity: true,
                            price: true
                        }
                    }
                },
                orderBy: {
                    orderItems: {
                        _count: 'desc'
                    }
                }
            })
        ])

        // Calculate top products statistics
        const topProductsStats = topProducts.map(product => {
            const totalSales = product.orderItems.reduce((sum, item) => sum + item.quantity, 0)
            const totalRevenue = product.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

            return {
                name: product.name,
                sales: totalSales,
                revenue: totalRevenue
            }
        })

        const dashboardStats = {
            totalRevenue: totalRevenue._sum.total || 0,
            totalOrders,
            totalProducts,
            totalCustomers,
            pendingOrders,
            lowStockProducts,
            recentOrders: recentOrders.map(order => ({
                id: order.orderNumber,
                customer: order.customerName,
                amount: order.total,
                status: order.status,
                date: order.createdAt.toISOString().split('T')[0]
            })),
            topProducts: topProductsStats
        }

        return NextResponse.json(dashboardStats)

    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        return NextResponse.json(
            { error: 'Failed to fetch dashboard statistics' },
            { status: 500 }
        )
    }
}