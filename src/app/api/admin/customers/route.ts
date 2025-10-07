import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

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
        const status = searchParams.get('status')

        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {
            role: 'CUSTOMER'
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } }
            ]
        }

        if (status === 'active') {
            where.isActive = true
        } else if (status === 'inactive') {
            where.isActive = false
        }

        const [users, total] = await Promise.all([
            db.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    address: true,
                    city: true,
                    state: true,
                    country: true,
                    zipCode: true,
                    isActive: true,
                    createdAt: true,
                    _count: {
                        select: {
                            orders: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            }),
            db.user.count({ where })
        ])

        // Transform users data to match expected interface
        const customers = users.map(user => ({
            id: user.id,
            name: user.name || 'N/A',
            email: user.email,
            phone: user.phone || 'N/A',
            address: user.address || 'N/A',
            city: user.city || 'N/A',
            state: user.state || 'N/A',
            country: user.country || 'N/A',
            zipCode: user.zipCode || 'N/A',
            totalOrders: user._count.orders,
            isActive: user.isActive,
            joinedAt: user.createdAt.toISOString().split('T')[0]
        }))

        return NextResponse.json({
            customers,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            hasMore: skip + limit < total
        })

    } catch (error) {
        console.error('Error fetching admin customers:', error)
        return NextResponse.json(
            { error: 'Failed to fetch customers' },
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
            email,
            phone,
            address,
            city,
            state,
            country,
            zipCode,
            role = 'CUSTOMER',
            isActive = true
        } = body

        if (!name || !email) {
            return NextResponse.json(
                { error: 'Name and email are required' },
                { status: 400 }
            )
        }

        // Check if email already exists
        const existingUser = await db.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already exists' },
                { status: 400 }
            )
        }

        // Generate a temporary password for admin-created users
        const tempPassword = Math.random().toString(36).slice(-8)
        const hashedPassword = await bcrypt.hash(tempPassword, 12)

        const user = await db.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                role: role as any,
                address,
                city,
                state,
                country,
                zipCode,
                isActive: Boolean(isActive)
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                address: true,
                city: true,
                state: true,
                country: true,
                zipCode: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        })

        return NextResponse.json({
            user,
            tempPassword,
            message: 'User created successfully. Please provide them with the temporary password.'
        }, { status: 201 })

    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json(
            { error: 'Failed to create user' },
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
            email,
            phone,
            address,
            city,
            state,
            country,
            zipCode,
            role,
            isActive
        } = body

        if (!id) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        // Check if user exists
        const existingUser = await db.user.findUnique({
            where: { id }
        })

        if (!existingUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Check if email already exists for a different user
        if (email && email !== existingUser.email) {
            const existingEmail = await db.user.findUnique({
                where: { email }
            })

            if (existingEmail) {
                return NextResponse.json(
                    { error: 'Email already exists' },
                    { status: 400 }
                )
            }
        }

        // Prevent users from changing their own role or admin status
        if (session.user.id === id && (role !== existingUser.role || isActive === false)) {
            return NextResponse.json(
                { error: 'Cannot modify your own role or status' },
                { status: 403 }
            )
        }

        const updateData: any = {}

        // Only update fields that are provided
        if (name) updateData.name = name
        if (email) updateData.email = email
        if (phone !== undefined) updateData.phone = phone
        if (address !== undefined) updateData.address = address
        if (city !== undefined) updateData.city = city
        if (state !== undefined) updateData.state = state
        if (country !== undefined) updateData.country = country
        if (zipCode !== undefined) updateData.zipCode = zipCode
        if (role) updateData.role = role
        if (isActive !== undefined) updateData.isActive = Boolean(isActive)

        const user = await db.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                address: true,
                city: true,
                state: true,
                country: true,
                zipCode: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            }
        })

        return NextResponse.json(user)

    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json(
            { error: 'Failed to update user' },
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
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        // Prevent users from deleting themselves
        if (session.user.id === id) {
            return NextResponse.json(
                { error: 'Cannot delete your own account' },
                { status: 403 }
            )
        }

        // Check if user exists
        const existingUser = await db.user.findUnique({
            where: { id }
        })

        if (!existingUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // Check if user has orders (soft delete if they do)
        const hasOrders = await db.order.findFirst({
            where: { userId: id }
        })

        if (hasOrders) {
            // Soft delete - mark as inactive instead of hard delete
            const user = await db.user.update({
                where: { id },
                data: { isActive: false }
            })

            return NextResponse.json({
                message: 'User deactivated (has existing orders)',
                user
            })
        } else {
            // Hard delete if no orders
            await db.user.delete({
                where: { id }
            })

            return NextResponse.json({
                message: 'User deleted successfully'
            })
        }

    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        )
    }
}