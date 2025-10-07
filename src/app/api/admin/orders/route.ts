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

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search')
        const status = searchParams.get('status')

        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {}

        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                { customerName: { contains: search, mode: 'insensitive' } },
                { customerEmail: { contains: search, mode: 'insensitive' } }
            ]
        }

        if (status && status !== 'all') {
            where.status = status.toUpperCase()
        }

        const [orders, total] = await Promise.all([
            db.order.findMany({
                where,
                include: {
                    orderItems: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    price: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            }),
            db.order.count({ where })
        ])

        // Transform orders data to match expected interface
        const transformedOrders = orders.map(order => ({
            id: order.id,
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone || 'N/A',
            items: order.orderItems.length,
            total: order.total,
            status: order.status,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod || 'N/A',
            shippingAddress: `${order.customerAddress}, ${order.customerCity || ''}, ${order.customerState || ''}, ${order.customerCountry || ''}`.trim(),
            orderDate: order.createdAt.toISOString().split('T')[0],
            orderItems: order.orderItems.map(item => ({
                productName: item.product.name,
                quantity: item.quantity,
                price: item.price
            }))
        }))

        return NextResponse.json({
            orders: transformedOrders,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            hasMore: skip + limit < total
        })

    } catch (error) {
        console.error('Error fetching admin orders:', error)
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            )
        }

        const { orderId, status, notes } = await request.json()

        if (!orderId || !status) {
            return NextResponse.json(
                { error: 'Order ID and status are required' },
                { status: 400 }
            )
        }

        const updatedOrder = await db.order.update({
            where: { id: orderId },
            data: {
                status: status.toUpperCase(),
                notes: notes || undefined
            }
        })

        return NextResponse.json({
            message: 'Order status updated successfully',
            order: updatedOrder
        })

    } catch (error) {
        console.error('Error updating order:', error)
        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        )
    }
}