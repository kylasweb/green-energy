import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params
    const { id } = resolvedParams

    const order = await db.order.findFirst({
      where: {
        id: id,
        ...(session?.user
          ? { userId: session.user.id }
          : { sessionId: request.cookies.get('sessionId')?.value }
        )
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        shipments: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}