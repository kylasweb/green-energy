import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const brands = await prisma.brand.findMany({
            orderBy: { name: 'asc' }
        })

        return NextResponse.json({ brands })
    } catch (error) {
        console.error('Error fetching brands:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { name, description, logo, isActive = true } = await req.json()

        if (!name) {
            return NextResponse.json({ error: 'Brand name is required' }, { status: 400 })
        }

        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')

        const brand = await prisma.brand.create({
            data: {
                name,
                slug,
                description,
                logo,
                isActive
            }
        })

        return NextResponse.json(brand, { status: 201 })
    } catch (error) {
        console.error('Error creating brand:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id, name, description, logo, isActive } = await req.json()

        if (!id || !name) {
            return NextResponse.json({ error: 'ID and brand name are required' }, { status: 400 })
        }

        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')

        const brand = await prisma.brand.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                logo,
                isActive
            }
        })

        return NextResponse.json(brand)
    } catch (error) {
        console.error('Error updating brand:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Brand ID is required' }, { status: 400 })
        }

        // Check if brand has products
        const hasProducts = await prisma.product.findFirst({
            where: { brandId: id }
        })

        if (hasProducts) {
            // Soft delete - mark as inactive instead of hard delete
            const brand = await prisma.brand.update({
                where: { id },
                data: { isActive: false }
            })

            return NextResponse.json({
                message: 'Brand deactivated (has existing products)',
                brand
            })
        } else {
            // Hard delete if no products
            await prisma.brand.delete({
                where: { id }
            })

            return NextResponse.json({
                message: 'Brand deleted successfully'
            })
        }

    } catch (error) {
        console.error('Error deleting brand:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}