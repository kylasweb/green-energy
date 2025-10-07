'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle, Smartphone, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface UpiPaymentProps {
  orderId: string
  amount: number
  onSuccess: (transactionId: string) => void
  onCancel: () => void
}

interface SavedVpa {
  id: string
  vpa: string
  isDefault: boolean
}

export default function UpiPayment({ orderId, amount, onSuccess, onCancel }: UpiPaymentProps) {
  const [vpa, setVpa] = useState('')
  const [savedVpas, setSavedVpas] = useState<SavedVpa[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle')
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes

  // Load saved VPAs on component mount
  useEffect(() => {
    loadSavedVpas()
  }, [])

  // Timer for payment timeout
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (paymentStatus === 'pending' && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
    } else if (timeRemaining === 0 && paymentStatus === 'pending') {
      handlePaymentTimeout()
    }
    return () => clearInterval(timer)
  }, [paymentStatus, timeRemaining])

  const loadSavedVpas = async () => {
    try {
      const response = await fetch('/api/user/vpas')
      if (response.ok) {
        const data = await response.json()
        setSavedVpas(data.vpas)
        
        // Set default VPA if available
        const defaultVpa = data.vpas.find((v: SavedVpa) => v.isDefault)
        if (defaultVpa) {
          setVpa(defaultVpa.vpa)
        }
      }
    } catch (error) {
      console.error('Error loading saved VPAs:', error)
    }
  }

  const validateVpa = (vpaString: string) => {
    const vpaRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/
    return vpaRegex.test(vpaString)
  }

  const initiatePayment = async () => {
    if (!vpa.trim()) {
      setError('Please enter a valid UPI ID')
      return
    }

    if (!validateVpa(vpa)) {
      setError('Please enter a valid UPI ID format (e.g., user@paytm)')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/payments/upi/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          vpa: vpa.trim()
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setTransactionId(data.transactionId)
        setPaymentStatus('pending')
        setTimeRemaining(300) // Reset timer
        
        // Start polling for payment status
        startStatusPolling(data.transactionId)
        
        toast.success('Payment initiated! Please approve the transaction in your UPI app.')
      } else {
        setError(data.error || 'Failed to initiate payment')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const startStatusPolling = (txnId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payments/upi/status/${orderId}`)
        const data = await response.json()

        if (data.status === 'SUCCESS') {
          setPaymentStatus('success')
          clearInterval(pollInterval)
          onSuccess(txnId)
        } else if (data.status === 'FAILED') {
          setPaymentStatus('failed')
          setError('Payment failed. Please try again.')
          clearInterval(pollInterval)
        }
        // Continue polling for PENDING status
      } catch (error) {
        console.error('Error polling payment status:', error)
      }
    }, 3000) // Poll every 3 seconds

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval)
      if (paymentStatus === 'pending') {
        handlePaymentTimeout()
      }
    }, 300000)
  }

  const handlePaymentTimeout = () => {
    setPaymentStatus('failed')
    setError('Payment timeout. Please try again.')
  }

  const saveVpa = async (vpaToSave: string) => {
    try {
      const response = await fetch('/api/user/vpas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vpa: vpaToSave })
      })

      if (response.ok) {
        loadSavedVpas() // Refresh the list
        toast.success('UPI ID saved for future use')
      }
    } catch (error) {
      console.error('Error saving VPA:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (paymentStatus === 'success') {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-700">Payment Successful!</h3>
            <p className="text-gray-600 mt-2">Your payment has been processed successfully.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Pay with UPI
        </CardTitle>
        <CardDescription>
          Enter your UPI ID to complete the payment of ₹{amount.toFixed(2)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {paymentStatus === 'pending' && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Payment initiated. Please approve the transaction in your UPI app.
              Time remaining: {formatTime(timeRemaining)}
            </AlertDescription>
          </Alert>
        )}

        {/* Saved VPAs */}
        {savedVpas.length > 0 && paymentStatus === 'idle' && (
          <div>
            <Label className="text-sm font-medium">Saved UPI IDs</Label>
            <div className="grid gap-2 mt-2">
              {savedVpas.map((savedVpa) => (
                <Button
                  key={savedVpa.id}
                  variant={vpa === savedVpa.vpa ? "default" : "outline"}
                  className="justify-start h-auto p-3"
                  onClick={() => setVpa(savedVpa.vpa)}
                >
                  <div className="text-left">
                    <div className="font-medium">{savedVpa.vpa}</div>
                    {savedVpa.isDefault && (
                      <div className="text-xs text-gray-500">Default</div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Manual VPA Input */}
        <div className="space-y-2">
          <Label htmlFor="vpa">UPI ID</Label>
          <Input
            id="vpa"
            type="text"
            placeholder="yourname@paytm"
            value={vpa}
            onChange={(e) => setVpa(e.target.value)}
            disabled={paymentStatus === 'pending'}
          />
          <p className="text-xs text-gray-500">
            Enter your UPI ID (e.g., user@paytm, user@phonepe, user@gpay)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={initiatePayment}
            disabled={isProcessing || paymentStatus === 'pending' || !vpa.trim()}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : paymentStatus === 'pending' ? (
              'Waiting for approval...'
            ) : (
              `Pay ₹${amount.toFixed(2)}`
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={paymentStatus === 'pending'}
          >
            Cancel
          </Button>
        </div>

        {/* Save VPA option */}
        {vpa && !savedVpas.find(saved => saved.vpa === vpa) && paymentStatus === 'idle' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => saveVpa(vpa)}
            className="w-full"
          >
            Save this UPI ID for future use
          </Button>
        )}
      </CardContent>
    </Card>
  )
}