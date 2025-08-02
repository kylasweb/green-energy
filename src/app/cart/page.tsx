"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Truck, 
  Shield,
  RotateCcw,
  Loader2
} from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export default function CartPage() {
  const { state, updateCartItem, removeFromCart, clearCart } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setIsUpdating(itemId)
    try {
      await updateCartItem(itemId, newQuantity)
    } finally {
      setIsUpdating(null)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    setIsUpdating(itemId)
    try {
      await removeFromCart(itemId)
    } finally {
      setIsUpdating(null)
    }
  }

  const handleApplyPromoCode = () => {
    // TODO: Implement promo code functionality
    alert(`Promo code "${promoCode}" applied successfully!`)
    setPromoCode("")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  if (state.loading && state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/products">
                Start Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

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
                <BreadcrumbPage>Shopping Cart</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Shopping Cart</h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  disabled={state.loading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>

              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0">
                        <Image
                          src={item.product.images[0] || "/placeholder-product.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="text-lg font-semibold text-gray-900 hover:text-green-600"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-gray-600">
                              {item.product.category.name} • {item.product.brand.name}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isUpdating === item.id}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Price */}
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-semibold text-green-600">
                              {formatPrice(item.product.price)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(item.product.mrp)}
                            </span>
                            <Badge variant="secondary">
                              Save {formatPrice(item.product.mrp - item.product.price)}
                            </Badge>
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isUpdating === item.id}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQuantity = parseInt(e.target.value)
                                if (newQuantity > 0) {
                                  handleQuantityChange(item.id, newQuantity)
                                }
                              }}
                              className="w-16 text-center"
                              min={1}
                              max={item.product.stockQuantity}
                              disabled={isUpdating === item.id}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stockQuantity || isUpdating === item.id}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Stock Status */}
                        <div className="mt-2">
                          {item.product.stockQuantity > 0 ? (
                            <span className="text-sm text-green-600">
                              ✓ In Stock ({item.product.stockQuantity} available)
                            </span>
                          ) : (
                            <span className="text-sm text-red-600">
                              ✗ Out of Stock
                            </span>
                          )}
                        </div>

                        {/* Item Total */}
                        <div className="mt-2 text-right">
                          <span className="text-lg font-semibold">
                            Total: {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="h-6 w-6 text-green-600" />
                  <div>
                    <div className="font-medium">Free Delivery</div>
                    <div className="text-sm text-gray-600">On orders above ₹999</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-green-600" />
                  <div>
                    <div className="font-medium">Secure Payment</div>
                    <div className="text-sm text-gray-600">100% secure transactions</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-6 w-6 text-green-600" />
                  <div>
                    <div className="font-medium">Easy Returns</div>
                    <div className="text-sm text-gray-600">30-day return policy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Summary Items */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({state.totals.totalItems} items)</span>
                  <span>{formatPrice(state.totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(state.totals.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-green-600">{formatPrice(state.totals.total)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyPromoCode}
                    disabled={!promoCode.trim()}
                  >
                    Apply
                  </Button>
                </div>
              </div>

              {/* Checkout Button */}
              <Button 
                size="lg" 
                className="w-full bg-green-600 hover:bg-green-700 mb-4"
                asChild
              >
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              {/* Continue Shopping */}
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full"
                asChild
              >
                <Link href="/products">
                  Continue Shopping
                </Link>
              </Button>

              {/* Security Note */}
              <div className="mt-6 text-center text-sm text-gray-600">
                <p className="mb-2">🔒 Secure Checkout</p>
                <p>Your payment information is encrypted and secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}