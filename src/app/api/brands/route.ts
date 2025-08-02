import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'

    const brands = await db.brand.findMany({
      where: {
        isActive: true
      },
      include: {
        products: includeProducts ? {
          where: { isActive: true },
          select: { id: true }
        } : false
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Add product count for each brand
    const brandsWithCount = brands.map(brand => ({
      ...brand,
      productCount: includeProducts ? brand.products?.length || 0 : 0
    }))

    return NextResponse.json(brandsWithCount)
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, logo, website } = body

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const brand = await db.brand.create({
      data: {
        name,
        slug,
        description,
        logo,
        website
      }
    })

    return NextResponse.json(brand, { status: 201 })
  } catch (error) {
    console.error('Error creating brand:', error)
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    )
  }
}