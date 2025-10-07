import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
interface Product {
  id: string
  name: string
  slug: string
  description: string
  sku: string
  price: number
  mrp: number
  stockQuantity: number
  lowStockThreshold: number
  category: string
  brand: string
  images?: string[]
  tags?: string[]
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export async function POST(request: NextRequest) {
  try {
    const { productId, images } = await request.json()

    if (!productId || !images) {
      return NextResponse.json(
        { error: 'Product ID and images are required' },
        { status: 400 }
      )
    }

    // Update product with new images
    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: {
        images: images,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      product: updatedProduct
    })

  } catch (error) {
    console.error('Error updating product images:', error)
    return NextResponse.json(
      { error: 'Failed to update product images' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { productIds } = await request.json()

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: 'Valid product IDs array is required' },
        { status: 400 }
      )
    }

    const updatedProducts: Product[] = []

    for (const productId of productIds) {
      // Get product details
      const product = await db.product.findUnique({
        where: { id: productId },
        include: {
          brand: true,
          category: true
        }
      })

      if (!product) continue

      // Search for images using the existing API
      const searchResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/products/search-images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brand: product.brand.name,
          productName: product.name,
          category: product.category.name
        }),
      })

      if (searchResponse.ok) {
        const searchData = await searchResponse.json()

        // Update product with first image found
        if (searchData.images && searchData.images.length > 0) {
          const updatedProduct = await db.product.update({
            where: { id: productId },
            data: {
              images: [searchData.images[0]],
              updatedAt: new Date()
            },
            include: {
              category: true,
              brand: true
            }
          })
          updatedProducts.push(updatedProduct as any)
        }
      }
    }

    return NextResponse.json({
      success: true,
      updatedProducts: updatedProducts.length,
      message: `Updated images for ${updatedProducts.length} products`
    })

  } catch (error) {
    console.error('Error bulk updating product images:', error)
    return NextResponse.json(
      { error: 'Failed to bulk update product images' },
      { status: 500 }
    )
  }
}