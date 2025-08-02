import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Get all products that don't have images or have empty images array
    const productsWithoutImages = await db.product.findMany({
      where: {
        OR: [
          { images: null },
          { images: [] },
          { images: '[]' }
        ]
      },
      include: {
        brand: true,
        category: true
      }
    })

    if (productsWithoutImages.length === 0) {
      return NextResponse.json({
        success: true,
        message: "All products already have images",
        updatedProducts: 0
      })
    }

    let updatedCount = 0

    for (const product of productsWithoutImages) {
      try {
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
            await db.product.update({
              where: { id: product.id },
              data: { 
                images: [searchData.images[0]],
                updatedAt: new Date()
              }
            })
            updatedCount++
          }
        }
      } catch (error) {
        console.error(`Error fetching images for product ${product.id}:`, error)
        // Continue with next product even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully fetched images for ${updatedCount} out of ${productsWithoutImages.length} products`,
      updatedProducts: updatedCount,
      totalProcessed: productsWithoutImages.length
    })

  } catch (error) {
    console.error('Error in auto-fetching product images:', error)
    return NextResponse.json(
      { error: 'Failed to auto-fetch product images' },
      { status: 500 }
    )
  }
}