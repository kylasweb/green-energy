import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import crypto from 'crypto'

const UpiSettingsSchema = z.object({
    provider: z.enum(['razorpay', 'payu', 'phonepe', 'gpay', 'mock']),
    apiKey: z.string().min(1, 'API key is required'),
    apiSecret: z.string().min(1, 'API secret is required'),
    merchantId: z.string().min(1, 'Merchant ID is required'),
    webhookSecret: z.string().min(1, 'Webhook secret is required'),
    isTestMode: z.boolean().default(false),
    isActive: z.boolean().default(true),
    webhookUrl: z.string().url('Invalid webhook URL').optional(),
    timeoutMinutes: z.number().min(1).max(30).default(15),
    maxRetries: z.number().min(1).max(5).default(3),
    name: z.string().min(1, 'Configuration name is required'),
    description: z.string().optional()
})

// Encryption functions
const ALGORITHM = 'aes-256-gcm'
const getEncryptionKey = () => {
    const key = process.env.ENCRYPTION_KEY || 'your-32-byte-secret-key-here!!'
    return Buffer.from(key.slice(0, 32), 'utf8')
}

function encrypt(text: string): string {
    const key = getEncryptionKey()
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(ALGORITHM, key)

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return `${encrypted}:${iv.toString('hex')}`
}

function decrypt(encryptedData: string): string {
    if (!encryptedData) return ''
    try {
        const key = getEncryptionKey()
        const [encrypted, ivHex] = encryptedData.split(':')

        const decipher = crypto.createDecipher(ALGORITHM, key)

        let decrypted = decipher.update(encrypted, 'hex', 'utf8')
        decrypted += decipher.final('utf8')

        return decrypted
    } catch (error) {
        console.error('Decryption error:', error)
        return encryptedData
    }
}

// GET - Fetch all UPI settings
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            )
        }

        const { db } = await import('@/lib/db')
        const { searchParams } = new URL(request.url)
        const settingId = searchParams.get('id')

        if (settingId) {
            // Get specific setting
            const setting = await db.upiSettings.findUnique({
                where: { id: settingId },
                select: {
                    id: true,
                    provider: true,
                    isTestMode: true,
                    isActive: true,
                    webhookUrl: true,
                    timeoutMinutes: true,
                    maxRetries: true,
                    name: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true
                    // Don't expose encrypted sensitive keys in list
                }
            })

            if (!setting) {
                return NextResponse.json(
                    { error: 'Setting not found' },
                    { status: 404 }
                )
            }

            return NextResponse.json({ setting })
        } else {
            // Get all settings
            const settings = await db.upiSettings.findMany({
                select: {
                    id: true,
                    provider: true,
                    isTestMode: true,
                    isActive: true,
                    webhookUrl: true,
                    timeoutMinutes: true,
                    maxRetries: true,
                    name: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true
                },
                orderBy: { createdAt: 'desc' }
            })

            return NextResponse.json({ settings })
        }
    } catch (error) {
        console.error('Error fetching UPI settings:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// POST - Create new UPI setting
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json(
                { error: 'Super admin access required' },
                { status: 403 }
            )
        }

        const body = await request.json()
        const validatedData = UpiSettingsSchema.parse(body)

        const { db } = await import('@/lib/db')

        // Check if a setting with the same name already exists
        const existingByName = await db.upiSettings.findFirst({
            where: { name: validatedData.name }
        })

        if (existingByName) {
            return NextResponse.json(
                { error: 'A setting with this name already exists' },
                { status: 400 }
            )
        }

        // If this is set as active, deactivate others
        if (validatedData.isActive) {
            await db.upiSettings.updateMany({
                where: { isActive: true },
                data: { isActive: false }
            })
        }

        // Encrypt sensitive data
        const encryptedSetting = await db.upiSettings.create({
            data: {
                provider: validatedData.provider,
                apiKey: encrypt(validatedData.apiKey),
                apiSecret: encrypt(validatedData.apiSecret),
                merchantId: encrypt(validatedData.merchantId),
                webhookSecret: encrypt(validatedData.webhookSecret),
                isTestMode: validatedData.isTestMode,
                isActive: validatedData.isActive,
                webhookUrl: validatedData.webhookUrl,
                timeoutMinutes: validatedData.timeoutMinutes,
                maxRetries: validatedData.maxRetries,
                name: validatedData.name,
                description: validatedData.description
            },
            select: {
                id: true,
                provider: true,
                isTestMode: true,
                isActive: true,
                webhookUrl: true,
                timeoutMinutes: true,
                maxRetries: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true
            }
        })

        return NextResponse.json({
            success: true,
            message: 'UPI setting created successfully',
            setting: encryptedSetting
        })
    } catch (error) {
        console.error('Error creating UPI setting:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation failed', details: error.issues },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PUT - Update existing UPI setting
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json(
                { error: 'Super admin access required' },
                { status: 403 }
            )
        }

        const body = await request.json()
        const { id, ...updateData } = body

        if (!id) {
            return NextResponse.json(
                { error: 'Setting ID is required' },
                { status: 400 }
            )
        }

        const validatedData = UpiSettingsSchema.partial().parse(updateData)
        const { db } = await import('@/lib/db')

        // Check if setting exists
        const existingSetting = await db.upiSettings.findUnique({
            where: { id }
        })

        if (!existingSetting) {
            return NextResponse.json(
                { error: 'Setting not found' },
                { status: 404 }
            )
        }

        // Check name uniqueness if name is being updated
        if (validatedData.name && validatedData.name !== existingSetting.name) {
            const existingByName = await db.upiSettings.findFirst({
                where: {
                    name: validatedData.name,
                    id: { not: id }
                }
            })

            if (existingByName) {
                return NextResponse.json(
                    { error: 'A setting with this name already exists' },
                    { status: 400 }
                )
            }
        }

        // If setting is being activated, deactivate others
        if (validatedData.isActive === true) {
            await db.upiSettings.updateMany({
                where: {
                    isActive: true,
                    id: { not: id }
                },
                data: { isActive: false }
            })
        }

        // Prepare update data with encryption for sensitive fields
        const updatePayload: any = {}

        Object.keys(validatedData).forEach(key => {
            const value = validatedData[key as keyof typeof validatedData]
            if (value !== undefined) {
                if (['apiKey', 'apiSecret', 'merchantId', 'webhookSecret'].includes(key)) {
                    updatePayload[key] = encrypt(value as string)
                } else {
                    updatePayload[key] = value
                }
            }
        })

        const updatedSetting = await db.upiSettings.update({
            where: { id },
            data: updatePayload,
            select: {
                id: true,
                provider: true,
                isTestMode: true,
                isActive: true,
                webhookUrl: true,
                timeoutMinutes: true,
                maxRetries: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true
            }
        })

        return NextResponse.json({
            success: true,
            message: 'UPI setting updated successfully',
            setting: updatedSetting
        })
    } catch (error) {
        console.error('Error updating UPI setting:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation failed', details: error.issues },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE - Remove UPI setting
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json(
                { error: 'Super admin access required' },
                { status: 403 }
            )
        }

        const { searchParams } = new URL(request.url)
        const settingId = searchParams.get('id')

        if (!settingId) {
            return NextResponse.json(
                { error: 'Setting ID is required' },
                { status: 400 }
            )
        }

        const { db } = await import('@/lib/db')

        // Check if setting exists
        const existingSetting = await db.upiSettings.findUnique({
            where: { id: settingId }
        })

        if (!existingSetting) {
            return NextResponse.json(
                { error: 'Setting not found' },
                { status: 404 }
            )
        }

        // Don't allow deletion of active setting without replacement
        if (existingSetting.isActive) {
            const otherSettings = await db.upiSettings.count({
                where: {
                    id: { not: settingId }
                }
            })

            if (otherSettings === 0) {
                return NextResponse.json(
                    { error: 'Cannot delete the last UPI setting. Please add another setting first.' },
                    { status: 400 }
                )
            }
        }

        await db.upiSettings.delete({
            where: { id: settingId }
        })

        return NextResponse.json({
            success: true,
            message: 'UPI setting deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting UPI setting:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}