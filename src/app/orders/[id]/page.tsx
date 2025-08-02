"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  Mail,
  CreditCard,
  Download,
  Loader2,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"
import { useSession } from "next-auth/react"

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  total: number
  product: {
    id: string
    name: string
    images: string[]
  }
}

interface Order {
  id: string
  orderNumber: string
  status: string
  subtotal: number
  shipping: number
  tax: number
  total: number
  paymentMethod: string
  notes?: string
  shippingAddress: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    country: string
  }
  billingAddress: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    country: string
  }
  orderItems: OrderItem[]
  shipment?: {
    id: string
    status: string
    trackingNumber?: string
    estimatedDelivery: string
    actualDelivery?: string
    carrier?: string
  }
  createdAt: string
  updatedAt: string
}

interface OrderTimeline {
  id: string
  status: string
  title: string
  description: string
  timestamp: string
  completed: boolean
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const orderId = params.id as string
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/auth/signin?callbackUrl=/orders/' + orderId
      return
    }

    if (status === 'authenticated' && orderId) {
      fetchOrder()
    }
  }, [orderId, status])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${orderId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch order')
      }
      const data = await response.json()
      setOrder(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch order')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-purple-100 text-purple-800'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'processing':
        return <Package className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    return method === 'cod' ? <Truck className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />
  }

  const getPaymentMethodName = (method: string) => {
    return method === 'cod' ? 'Cash on Delivery' : 'Online Payment'
  }

  const generateTimeline = (order: Order): OrderTimeline[] => {
    const timeline: OrderTimeline[] = [
      {
        id: '1',
        status: 'pending',
        title: 'Order Placed',
        description: 'Your order has been received',
        timestamp: order.createdAt,
        completed: true
      }
    ]

    if (order.status !== 'pending') {
      timeline.push({
        id: '2',
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Your order has been confirmed and is being processed',
        timestamp: order.updatedAt,
        completed: ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)
      })
    }

    if (['processing', 'shipped', 'delivered'].includes(order.status)) {
      timeline.push({
        id: '3',
        status: 'processing',
        title: 'Processing',
        description: 'Your order is being prepared for shipment',
        timestamp: order.updatedAt,
        completed: ['processing', 'shipped', 'delivered'].includes(order.status)
      })
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      timeline.push({
        id: '4',
        status: 'shipped',
        title: 'Shipped',
        description: order.shipment?.trackingNumber 
          ? `Your order has been shipped. Tracking number: ${order.shipment.trackingNumber}`
          : 'Your order has been shipped',
        timestamp: order.shipment?.estimatedDelivery || order.updatedAt,
        completed: ['shipped', 'delivered'].includes(order.status)
      })
    }

    if (order.status === 'delivered') {
      timeline.push({
        id: '5',
        status: 'delivered',
        title: 'Delivered',
        description: 'Your order has been delivered successfully',
        timestamp: order.shipment?.actualDelivery || order.updatedAt,
        completed: true
      })
    }

    if (order.status === 'cancelled') {
      timeline.push({
        id: '6',
        status: 'cancelled',
        title: 'Cancelled',
        description: 'Your order has been cancelled',
        timestamp: order.updatedAt,
        completed: true
      })
    }

    return timeline
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'We couldn\'t find your order details.'}</p>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/orders">
              Back to Orders
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const timeline = generateTimeline(order)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/orders">My Orders</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Order Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>

        {/* Order Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Placed on {formatDate(order.createdAt)}
                  </span>
                  {order.shipment?.estimatedDelivery && (
                    <span className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      Est. delivery {formatDate(order.shipment.estimatedDelivery)}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600 mb-1">
                  {formatPrice(order.total)}
                </p>
                <p className="text-sm text-gray-600">
                  {getPaymentMethodIcon(order.paymentMethod)}
                  <span className="ml-1">{getPaymentMethodName(order.paymentMethod)}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeline.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          event.completed ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {event.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                        {index < timeline.length - 1 && (
                          <div className={`w-0.5 h-16 mt-2 ${
                            event.completed ? 'bg-green-600' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${event.completed ? 'text-green-600' : 'text-gray-600'}`}>
                          {event.title}
                        </h4>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(event.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                        <Image
                          src={item.product.images[0] || "/placeholder-product.svg"}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.price)} each</p>
                        <p className="text-sm text-gray-600">{formatPrice(item.total)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping & Billing Addresses */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                    <p>{order.shippingAddress.country}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {order.shippingAddress.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {order.shippingAddress.email}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Billing Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{order.billingAddress.fullName}</p>
                    <p>{order.billingAddress.address}</p>
                    <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.pincode}</p>
                    <p>{order.billingAddress.country}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {order.billingAddress.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {order.billingAddress.email}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({order.orderItems.length} items)</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={order.shipping === 0 ? 'text-green-600' : ''}>
                      {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-green-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Invoice
                </Button>
                
                {order.shipment?.trackingNumber && (
                  <Button className="w-full" variant="outline">
                    <Truck className="mr-2 h-4 w-4" />
                    Track Shipment
                  </Button>
                )}
                
                {order.status === 'delivered' && (
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Buy Again
                  </Button>
                )}
                
                {['pending', 'confirmed'].includes(order.status) && (
                  <Button className="w-full" variant="outline">
                    Cancel Order
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    Have questions about your order?
                  </p>
                  <Button variant="link" className="p-0 h-auto text-green-600">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}