"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { ShoppingCart, Search, User, Heart, Star, Leaf, Battery, Zap, Shield, Truck, Headphones } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"

export default function Home() {
  const [email, setEmail] = useState("")
  const { addToCart } = useCart()
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  const featuredProducts = [
    {
      id: 1,
      name: "Amaron 2.5L",
      price: 758,
      mrp: 899,
      category: "Two-Wheeler Batteries",
      image: "/placeholder-product.svg",
      rating: 4.5,
      description: "Reliable two-wheeler battery offering durability and smooth performance"
    },
    {
      id: 2,
      name: "Amaron Z4",
      price: 875,
      mrp: 1020,
      category: "Two-Wheeler Batteries",
      image: "/placeholder-product.svg",
      rating: 4.3,
      description: "Compact and efficient, designed for two-wheelers"
    },
    {
      id: 3,
      name: "Amaron Z5",
      price: 1030,
      mrp: 1200,
      category: "Two-Wheeler Batteries",
      image: "/placeholder-product.svg",
      rating: 4.7,
      description: "Enhanced capacity with quick charging and stable power output"
    },
    {
      id: 4,
      name: "Amaron 5L",
      price: 1130,
      mrp: 1350,
      category: "Two-Wheeler Batteries",
      image: "/placeholder-product.svg",
      rating: 4.6,
      description: "Robust battery with high cranking power"
    }
  ]

  const handleAddToCart = async (productId: string, productName: string) => {
    setAddingToCart(productId)
    try {
      await addToCart(productId)
      toast.success(`${productName} added to cart!`)
    } catch (error) {
      toast.error('Failed to add product to cart')
    } finally {
      setAddingToCart(null)
    }
  }

  const categories = [
    { name: "Two-Wheeler Batteries", icon: Battery, count: 25 },
    { name: "Four-Wheeler Batteries", icon: Battery, count: 30 },
    { name: "Inverters", icon: Zap, count: 15 },
    { name: "Solar PCU", icon: Leaf, count: 8 },
    { name: "UPS Battery", icon: Battery, count: 12 },
    { name: "Inverter Trolley", icon: Truck, count: 6 },
    { name: "Battery Tray", icon: Shield, count: 4 },
    { name: "Others", icon: Zap, count: 10 }
  ]

  const benefits = [
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "All products come with manufacturer warranty and quality guarantee"
    },
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Free shipping on orders above ₹999 across India"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round the clock customer support for all your queries"
    },
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description: "Sustainable energy solutions for a greener future"
    }
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Mumbai",
      rating: 5,
      comment: "Excellent service and genuine products. The Amaron battery I purchased is working perfectly."
    },
    {
      name: "Priya Sharma",
      location: "Delhi",
      rating: 4,
      comment: "Fast delivery and great customer support. Will definitely recommend to others."
    },
    {
      name: "Amit Patel",
      location: "Bangalore",
      rating: 5,
      comment: "Best prices for inverters and batteries. Very satisfied with the purchase."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Power Your Future with Green Energy Solutions
                </h1>
                <p className="text-xl mb-8 text-green-100">
                  Premium quality inverters, batteries, and solar solutions for all your energy needs. 
                  Trusted brands, competitive prices, and exceptional service.
                </p>
                <div className="flex space-x-4">
                  <Button size="lg" className="bg-white text-green-600 hover:bg-green-50">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Shop Now
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">85+</div>
                      <div className="text-green-100">Products</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">10K+</div>
                      <div className="text-green-100">Happy Customers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">5+</div>
                      <div className="text-green-100">Brands</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">24/7</div>
                      <div className="text-green-100">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover our top-selling inverters and batteries, carefully selected for quality and performance
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="relative h-48 bg-gray-100 rounded-lg mb-4">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <Badge className="absolute top-2 left-2 bg-green-600">
                        {product.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">₹{product.mrp}</span>
                      </div>
                      <Badge variant="secondary">Save ₹{product.mrp - product.price}</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={addingToCart === product.id.toString()}
                        onClick={() => handleAddToCart(product.id.toString(), product.name)}
                      >
                        {addingToCart === product.id.toString() ? (
                          <ShoppingCart className="mr-2 h-4 w-4 animate-pulse" />
                        ) : (
                          <ShoppingCart className="mr-2 h-4 w-4" />
                        )}
                        {addingToCart === product.id.toString() ? 'Adding...' : 'Add to Cart'}
                      </Button>
                      <Button size="sm" variant="outline">
                        Buy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Browse our extensive range of energy solutions organized by category
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <category.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                    <p className="text-gray-600">{category.count} Products</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We provide the best energy solutions with unmatched service and support
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <benefit.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust us for their energy needs
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">"{testimonial.comment}"</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-semibold">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.location}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-green-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-green-100 mb-8">
                Subscribe to our newsletter for the latest products, offers, and energy-saving tips
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button className="bg-white text-green-600 hover:bg-green-50">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}