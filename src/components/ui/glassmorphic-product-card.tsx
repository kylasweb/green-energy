"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, ShoppingCart, Zap, Leaf, Award } from 'lucide-react'
import { GlassmorphicCard, GlassmorphicButton, GlassmorphicBadge } from '@/components/ui/glassmorphic'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface GlassmorphicProductCardProps {
  product: {
    id: string
    name: string
    price: number
    mrp?: number
    image: string
    rating?: number
    reviews?: number
    category?: string
    isFeatured?: boolean
    isNew?: boolean
    inStock?: boolean
    description?: string
  }
  className?: string
}

export function GlassmorphicProductCard({ product, className }: GlassmorphicProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0

  return (
    <GlassmorphicCard 
      className={cn(
        "group relative overflow-hidden transition-all duration-500",
        "hover:glass-hover cursor-pointer",
        className
      )}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden rounded-xl mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/30 glass-pattern" />
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <GlassmorphicBadge className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white border-white/30">
              <Award className="w-3 h-3 mr-1" />
              New
            </GlassmorphicBadge>
          )}
          {discount > 0 && (
            <GlassmorphicBadge className="bg-gradient-to-r from-red-500/80 to-pink-500/80 text-white border-white/30">
              -{discount}%
            </GlassmorphicBadge>
          )}
          {product.isFeatured && (
            <GlassmorphicBadge className="bg-gradient-to-r from-yellow-500/80 to-orange-500/80 text-white border-white/30">
              <Zap className="w-3 h-3 mr-1" />
              Featured
            </GlassmorphicBadge>
          )}
        </div>

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 right-3">
            <GlassmorphicBadge className="bg-green-500/80 text-white border-white/30 text-xs">
              <Leaf className="w-3 h-3 mr-1" />
              {product.category}
            </GlassmorphicBadge>
          </div>
        )}

        {/* Wishlist Button */}
        <div className="absolute bottom-3 right-3">
          <GlassmorphicButton
            variant="icon"
            size="icon"
            className={cn(
              "glass-card-strong transition-all duration-300",
              isLiked ? "text-red-500" : "text-gray-600"
            )}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          </GlassmorphicButton>
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="glass-card-strong px-4 py-2 rounded-full text-white text-sm font-medium">
            Quick View
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-3">
        {/* Product Name */}
        <div className="space-y-1">
          <h3 className="font-semibold text-lg glass-text-primary group-hover:text-green-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm glass-text-secondary line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4 transition-colors",
                    i < Math.floor(product.rating!)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm glass-text-secondary">
              {product.rating}
            </span>
            {product.reviews && (
              <span className="text-xs glass-text-secondary">
                ({product.reviews} reviews)
              </span>
            )}
          </div>
        )}

        {/* Price Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-600">
                ₹{product.price.toLocaleString()}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.mrp.toLocaleString()}
                </span>
              )}
            </div>
            {discount > 0 && (
              <GlassmorphicBadge variant="secondary" className="text-green-600 bg-green-100/80 border-green-200/50">
                Save {discount}%
              </GlassmorphicBadge>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              product.inStock !== false ? "bg-green-500" : "bg-red-500"
            )} />
            <span className={cn(
              "text-sm font-medium",
              product.inStock !== false ? "text-green-600" : "text-red-600"
            )}>
              {product.inStock !== false ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <GlassmorphicButton
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-none hover:from-green-600 hover:to-emerald-700"
            onClick={handleAddToCart}
            disabled={isLoading || product.inStock === false}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </GlassmorphicButton>
          
          <Link href={`/products/${product.id}`}>
            <GlassmorphicButton variant="gradient" size="icon">
              <Zap className="w-4 h-4" />
            </GlassmorphicButton>
          </Link>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20">
          <div className="glass-card-subtle p-2 rounded-lg text-center">
            <div className="text-xs text-green-600 font-medium">Free Delivery</div>
            <div className="text-xs glass-text-secondary">Above ₹500</div>
          </div>
          <div className="glass-card-subtle p-2 rounded-lg text-center">
            <div className="text-xs text-blue-600 font-medium">1 Year Warranty</div>
            <div className="text-xs glass-text-secondary">Guaranteed</div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="glass-card-strong p-4 rounded-full">
            <div className="w-8 h-8 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
          </div>
        </div>
      )}

      {/* Shimmer Effect */}
      <div className="glass-shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </GlassmorphicCard>
  )
}

export default GlassmorphicProductCard