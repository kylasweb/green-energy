import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RefreshCw, Package, CreditCard, Clock, AlertCircle, CheckCircle, Phone, Mail } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Returns & Exchanges | Green Energy Solutions",
  description: "Learn about our hassle-free return and exchange policy for all Green Energy Solutions products."
}

export default function ReturnsPage() {
  const returnTimeframes = [
    {
      category: "Small Electronics & Accessories",
      timeframe: "30 days",
      condition: "Original packaging required",
      examples: "Chargers, cables, small inverters under 1KVA"
    },
    {
      category: "Inverters & UPS Systems",
      timeframe: "15 days",
      condition: "Professional inspection required",
      examples: "Home inverters, UPS systems, charge controllers"
    },
    {
      category: "Batteries",
      timeframe: "7 days",
      condition: "Manufacturing defects only", 
      examples: "Inverter batteries, UPS batteries"
    },
    {
      category: "Solar Panels & Large Equipment",
      timeframe: "7 days",
      condition: "Physical damage or defects only",
      examples: "Solar panels, solar water heaters, large inverters"
    }
  ]

  const returnProcess = [
    {
      step: 1,
      title: "Request Return",
      description: "Contact our support team or submit a return request online",
      icon: Phone
    },
    {
      step: 2,
      title: "Return Authorization",
      description: "Receive return authorization number and instructions",
      icon: CheckCircle
    },
    {
      step: 3,
      title: "Package & Ship",
      description: "Pack the item securely and ship using provided label",
      icon: Package
    },
    {
      step: 4,
      title: "Inspection",
      description: "Our team inspects the returned item",
      icon: AlertCircle
    },
    {
      step: 5,
      title: "Refund/Exchange",
      description: "Refund processed or replacement item shipped",
      icon: RefreshCw
    }
  ]

  const conditions = [
    "Item must be in original condition with all accessories",
    "Original packaging and documentation required", 
    "No physical damage caused by misuse",
    "Return authorization number must be obtained first",
    "Customer pays return shipping unless item is defective",
    "Refund processing takes 5-7 business days after inspection"
  ]

  const nonReturnable = [
    "Products damaged due to misuse or improper installation",
    "Items purchased more than return period ago",
    "Products with missing components or accessories", 
    "Custom or specially ordered items",
    "Products showing signs of normal wear and tear",
    "Items without original purchase receipt"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-800 mb-4">Returns & Exchanges</Badge>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Easy Returns & Exchanges
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              We stand behind our products with a hassle-free return policy
            </p>
          </div>

          {/* Return Timeframes */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Return Timeframes by Product Category</h2>
            <div className="space-y-4">
              {returnTimeframes.map((item, index) => (
                <Card key={index} className="glass-card">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-4 gap-4 items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-green-600 mb-1">{item.category}</h3>
                      </div>
                      <div className="text-center">
                        <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                          {item.timeframe}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.condition}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.examples}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Return Process */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">How to Return an Item</h2>
            <div className="grid md:grid-cols-5 gap-6">
              {returnProcess.map((step, index) => (
                <Card key={index} className="glass-card text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      {step.step}
                    </div>
                    <step.icon className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Return Conditions */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    Return Conditions
                  </CardTitle>
                  <CardDescription>
                    Items must meet these conditions for return
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {conditions.map((condition, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                        <span className="text-gray-600 dark:text-gray-300">{condition}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                    Non-Returnable Items
                  </CardTitle>
                  <CardDescription>
                    These items cannot be returned or exchanged
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {nonReturnable.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                        <span className="text-gray-600 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Refund Information */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Refund Information</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glass-card text-center">
                <CardContent className="p-6">
                  <CreditCard className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Refund Method</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Refunds are processed to the original payment method
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card text-center">
                <CardContent className="p-6">
                  <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Processing Time</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    5-7 business days after item inspection
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card text-center">
                <CardContent className="p-6">
                  <RefreshCw className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Exchange Option</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Exchange for same or different product available
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Return Request Form */}
          <section className="mb-16">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Request a Return</CardTitle>
                <CardDescription>
                  Fill out this form to start your return process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderNumber">Order Number</Label>
                    <Input id="orderNumber" placeholder="GES-2024-001234" className="glass-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your-email@example.com" className="glass-input" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input id="productName" placeholder="e.g., Luminous Cruze 2KVA Inverter" className="glass-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="returnReason">Return Reason</Label>
                    <select className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">Select reason</option>
                      <option value="defective">Product defective</option>
                      <option value="damaged">Received damaged</option>
                      <option value="wrong-item">Wrong item received</option>
                      <option value="not-as-described">Not as described</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please describe the issue in detail..."
                    rows={4}
                    className="glass-input"
                  />
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Submit Return Request
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Contact Support */}
          <section>
            <Card className="glass-card text-center">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Need Help with Your Return?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Our customer service team is here to assist you with any questions about returns or exchanges
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Call +91 98765 43210
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}