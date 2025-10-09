import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, BookOpen, Tag } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Blog | Green Energy Solutions",
  description: "Stay updated with the latest news, tips, and insights about renewable energy, solar power, and sustainable living."
}

export default function BlogPage() {
  const featuredPost = {
    title: "The Complete Guide to Solar Battery Storage in India 2024",
    excerpt: "Everything you need to know about solar battery storage systems, costs, benefits, and how to choose the right setup for your home.",
    author: "Rajesh Kumar",
    date: "December 15, 2024",
    readTime: "8 min read",
    category: "Solar Energy",
    image: "/placeholder-blog-featured.jpg"
  }

  const blogPosts = [
    {
      title: "5 Signs Your Inverter Battery Needs Replacement",
      excerpt: "Learn to identify when your inverter battery is failing and how to extend its lifespan with proper maintenance.",
      author: "Priya Sharma",
      date: "December 12, 2024",
      readTime: "5 min read",
      category: "Batteries",
      image: "/placeholder-blog-1.jpg"
    },
    {
      title: "Solar vs. Traditional Power: Cost Analysis for Indian Homes",
      excerpt: "A comprehensive comparison of solar energy costs versus traditional electricity bills for typical Indian households.",
      author: "Amit Verma",
      date: "December 10, 2024",
      readTime: "6 min read",
      category: "Solar Energy",
      image: "/placeholder-blog-2.jpg"
    },
    {
      title: "Monsoon Preparation: Protecting Your Solar Panels",
      excerpt: "Essential tips to safeguard your solar installation during India's monsoon season and ensure optimal performance.",
      author: "Sunita Patel",
      date: "December 8, 2024",
      readTime: "4 min read",
      category: "Maintenance",
      image: "/placeholder-blog-3.jpg"
    },
    {
      title: "Government Subsidies for Solar Installation in 2024",
      excerpt: "Complete guide to available government subsidies, tax benefits, and financing options for solar installations.",
      author: "Karthik Reddy",
      date: "December 5, 2024",
      readTime: "7 min read",
      category: "Policy & Finance",
      image: "/placeholder-blog-4.jpg"
    },
    {
      title: "Best Practices for UPS Maintenance in Small Businesses",
      excerpt: "How small businesses can maximize UPS efficiency and minimize downtime through proper maintenance protocols.",
      author: "Neha Gupta",
      date: "December 3, 2024",
      readTime: "5 min read",
      category: "UPS Systems",
      image: "/placeholder-blog-5.jpg"
    },
    {
      title: "Energy-Efficient Appliances: Reducing Your Carbon Footprint",
      excerpt: "Discover energy-efficient appliances that work perfectly with solar and battery backup systems.",
      author: "Rohit Singh",
      date: "November 30, 2024",
      readTime: "6 min read",
      category: "Energy Efficiency",
      image: "/placeholder-blog-6.jpg"
    }
  ]

  const categories = [
    "Solar Energy",
    "Batteries",
    "Inverters",
    "UPS Systems",
    "Maintenance",
    "Policy & Finance",
    "Energy Efficiency",
    "Sustainability"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-800 mb-4">Our Blog</Badge>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Energy Insights & Tips
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Stay informed with the latest trends, tips, and insights in renewable energy
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <Button variant="default" className="bg-green-600 hover:bg-green-700">
              All Posts
            </Button>
            {categories.map((category) => (
              <Button key={category} variant="outline" className="hover:bg-green-50">
                {category}
              </Button>
            ))}
          </div>

          {/* Featured Post */}
          <Card className="glass-card mb-12 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-white" />
                </div>
              </div>
              <div className="md:w-1/2 p-6 md:p-8">
                <Badge className="bg-green-100 text-green-800 mb-3">
                  {featuredPost.category}
                </Badge>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {featuredPost.date}
                  </div>
                  <span>{featuredPost.readTime}</span>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  Read Full Article
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogPosts.map((post, index) => (
              <Card key={index} className="glass-card group cursor-pointer hover:shadow-lg transition-all">
                <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3">
                    {post.category}
                  </Badge>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                      Read More
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mb-12">
            <Button variant="outline" className="hover:bg-green-50">
              Load More Articles
            </Button>
          </div>

          {/* Newsletter Signup */}
          <Card className="glass-card bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Stay Updated
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Subscribe to our newsletter for the latest articles, product updates, and energy-saving tips
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Button className="bg-green-600 hover:bg-green-700 px-8">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}