import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Helper function to get session ID from cookies
function getSessionId(request: NextRequest): string {
  const sessionId = request.cookies.get('sessionId')?.value
  if (!sessionId) {
    // Generate a new session ID
    return crypto.randomUUID()
  }
  return sessionId
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const sessionId = getSessionId(request)

    let cartItems

    if (session?.user) {
      // User is logged in, get cart items by user ID
      cartItems = await db.cartItem.findMany({
        where: {
          userId: session.user.id
        },
        include: {
          product: {
            include: {
              category: true,
              brand: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      // User is not logged in, get cart items by session ID
      cartItems = await db.cartItem.findMany({
        where: {
          sessionId
        },
        include: {
          product: {
            include: {
              category: true,
              brand: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    return NextResponse.json({
      cartItems,
      totals: {
        subtotal,
        totalItems,
        tax: 0, // Will be calculated at checkout
        shipping: 0, // Will be calculated at checkout
        total: subtotal
      }
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const sessionId = getSessionId(request)
    const body = await request.json()
    const { productId, quantity = 1 } = body

    // Validate product exists and is active
    const product = await db.product.findFirst({
      where: {
        id: productId,
        isActive: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check stock
    if (product.stockQuantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    let cartItem

    if (session?.user) {
      // User is logged in
      cartItem = await db.cartItem.upsert({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId
          }
        },
        update: {
          quantity: {
            increment: quantity
          }
        },
        create: {
          userId: session.user.id,
          productId,
          quantity
        },
        include: {
          product: true
        }
      })
    } else {
      // User is not logged in
      cartItem = await db.cartItem.upsert({
        where: {
          sessionId_productId: {
            sessionId,
            productId
          }
        },
        update: {
          quantity: {
            increment: quantity
          }
        },
        create: {
          sessionId,
          productId,
          quantity
        },
        include: {
          product: true
        }
      })
    }

    // Create response with session ID cookie if it's a new session
    const response = NextResponse.json(cartItem, { status: 201 })
    if (!request.cookies.get('sessionId')) {
      response.cookies.set('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      })
    }

    return response
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const sessionId = getSessionId(request)
    const body = await request.json()
    const { cartItemId, quantity } = body

    if (!cartItemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Cart item ID and quantity are required' },
        { status: 400 }
      )
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      )
    }

    // Find the cart item
    const cartItem = await db.cartItem.findFirst({
      where: {
        id: cartItemId,
        ...(session?.user ? { userId: session.user.id } : { sessionId })
      },
      include: {
        product: true
      }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Check stock
    if (cartItem.product.stockQuantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    // Update quantity
    const updatedCartItem = await db.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: {
          include: {
            category: true,
            brand: true
          }
        }
      }
    })

    return NextResponse.json(updatedCartItem)
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const sessionId = getSessionId(request)
    const { searchParams } = new URL(request.url)
    const cartItemId = searchParams.get('cartItemId')
    const clearAll = searchParams.get('clearAll') === 'true'

    if (clearAll) {
      // Clear all cart items for the user/session
      await db.cartItem.deleteMany({
        where: session?.user 
          ? { userId: session.user.id }
          : { sessionId }
      })

      return NextResponse.json({ message: 'Cart cleared successfully' })
    }

    if (!cartItemId) {
      return NextResponse.json(
        { error: 'Cart item ID is required' },
        { status: 400 }
      )
    }

    // Find and delete the specific cart item
    const cartItem = await db.cartItem.findFirst({
      where: {
        id: cartItemId,
        ...(session?.user ? { userId: session.user.id } : { sessionId })
      }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    await db.cartItem.delete({
      where: { id: cartItemId }
    })

    return NextResponse.json({ message: 'Item removed from cart' })
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 500 }
    )
  }
}