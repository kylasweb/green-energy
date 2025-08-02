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
  Copy, 
  Save, 
  X,
  Plus,
  Trash2,
  Hash,
  DollarSign,
  Package,
  Tag,
  FileText,
  Layers,
  Zap
} from "lucide-react"

interface ProductClonerProps {
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
    images?: string[]
    specifications?: any
    features?: any
  }
  categories: string[]
  brands: string[]
  onClone: (clonedProduct: any) => void
}

interface Variation {
  id: string
  name: string
  sku: string
  price: number
  mrp: number
  stockQuantity: number
  isActive: boolean
}

export default function ProductCloner({ 
  product, 
  categories, 
  brands, 
  onClone 
}: ProductClonerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [cloneMode, setCloneMode] = useState<"single" | "variations">("single")
  const [variations, setVariations] = useState<Variation[]>([])
  const [baseProduct, setBaseProduct] = useState({
    name: `${product.name} (Copy)`,
    description: product.description,
    sku: `${product.sku}-COPY`,
    price: product.price,
    mrp: product.mrp,
    stockQuantity: product.stockQuantity,
    lowStockThreshold: product.lowStockThreshold,
    category: product.category,
    brand: product.brand,
    isActive: product.isActive,
    isFeatured: false, // Default to not featured for clones
    tags: product.tags?.join(", ") || "",
    copyImages: true,
    copySpecs: true,
    copyFeatures: true
  })

  const [isSaving, setIsSaving] = useState(false)

  const variationTypes = [
    { value: "capacity", label: "Capacity", examples: ["2.5L", "5L", "10L"] },
    { value: "voltage", label: "Voltage", examples: ["12V", "24V", "48V"] },
    { value: "type", label: "Type", examples: ["Standard", "Premium", "Heavy Duty"] },
    { value: "size", label: "Size", examples: ["Small", "Medium", "Large"] },
    { value: "color", label: "Color", examples: ["Red", "Blue", "Green"] }
  ]

  const addVariation = () => {
    const newVariation: Variation = {
      id: Date.now().toString(),
      name: "",
      sku: `${baseProduct.sku}-VAR${variations.length + 1}`,
      price: baseProduct.price,
      mrp: baseProduct.mrp,
      stockQuantity: baseProduct.stockQuantity,
      isActive: true
    }
    setVariations([...variations, newVariation])
  }

  const removeVariation = (id: string) => {
    setVariations(variations.filter(v => v.id !== id))
  }

  const updateVariation = (id: string, field: string, value: any) => {
    setVariations(variations.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ))
  }

  const generateVariations = (type: string, values: string[]) => {
    const newVariations = values.map((value, index) => ({
      id: Date.now().toString() + index,
      name: `${baseProduct.name} - ${value}`,
      sku: `${baseProduct.sku}-${value.toUpperCase().replace(/\s+/g, '')}`,
      price: baseProduct.price,
      mrp: baseProduct.mrp,
      stockQuantity: baseProduct.stockQuantity,
      isActive: true
    }))
    setVariations(newVariations)
  }

  const handleClone = async () => {
    setIsSaving(true)
    try {
      if (cloneMode === "single") {
        const clonedProduct = {
          ...baseProduct,
          tags: baseProduct.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
          originalProductId: product.id
        }
        await onClone(clonedProduct)
      } else {
        // Clone with variations
        for (const variation of variations) {
          const clonedProduct = {
            ...baseProduct,
            name: variation.name,
            sku: variation.sku,
            price: variation.price,
            mrp: variation.mrp,
            stockQuantity: variation.stockQuantity,
            isActive: variation.isActive,
            tags: baseProduct.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
            originalProductId: product.id,
            variationType: "custom"
          }
          await onClone(clonedProduct)
        }
      }
      setIsOpen(false)
      // Reset form
      setBaseProduct({
        name: `${product.name} (Copy)`,
        description: product.description,
        sku: `${product.sku}-COPY`,
        price: product.price,
        mrp: product.mrp,
        stockQuantity: product.stockQuantity,
        lowStockThreshold: product.lowStockThreshold,
        category: product.category,
        brand: product.brand,
        isActive: product.isActive,
        isFeatured: false,
        tags: product.tags?.join(", ") || "",
        copyImages: true,
        copySpecs: true,
        copyFeatures: true
      })
      setVariations([])
    } catch (error) {
      console.error("Failed to clone product:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    setBaseProduct({
      name: `${product.name} (Copy)`,
      description: product.description,
      sku: `${product.sku}-COPY`,
      price: product.price,
      mrp: product.mrp,
      stockQuantity: product.stockQuantity,
      lowStockThreshold: product.lowStockThreshold,
      category: product.category,
      brand: product.brand,
      isActive: product.isActive,
      isFeatured: false,
      tags: product.tags?.join(", ") || "",
      copyImages: true,
      copySpecs: true,
      copyFeatures: true
    })
    setVariations([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Copy className="h-4 w-4 mr-2" />
          Clone
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Clone Product: {product.name}</DialogTitle>
          <DialogDescription>
            Create a copy of this product or generate multiple variations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Clone Mode Selection */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Clone Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button
                  variant={cloneMode === "single" ? "default" : "outline"}
                  onClick={() => setCloneMode("single")}
                  className={`flex-1 ${cloneMode === "single" ? "bg-black hover:bg-gray-800 text-white border-black" : "border-gray-300 hover:bg-gray-50"}`}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Single Clone
                </Button>
                <Button
                  variant={cloneMode === "variations" ? "default" : "outline"}
                  onClick={() => setCloneMode("variations")}
                  className={`flex-1 ${cloneMode === "variations" ? "bg-black hover:bg-gray-800 text-white border-black" : "border-gray-300 hover:bg-gray-50"}`}
                >
                  <Layers className="h-4 w-4 mr-2" />
                  Multiple Variations
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Base Product Settings */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2 text-black" />
                Base Product Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={baseProduct.name}
                    onChange={(e) => setBaseProduct(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-gray-400" />
                    <Input
                      id="sku"
                      value={baseProduct.sku}
                      onChange={(e) => setBaseProduct(prev => ({ ...prev, sku: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="price">Price</Label>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={baseProduct.price}
                      onChange={(e) => setBaseProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="mrp">MRP</Label>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <Input
                      id="mrp"
                      type="number"
                      step="0.01"
                      value={baseProduct.mrp}
                      onChange={(e) => setBaseProduct(prev => ({ ...prev, mrp: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <Input
                      id="stock"
                      type="number"
                      value={baseProduct.stockQuantity}
                      onChange={(e) => setBaseProduct(prev => ({ ...prev, stockQuantity: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="threshold">Low Stock Threshold</Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={baseProduct.lowStockThreshold}
                    onChange={(e) => setBaseProduct(prev => ({ ...prev, lowStockThreshold: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={baseProduct.category}
                    onValueChange={(value) => setBaseProduct(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Select
                    value={baseProduct.brand}
                    onValueChange={(value) => setBaseProduct(prev => ({ ...prev, brand: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={baseProduct.description}
                  onChange={(e) => setBaseProduct(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={baseProduct.tags}
                  onChange={(e) => setBaseProduct(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., battery, automotive, 12v"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="copyImages"
                    checked={baseProduct.copyImages}
                    onCheckedChange={(checked) => setBaseProduct(prev => ({ ...prev, copyImages: checked }))}
                  />
                  <Label htmlFor="copyImages">Copy Images</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="copySpecs"
                    checked={baseProduct.copySpecs}
                    onCheckedChange={(checked) => setBaseProduct(prev => ({ ...prev, copySpecs: checked }))}
                  />
                  <Label htmlFor="copySpecs">Copy Specifications</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="copyFeatures"
                    checked={baseProduct.copyFeatures}
                    onCheckedChange={(checked) => setBaseProduct(prev => ({ ...prev, copyFeatures: checked }))}
                  />
                  <Label htmlFor="copyFeatures">Copy Features</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variations Section */}
          {cloneMode === "variations" && (
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Layers className="h-5 w-5 mr-2 text-black" />
                  Product Variations
                </CardTitle>
                <CardDescription>
                  Create multiple variations of the base product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Variation Generation */}
                <div>
                  <Label>Quick Generate Variations</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                    {variationTypes.map(type => (
                      <div key={type.value} className="border rounded-lg p-3 border-gray-200">
                        <div className="font-medium text-sm mb-2 text-black">{type.label}</div>
                        <div className="flex flex-wrap gap-1">
                          {type.examples.map(example => (
                            <Button
                              key={example}
                              size="sm"
                              variant="outline"
                              onClick={() => generateVariations(type.value, type.examples)}
                              className="text-xs border-gray-300 hover:bg-gray-50"
                            >
                              {example}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Manual Variations */}
                <div className="flex items-center justify-between">
                  <Label>Manual Variations</Label>
                  <Button size="sm" onClick={addVariation} className="bg-black hover:bg-gray-800 text-white border-black">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variation
                  </Button>
                </div>

                {/* Variations List */}
                {variations.length > 0 && (
                  <div className="space-y-3">
                    {variations.map((variation, index) => (
                      <div key={variation.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium">Variation {index + 1}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeVariation(variation.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label className="text-xs">Name</Label>
                            <Input
                              value={variation.name}
                              onChange={(e) => updateVariation(variation.id, "name", e.target.value)}
                              placeholder="Variation name"
                              className="text-sm"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs">SKU</Label>
                            <Input
                              value={variation.sku}
                              onChange={(e) => updateVariation(variation.id, "sku", e.target.value)}
                              placeholder="SKU"
                              className="text-sm"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs">Price</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={variation.price}
                              onChange={(e) => updateVariation(variation.id, "price", parseFloat(e.target.value) || 0)}
                              placeholder="Price"
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {variations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Layers className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No variations added yet</p>
                    <p className="text-sm">Click "Add Variation" or use quick generation above</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Zap className="h-5 w-5 mr-2 text-black" />
                Clone Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Clone Mode:</span>
                  <Badge variant="outline">
                    {cloneMode === "single" ? "Single Product" : "Multiple Variations"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Products to Create:</span>
                  <Badge>
                    {cloneMode === "single" ? "1" : Math.max(1, variations.length)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Copy Images:</span>
                  <Badge variant={baseProduct.copyImages ? "default" : "secondary"}>
                    {baseProduct.copyImages ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Copy Specifications:</span>
                  <Badge variant={baseProduct.copySpecs ? "default" : "secondary"}>
                    {baseProduct.copySpecs ? "Yes" : "No"}
                  </Badge>
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
          <Button onClick={handleClone} disabled={isSaving} className="bg-black hover:bg-gray-800 text-white border-black">
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                Cloning...
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Clone {cloneMode === "single" ? "Product" : `${Math.max(1, variations.length)} Products`}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}