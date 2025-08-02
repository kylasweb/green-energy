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
  Edit3, 
  Save, 
  X,
  Users,
  DollarSign,
  Package,
  Star,
  Power,
  Tag,
  FileText,
  Hash,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

interface BatchEditPanelProps {
  selectedProductIds: string[]
  products: any[]
  categories: string[]
  brands: string[]
  onUpdate: (productIds: string[], updates: any) => void
  onClearSelection: () => void
}

interface BatchField {
  key: string
  label: string
  type: "text" | "number" | "currency" | "select" | "textarea" | "boolean" | "tags"
  options?: { value: string; label: string }[]
  description?: string
  icon?: React.ReactNode
}

export default function BatchEditPanel({ 
  selectedProductIds, 
  products, 
  categories, 
  brands, 
  onUpdate, 
  onClearSelection 
}: BatchEditPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const batchFields: BatchField[] = [
    {
      key: "price",
      label: "Price",
      type: "currency",
      description: "Set new price for all selected products",
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      key: "mrp",
      label: "MRP",
      type: "currency",
      description: "Set new MRP for all selected products",
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      key: "stockQuantity",
      label: "Stock Quantity",
      type: "number",
      description: "Set stock quantity (absolute value)",
      icon: <Package className="h-4 w-4" />
    },
    {
      key: "stockAdjustment",
      label: "Stock Adjustment",
      type: "number",
      description: "Adjust stock by amount (positive or negative)",
      icon: <Package className="h-4 w-4" />
    },
    {
      key: "lowStockThreshold",
      label: "Low Stock Threshold",
      type: "number",
      description: "Set low stock warning threshold",
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: categories.map(cat => ({ value: cat, label: cat })),
      description: "Change category for all selected products",
      icon: <Tag className="h-4 w-4" />
    },
    {
      key: "brand",
      label: "Brand",
      type: "select",
      options: brands.map(brand => ({ value: brand, label: brand })),
      description: "Change brand for all selected products",
      icon: <Tag className="h-4 w-4" />
    },
    {
      key: "isActive",
      label: "Active Status",
      type: "boolean",
      description: "Set active/inactive status for all selected products",
      icon: <Power className="h-4 w-4" />
    },
    {
      key: "isFeatured",
      label: "Featured Status",
      type: "boolean",
      description: "Set featured status for all selected products",
      icon: <Star className="h-4 w-4" />
    },
    {
      key: "tags",
      label: "Tags",
      type: "tags",
      description: "Set tags (comma-separated, replaces existing tags)",
      icon: <Tag className="h-4 w-4" />
    }
  ]

  const handleFieldToggle = (fieldKey: string) => {
    const newSelected = new Set(selectedFields)
    if (newSelected.has(fieldKey)) {
      newSelected.delete(fieldKey)
      delete formData[fieldKey]
    } else {
      newSelected.add(fieldKey)
    }
    setSelectedFields(newSelected)
    setFormData({ ...formData })
  }

  const handleFieldChange = (fieldKey: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldKey]: value }))
  }

  const handleSave = async () => {
    if (selectedFields.size === 0) {
      alert("Please select at least one field to update")
      return
    }

    setIsSaving(true)
    try {
      const updates: any = {}
      
      selectedFields.forEach(fieldKey => {
        if (fieldKey === "stockAdjustment") {
          // Handle stock adjustment separately
          updates.stockAdjustment = formData.stockAdjustment
        } else {
          updates[fieldKey] = formData[fieldKey]
        }
      })

      await onUpdate(selectedProductIds, updates)
      setIsOpen(false)
      setSelectedFields(new Set())
      setFormData({})
    } catch (error) {
      console.error("Failed to save batch edits:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setSelectedFields(new Set())
    setFormData({})
    setIsOpen(false)
  }

  const getSelectedProducts = () => {
    return products.filter(p => selectedProductIds.includes(p.id))
  }

  const renderField = (field: BatchField) => {
    const isSelected = selectedFields.has(field.key)
    const value = formData[field.key]
    
    if (!isSelected) return null

    switch (field.type) {
      case "number":
      case "currency":
        return (
          <div className="space-y-2">
            <Input
              type="number"
              step={field.type === "currency" ? "0.01" : "1"}
              value={value || ""}
              onChange={(e) => handleFieldChange(field.key, parseFloat(e.target.value) || 0)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
          </div>
        )
      case "boolean":
        return (
          <div className="space-y-2">
            <Switch
              checked={value || false}
              onCheckedChange={(checked) => handleFieldChange(field.key, checked)}
            />
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
          </div>
        )
      case "select":
        return (
          <div className="space-y-2">
            <Select
              value={value || ""}
              onValueChange={(selectedValue) => handleFieldChange(field.key, selectedValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
          </div>
        )
      case "tags":
        return (
          <div className="space-y-2">
            <Input
              value={value || ""}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder="Enter tags separated by commas"
            />
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
          </div>
        )
      default:
        return (
          <div className="space-y-2">
            <Input
              value={value || ""}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
          </div>
        )
    }
  }

  const renderPreview = () => {
    const selectedProducts = getSelectedProducts()
    
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Preview Changes
          </CardTitle>
          <CardDescription>
            Review the changes that will be applied to {selectedProducts.length} selected product(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Summary of changes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from(selectedFields).map(fieldKey => {
                const field = batchFields.find(f => f.key === fieldKey)
                if (!field) return null
                
                return (
                  <div key={fieldKey} className="border rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      {field.icon}
                      <span className="font-medium">{field.label}</span>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-600">New value:</div>
                      <div className="font-medium">
                        {field.type === "boolean" 
                          ? formData[fieldKey] ? "Yes" : "No"
                          : field.type === "currency"
                          ? `₹${formData[fieldKey]}`
                          : formData[fieldKey]?.toString() || "Not set"
                        }
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Sample product preview */}
            {selectedProducts.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Sample Product Changes:</h4>
                <div className="border rounded-lg p-3 bg-gray-50">
                  <div className="space-y-2 text-sm">
                    <div><strong>{selectedProducts[0].name}</strong></div>
                    {Array.from(selectedFields).map(fieldKey => {
                      const currentValue = selectedProducts[0][fieldKey]
                      const newValue = formData[fieldKey]
                      
                      return (
                        <div key={fieldKey} className="flex justify-between">
                          <span className="text-gray-600">{fieldKey}:</span>
                          <div className="flex items-center space-x-2">
                            <span className="line-through text-gray-400">
                              {fieldKey === "isActive" || fieldKey === "isFeatured"
                                ? currentValue ? "Yes" : "No"
                                : fieldKey === "price" || fieldKey === "mrp"
                                ? `₹${currentValue}`
                                : currentValue?.toString() || "Not set"
                              }
                            </span>
                            <span>→</span>
                            <span className="font-medium text-green-600">
                              {fieldKey === "isActive" || fieldKey === "isFeatured"
                                ? newValue ? "Yes" : "No"
                                : fieldKey === "price" || fieldKey === "mrp"
                                ? `₹${newValue}`
                                : newValue?.toString() || "Not set"
                              }
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (selectedProductIds.length === 0) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit3 className="h-4 w-4 mr-2" />
          Batch Edit ({selectedProductIds.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Batch Edit Products</DialogTitle>
          <DialogDescription>
            Edit multiple products at once. Select the fields you want to update.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Products Summary */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2 text-black" />
                Selected Products ({selectedProductIds.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {getSelectedProducts().slice(0, 10).map(product => (
                  <Badge key={product.id} variant="secondary" className="text-xs">
                    {product.name}
                  </Badge>
                ))}
                {selectedProductIds.length > 10 && (
                  <Badge variant="outline" className="text-xs">
                    +{selectedProductIds.length - 10} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Field Selection */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Select Fields to Update</CardTitle>
              <CardDescription>
                Choose which fields you want to modify for all selected products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {batchFields.map(field => (
                  <div
                    key={field.key}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedFields.has(field.key)
                        ? 'border-black bg-black bg-opacity-5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleFieldToggle(field.key)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-black">{field.icon}</span>
                        <span className="font-medium text-black">{field.label}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedFields.has(field.key)}
                        onChange={() => {}}
                        className="rounded border-gray-300 text-black focus:ring-black"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <p className="text-xs text-gray-600">{field.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Field Values */}
          {selectedFields.size > 0 && (
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Enter New Values</CardTitle>
                <CardDescription>
                  Set the new values for the selected fields
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {batchFields.map(field => renderField(field))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview */}
          {selectedFields.size > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedFields.size} field{selectedFields.size !== 1 ? 's' : ''} selected for update
              </span>
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
                className="border-gray-300 hover:bg-gray-50"
              >
                {previewMode ? "Hide Preview" : "Show Preview"}
              </Button>
            </div>
          )}

          {previewMode && selectedFields.size > 0 && renderPreview()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} className="border-gray-300 hover:bg-gray-50">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || selectedFields.size === 0}
            className="bg-black hover:bg-gray-800 text-white border-black"
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                Updating {selectedProductIds.length} products...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update {selectedProductIds.length} Product{selectedProductIds.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}