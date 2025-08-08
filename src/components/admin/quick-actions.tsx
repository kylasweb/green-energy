"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Upload, 
  Download, 
  RefreshCw, 
  Filter,
  Search,
  Settings,
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  Star,
  Truck,
  FileText,
  Database,
  Zap
} from "lucide-react"

interface QuickActionsProps {
  type: "products" | "orders" | "customers" | "dashboard"
  onAdd?: () => void
  onImport?: () => void
  onExport?: () => void
  onRefresh?: () => void
  onFilter?: () => void
  onSearch?: () => void
  onSettings?: () => void
  onAnalytics?: () => void
  customActions?: {
    label: string
    icon: React.ReactNode
    onClick?: () => void
    badge?: string
    variant?: "default" | "outline" | "ghost"
  }[]
}

export default function QuickActions({
  type,
  onAdd,
  onImport,
  onExport,
  onRefresh,
  onFilter,
  onSearch,
  onSettings,
  onAnalytics,
  customActions = []
}: QuickActionsProps) {
  const getTypeTitle = () => {
    switch (type) {
      case "products": return "Products"
      case "orders": return "Orders"
      case "customers": return "Customers"
      case "dashboard": return "Dashboard"
      default: return "Management"
    }
  }

  const getTypeIcon = () => {
    switch (type) {
      case "products": return <Package className="h-5 w-5" />
      case "orders": return <ShoppingCart className="h-5 w-5" />
      case "customers": return <Users className="h-5 w-5" />
      case "dashboard": return <BarChart3 className="h-5 w-5" />
      default: return <Settings className="h-5 w-5" />
    }
  }

  const defaultActions: QuickActionsProps['customActions'] = [
    {
      label: "Add New",
      icon: <Plus className="h-4 w-4" />,
      onClick: onAdd || undefined,
      variant: "default" as const,
      badge: undefined
    },
    {
      label: "Import",
      icon: <Upload className="h-4 w-4" />,
      onClick: onImport || undefined,
      variant: "outline" as const,
      badge: undefined
    },
    {
      label: "Export",
      icon: <Download className="h-4 w-4" />,
      onClick: onExport || undefined,
      variant: "outline" as const,
      badge: undefined
    },
    {
      label: "Refresh",
      icon: <RefreshCw className="h-4 w-4" />,
      onClick: onRefresh || undefined,
      variant: "outline" as const,
      badge: undefined
    },
    {
      label: "Filter",
      icon: <Filter className="h-4 w-4" />,
      onClick: onFilter || undefined,
      variant: "outline" as const,
      badge: undefined
    },
    {
      label: "Search",
      icon: <Search className="h-4 w-4" />,
      onClick: onSearch || undefined,
      variant: "outline" as const,
      badge: undefined
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      onClick: onSettings || undefined,
      variant: "outline" as const,
      badge: undefined
    },
    {
      label: "Analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      onClick: onAnalytics || undefined,
      variant: "outline" as const,
      badge: undefined
    }
  ]

  const allActions = [...defaultActions, ...customActions]

  const primaryActions = allActions.filter(action => action.variant === "default")
  const secondaryActions = allActions.filter(action => action.variant !== "default")

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          {getTypeIcon()}
          <span>Quick Actions - {getTypeTitle()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {primaryActions.map((action, index) => (
            <Button
              key={index}
              className="h-20 flex-col space-y-2"
              onClick={action.onClick}
              disabled={!action.onClick}
            >
              {action.icon}
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
          
          {secondaryActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-20 flex-col space-y-2"
              onClick={action.onClick}
              disabled={!action.onClick}
            >
              <div className="relative">
                {action.icon}
                {action.badge && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {action.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
        
        {/* Keyboard Shortcuts Hint */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">Keyboard Shortcuts</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
            <div><kbd className="px-1 py-0.5 bg-white border rounded">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-white border rounded">N</kbd> New</div>
            <div><kbd className="px-1 py-0.5 bg-white border rounded">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-white border rounded">F</kbd> Find</div>
            <div><kbd className="px-1 py-0.5 bg-white border rounded">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-white border rounded">R</kbd> Refresh</div>
            <div><kbd className="px-1 py-0.5 bg-white border rounded">Esc</kbd> Cancel</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}