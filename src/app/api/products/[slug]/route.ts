import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Get product details
    const product = await db.product.findFirst({
      where: {
        slug,
        isActive: true
      },
      include: {
        category: true,
        brand: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

    // Get related products (same category, excluding current product)
    const relatedProducts = await db.product.findMany({
      where: {
        categoryId: product.categoryId,
        isActive: true,
        id: {
          not: product.id
        }
      },
      include: {
        category: true,
        brand: true,
        reviews: {
          select: {
            rating: true
          }
        }
      },
      take: 6,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate average rating for related products
    const relatedProductsWithRating = relatedProducts.map(relatedProduct => {
      const relatedAvgRating = relatedProduct.reviews.length > 0
        ? relatedProduct.reviews.reduce((sum, review) => sum + review.rating, 0) / relatedProduct.reviews.length
        : 0
      return {
        ...relatedProduct,
        avgRating: Math.round(relatedAvgRating * 10) / 10,
        reviewCount: relatedProduct.reviews.length
      }
    })

    return NextResponse.json({
      product: {
        ...product,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: product.reviews.length
      },
      relatedProducts: relatedProductsWithRating
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}