import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = session.user.role as string
    if (!userRole || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { action, type, ids, data } = await request.json()

    if (!action || !type || !ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    let result

    switch (type) {
      case "products":
        result = await handleProductBatchAction(action, ids, data)
        break
      case "orders":
        result = await handleOrderBatchAction(action, ids, data)
        break
      case "customers":
        result = await handleCustomerBatchAction(action, ids, data)
        break
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Batch operation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

async function handleProductBatchAction(action: string, ids: string[], data: any) {
  switch (action) {
    case "delete":
      await db.product.deleteMany({
        where: { id: { in: ids } }
      })
      return { success: true, message: `Deleted ${ids.length} products` }

    case "update":
      const { updates } = data
      await db.product.updateMany({
        where: { id: { in: ids } },
        data: updates
      })
      return { success: true, message: `Updated ${ids.length} products` }

    case "activate":
      await db.product.updateMany({
        where: { id: { in: ids } },
        data: { isActive: true }
      })
      return { success: true, message: `Activated ${ids.length} products` }

    case "deactivate":
      await db.product.updateMany({
        where: { id: { in: ids } },
        data: { isActive: false }
      })
      return { success: true, message: `Deactivated ${ids.length} products` }

    case "setFeatured":
      await db.product.updateMany({
        where: { id: { in: ids } },
        data: { isFeatured: true }
      })
      return { success: true, message: `Set ${ids.length} products as featured` }

    case "unsetFeatured":
      await db.product.updateMany({
        where: { id: { in: ids } },
        data: { isFeatured: false }
      })
      return { success: true, message: `Removed ${ids.length} products from featured` }

    case "updateStock":
      const { stockAdjustment } = data
      await db.product.updateMany({
        where: { id: { in: ids } },
        data: {
          stockQuantity: {
            increment: stockAdjustment
          }
        }
      })
      return { success: true, message: `Updated stock for ${ids.length} products` }

    case "updatePrice":
      const { priceAdjustment, adjustmentType } = data
      const updateData: any = {}
      
      if (adjustmentType === "percentage") {
        updateData.price = {
          multiply: 1 + (priceAdjustment / 100)
        }
        updateData.mrp = {
          multiply: 1 + (priceAdjustment / 100)
        }
      } else {
        updateData.price = {
          increment: priceAdjustment
        }
        updateData.mrp = {
          increment: priceAdjustment
        }
      }

      await db.product.updateMany({
        where: { id: { in: ids } },
        data: updateData
      })
      return { success: true, message: `Updated prices for ${ids.length} products` }

    default:
      throw new Error(`Unknown product action: ${action}`)
  }
}

async function handleOrderBatchAction(action: string, ids: string[], data: any) {
  switch (action) {
    case "updateStatus":
      const { status } = data
      await db.order.updateMany({
        where: { id: { in: ids } },
        data: { status }
      })
      return { success: true, message: `Updated status for ${ids.length} orders` }

    case "updatePaymentStatus":
      const { paymentStatus } = data
      await db.order.updateMany({
        where: { id: { in: ids } },
        data: { paymentStatus }
      })
      return { success: true, message: `Updated payment status for ${ids.length} orders` }

    case "cancel":
      await db.order.updateMany({
        where: { id: { in: ids } },
        data: { 
          status: "CANCELLED",
          paymentStatus: "REFUNDED"
        }
      })
      return { success: true, message: `Cancelled ${ids.length} orders` }

    case "delete":
      // First delete order items, then orders
      await db.orderItem.deleteMany({
        where: { orderId: { in: ids } }
      })
      await db.order.deleteMany({
        where: { id: { in: ids } }
      })
      return { success: true, message: `Deleted ${ids.length} orders` }

    case "export":
      // Return order data for export
      const orders = await db.order.findMany({
        where: { id: { in: ids } },
        include: {
          orderItems: {
            include: {
              product: true
            }
          },
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })
      return { success: true, data: orders, message: `Exported ${ids.length} orders` }

    default:
      throw new Error(`Unknown order action: ${action}`)
  }
}

async function handleCustomerBatchAction(action: string, ids: string[], data: any) {
  switch (action) {
    case "updateRole":
      const { role } = data
      await db.user.updateMany({
        where: { id: { in: ids } },
        data: { role }
      })
      return { success: true, message: `Updated role for ${ids.length} customers` }

    case "activate":
      await db.user.updateMany({
        where: { id: { in: ids } },
        data: { isActive: true }
      })
      return { success: true, message: `Activated ${ids.length} customers` }

    case "deactivate":
      await db.user.updateMany({
        where: { id: { in: ids } },
        data: { isActive: false }
      })
      return { success: true, message: `Deactivated ${ids.length} customers` }

    case "delete":
      // Check if we're not deleting super admins
      const superAdminCount = await db.user.count({
        where: { 
          id: { in: ids },
          role: "SUPER_ADMIN"
        }
      })
      
      if (superAdminCount > 0) {
        return NextResponse.json({ 
          error: "Cannot delete super admin users" 
        }, { status: 400 })
      }

      await db.user.deleteMany({
        where: { id: { in: ids } }
      })
      return { success: true, message: `Deleted ${ids.length} customers` }

    case "export":
      const customers = await db.user.findMany({
        where: { id: { in: ids } },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          address: true,
          city: true,
          state: true,
          country: true,
          zipCode: true
        }
      })
      return { success: true, data: customers, message: `Exported ${ids.length} customers` }

    default:
      throw new Error(`Unknown customer action: ${action}`)
  }
}