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
import { GlassmorphicCard, GlassmorphicButton, GlassmorphicInput } from "@/components/ui/glassmorphic"
import GlassmorphicProductCard from "@/components/ui/glassmorphic-product-card"

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
    <div className="min-h-screen neu-container rounded-none flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-screen glass-gradient-hero flex items-center overflow-hidden">
          <div className="absolute inset-0 glass-pattern opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/80 via-green-700/70 to-green-800/80"></div>
          <div className="relative z-10 container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                  Power Your Future with Green Energy Solutions
                </h1>
                <p className="text-xl mb-8 text-green-100 drop-shadow">
                  Premium quality inverters, batteries, and solar solutions for all your energy needs. 
                  Trusted brands, competitive prices, and exceptional service.
                </p>
                <div className="flex space-x-4">
                  <GlassmorphicButton size="lg" className="bg-white text-green-600 hover:bg-green-50 shadow-xl">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Shop Now
                  </GlassmorphicButton>
                  <GlassmorphicButton size="lg" variant="gradient" className="border-2 border-white/30 text-white backdrop-blur-sm">
                    Learn More
                  </GlassmorphicButton>
                </div>
              </div>
              <div className="relative">
                <GlassmorphicCard className="bg-white/10 backdrop-blur-md border border-white/20 text-white">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <GlassmorphicCard variant="subtle" className="p-4 bg-white/5">
                        <div className="text-3xl font-bold text-white mb-1">85+</div>
                        <div className="text-green-100">Products</div>
                      </GlassmorphicCard>
                    </div>
                    <div className="text-center">
                      <GlassmorphicCard variant="subtle" className="p-4 bg-white/5">
                        <div className="text-3xl font-bold text-white mb-1">10K+</div>
                        <div className="text-green-100">Happy Customers</div>
                      </GlassmorphicCard>
                    </div>
                    <div className="text-center">
                      <GlassmorphicCard variant="subtle" className="p-4 bg-white/5">
                        <div className="text-3xl font-bold text-white mb-1">5+</div>
                        <div className="text-green-100">Brands</div>
                      </GlassmorphicCard>
                    </div>
                    <div className="text-center">
                      <GlassmorphicCard variant="subtle" className="p-4 bg-white/5">
                        <div className="text-3xl font-bold text-white mb-1">24/7</div>
                        <div className="text-green-100">Support</div>
                      </GlassmorphicCard>
                    </div>
                  </div>
                </GlassmorphicCard>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 glass-section-bg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <GlassmorphicCard className="inline-block px-8 py-4 mb-6">
                <h2 className="text-3xl font-bold glass-text-primary mb-2">Featured Products</h2>
                <p className="glass-text-secondary max-w-2xl">
                  Discover our top-selling inverters and batteries, carefully selected for quality and performance
                </p>
              </GlassmorphicCard>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <GlassmorphicProductCard key={product.id} product={{
                  id: product.id.toString(),
                  name: product.name,
                  price: product.price,
                  mrp: product.mrp,
                  image: product.image,
                  category: product.category,
                  rating: product.rating,
                  description: product.description,
                  isNew: false
                }} />
              ))}
            </div>
            <div className="text-center mt-12">
              <GlassmorphicButton variant="gradient" size="lg" className="glass-button-gradient border border-green-300">
                View All Products
              </GlassmorphicButton>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 glass-section-bg-alt">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <GlassmorphicCard className="inline-block px-8 py-4 mb-6">
                <h2 className="text-3xl font-bold glass-text-primary mb-2">Shop by Category</h2>
                <p className="glass-text-secondary max-w-2xl">
                  Browse our extensive range of energy solutions organized by category
                </p>
              </GlassmorphicCard>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <GlassmorphicCard key={index} className="hover:glass-hover transition-all cursor-pointer group">
                  <div className="p-6 text-center">
                    <div className="glass-icon-container mb-4 mx-auto">
                      <category.icon className="h-12 w-12 text-green-600 group-hover:text-green-700 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 glass-text-primary">{category.name}</h3>
                    <p className="glass-text-secondary text-sm font-medium">
                      {category.count} Products
                    </p>
                  </div>
                </GlassmorphicCard>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 glass-section-bg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <GlassmorphicCard className="inline-block px-8 py-4 mb-6">
                <h2 className="text-3xl font-bold glass-text-primary mb-2">Why Choose Us</h2>
                <p className="glass-text-secondary max-w-2xl">
                  We provide the best energy solutions with unmatched service and support
                </p>
              </GlassmorphicCard>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <GlassmorphicCard key={index} className="text-center p-6 hover:glass-hover transition-all group">
                  <div className="glass-icon-container-lg mb-4 mx-auto">
                    <benefit.icon className="h-8 w-8 text-green-600 group-hover:text-green-700 transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 glass-text-primary">{benefit.title}</h3>
                  <p className="glass-text-secondary">{benefit.description}</p>
                </GlassmorphicCard>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 glass-section-bg-alt">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <GlassmorphicCard className="inline-block px-8 py-4 mb-6">
                <h2 className="text-3xl font-bold glass-text-primary mb-2">What Our Customers Say</h2>
                <p className="glass-text-secondary max-w-2xl">
                  Join thousands of satisfied customers who trust us for their energy needs
                </p>
              </GlassmorphicCard>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <GlassmorphicCard key={index} className="p-6 hover:glass-hover transition-all">
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
                  <p className="glass-text-secondary mb-6 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center">
                    <GlassmorphicCard variant="subtle" className="w-12 h-12 flex items-center justify-center mr-4">
                      <span className="text-green-600 font-semibold text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </GlassmorphicCard>
                    <div>
                      <div className="font-semibold glass-text-primary">{testimonial.name}</div>
                      <div className="text-sm glass-text-secondary">{testimonial.location}</div>
                    </div>
                  </div>
                </GlassmorphicCard>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 glass-gradient-secondary relative overflow-hidden">
          <div className="absolute inset-0 glass-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <GlassmorphicCard className="bg-white/10 backdrop-blur-md border border-white/20 text-white mb-8">
                <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                <p className="text-green-100 mb-6">
                  Subscribe to our newsletter for the latest products, offers, and energy-saving tips
                </p>
              </GlassmorphicCard>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <GlassmorphicInput
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                />
                <GlassmorphicButton className="bg-white text-green-600 hover:bg-green-50 shadow-xl">
                  Subscribe
                </GlassmorphicButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}