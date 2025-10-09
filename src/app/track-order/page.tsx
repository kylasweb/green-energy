import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Search, Package, Truck, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Track Your Order | Green Energy Solutions",
  description: "Track your order status and delivery progress with Green Energy Solutions."
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Track Your Order
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Enter your order details to track your delivery status
            </p>
          </div>

          {/* Order Tracking Form */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-green-600" />
                Order Lookup
              </CardTitle>
              <CardDescription>
                Enter your order number and email to track your order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Order Number</Label>
                  <Input
                    id="orderNumber"
                    placeholder="e.g., GES-2024-001234"
                    className="glass-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your-email@example.com"
                    className="glass-input"
                  />
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Search className="h-4 w-4 mr-2" />
                Track Order
              </Button>
            </CardContent>
          </Card>

          {/* Sample Order Status */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
              <CardDescription>Order #GES-2024-001234</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Progress Steps */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mb-2">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium">Order Placed</p>
                    <p className="text-xs text-gray-500">Dec 15, 2024</p>
                  </div>
                  <div className="flex-1 h-1 bg-green-600 mx-4"></div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mb-2">
                      <Package className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium">Processing</p>
                    <p className="text-xs text-gray-500">Dec 16, 2024</p>
                  </div>
                  <div className="flex-1 h-1 bg-blue-600 mx-4"></div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-2">
                      <Truck className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium">Shipped</p>
                    <p className="text-xs text-gray-500">Dec 17, 2024</p>
                  </div>
                  <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center mb-2">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium">Delivered</p>
                    <p className="text-xs text-gray-500">Expected: Dec 19</p>
                  </div>
                </div>

                {/* Order Details */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Order Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking Number:</span>
                      <span className="font-medium">TRK123456789</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Delivery:</span>
                      <span className="font-medium">Dec 19, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Address:</span>
                      <span className="font-medium">123 Main St, Mumbai, MH 400001</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="text-center mt-8">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Need help with your order?
            </p>
            <Button variant="outline" asChild>
              <a href="/contact">Contact Support</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}