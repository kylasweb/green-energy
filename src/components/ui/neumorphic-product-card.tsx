"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, ShoppingCart, Zap, Leaf, Award } from 'lucide-react'
import { NeumorphicCard, NeumorphicButton, NeumorphicBadge } from '@/components/ui/neumorphic'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface NeumorphicProductCardProps {
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

export function NeumorphicProductCard({ product, className }: NeumorphicProductCardProps) {
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
    <NeumorphicCard 
      className={cn(
        "group relative overflow-hidden transition-all duration-500",
        "hover:scale-[1.03] hover:-translate-y-2",
        className
      )}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <NeumorphicBadge variant="gradient" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Zap className="w-3 h-3 mr-1" />
              New
            </NeumorphicBadge>
          )}
          {product.isFeatured && (
            <NeumorphicBadge variant="gradient" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
              <Award className="w-3 h-3 mr-1" />
              Featured
            </NeumorphicBadge>
          )}
          {discount > 0 && (
            <NeumorphicBadge variant="gradient" className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
              {discount}% OFF
            </NeumorphicBadge>
          )}
        </div>

        {/* Heart Button */}
        <div className="absolute top-3 right-3">
          <NeumorphicButton
            variant="icon"
            size="icon"
            onClick={() => setIsLiked(!isLiked)}
            className={cn(
              "w-10 h-10 transition-all duration-300",
              isLiked && "neu-pressed scale-95"
            )}
          >
            <Heart 
              className={cn(
                "w-5 h-5 transition-colors",
                isLiked ? "fill-red-500 text-red-500" : "text-gray-400"
              )} 
            />
          </NeumorphicButton>
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <NeumorphicButton
            variant="gradient"
            onClick={handleAddToCart}
            disabled={isLoading}
            className={cn(
              "opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0",
              "transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 text-white",
              isLoading && "neu-loading"
            )}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isLoading ? 'Adding...' : 'Quick Add'}
          </NeumorphicButton>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Category */}
        {product.category && (
          <div className="flex items-center gap-1 text-sm neu-text-secondary">
            <Leaf className="w-3 h-3" />
            {product.category}
          </div>
        )}

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold neu-text-primary line-clamp-2 hover:text-green-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        {product.description && (
          <p className="text-sm neu-text-secondary line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(product.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-sm neu-text-secondary">
              {product.rating} {product.reviews && `(${product.reviews})`}
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold neu-text-primary">
                ₹{product.price.toLocaleString()}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-sm neu-text-secondary line-through">
                  ₹{product.mrp.toLocaleString()}
                </span>
              )}
            </div>
            <div className={cn(
              "text-xs font-medium",
              product.inStock !== false ? "text-green-600" : "text-red-500"
            )}>
              {product.inStock !== false ? "In Stock" : "Out of Stock"}
            </div>
          </div>

          <NeumorphicButton
            variant="default"
            size="sm"
            onClick={handleAddToCart}
            disabled={isLoading || product.inStock === false}
            className={cn(
              "min-w-[80px]",
              isLoading && "neu-loading",
              product.inStock === false && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add
              </>
            )}
          </NeumorphicButton>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10" />
      </div>
    </NeumorphicCard>
  )
}

export default NeumorphicProductCard