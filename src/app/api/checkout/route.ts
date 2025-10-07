import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface CheckoutData {
  shippingAddress: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    country: string
  }
  billingAddress?: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    country: string
  }
  paymentMethod: 'cod' | 'online' | 'upi'
  notes?: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json() as CheckoutData

    // Validate required fields
    if (!body.shippingAddress || !body.paymentMethod) {
      return NextResponse.json(
        { error: 'Shipping address and payment method are required' },
        { status: 400 }
      )
    }

    // Validate shipping address
    const { fullName, email, phone, address, city, state, pincode } = body.shippingAddress
    if (!fullName || !email || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'All shipping address fields are required' },
        { status: 400 }
      )
    }

    // Get cart items
    let cartItems
    if (session?.user) {
      cartItems = await db.cartItem.findMany({
        where: { userId: session.user.id },
        include: {
          product: true
        }
      })
    } else {
      const sessionId = request.cookies.get('sessionId')?.value
      if (!sessionId) {
        return NextResponse.json(
          { error: 'No session found' },
          { status: 400 }
        )
      }
      cartItems = await db.cartItem.findMany({
        where: { sessionId },
        include: {
          product: true
        }
      })
    }

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Check stock availability
    for (const item of cartItems) {
      if (item.product.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.product.name}` },
          { status: 400 }
        )
      }
    }

    // Calculate order totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    const shipping = subtotal >= 999 ? 0 : 99
    const tax = Math.round(subtotal * 0.18) // 18% GST
    const total = subtotal + shipping + tax

    // Generate order number
    const orderNumber = `GES-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id || null,
        status: 'PENDING',
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: body.paymentMethod,
        notes: body.notes || '',
        customerEmail: body.shippingAddress.email,
        customerName: body.shippingAddress.fullName,
        customerPhone: body.shippingAddress.phone,
        customerAddress: body.shippingAddress.address,
        customerCity: body.shippingAddress.city,
        customerState: body.shippingAddress.state,
        customerCountry: body.shippingAddress.country,
        customerZipCode: body.shippingAddress.pincode,
        orderItems: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            total: item.product.price * item.quantity
          }))
        }
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    })

    // Update product stock
    for (const item of cartItems) {
      await db.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity
          }
        }
      })
    }

    // Clear cart
    if (session?.user) {
      await db.cartItem.deleteMany({
        where: { userId: session.user.id }
      })
    } else {
      await db.cartItem.deleteMany({
        where: { sessionId: request.cookies.get('sessionId')?.value }
      })
    }

    // Create shipment record
    await db.shipment.create({
      data: {
        orderId: order.id,
        status: 'PENDING',
        trackingNumber: null
      }
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        paymentMethod: order.paymentMethod
      }
    })

  } catch (error) {
    console.error('Error processing checkout:', error)
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    )
  }
}