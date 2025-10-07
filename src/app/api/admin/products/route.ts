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
        const category = searchParams.get('category')
        const brand = searchParams.get('brand')
        const status = searchParams.get('status')

        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {}

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } }
            ]
        }

        if (category) {
            where.category = {
                slug: category
            }
        }

        if (brand) {
            where.brand = {
                slug: brand
            }
        }

        if (status === 'active') {
            where.isActive = true
        } else if (status === 'inactive') {
            where.isActive = false
        }

        const [products, total, categories, brands] = await Promise.all([
            db.product.findMany({
                where,
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    },
                    brand: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            }),
            db.product.count({ where }),
            db.category.findMany({
                where: { isActive: true },
                select: { id: true, name: true, slug: true },
                orderBy: { name: 'asc' }
            }),
            db.brand.findMany({
                where: { isActive: true },
                select: { id: true, name: true, slug: true },
                orderBy: { name: 'asc' }
            })
        ])

        return NextResponse.json({
            products,
            total,
            categories,
            brands,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            hasMore: skip + limit < total
        })

    } catch (error) {
        console.error('Error fetching admin products:', error)
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            )
        }

        const body = await request.json()
        const {
            name,
            description,
            sku,
            price,
            mrp,
            stockQuantity,
            lowStockThreshold,
            categoryId,
            brandId,
            isActive,
            isFeatured,
            images,
            tags,
            specifications,
            features,
            dimensions,
            weight
        } = body

        if (!name || !sku || !price || !categoryId || !brandId) {
            return NextResponse.json(
                { error: 'Name, SKU, price, category and brand are required' },
                { status: 400 }
            )
        }

        // Generate slug from name
        const slug = name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()

        // Check if SKU already exists
        const existingSku = await db.product.findUnique({
            where: { sku }
        })

        if (existingSku) {
            return NextResponse.json(
                { error: 'SKU already exists' },
                { status: 400 }
            )
        }

        const product = await db.product.create({
            data: {
                name,
                slug,
                description,
                sku,
                price: parseFloat(price),
                mrp: parseFloat(mrp || price),
                stockQuantity: parseInt(stockQuantity || 0),
                lowStockThreshold: parseInt(lowStockThreshold || 10),
                categoryId,
                brandId,
                isActive: Boolean(isActive),
                isFeatured: Boolean(isFeatured),
                images: images || [],
                tags: tags || [],
                specifications: specifications || {},
                features: features || [],
                dimensions: dimensions || {},
                weight: weight ? parseFloat(weight) : null
            },
            include: {
                category: true,
                brand: true
            }
        })

        return NextResponse.json(product, { status: 201 })

    } catch (error) {
        console.error('Error creating product:', error)
        return NextResponse.json(
            { error: 'Failed to create product' },
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

        const body = await request.json()
        const {
            id,
            name,
            description,
            sku,
            price,
            mrp,
            stockQuantity,
            lowStockThreshold,
            categoryId,
            brandId,
            isActive,
            isFeatured,
            images,
            tags,
            specifications,
            features,
            dimensions,
            weight
        } = body

        if (!id) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            )
        }

        // Check if product exists
        const existingProduct = await db.product.findUnique({
            where: { id }
        })

        if (!existingProduct) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        // Check if SKU already exists for a different product
        if (sku && sku !== existingProduct.sku) {
            const existingSku = await db.product.findUnique({
                where: { sku }
            })

            if (existingSku) {
                return NextResponse.json(
                    { error: 'SKU already exists' },
                    { status: 400 }
                )
            }
        }

        // Generate new slug if name changed
        let slug = existingProduct.slug
        if (name && name !== existingProduct.name) {
            slug = name.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim()
        }

        const updateData: any = { slug }

        // Only update fields that are provided
        if (name) updateData.name = name
        if (description !== undefined) updateData.description = description
        if (sku) updateData.sku = sku
        if (price !== undefined) updateData.price = parseFloat(price)
        if (mrp !== undefined) updateData.mrp = parseFloat(mrp)
        if (stockQuantity !== undefined) updateData.stockQuantity = parseInt(stockQuantity)
        if (lowStockThreshold !== undefined) updateData.lowStockThreshold = parseInt(lowStockThreshold)
        if (categoryId) updateData.categoryId = categoryId
        if (brandId) updateData.brandId = brandId
        if (isActive !== undefined) updateData.isActive = Boolean(isActive)
        if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured)
        if (images !== undefined) updateData.images = images
        if (tags !== undefined) updateData.tags = tags
        if (specifications !== undefined) updateData.specifications = specifications
        if (features !== undefined) updateData.features = features
        if (dimensions !== undefined) updateData.dimensions = dimensions
        if (weight !== undefined) updateData.weight = weight ? parseFloat(weight) : null

        const product = await db.product.update({
            where: { id },
            data: updateData,
            include: {
                category: true,
                brand: true
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.error('Error updating product:', error)
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            )
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            )
        }

        // Check if product exists
        const existingProduct = await db.product.findUnique({
            where: { id }
        })

        if (!existingProduct) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        // Check if product has orders (soft delete if it does)
        const hasOrders = await db.orderItem.findFirst({
            where: { productId: id }
        })

        if (hasOrders) {
            // Soft delete - mark as inactive instead of hard delete
            const product = await db.product.update({
                where: { id },
                data: { isActive: false }
            })

            return NextResponse.json({
                message: 'Product deactivated (has existing orders)',
                product
            })
        } else {
            // Hard delete if no orders
            await db.product.delete({
                where: { id }
            })

            return NextResponse.json({
                message: 'Product deleted successfully'
            })
        }

    } catch (error) {
        console.error('Error deleting product:', error)
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        )
    }
}