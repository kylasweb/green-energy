"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Search, User, Heart, Menu, X, Leaf } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export default function Header() {
  const pathname = usePathname()
  const { state } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const navigation = [
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-green-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="hidden md:flex items-center space-x-6">
              <span>📞 +91 98765 43210</span>
              <span>✉️ info@greenenergysolutions.com</span>
              <span>🕐 Mon-Sat: 9AM-6PM</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/track-order" className="hover:text-green-100">Track Order</Link>
              <Link href="/support" className="hover:text-green-100">Support</Link>
              <Link href="/auth/signin" className="hover:text-green-100">Sign In</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-green-800">Green Energy Solutions</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-gray-700 hover:text-green-600 transition-colors ${
                  isActive(item.href) ? 'text-green-600 font-medium' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              {/* Search Dropdown */}
              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border rounded-lg shadow-lg p-4 z-10">
                  <div className="flex space-x-2">
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="flex-1"
                      autoFocus
                    />
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Search
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {state.totals.totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center p-0 min-w-5">
                    {state.totals.totalItems > 99 ? '99+' : state.totals.totalItems}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="flex space-x-2">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="flex-1"
                />
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-50 ${
                      isActive(item.href) ? 'text-green-600 bg-green-50 font-medium' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="flex items-center justify-around pt-4 border-t">
                <Button variant="ghost" size="sm" className="flex-col gap-1">
                  <User className="h-5 w-5" />
                  <span className="text-xs">Account</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex-col gap-1">
                  <Heart className="h-5 w-5" />
                  <span className="text-xs">Wishlist</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex-col gap-1 relative" asChild>
                  <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                    <ShoppingCart className="h-5 w-5" />
                    <span className="text-xs">Cart</span>
                    {state.totals.totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center p-0 min-w-5">
                        {state.totals.totalItems > 99 ? '99+' : state.totals.totalItems}
                      </Badge>
                    )}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}