"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Edit2, 
  Save, 
  X,
  DollarSign,
  Package,
  Star,
  Power,
  Tag,
  FileText,
  Hash,
  CheckCircle
} from "lucide-react"

interface QuickEditPanelProps {
  product: {
    id: string
    name: string
    description: string
    sku: string
    price: number
    mrp: number
    stockQuantity: number
    lowStockThreshold: number
    category: string
    brand: string
    isActive: boolean
    isFeatured: boolean
    tags?: string[]
  }
  categories: string[]
  brands: string[]
  onUpdate: (productId: string, updates: any) => void
}

export default function QuickEditPanel({ 
  product, 
  categories, 
  brands, 
  onUpdate 
}: QuickEditPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    sku: product.sku,
    price: product.price,
    mrp: product.mrp,
    stockQuantity: product.stockQuantity,
    lowStockThreshold: product.lowStockThreshold,
    category: product.category,
    brand: product.brand,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    tags: product.tags?.join(", ") || ""
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updates = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
      }
      
      await onUpdate(product.id, updates)
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to save quick edits:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: product.name,
      description: product.description,
      sku: product.sku,
      price: product.price,
      mrp: product.mrp,
      stockQuantity: product.stockQuantity,
      lowStockThreshold: product.lowStockThreshold,
      category: product.category,
      brand: product.brand,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      tags: product.tags?.join(", ") || ""
    })
    setIsOpen(false)
  }

  const quickActions = [
    {
      title: "Pricing",
      icon: <DollarSign className="h-4 w-4" />,
      fields: [
        { key: "price", label: "Price", type: "number", step: 0.01 },
        { key: "mrp", label: "MRP", type: "number", step: 0.01 }
      ]
    },
    {
      title: "Inventory",
      icon: <Package className="h-4 w-4" />,
      fields: [
        { key: "stockQuantity", label: "Stock", type: "number" },
        { key: "lowStockThreshold", label: "Low Stock Threshold", type: "number" }
      ]
    },
    {
      title: "Status",
      icon: <Power className="h-4 w-4" />,
      fields: [
        { 
          key: "isActive", 
          label: "Active", 
          type: "switch",
          description: "Product is visible to customers"
        },
        { 
          key: "isFeatured", 
          label: "Featured", 
          type: "switch",
          description: "Show on homepage and featured sections"
        }
      ]
    },
    {
      title: "Classification",
      icon: <Tag className="h-4 w-4" />,
      fields: [
        { 
          key: "category", 
          label: "Category", 
          type: "select",
          options: categories.map(cat => ({ value: cat, label: cat }))
        },
        { 
          key: "brand", 
          label: "Brand", 
          type: "select",
          options: brands.map(brand => ({ value: brand, label: brand }))
        }
      ]
    }
  ]

  const renderField = (field: any) => {
    const value = formData[field.key]
    
    switch (field.type) {
      case "number":
        return (
          <Input
            type="number"
            step={field.step || 1}
            value={value}
            onChange={(e) => handleFieldChange(field.key, parseFloat(e.target.value) || 0)}
            className="w-full"
          />
        )
      case "switch":
        return (
          <div className="space-y-2">
            <Switch
              checked={value}
              onCheckedChange={(checked) => handleFieldChange(field.key, checked)}
            />
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
          </div>
        )
      case "select":
        return (
          <Select
            value={value}
            onValueChange={(selectedValue) => handleFieldChange(field.key, selectedValue)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return (
          <Input
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="w-full"
          />
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit2 className="h-4 w-4 mr-2" />
          Quick Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick Edit: {product.name}</DialogTitle>
          <DialogDescription>
            Make quick edits to common product fields
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2 text-black" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="sku">SKU</Label>
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleFieldChange("sku", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  rows={3}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleFieldChange("tags", e.target.value)}
                  placeholder="e.g., battery, automotive, 12v"
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Card key={action.title} className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <span className="text-black">{action.icon}</span>
                    <span className="ml-2 text-black">{action.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {action.fields.map((field: any) => (
                    <div key={field.key}>
                      <Label htmlFor={field.key}>{field.label}</Label>
                      {renderField(field)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Preview Changes */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Changes Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm line-through text-gray-400">
                      ₹{product.price}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      ₹{formData.price}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Stock:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">
                      {product.stockQuantity}
                    </span>
                    <span className="text-sm font-medium">
                      → {formData.stockQuantity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-sm">→</span>
                    <Badge variant={formData.isActive ? "default" : "secondary"}>
                      {formData.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} className="border-gray-300 hover:bg-gray-50">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-black hover:bg-gray-800 text-white border-black">
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}