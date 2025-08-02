"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Search, Battery, Zap, Leaf, Shield, Truck, Headphones, Grid, List, Loader2 } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  productCount: number
  children?: Category[]
}

interface CategoryWithProducts extends Category {
  products?: Array<{
    id: string
    name: string
    slug: string
    price: number
    mrp: number
    images: string[]
    avgRating: number
    reviewCount: number
    stockQuantity: number
  }>
}

const categoryIcons = {
  "Two-Wheeler Batteries": Battery,
  "Four-Wheeler Batteries": Battery,
  "Inverters": Zap,
  "Solar PCU": Leaf,
  "UPS Battery": Battery,
  "Inverter Trolley": Truck,
  "Battery Tray": Shield,
  "Others": Headphones
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/categories?includeProducts=true&includeChildren=true')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const CategoryCard = ({ category }: { category: CategoryWithProducts }) => {
    const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Battery
    const isExpanded = expandedCategory === category.id

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-full p-3">
                <IconComponent className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <CardDescription>
                  {category.productCount} Products
                </CardDescription>
              </div>
            </div>
            {category.children && category.children.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
              >
                <svg
                  className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            )}
          </div>
          
          {category.image && (
            <div className="relative h-32 bg-gray-100 rounded-lg mb-4">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
          
          {category.description && (
            <p className="text-sm text-gray-600 mb-4">{category.description}</p>
          )}
        </CardHeader>
        
        <CardContent>
          {/* Subcategories */}
          {isExpanded && category.children && category.children.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Subcategories</h4>
              <div className="grid grid-cols-2 gap-2">
                {category.children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/products?category=${child.slug}`}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    {child.name} ({child.productCount})
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Sample Products */}
          {category.products && category.products.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Popular Products</h4>
              <div className="space-y-2">
                {category.products.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center justify-between text-sm">
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-gray-700 hover:text-green-600 truncate"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-green-600">
                        ₹{product.price}
                      </span>
                      {product.stockQuantity > 0 ? (
                        <Badge variant="secondary" className="text-xs">
                          In Stock
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
              <Link href={`/products?category=${category.slug}`}>
                View Products
              </Link>
            </Button>
            {category.children && category.children.length > 0 && (
              <Button variant="outline" size="sm">
                {category.children.length} Subcategories
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const CategoryList = ({ category }: { category: CategoryWithProducts }) => {
    const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Battery
    const isExpanded = expandedCategory === category.id

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="bg-green-100 rounded-full p-4">
                <IconComponent className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-2">{category.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{category.productCount} Products</span>
                    {category.children && category.children.length > 0 && (
                      <span>{category.children.length} Subcategories</span>
                    )}
                  </div>
                </div>
                {category.children && category.children.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                  >
                    <svg
                      className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                )}
              </div>

              {isExpanded && category.children && category.children.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Subcategories</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/products?category=${child.slug}`}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200"
                      >
                        {child.name} ({child.productCount})
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {category.products && category.products.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Popular Products</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {category.products.slice(0, 3).map((product) => (
                      <div key={product.id} className="border rounded-lg p-3">
                        <Link
                          href={`/products/${product.slug}`}
                          className="text-sm font-medium text-gray-700 hover:text-green-600 block mb-1"
                        >
                          {product.name}
                        </Link>
                        <div className="flex items-center justify-between">
                          <span className="text-green-600 font-medium">
                            ₹{product.price}
                          </span>
                          {product.stockQuantity > 0 ? (
                            <Badge variant="secondary" className="text-xs">
                              In Stock
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href={`/products?category=${category.slug}`}>
                    View All Products
                  </Link>
                </Button>
                {category.image && (
                  <Button variant="outline" size="sm">
                    View Gallery
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
                <BreadcrumbPage>Categories</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Product Categories</h1>
              <p className="text-gray-600">
                Browse our wide range of energy solutions by category
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-r-none ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`rounded-l-none ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : (
          <>
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No categories found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search terms</p>
                <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "space-y-6"
              }>
                {filteredCategories.map((category) => (
                  viewMode === 'grid' ? (
                    <CategoryCard key={category.id} category={category} />
                  ) : (
                    <CategoryList key={category.id} category={category} />
                  )
                ))}
              </div>
            )}
          </>
        )}

        {/* Stats */}
        {!loading && filteredCategories.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Category Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredCategories.length}
                </div>
                <div className="text-sm text-gray-600">Total Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredCategories.reduce((sum, cat) => sum + cat.productCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredCategories.filter(cat => cat.children && cat.children.length > 0).length}
                </div>
                <div className="text-sm text-gray-600">Parent Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredCategories.reduce((sum, cat) => sum + (cat.children?.length || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Subcategories</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}