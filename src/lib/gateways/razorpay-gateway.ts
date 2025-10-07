import crypto from 'crypto';

export interface RazorpayConfig {
    apiKey: string;
    apiSecret: string;
    webhookSecret: string;
    merchantId: string;
}

export class RazorpayGateway {
    private razorpay: any;
    private config: RazorpayConfig;

    constructor(config: RazorpayConfig) {
        this.config = config;

        this.razorpay = null;
    }

    // Initialize Razorpay instance asynchronously
    private async initRazorpay() {
        if (this.razorpay) return this.razorpay;

        try {
            const { default: Razorpay } = await import('razorpay');
            this.razorpay = new Razorpay({
                key_id: this.config.apiKey,
                key_secret: this.config.apiSecret,
            });
            return this.razorpay;
        } catch (error) {
            console.warn('Razorpay package not installed. Install with: npm install razorpay');
            throw new Error('Razorpay package not available');
        }
    }

    async initiatePayment(params: {
        amount: number;
        currency: string;
        vpa: string;
        orderId: string;
    }) {
        try {
            const razorpay = await this.initRazorpay();

            const order = await razorpay.orders.create({
                amount: params.amount * 100, // Convert to paise
                currency: 'INR',
                receipt: params.orderId,
                payment_capture: 1,
            });

            return {
                success: true,
                data: {
                    paymentId: order.id,
                    qrCode: this.generateUPIString(order.id, params.amount),
                    deepLink: this.generateUPIString(order.id, params.amount),
                    intentUrl: this.generateUPIString(order.id, params.amount),
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
                },
            };
        } catch (error: any) {
            return {
                success: false,
                error: `Payment initiation failed: ${error?.message || 'Unknown error'}`,
            };
        }
    }

    async checkPaymentStatus(paymentId: string) {
        try {
            const razorpay = await this.initRazorpay();

            const payment = await razorpay.payments.fetch(paymentId);

            return {
                success: true,
                status: payment.status === 'captured' ? 'completed' :
                    payment.status === 'failed' ? 'failed' : 'pending',
                data: {
                    paymentId: payment.id,
                    orderId: payment.order_id,
                    amount: payment.amount / 100,
                    method: payment.method,
                    transactionId: payment.acquirer_data?.rrn || payment.id,
                },
            };
        } catch (error: any) {
            return {
                success: false,
                error: `Status check failed: ${error?.message || 'Unknown error'}`,
            };
        }
    } async validateWebhook(payload: any, signature: string): Promise<boolean> {
        const expectedSignature = crypto
            .createHmac('sha256', this.config.webhookSecret)
            .update(JSON.stringify(payload))
            .digest('hex');

        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );
    }

    async initiateRefund(params: {
        transactionId: string
        amount: number
        reason: string
    }) {
        try {
            const razorpay = await this.initRazorpay();

            const refund = await razorpay.payments.refund(params.transactionId, {
                amount: params.amount * 100, // Convert to paise
                notes: {
                    reason: params.reason
                }
            });

            return {
                success: true,
                data: {
                    refundId: refund.id,
                    transactionId: params.transactionId,
                    amount: refund.amount / 100, // Convert back to rupees
                    status: refund.status,
                    reason: params.reason
                }
            };
        } catch (error: any) {
            return {
                success: false,
                error: `Refund initiation failed: ${error?.message || 'Unknown error'}`,
            };
        }
    }

    private generateUPIString(orderId: string, amount: number): string {
        // Generate UPI payment string for QR codes
        const upiId = 'your-business@razorpay'; // Replace with your UPI ID
        return `upi://pay?pa=${upiId}&pn=Your Business&tr=${orderId}&am=${amount}&cu=INR`;
    }
}