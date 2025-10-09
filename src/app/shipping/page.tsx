import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, Clock, MapPin, Package, Shield, CreditCard, Globe, Phone } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Shipping Information | Green Energy Solutions", 
  description: "Learn about our shipping policies, delivery times, and shipping costs for all Green Energy Solutions products."
}

export default function ShippingPage() {
  const shippingZones = [
    {
      zone: "Metro Cities",
      cities: "Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune",
      deliveryTime: "1-2 business days",
      cost: "Free for orders above ₹5,000"
    },
    {
      zone: "Tier 1 Cities", 
      cities: "Ahmedabad, Surat, Jaipur, Lucknow, Kanpur, Nagpur, Indore, Bhopal, Visakhapatnam, Patna",
      deliveryTime: "2-3 business days",
      cost: "Free for orders above ₹7,500"
    },
    {
      zone: "Tier 2 Cities",
      cities: "Coimbatore, Kochi, Madurai, Nashik, Rajkot, Vadodara, Aurangabad, Dhanbad",
      deliveryTime: "3-4 business days", 
      cost: "Free for orders above ₹10,000"
    },
    {
      zone: "Other Areas",
      cities: "All other serviceable pin codes across India",
      deliveryTime: "4-7 business days",
      cost: "Shipping charges apply (₹200-500)"
    }
  ]

  const shippingMethods = [
    {
      icon: Truck,
      title: "Standard Delivery",
      description: "Regular delivery for most products",
      timeframe: "2-7 business days",
      cost: "Free on eligible orders"
    },
    {
      icon: Clock,
      title: "Express Delivery",
      description: "Fast delivery for urgent orders",
      timeframe: "1-3 business days",
      cost: "₹200 additional charge"
    },
    {
      icon: Package,
      title: "Installation Service",
      description: "Delivery with professional installation",
      timeframe: "Scheduled appointment",
      cost: "Installation charges apply"
    }
  ]

  const policies = [
    {
      title: "Order Processing Time",
      content: "Orders are typically processed within 24-48 hours of confirmation. Processing may take longer during peak seasons or for custom products."
    },
    {
      title: "Delivery Attempts",
      content: "We make 3 delivery attempts. If unsuccessful, the order will be held at the local facility for 7 days before being returned."
    },
    {
      title: "Address Accuracy",
      content: "Please ensure your delivery address is accurate and complete. We are not responsible for delays due to incorrect addresses."
    },
    {
      title: "Signature Required",
      content: "High-value items (above ₹25,000) require signature upon delivery for security purposes."
    },
    {
      title: "Packaging",
      content: "All products are securely packaged to prevent damage during transit. Solar panels and batteries include special protective packaging."
    },
    {
      title: "Tracking",
      content: "You'll receive tracking information via SMS and email once your order is shipped. Track your order anytime on our website."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-800 mb-4">Shipping Information</Badge>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Shipping & Delivery
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Fast, reliable delivery across India with secure packaging and professional service
            </p>
          </div>

          {/* Shipping Methods */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Shipping Options</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {shippingMethods.map((method, index) => (
                <Card key={index} className="glass-card text-center">
                  <CardContent className="p-6">
                    <method.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{method.description}</p>
                    <div className="space-y-1">
                      <p className="font-medium">{method.timeframe}</p>
                      <p className="text-sm text-gray-500">{method.cost}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Shipping Zones */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Delivery Zones & Timeline</h2>
            <div className="space-y-4">
              {shippingZones.map((zone, index) => (
                <Card key={index} className="glass-card">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-4 gap-4 items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-green-600 mb-1">{zone.zone}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="h-4 w-4" />
                          Coverage
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{zone.cities}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{zone.deliveryTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-600">{zone.cost}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Special Products */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Special Product Shipping</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-6 w-6 text-green-600" />
                    Solar Panels & Large Equipment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Delivery time: 5-10 business days</li>
                    <li>• Professional installation available</li>
                    <li>• Advance appointment scheduling</li>
                    <li>• Special handling and packaging</li>
                    <li>• Freight shipping for bulk orders</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-blue-600" />
                    Batteries & UPS Systems
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Hazmat certified shipping</li>
                    <li>• Temperature-controlled transport</li>
                    <li>• Insurance included</li>
                    <li>• Adult signature required</li>
                    <li>• Professional installation recommended</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Policies */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Shipping Policies</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {policies.map((policy, index) => (
                <Card key={index} className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">{policy.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">{policy.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* International Shipping */}
          <section className="mb-16">
            <Card className="glass-card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-6 w-6 text-blue-600" />
                  International Shipping
                </CardTitle>
                <CardDescription>
                  We currently ship only within India
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Our shipping services are currently available only within India. We are working on expanding 
                  our international shipping capabilities. For international inquiries, please contact our 
                  export team.
                </p>
                <Button variant="outline">
                  Contact Export Team
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Contact */}
          <section>
            <Card className="glass-card text-center">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Questions About Shipping?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Our shipping team is here to help with any questions about delivery times, costs, or special requirements
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Call +91 98765 43210
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/track-order">Track Your Order</Link>
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