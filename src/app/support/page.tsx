import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { HeadphonesIcon, MessageCircle, Phone, Mail, Clock, Search, FileText, Users, Zap } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Support Center | Green Energy Solutions",
  description: "Get help and support for your Green Energy Solutions products. Find answers, contact support, and access resources."
}

export default function SupportPage() {
  const supportOptions = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our technical experts",
      details: "+91 98765 43210",
      availability: "Mon-Sat: 9AM-6PM",
      action: "Call Now"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help through live chat",
      details: "Average response time: 2 minutes",
      availability: "24/7 Available",
      action: "Start Chat"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your detailed queries",
      details: "support@greenenergysolutions.com",
      availability: "Response within 4 hours",
      action: "Send Email"
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Browse our comprehensive guides",
      details: "Installation guides, troubleshooting, FAQs",
      availability: "Always Available",
      action: "Browse Docs"
    }
  ]

  const quickLinks = [
    { title: "Product Installation Guides", href: "/support/installation" },
    { title: "Warranty Registration", href: "/support/warranty" },
    { title: "Troubleshooting Common Issues", href: "/support/troubleshooting" },
    { title: "Product Manuals & Downloads", href: "/support/downloads" },
    { title: "Service Center Locator", href: "/support/service-centers" },
    { title: "Replacement Parts", href: "/support/parts" }
  ]

  const categories = [
    {
      icon: Zap,
      title: "Inverters & UPS",
      description: "Installation, maintenance, and troubleshooting",
      count: "45 articles"
    },
    {
      icon: Users,
      title: "Batteries",
      description: "Battery care, replacement, and optimization",
      count: "32 articles"
    },
    {
      icon: FileText,
      title: "Solar Systems",
      description: "Solar installation and maintenance guides",
      count: "28 articles"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-800 mb-4">Support Center</Badge>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How can we help you?
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Get the support you need for all your Green Energy Solutions products
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for help articles, guides, or common issues..."
                  className="pl-12 py-3 text-lg glass-input"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700">
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Support Options */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Get in Touch</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportOptions.map((option, index) => (
                <Card key={index} className="glass-card text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <option.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {option.description}
                    </p>
                    <div className="space-y-2 text-xs text-gray-500 mb-4">
                      <p>{option.details}</p>
                      <p className="flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3" />
                        {option.availability}
                      </p>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Categories */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <Card key={index} className="glass-card hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <category.icon className="h-8 w-8 text-green-600" />
                      <div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Quick Links */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Popular Help Topics</h2>
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {quickLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                    >
                      <FileText className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700 dark:text-gray-300 hover:text-green-600">
                        {link.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Emergency Support */}
          <section>
            <Card className="glass-card bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <HeadphonesIcon className="h-6 w-6" />
                  Emergency Support
                </CardTitle>
                <CardDescription>
                  For urgent technical issues affecting your power supply
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      24/7 Emergency Helpline for critical power issues
                    </p>
                    <p className="text-lg font-semibold text-red-700 dark:text-red-400">
                      📞 +91 98765 00000
                    </p>
                  </div>
                  <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                    Call Emergency Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Additional Help */}
          <div className="text-center mt-12">
            <h3 className="text-xl font-semibold mb-4">Still need help?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Can't find what you're looking for? Our support team is always ready to assist you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/faq">View FAQ</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}