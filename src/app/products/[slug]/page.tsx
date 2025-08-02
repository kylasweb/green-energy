"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw, 
  Share2,
  Plus,
  Minus,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"

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
  specifications?: any
  features?: any
  avgRating: number
  reviewCount: number
  isFeatured: boolean
  isNew: boolean
  stockQuantity: number
  weight?: number
  dimensions?: any
  tags?: string[]
  metaTitle?: string
  metaDesc?: string
  metaKeywords?: string
  reviews: Array<{
    id: string
    rating: number
    title?: string
    comment?: string
    createdAt: string
    user: {
      id: string
      name: string
    }
  }>
}

interface RelatedProduct {
  id: string
  name: string
  slug: string
  price: number
  mrp: number
  images: string[]
  avgRating: number
  reviewCount: number
  stockQuantity: number
  category: {
    name: string
  }
  brand: {
    name: string
  }
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { addToCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  })

  useEffect(() => {
    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/${slug}`)
      const data = await response.json()
      
      if (data.error) {
        router.push('/products')
        return
      }
      
      setProduct(data.product)
      setRelatedProducts(data.relatedProducts)
    } catch (error) {
      console.error('Error fetching product:', error)
      router.push('/products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    
    setIsAddingToCart(true)
    try {
      await addToCart(product.id, quantity)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      toast.error('Failed to add product to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBuyNow = () => {
    // TODO: Implement buy now functionality
    alert('Redirecting to checkout...')
  }

  const handleAddToWishlist = () => {
    // TODO: Implement wishlist functionality
    alert('Added to wishlist')
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement review submission
    alert('Review submitted successfully!')
    setReviewForm({ rating: 5, title: '', comment: '' })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const renderStars = (rating: number, size = 'h-4 w-4') => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${size} ${
              i < Math.floor(rating)
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => router.push('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
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
                <BreadcrumbLink href="/products">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/products?category=${product.category.slug}`}>
                  {product.category.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            <div className="relative h-96 bg-gray-100 rounded-lg mb-4">
              <Image
                src={product.images[selectedImageIndex] || "/placeholder-product.svg"}
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
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-20 bg-gray-100 rounded border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-green-500' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image || "/placeholder-product.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-gray-600 mb-4">{product.shortDesc || product.description.substring(0, 150)}...</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    {renderStars(product.avgRating)}
                    <span className="text-sm text-gray-600 ml-2">
                      ({product.avgRating} - {product.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Brand: <Link href={`/products?brand=${product.brand.slug}`} className="text-green-600 hover:text-green-700">
                      {product.brand.name}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-green-600">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.mrp)}
                  </span>
                  <Badge variant="secondary">
                    Save {formatPrice(product.mrp - product.price)}
                  </Badge>
                </div>
                {product.stockQuantity > 0 ? (
                  <div className="text-green-600 text-sm">
                    ✓ In Stock ({product.stockQuantity} available)
                  </div>
                ) : (
                  <div className="text-red-600 text-sm">
                    ✗ Out of Stock
                  </div>
                )}
              </div>

              {/* Quantity and Actions */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-0"
                      min={1}
                      max={product.stockQuantity}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      disabled={quantity >= product.stockQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Total: {formatPrice(product.price * quantity)}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    size="lg" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity === 0 || isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <ShoppingCart className="mr-2 h-5 w-5" />
                    )}
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={handleBuyNow}
                    disabled={product.stockQuantity === 0}
                  >
                    Buy Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleAddToWishlist}
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <Truck className="h-6 w-6 text-green-600 mb-2" />
                    <span className="text-sm font-medium">Free Delivery</span>
                    <span className="text-xs text-gray-600">On orders above ₹999</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <RotateCcw className="h-6 w-6 text-green-600 mb-2" />
                    <span className="text-sm font-medium">Easy Returns</span>
                    <span className="text-xs text-gray-600">30-day return policy</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Shield className="h-6 w-6 text-green-600 mb-2" />
                    <span className="text-sm font-medium">Warranty</span>
                    <span className="text-xs text-gray-600">Manufacturer warranty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">Product Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
                
                {product.features && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Key Features</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {Array.isArray(product.features) 
                        ? product.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))
                        : Object.entries(product.features).map(([key, value]) => (
                            <li key={key}>{key}: {value}</li>
                          ))
                      }
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Technical Specifications</h3>
              {product.specifications ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="font-medium text-gray-700">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No specifications available for this product.</p>
              )}
              
              {product.dimensions && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Dimensions</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(product.dimensions).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium text-gray-700">{key}</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {product.weight && (
                <div className="mt-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-gray-700">Weight</span>
                    <span className="text-gray-600">{product.weight} kg</span>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Reviews List */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                  
                  {product.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              {renderStars(review.rating)}
                              <span className="font-medium">{review.user.name}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {review.title && (
                            <h4 className="font-medium mb-1">{review.title}</h4>
                          )}
                          {review.comment && (
                            <p className="text-gray-700">{review.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
                
                {/* Review Form */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <Select 
                        value={reviewForm.rating.toString()} 
                        onValueChange={(value) => setReviewForm(prev => ({ ...prev, rating: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 Stars - Excellent</SelectItem>
                          <SelectItem value="4">4 Stars - Good</SelectItem>
                          <SelectItem value="3">3 Stars - Average</SelectItem>
                          <SelectItem value="2">2 Stars - Poor</SelectItem>
                          <SelectItem value="1">1 Star - Terrible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Title (Optional)</label>
                      <Input
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Review title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Comment</label>
                      <Textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Write your review here..."
                        rows={4}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                      Submit Review
                    </Button>
                  </form>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                  <div className="space-y-3 text-gray-700">
                    <p><strong>Free Shipping:</strong> On all orders above ₹999</p>
                    <p><strong>Standard Delivery:</strong> 3-5 business days</p>
                    <p><strong>Express Delivery:</strong> 1-2 business days (additional charges apply)</p>
                    <p><strong>Shipping Partners:</strong> We work with trusted delivery partners across India</p>
                    <p><strong>Order Tracking:</strong> Real-time tracking available once your order is shipped</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Return Policy</h3>
                  <div className="space-y-3 text-gray-700">
                    <p><strong>Return Period:</strong> 30 days from delivery</p>
                    <p><strong>Condition:</strong> Product must be unused and in original packaging</p>
                    <p><strong>Process:</strong> Easy return process with pickup from your location</p>
                    <p><strong>Refund:</strong> Full refund or exchange available</p>
                    <p><strong>Warranty:</strong> Manufacturer warranty applies as per product specifications</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="relative h-48 bg-gray-100 rounded-lg mb-4">
                      <Image
                        src={relatedProduct.images[0] || "/placeholder-product.svg"}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{relatedProduct.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {relatedProduct.category.name} • {relatedProduct.brand.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-3">
                      {renderStars(relatedProduct.avgRating)}
                      <span className="text-sm text-gray-600 ml-2">
                        ({relatedProduct.avgRating})
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xl font-bold text-green-600">
                          {formatPrice(relatedProduct.price)}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {formatPrice(relatedProduct.mrp)}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" asChild>
                      <Link href={`/products/${relatedProduct.slug}`}>
                        View Product
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}