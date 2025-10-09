import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Leaf, Users, Award, Target, Heart, Zap, Shield, Globe } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Us | Green Energy Solutions",
  description: "Learn about Green Energy Solutions - your trusted partner for sustainable energy products and solutions."
}

export default function AboutPage() {
  const stats = [
    { label: "Years of Experience", value: "15+", icon: Award },
    { label: "Happy Customers", value: "50K+", icon: Users },
    { label: "Products Sold", value: "100K+", icon: Zap },
    { label: "Cities Served", value: "200+", icon: Globe },
  ]

  const values = [
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Committed to providing eco-friendly energy solutions that reduce carbon footprint and promote environmental conservation."
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "We ensure all our products meet the highest quality standards with comprehensive testing and certification processes."
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Our customers are at the heart of everything we do. We prioritize their needs and satisfaction above all else."
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Continuously innovating and adopting the latest technologies to provide cutting-edge energy solutions."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-green-100 text-green-800 mb-4">About Green Energy Solutions</Badge>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Powering a <span className="text-green-600">Sustainable Future</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              For over 15 years, Green Energy Solutions has been India's trusted partner in renewable energy, 
              providing premium inverters, batteries, and solar solutions to homes and businesses nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="glass-card text-center">
                <CardContent className="pt-6">
                  <stat.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Journey
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                    Founded in 2009, Green Energy Solutions began with a simple mission: to make clean, 
                    reliable energy accessible to every Indian household. What started as a small venture 
                    in Mumbai has grown into one of India's leading renewable energy companies.
                  </p>
                  <p>
                    Over the years, we've built strong partnerships with top manufacturers like Luminous, 
                    Exide, and Microtek, ensuring our customers get only the best products with reliable 
                    after-sales support.
                  </p>
                  <p>
                    Today, we're proud to have served over 50,000 satisfied customers across 200+ cities, 
                    helping them reduce their electricity bills while contributing to a greener planet.
                  </p>
                </div>
                <Button className="mt-6 bg-green-600 hover:bg-green-700" asChild>
                  <Link href="/products">Explore Our Products</Link>
                </Button>
              </div>
              <Card className="glass-card">
                <CardContent className="p-8">
                  <div className="aspect-square bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <Leaf className="h-24 w-24 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mt-6 mb-2">15+ Years of Excellence</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Serving customers with dedication and integrity since 2009
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Core Values
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="glass-card text-center h-full">
                  <CardContent className="p-6">
                    <value.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-6 w-6 text-green-600" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    To empower every Indian household and business with reliable, affordable, and 
                    sustainable energy solutions that reduce dependency on traditional power sources 
                    while promoting environmental conservation for future generations.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-blue-600" />
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    To be India's most trusted renewable energy company, leading the transition to 
                    clean energy through innovative products, exceptional service, and unwavering 
                    commitment to sustainability and customer satisfaction.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="glass-card max-w-4xl mx-auto">
            <CardContent className="text-center p-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Join the Green Revolution?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Discover our complete range of energy solutions and start your journey 
                towards energy independence today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-green-600 hover:bg-green-700" asChild>
                  <Link href="/products">Shop Products</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}