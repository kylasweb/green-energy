import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Calendar, FileText, CheckCircle, Phone, Mail, Download, AlertTriangle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Warranty Information | Green Energy Solutions",
  description: "Learn about warranty coverage, registration, and claims for all Green Energy Solutions products."
}

export default function WarrantyPage() {
  const warrantyPeriods = [
    {
      category: "Inverters & UPS",
      period: "2-5 years",
      coverage: "Manufacturing defects, component failure",
      brands: "Luminous, Microtek, Exide, Su-Kam",
      registration: "Required within 30 days"
    },
    {
      category: "Batteries",
      period: "2-3 years",
      coverage: "Capacity degradation, manufacturing defects",
      brands: "Exide, Luminous, Amaron, Okaya",
      registration: "Recommended within 15 days"
    },
    {
      category: "Solar Panels",
      period: "10-25 years",
      coverage: "Performance guarantee, physical defects",
      brands: "Tata Solar, Vikram Solar, Waaree",
      registration: "Required for performance warranty"
    },
    {
      category: "Solar Accessories",
      period: "1-2 years", 
      coverage: "Manufacturing defects only",
      brands: "Various manufacturers",
      registration: "Optional"
    }
  ]

  const warrantySteps = [
    {
      step: 1,
      title: "Register Product",
      description: "Register within warranty registration period",
      icon: FileText
    },
    {
      step: 2,
      title: "Identify Issue", 
      description: "Determine if issue is covered under warranty",
      icon: AlertTriangle
    },
    {
      step: 3,
      title: "Contact Support",
      description: "Reach out to our warranty support team",
      icon: Phone
    },
    {
      step: 4,
      title: "Verification",
      description: "Technical verification of the issue",
      icon: CheckCircle
    },
    {
      step: 5,
      title: "Resolution",
      description: "Repair, replacement, or compensation",
      icon: Shield
    }
  ]

  const covered = [
    "Manufacturing defects in materials or workmanship",
    "Component failure under normal operating conditions",
    "Performance degradation beyond specified limits",
    "Physical defects not caused by external factors",
    "Premature failure of electronic components",
    "Software/firmware issues in smart products"
  ]

  const notCovered = [
    "Physical damage due to misuse or accidents",
    "Damage caused by power surges or lightning",
    "Normal wear and tear over time",
    "Damage due to improper installation",
    "Issues caused by unauthorized modifications",
    "Damage from environmental factors (floods, fire)"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-800 mb-4">Warranty Information</Badge>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Warranty Protection
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              We stand behind our products with industry-leading warranty coverage and support
            </p>
          </div>

          {/* Warranty Periods */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Warranty Coverage by Product Category</h2>
            <div className="space-y-4">
              {warrantyPeriods.map((warranty, index) => (
                <Card key={index} className="glass-card">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-5 gap-4 items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-green-600 mb-1">{warranty.category}</h3>
                        <p className="text-sm text-gray-500">{warranty.brands}</p>
                      </div>
                      <div className="text-center">
                        <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
                          {warranty.period}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{warranty.coverage}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{warranty.registration}</p>
                      </div>
                      <div className="text-center">
                        <Button variant="outline" size="sm">
                          Register Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Warranty Claim Process */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Warranty Claim Process</h2>
            <div className="grid md:grid-cols-5 gap-6">
              {warrantySteps.map((step, index) => (
                <Card key={index} className="glass-card text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      {step.step}
                    </div>
                    <step.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Coverage Details */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    What's Covered
                  </CardTitle>
                  <CardDescription>
                    Issues covered under our warranty
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {covered.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                        <span className="text-gray-600 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                    What's Not Covered
                  </CardTitle>
                  <CardDescription>
                    Issues not covered under warranty
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {notCovered.map((item, index) => (
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

          {/* Registration Form */}
          <section className="mb-16">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Register Your Product</CardTitle>
                <CardDescription>
                  Register your product to activate warranty coverage and receive support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productModel">Product Model</Label>
                    <Input id="productModel" placeholder="e.g., Luminous Cruze 2KVA" className="glass-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input id="serialNumber" placeholder="Product serial number" className="glass-input" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input id="purchaseDate" type="date" className="glass-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dealerName">Dealer/Store Name</Label>
                    <Input id="dealerName" placeholder="Where you purchased" className="glass-input" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input id="customerName" placeholder="Your full name" className="glass-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+91 98765 43210" className="glass-input" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your-email@example.com" className="glass-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Installation Address</Label>
                  <Input id="address" placeholder="Complete installation address" className="glass-input" />
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Shield className="h-4 w-4 mr-2" />
                  Register Product
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Important Information */}
          <section className="mb-16">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glass-card text-center">
                <CardContent className="p-6">
                  <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Registration Deadline</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Register within 30 days of purchase for full warranty coverage
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card text-center">
                <CardContent className="p-6">
                  <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Keep Records</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Maintain purchase receipts and warranty documents safely
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card text-center">
                <CardContent className="p-6">
                  <Download className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Download Documents</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Access warranty certificates and product manuals online
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Extended Warranty */}
          <section className="mb-16">
            <Card className="glass-card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  Extended Warranty Plans
                </CardTitle>
                <CardDescription>
                  Extend your warranty coverage for additional peace of mind
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Benefits of Extended Warranty:</h4>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>• Additional 1-3 years of coverage</li>
                      <li>• Priority technical support</li>
                      <li>• Free annual maintenance visits</li>
                      <li>• Replacement guarantee for major failures</li>
                      <li>• Transferable to new owners</li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600 mb-2">Starting from ₹999</p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Protect your investment with comprehensive coverage
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      View Plans
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Contact Support */}
          <section>
            <Card className="glass-card text-center">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Need Warranty Support?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Our warranty support team is here to help with registrations, claims, and technical assistance
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Warranty Support
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Warranty Helpline: +91 98765 43210 | Email: warranty@greenenergysolutions.com
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}