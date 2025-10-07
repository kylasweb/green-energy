"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Pagination } from "@/components/ui/pagination"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Heart, 
  ChevronDown,
  X,
  Loader2
} from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDesc?: string
  price: number
  mrp: number
  images: string[]
  category: {
    id: string
    name: string
    slug: string
  }
  brand: {
    id: string
    name: string
    slug: string
  }
  avgRating: number
  reviewCount: number
  isFeatured: boolean
  isNew: boolean
  stockQuantity: number
}

interface Category {
  id: string
  name: string
  slug: string
  productCount: number
}

interface Brand {
  id: string
  name: string
  slug: string
  productCount: number
}

function ProductsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addToCart } = useCart()
  
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt')
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sortBy,
        sortOrder
      })

      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('category', selectedCategory)
      if (selectedBrand) params.append('brand', selectedBrand)
      if (priceRange[0] > 0) params.append('minPrice', priceRange[0].toString())
      if (priceRange[1] < 5000) params.append('maxPrice', priceRange[1].toString())

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      
      setProducts(data.products)
      setTotalPages(data.pagination.pages)
      setTotalProducts(data.pagination.total)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, sortBy, sortOrder, searchTerm, selectedCategory, selectedBrand, priceRange])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?includeProducts=true')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands?includeProducts=true')
      const data = await response.json()
      setBrands(data)
    } catch (error) {
      console.error('Error fetching brands:', error)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchBrands()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts()
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedBrand('')
    setPriceRange([0, 5000])
    setSortBy('createdAt')
    setSortOrder('desc')
    setCurrentPage(1)
  }

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="relative h-48 bg-gray-100 rounded-lg mb-4">
          <Image
            src={product.images[0] || "/placeholder-product.svg"}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
          <div className="absolute top-2 left-2 flex gap-1">
            {product.isFeatured && (
              <Badge className="bg-orange-500">Featured</Badge>
            )}
            {product.isNew && (
              <Badge className="bg-green-500">New</Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {product.shortDesc || product.description.substring(0, 100)}...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.avgRating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            ({product.avgRating} - {product.reviewCount} reviews)
          </span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xl font-bold text-green-600">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-gray-500 line-through ml-2">
              {formatPrice(product.mrp)}
            </span>
          </div>
          <Badge variant="secondary">
            Save {formatPrice(product.mrp - product.price)}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={product.stockQuantity === 0 || addingToCart === product.id}
            onClick={() => handleAddToCart(product.id, product.name)}
          >
            {addingToCart === product.id ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="mr-2 h-4 w-4" />
            )}
            {addingToCart === product.id ? 'Adding...' : (product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart')}
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/products/${product.slug}`}>View</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const ProductList = ({ product }: { product: Product }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-6">
          <div className="relative w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0">
            <Image
              src={product.images[0] || "/placeholder-product.svg"}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {product.shortDesc || product.description.substring(0, 150)}...
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Category: {product.category.name}</span>
                  <span>Brand: {product.brand.name}</span>
                  {product.stockQuantity > 0 && (
                    <span className="text-green-600">In Stock ({product.stockQuantity})</span>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-xl font-bold text-green-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-gray-500 line-through ml-2">
                    {formatPrice(product.mrp)}
                  </span>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.avgRating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    ({product.avgRating})
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={product.stockQuantity === 0 || addingToCart === product.id}
                  onClick={() => handleAddToCart(product.id, product.name)}
                >
                  {addingToCart === product.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="mr-2 h-4 w-4" />
                  )}
                  {addingToCart === product.id ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/products/${product.slug}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
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
                  <BreadcrumbPage>Products</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>

              {/* Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </form>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedCategory === category.slug}
                        onCheckedChange={(checked) => {
                          setSelectedCategory(checked ? category.slug : '')
                          setCurrentPage(1)
                        }}
                      />
                      <span className="text-sm">{category.name}</span>
                      <span className="text-xs text-gray-500">({category.productCount})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Brands</h4>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedBrand === brand.slug}
                        onCheckedChange={(checked) => {
                          setSelectedBrand(checked ? brand.slug : '')
                          setCurrentPage(1)
                        }}
                      />
                      <span className="text-sm">{brand.name}</span>
                      <span className="text-xs text-gray-500">({brand.productCount})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => {
                    setPriceRange(value as [number, number])
                    setCurrentPage(1)
                  }}
                  max={5000}
                  step={100}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="font-medium mb-3">Sort By</h4>
                <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                  const [field, order] = value.split('-')
                  setSortBy(field)
                  setSortOrder(order)
                  setCurrentPage(1)
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Products</h1>
                  <p className="text-gray-600">
                    Showing {totalProducts} products
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
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

            {/* Products */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : (
              <>
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                    <Button onClick={clearFilters}>Clear Filters</Button>
                  </div>
                ) : (
                  <>
                    <div className={
                      viewMode === 'grid' 
                        ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" 
                        : "space-y-4"
                    }>
                      {products.map((product) => (
                        viewMode === 'grid' ? (
                          <ProductCard key={product.id} product={product} />
                        ) : (
                          <ProductList key={product.id} product={product} />
                        )
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-8 flex justify-center">
                        <Pagination>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                          <div className="flex items-center px-4">
                            Page {currentPage} of {totalPages}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </Button>
                        </Pagination>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}