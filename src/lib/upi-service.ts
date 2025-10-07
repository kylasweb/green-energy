import crypto from 'crypto'
import { UpiPaymentStatus } from '@prisma/client'
import { RazorpayGateway } from './gateways/razorpay-gateway'

// Import db dynamically to avoid import issues
let db: any;

async function getDb() {
    if (!db) {
        const { db: database } = await import('@/lib/db');
        db = database;
    }
    return db;
}

// Mock UPI Gateway Configuration (In production, use environment variables)
interface UpiGatewayConfig {
    merchantId: string
    apiKey: string
    apiSecret: string
    webhookSecret: string
    baseUrl: string
}

// Mock UPI Gateway for demonstration - replace with actual gateway integration
class MockUpiGateway {
    private config: UpiGatewayConfig

    constructor(config: UpiGatewayConfig) {
        this.config = config
    }

    async initiatePayment(params: {
        amount: number
        currency: string
        vpa: string
        orderId: string
    }) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Generate mock payment response
        const paymentId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const qrString = `upi://pay?pa=${params.vpa}&pn=Test Merchant&tr=${params.orderId}&am=${params.amount}&cu=${params.currency}`

        return {
            success: true,
            data: {
                paymentId,
                qrCode: qrString,
                deepLink: qrString,
                intentUrl: qrString,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
            }
        }
    }

    async checkPaymentStatus(paymentId: string) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Mock payment status check
        const statuses = ['pending', 'success', 'failed']
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

        return {
            success: true,
            status: randomStatus,
            data: {
                paymentId,
                status: randomStatus,
                amount: 100, // Mock amount
                currency: 'INR',
                transactionId: `txn_${Date.now()}`,
                bankReference: randomStatus === 'success' ? `bank_ref_${Date.now()}` : null
            }
        }
    }

    async validateWebhook(payload: any, signature: string): Promise<boolean> {
        // Mock webhook validation
        return true
    }

    async initiateRefund(params: {
        transactionId: string
        amount: number
        reason: string
    }) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        const refundId = `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        return {
            success: true,
            data: {
                refundId,
                transactionId: params.transactionId,
                amount: params.amount,
                status: 'pending',
                reason: params.reason
            }
        }
    }
}

class UpiService {
    private gateway: MockUpiGateway | RazorpayGateway | null = null

    constructor() {
        // Gateway will be initialized lazily when needed
    }

    // Decrypt settings helper
    private decryptSetting(encryptedData: string): string {
        if (!encryptedData) return ''
        try {
            // For now, return the data as-is since we're storing it encrypted on the API side
            // The API handles the decryption when serving the data
            return encryptedData
        } catch (error) {
            console.error('Decryption error:', error)
            return encryptedData
        }
    }

    // Initialize gateway based on active settings
    private async initializeGateway() {
        if (this.gateway) return this.gateway

        try {
            // Try to load active UPI setting from database
            const database = await getDb();
            const activeSetting = await database.upiSettings.findFirst({
                where: { isActive: true }
            })

            if (activeSetting && activeSetting.provider !== 'mock') {
                console.log(`Initializing ${activeSetting.provider} gateway`)

                // Decrypt the credentials
                const apiKey = this.decryptSetting(activeSetting.apiKey)
                const apiSecret = this.decryptSetting(activeSetting.apiSecret)
                const merchantId = this.decryptSetting(activeSetting.merchantId)
                const webhookSecret = this.decryptSetting(activeSetting.webhookSecret)

                switch (activeSetting.provider) {
                    case 'razorpay':
                        this.gateway = new RazorpayGateway({
                            apiKey,
                            apiSecret,
                            merchantId,
                            webhookSecret
                        })
                        break
                    // Add other providers here as needed
                    default:
                        console.warn(`Unsupported provider: ${activeSetting.provider}, falling back to mock`)
                        this.gateway = this.createMockGateway()
                }
            } else {
                console.log('No active UPI setting found, using mock gateway')
                this.gateway = this.createMockGateway()
            }
        } catch (error) {
            console.error('Failed to initialize UPI gateway:', error)
            this.gateway = this.createMockGateway()
        }

        return this.gateway
    }

    private createMockGateway(): MockUpiGateway {
        const config: UpiGatewayConfig = {
            merchantId: process.env.UPI_MERCHANT_ID || 'test_merchant',
            apiKey: process.env.UPI_API_KEY || 'test_api_key',
            apiSecret: process.env.UPI_API_SECRET || 'test_api_secret',
            webhookSecret: process.env.UPI_WEBHOOK_SECRET || 'webhook_secret_key',
            baseUrl: process.env.UPI_GATEWAY_URL || 'https://api.mock-upi-gateway.com'
        }
        return new MockUpiGateway(config)
    }

    // Validate VPA format
    validateVpa(vpa: string): boolean {
        const vpaRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/
        return vpaRegex.test(vpa) && vpa.length >= 3 && vpa.length <= 50
    }

    // Initiate UPI payment
    async initiatePayment(params: {
        orderId: string
        userId?: string
        vpa: string
        amount: number
        currency?: string
    }) {
        try {
            // Validate VPA
            if (!this.validateVpa(params.vpa)) {
                throw new Error('Invalid VPA format')
            }

            // Check if order exists
            const database = await getDb();
            const order = await database.order.findUnique({
                where: { id: params.orderId }
            })

            if (!order) {
                throw new Error('Order not found')
            }

            // Check if there's already a pending transaction for this order
            const existingTransaction = await database.upiTransaction.findFirst({
                where: {
                    orderId: params.orderId,
                    status: UpiPaymentStatus.PENDING
                }
            })

            if (existingTransaction) {
                throw new Error('Payment already in progress for this order')
            }

            // Initialize and get gateway
            const gateway = await this.initializeGateway()

            // Initiate payment with gateway
            const gatewayResponse = await gateway.initiatePayment({
                amount: params.amount,
                currency: params.currency || 'INR',
                vpa: params.vpa,
                orderId: params.orderId
            })

            if (!gatewayResponse.success || !gatewayResponse.data) {
                throw new Error('Failed to initiate payment with gateway')
            }

            // Store transaction in database
            const transaction = await database.upiTransaction.create({
                data: {
                    orderId: params.orderId,
                    userId: params.userId,
                    gatewayTransactionId: gatewayResponse.data.paymentId,
                    amount: params.amount,
                    currency: params.currency || 'INR',
                    status: UpiPaymentStatus.PENDING,
                    vpa: params.vpa
                }
            })

            return {
                success: true,
                data: {
                    transactionId: transaction.id,
                    paymentId: gatewayResponse.data.paymentId,
                    qrCode: gatewayResponse.data.qrCode,
                    deepLink: gatewayResponse.data.deepLink || gatewayResponse.data.qrCode,
                    intentUrl: gatewayResponse.data.intentUrl || gatewayResponse.data.qrCode,
                    expiresAt: gatewayResponse.data.expiresAt,
                    amount: params.amount,
                    currency: params.currency || 'INR'
                }
            }
        } catch (error) {
            console.error('UPI payment initiation failed:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }
        }
    }

    // Check payment status
    async checkPaymentStatus(transactionId: string) {
        try {
            // Get transaction from database
            const database = await getDb();
            const transaction = await database.upiTransaction.findUnique({
                where: { id: transactionId }
            })

            if (!transaction) {
                throw new Error('Transaction not found')
            }

            // If already completed or failed, return stored status
            if (transaction.status !== UpiPaymentStatus.PENDING) {
                return {
                    success: true,
                    data: {
                        transactionId: transaction.id,
                        status: transaction.status,
                        amount: transaction.amount,
                        currency: transaction.currency,
                        paymentId: transaction.gatewayTransactionId,
                        vpa: transaction.vpa
                    }
                }
            }

            // Check with gateway
            const gateway = await this.initializeGateway()
            const gatewayResponse = await gateway.checkPaymentStatus(transaction.gatewayTransactionId)

            if (!gatewayResponse.success) {
                throw new Error('Failed to check payment status with gateway')
            }

            // Map gateway status to our enum
            let mappedStatus: UpiPaymentStatus
            switch (gatewayResponse.status) {
                case 'success':
                case 'completed':
                case 'captured':
                    mappedStatus = UpiPaymentStatus.SUCCESS
                    break
                case 'failed':
                case 'cancelled':
                    mappedStatus = UpiPaymentStatus.FAILED
                    break
                default:
                    mappedStatus = UpiPaymentStatus.PENDING
            }

            // Update transaction if status changed
            if (mappedStatus !== transaction.status) {
                await database.upiTransaction.update({
                    where: { id: transactionId },
                    data: {
                        status: mappedStatus,
                        webhookData: gatewayResponse.data
                    }
                })
            }

            return {
                success: true,
                data: {
                    transactionId: transaction.id,
                    status: mappedStatus,
                    amount: transaction.amount,
                    currency: transaction.currency,
                    paymentId: transaction.gatewayTransactionId,
                    vpa: transaction.vpa,
                    gatewayData: gatewayResponse.data
                }
            }
        } catch (error) {
            console.error('Payment status check failed:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }
        }
    }

    // Handle webhook notifications
    async handleWebhook(payload: any, signature: string, provider: string = 'mock') {
        try {
            // Initialize gateway
            const gateway = await this.initializeGateway()

            // Validate webhook signature
            const isValid = await gateway.validateWebhook(payload, signature)
            if (!isValid) {
                throw new Error('Invalid webhook signature')
            }

            // Extract payment information from webhook
            const { paymentId, status, orderId, amount } = this.extractWebhookData(payload, provider)

            // Find transaction by gateway payment ID
            const database = await getDb();
            const transaction = await database.upiTransaction.findFirst({
                where: { gatewayTransactionId: paymentId }
            })

            if (!transaction) {
                throw new Error('Transaction not found for webhook')
            }

            // Map webhook status to our enum
            let mappedStatus: UpiPaymentStatus
            switch (status.toLowerCase()) {
                case 'success':
                case 'completed':
                case 'captured':
                case 'paid':
                    mappedStatus = UpiPaymentStatus.SUCCESS
                    break
                case 'failed':
                case 'cancelled':
                case 'expired':
                    mappedStatus = UpiPaymentStatus.FAILED
                    break
                default:
                    mappedStatus = UpiPaymentStatus.PENDING
            }

            // Update transaction
            await database.upiTransaction.update({
                where: { id: transaction.id },
                data: {
                    status: mappedStatus,
                    webhookData: payload
                }
            })

            // If payment successful, update order status
            if (mappedStatus === UpiPaymentStatus.SUCCESS) {
                await database.order.update({
                    where: { id: transaction.orderId },
                    data: {
                        status: 'COMPLETED',
                        updatedAt: new Date()
                    }
                })
            }

            return {
                success: true,
                data: {
                    transactionId: transaction.id,
                    status: mappedStatus,
                    processed: true
                }
            }
        } catch (error) {
            console.error('Webhook processing failed:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }
        }
    }

    // Extract webhook data based on provider
    private extractWebhookData(payload: any, provider: string) {
        switch (provider) {
            case 'razorpay':
                return {
                    paymentId: payload.payload.payment.entity.id,
                    status: payload.payload.payment.entity.status,
                    orderId: payload.payload.payment.entity.order_id,
                    amount: payload.payload.payment.entity.amount / 100
                }
            case 'payu':
                return {
                    paymentId: payload.mihpayid,
                    status: payload.status,
                    orderId: payload.txnid,
                    amount: parseFloat(payload.amount)
                }
            case 'phonepe':
                return {
                    paymentId: payload.transactionId,
                    status: payload.code === 'PAYMENT_SUCCESS' ? 'success' : 'failed',
                    orderId: payload.merchantTransactionId,
                    amount: payload.amount / 100
                }
            default:
                // Mock provider format
                return {
                    paymentId: payload.paymentId,
                    status: payload.status,
                    orderId: payload.orderId,
                    amount: payload.amount
                }
        }
    }

    // Get transaction details
    async getTransaction(transactionId: string) {
        try {
            const database = await getDb();
            const transaction = await database.upiTransaction.findUnique({
                where: { id: transactionId },
                include: {
                    order: true
                }
            })

            if (!transaction) {
                throw new Error('Transaction not found')
            }

            return {
                success: true,
                data: transaction
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }
        }
    }

    // Get all transactions for a user
    async getUserTransactions(userId: string, limit: number = 10, offset: number = 0) {
        try {
            const database = await getDb();
            const transactions = await database.upiTransaction.findMany({
                where: { userId },
                include: {
                    order: true
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset
            })

            const totalCount = await database.upiTransaction.count({
                where: { userId }
            })

            return {
                success: true,
                data: {
                    transactions,
                    totalCount,
                    hasMore: offset + limit < totalCount
                }
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }
        }
    }

    // Initiate refund for a transaction
    async initiateRefund(transactionId: string, amount?: number, reason?: string) {
        try {
            const database = await getDb();
            const transaction = await database.upiTransaction.findUnique({
                where: { id: transactionId }
            })

            if (!transaction) {
                throw new Error('Transaction not found')
            }

            if (transaction.status !== UpiPaymentStatus.SUCCESS) {
                throw new Error('Can only refund successful transactions')
            }

            const gateway = await this.initializeGateway()
            const refundAmount = amount || transaction.amount

            // Initiate refund with gateway
            const result = await gateway.initiateRefund({
                transactionId: transaction.gatewayTransactionId,
                amount: refundAmount,
                reason: reason || 'Customer requested refund'
            })

            return {
                success: true,
                data: result
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }
        }
    }

    // Get transactions with filters
    async getTransactions(params: {
        userId?: string
        status?: string
        limit?: number
        offset?: number
        orderId?: string
    } = {}) {
        try {
            const database = await getDb();
            const { userId, status, limit = 10, offset = 0, orderId } = params;

            const where: any = {};
            if (userId) where.userId = userId;
            if (status) where.status = status;
            if (orderId) where.orderId = orderId;

            const transactions = await database.upiTransaction.findMany({
                where,
                include: {
                    order: true
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset
            });

            const totalCount = await database.upiTransaction.count({ where });

            return {
                success: true,
                data: {
                    transactions,
                    totalCount,
                    hasMore: offset + limit < totalCount
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }
}

// Export singleton instance
export const upiService = new UpiService()