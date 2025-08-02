import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'
    const includeChildren = searchParams.get('includeChildren') === 'true'

    const categories = await db.category.findMany({
      where: {
        isActive: true
      },
      include: {
        products: includeProducts ? {
          where: { isActive: true },
          select: { id: true }
        } : false,
        children: includeChildren ? {
          where: { isActive: true },
          include: {
            products: includeProducts ? {
              where: { isActive: true },
              select: { id: true }
            } : false
          }
        } : false
      },
      orderBy: {
        sortOrder: 'asc'
      }
    })

    // Add product count for each category
    const categoriesWithCount = categories.map(category => ({
      ...category,
      productCount: includeProducts ? category.products?.length || 0 : 0
    }))

    return NextResponse.json(categoriesWithCount)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, image, parentId, sortOrder } = body

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const category = await db.category.create({
      data: {
        name,
        slug,
        description,
        image,
        parentId,
        sortOrder: sortOrder || 0
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}