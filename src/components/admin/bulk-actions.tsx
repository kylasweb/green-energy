"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { 
  MoreHorizontal, 
  Download, 
  Upload, 
  Trash2, 
  Copy,
  Archive,
  EyeOff,
  Eye,
  Package,
  ShoppingCart,
  Users
} from "lucide-react"

interface BulkActionsProps {
  selectedCount: number
  totalCount: number
  actions: {
    label: string
    icon: React.ReactNode
    onClick: () => void
    variant?: "default" | "destructive" | "outline"
    confirm?: string
  }[]
  onClearSelection: () => void
  onSelectAll: () => void
  type?: "products" | "orders" | "customers"
}

export default function BulkActions({
  selectedCount,
  totalCount,
  actions,
  onClearSelection,
  onSelectAll,
  type = "products"
}: BulkActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAction = async (action: any) => {
    if (action.confirm && !confirm(action.confirm)) {
      return
    }

    setIsProcessing(true)
    try {
      await action.onClick()
    } catch (error) {
      console.error("Bulk action failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getTypeIcon = () => {
    switch (type) {
      case "products": return <Package className="h-4 w-4" />
      case "orders": return <ShoppingCart className="h-4 w-4" />
      case "customers": return <Users className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  if (selectedCount === 0) {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            onChange={onSelectAll}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-600">
            Select all {totalCount} {type}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedCount === totalCount}
            onChange={onSelectAll}
            className="rounded border-gray-300"
          />
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {selectedCount} selected
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-blue-700">
          {getTypeIcon()}
          <span>{selectedCount} {type} selected</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClearSelection}
        >
          Clear
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isProcessing}>
              <MoreHorizontal className="h-4 w-4 mr-1" />
              Bulk Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {actions.map((action, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() => handleAction(action)}
                  className={action.variant === "destructive" ? "text-red-600" : ""}
                  disabled={isProcessing}
                >
                  <div className="flex items-center space-x-2">
                    {action.icon}
                    <span>{action.label}</span>
                  </div>
                </DropdownMenuItem>
                {index < actions.length - 1 && <DropdownMenuSeparator />}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}