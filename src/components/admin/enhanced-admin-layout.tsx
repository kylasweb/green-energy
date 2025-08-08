"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  TrendingUp,
  Star,
  Truck,
  CreditCard,
  Bell,
  Search,
  HelpCircle,
  Keyboard
} from "lucide-react"
import KeyboardShortcuts from "./keyboard-shortcuts"
import AutoSave from "./auto-save"

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    title: "Shipments",
    href: "/admin/shipments",
    icon: Truck,
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: TrendingUp,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

interface EnhancedAdminLayoutProps {
  children: React.ReactNode
  autoSaveData?: any
  onAutoSave?: (data: any) => Promise<void>
  onAddProductClick?: () => void
}

interface AdminUser {
  id: string
  name: string
  email: string
  role: "ADMIN" | "SUPER_ADMIN"
  avatar?: string
}

export default function EnhancedAdminLayout({ 
  children,
  autoSaveData,
  onAutoSave,
  onAddProductClick
}: EnhancedAdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const pathname = usePathname()

  useEffect(() => {
    // Check admin authentication
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/auth")
        if (response.ok) {
          const data = await response.json()
          setAdminUser(data.user)
        } else {
          redirect("/auth/signin")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        redirect("/auth/signin")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" })
      redirect("/auth/signin")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleNew = () => {
    // Determine what "new" means based on current page
    if (pathname.includes("/products")) {
      // Trigger add product
      const addButton = document.evaluate(
        "//button[contains(., 'Add Product')]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue as HTMLButtonElement;
      addButton?.click();
    } else if (pathname.includes("/orders")) {
      // Trigger add order
      console.log("Add order")
    } else if (pathname.includes("/customers")) {
      // Trigger add customer
      console.log("Add customer")
    }
  }

  const handleSearch = () => {
    const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
    if (searchInput) {
      searchInput.focus()
      searchInput.select()
    }
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleSave = async () => {
    if (onAutoSave && autoSaveData) {
      try {
        await onAutoSave(autoSaveData)
      } catch (error) {
        console.error("Save failed:", error)
      }
    }
  }

  const handleCancel = () => {
    // Close any open modals or dialogs
    const closeButton = document.querySelector('button[aria-label="Close"]') as HTMLButtonElement
    if (closeButton) {
      closeButton.click()
    }
  }

  const handleHelp = () => {
    // Keyboard shortcuts dialog will open automatically
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!adminUser) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onNew={handleNew}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onSave={handleSave}
        onCancel={handleCancel}
        onHelp={handleHelp}
      />

      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <h1 className="text-xl font-bold text-green-600">Admin Panel</h1>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:bg-white lg:border-r">
        <div className="flex h-16 items-center px-4 border-b">
          <h1 className="text-xl font-bold text-green-600">Admin Panel</h1>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.title}
              </Link>
            )
          })}
        </nav>
        
        {/* User info */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={adminUser.avatar} alt={adminUser.name} />
              <AvatarFallback>{adminUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {adminUser.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {adminUser.email}
              </p>
              <Badge variant="secondary" className="text-xs mt-1">
                {adminUser.role}
              </Badge>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-gray-600 hover:text-gray-900"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              
              {/* Search */}
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <Search className="h-4 w-4" />
                </Button>
                {searchOpen && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 border rounded-md text-sm"
                      autoFocus
                      onBlur={() => setSearchOpen(false)}
                    />
                  </div>
                )}
              </div>
              
              <div className="hidden lg:block">
                <h2 className="text-lg font-semibold text-gray-900">
                  Welcome back, {adminUser.name}
                </h2>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {notifications}
                  </Badge>
                )}
              </Button>
              
              {/* Help */}
              <Button variant="ghost" size="sm">
                <Keyboard className="h-4 w-4" />
              </Button>
              
              {/* User menu */}
              <Avatar className="h-8 w-8">
                <AvatarImage src={adminUser.avatar} alt={adminUser.name} />
                <AvatarFallback>{adminUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Auto-save status */}
        {autoSaveData && onAutoSave && (
          <div className="px-4 sm:px-6 lg:px-8 py-2">
            <AutoSave
              data={autoSaveData}
              onSave={onAutoSave}
              debounceMs={3000}
              enabled={true}
              showStatus={true}
            />
          </div>
        )}

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}