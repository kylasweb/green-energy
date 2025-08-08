"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Upload,
  Download,
  Archive,
  Star,
  X,
  ImageIcon
} from "lucide-react"
import EditableTable from "@/components/admin/editable-table"
import BulkActions from "@/components/admin/bulk-actions"
import QuickActions from "@/components/admin/quick-actions"
import ImageSearch from "@/components/admin/image-search"
import EnhancedInlineEdit from "@/components/admin/enhanced-inline-edit"
import ImageReorder from "@/components/admin/image-reorder"
import QuickEditPanel from "@/components/admin/quick-edit-panel"
import BatchEditPanel from "@/components/admin/batch-edit-panel"
import ProductCloner from "@/components/admin/product-cloner"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  sku: string
  price: number
  mrp: number
  stockQuantity: number
  lowStockThreshold: number
  category: string
  brand: string
  images?: string[]
  tags?: string[]
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

interface ProductFormData {
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
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    sku: "",
    price: 0,
    mrp: 0,
    stockQuantity: 0,
    lowStockThreshold: 10,
    category: "",
    brand: "",
    isActive: true,
    isFeatured: false
  })

  // Mock categories and brands
  const categories = [
    "Two-Wheeler Batteries",
    "Four-Wheeler Batteries",
    "Inverters",
    "Solar PCU",
    "UPS Battery",
    "Inverter Trolley",
    "Battery Tray"
  ]

  const brands = [
    "Amaron",
    "Exide",
    "Luminous",
    "Microtek",
    "Su-Kam",
    "Okaya",
    "Tata Green"
  ]

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Amaron 2.5L",
        slug: "amaron-2-5l",
        description: "Reliable two-wheeler battery offering durability and smooth performance",
        sku: "AMR-25L-001",
        price: 758,
        mrp: 899,
        stockQuantity: 45,
        lowStockThreshold: 10,
        category: "Two-Wheeler Batteries",
        brand: "Amaron",
        images: [
          "https://ui-avatars.com/api/?name=Amaron&background=FF0000&color=fff&size=256",
          "https://via.placeholder.com/400x400/FF0000/FFFFFF?text=Amaron+2.5L"
        ],
        tags: ["battery", "automotive", "two-wheeler", "12v"],
        isActive: true,
        isFeatured: true,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-15"
      },
      {
        id: "2",
        name: "Amaron Z4",
        slug: "amaron-z4",
        description: "Compact and efficient, designed for two-wheelers",
        sku: "AMR-Z4-002",
        price: 875,
        mrp: 1020,
        stockQuantity: 32,
        lowStockThreshold: 10,
        category: "Two-Wheeler Batteries",
        brand: "Amaron",
        images: [
          "https://ui-avatars.com/api/?name=Amaron+Z4&background=FF0000&color=fff&size=256"
        ],
        isActive: true,
        isFeatured: true,
        createdAt: "2024-01-02",
        updatedAt: "2024-01-14"
      },
      {
        id: "3",
        name: "Amaron Z5",
        slug: "amaron-z5",
        description: "Enhanced capacity with quick charging and stable power output",
        sku: "AMR-Z5-003",
        price: 1030,
        mrp: 1200,
        stockQuantity: 8,
        lowStockThreshold: 10,
        category: "Two-Wheeler Batteries",
        brand: "Amaron",
        isActive: true,
        isFeatured: false,
        createdAt: "2024-01-03",
        updatedAt: "2024-01-13"
      },
      {
        id: "4",
        name: "Luminous Inverter",
        slug: "luminous-inverter",
        description: "High efficiency inverter for home and office use",
        sku: "LUM-INV-001",
        price: 2500,
        mrp: 2999,
        stockQuantity: 15,
        lowStockThreshold: 5,
        category: "Inverters",
        brand: "Luminous",
        isActive: true,
        isFeatured: true,
        createdAt: "2024-01-04",
        updatedAt: "2024-01-12"
      },
      {
        id: "5",
        name: "Exide Battery",
        slug: "exide-battery",
        description: "Durable battery with long life",
        sku: "EXD-BAT-001",
        price: 3200,
        mrp: 3799,
        stockQuantity: 5,
        lowStockThreshold: 10,
        category: "Four-Wheeler Batteries",
        brand: "Exide",
        isActive: false,
        isFeatured: false,
        createdAt: "2024-01-05",
        updatedAt: "2024-01-11"
      }
    ]
    
    setProducts(mockProducts)
    setFilteredProducts(mockProducts)
    setLoading(false)
  }, [])

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [searchTerm, products])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      description: "",
      sku: "",
      price: 0,
      mrp: 0,
      stockQuantity: 0,
      lowStockThreshold: 10,
      category: "",
      brand: "",
      isActive: true,
      isFeatured: false
    })
    setIsDialogOpen(true)
  }

  const handleEditProduct = (productId: string) => {
    const productToEdit = products.find(p => p.id === productId)
    if (productToEdit) {
      setEditingProduct(productToEdit)
      setFormData({
        name: productToEdit.name,
        description: productToEdit.description,
        sku: productToEdit.sku,
        price: productToEdit.price,
        mrp: productToEdit.mrp,
        stockQuantity: productToEdit.stockQuantity,
        lowStockThreshold: productToEdit.lowStockThreshold,
        category: productToEdit.category,
        brand: productToEdit.brand,
        isActive: productToEdit.isActive,
        isFeatured: productToEdit.isFeatured
      })
      setIsDialogOpen(true)
    }
  }

  const handleSaveProduct = () => {
    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map(p =>
        p.id === editingProduct.id
          ? { ...p, ...formData, updatedAt: new Date().toISOString() }
          : p
      )
      setProducts(updatedProducts)
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...formData
      }
      setProducts([...products, newProduct])
    }
    setIsDialogOpen(false)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter(p => p.id !== productId)
      setProducts(updatedProducts)
    }
  }

  const handleInlineEdit = (id: string, field: string, value: any) => {
    const updatedProducts = products.map(p =>
      p.id === id
        ? { ...p, [field]: value, updatedAt: new Date().toISOString() }
        : p
    )
    setProducts(updatedProducts)
  }

  const handleImageUpdate = (productId: string, images: string[]) => {
    const updatedProducts = products.map(p =>
      p.id === productId
        ? { ...p, images, updatedAt: new Date().toISOString() }
        : p
    )
    setProducts(updatedProducts)
  }

  const handleAutoFetchImages = async () => {
    if (confirm("This will automatically search and add images for all products that don't have images. Continue?")) {
      try {
        const response = await fetch("/api/admin/products/auto-fetch-images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const result = await response.json()
          alert(result.message)
          window.location.reload()
        } else {
          alert("Failed to auto-fetch images")
        }
      } catch (error) {
        console.error("Auto-fetch images error:", error)
        alert("Failed to auto-fetch images")
      }
    }
  }

  // Validation functions
  const validatePrice = (value: number) => {
    if (value <= 0) return "Price must be greater than 0"
    if (value > 1000000) return "Price seems too high"
    return null
  }

  const validateStock = (value: number) => {
    if (value < 0) return "Stock cannot be negative"
    if (value > 10000) return "Stock quantity seems too high"
    return null
  }

  const validateSKU = (value: string) => {
    if (!value.trim()) return "SKU is required"
    if (value.length < 3) return "SKU must be at least 3 characters"
    if (products.some(p => p.sku === value && p.id !== editingProduct?.id)) {
      return "SKU already exists"
    }
    return null
  }

  const validateName = (value: string) => {
    if (!value.trim()) return "Product name is required"
    if (value.length < 2) return "Product name must be at least 2 characters"
    return null
  }

  const handleBatchUpdate = async (productIds: string[], updates: any) => {
    try {
      const response = await fetch("/api/admin/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "customUpdate",
          type: "products",
          ids: productIds,
          data: updates
        }),
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message)
        setSelectedRows(new Set())
        window.location.reload()
      } else {
        alert("Batch update failed")
      }
    } catch (error) {
      console.error("Batch update error:", error)
      alert("Batch update failed")
    }
  }

  const handleCloneProduct = async (clonedProduct: any) => {
    try {
      // In a real app, this would call an API to create the cloned product
      const newProduct: Product = {
        id: Date.now().toString(),
        slug: clonedProduct.name.toLowerCase().replace(/\s+/g, '-'),
        name: clonedProduct.name,
        description: clonedProduct.description,
        sku: clonedProduct.sku,
        price: clonedProduct.price,
        mrp: clonedProduct.mrp,
        stockQuantity: clonedProduct.stockQuantity,
        lowStockThreshold: clonedProduct.lowStockThreshold,
        category: clonedProduct.category,
        brand: clonedProduct.brand,
        images: clonedProduct.copyImages ? products.find(p => p.id === clonedProduct.id)?.images : [],
        tags: clonedProduct.tags,
        isActive: clonedProduct.isActive,
        isFeatured: clonedProduct.isFeatured,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setProducts([...products, newProduct])
      alert("Product cloned successfully!")
    } catch (error) {
      console.error("Clone product error:", error)
      alert("Failed to clone product")
    }
  }

  const handleBulkAction = async (action: string) => {
    const selectedArray = Array.from(selectedRows)
    if (selectedArray.length === 0) return

    try {
      const response = await fetch("/api/admin/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          type: "products",
          ids: selectedArray,
          data: getBulkActionData(action)
        }),
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message)
        setSelectedRows(new Set())
        // Refresh data
        window.location.reload()
      } else {
        alert("Bulk action failed")
      }
    } catch (error) {
      console.error("Bulk action error:", error)
      alert("Bulk action failed")
    }
  }

  const getBulkActionData = (action: string) => {
    switch (action) {
      case "activate":
        return { updates: { isActive: true } }
      case "deactivate":
        return { updates: { isActive: false } }
      case "setFeatured":
        return { updates: { isFeatured: true } }
      case "unsetFeatured":
        return { updates: { isFeatured: false } }
      case "updateStock":
        return { stockAdjustment: 10 } // Example: add 10 to stock
      case "updatePrice":
        return { priceAdjustment: 5, adjustmentType: "percentage" } // Example: increase by 5%
      default:
        return {}
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const getStockStatus = (stock: number, threshold: number) => {
    if (stock === 0) return { color: "bg-red-100 text-red-800", text: "Out of Stock" }
    if (stock <= threshold) return { color: "bg-yellow-100 text-yellow-800", text: "Low Stock" }
    return { color: "bg-green-100 text-green-800", text: "In Stock" }
  }

  const tableColumns = [
    {
      key: "name",
      label: "Product",
      type: "text" as const,
      editable: true,
      render: (value: any, row: Product) => (
        <div>
          <EnhancedInlineEdit
            value={value}
            onChange={(newValue) => handleInlineEdit(row.id, "name", newValue)}
            type="text"
            validation={validateName}
            placeholder="Product name"
          />
          <div className="text-sm text-gray-500 mt-1">{row.description}</div>
        </div>
      )
    },
    {
      key: "sku",
      label: "SKU",
      type: "text" as const,
      editable: true,
      render: (value: any, row: Product) => (
        <EnhancedInlineEdit
          value={value}
          onChange={(newValue) => handleInlineEdit(row.id, "sku", newValue)}
          type="text"
          validation={validateSKU}
          placeholder="SKU"
        />
      )
    },
    {
      key: "category",
      label: "Category",
      type: "select" as const,
      editable: true,
      render: (value: any, row: Product) => (
        <EnhancedInlineEdit
          value={value}
          onChange={(newValue) => handleInlineEdit(row.id, "category", newValue)}
          type="select"
          options={categories.map(cat => ({ value: cat, label: cat }))}
        />
      )
    },
    {
      key: "brand",
      label: "Brand",
      type: "select" as const,
      editable: true,
      render: (value: any, row: Product) => (
        <EnhancedInlineEdit
          value={value}
          onChange={(newValue) => handleInlineEdit(row.id, "brand", newValue)}
          type="select"
          options={brands.map(brand => ({ value: brand, label: brand }))}
        />
      )
    },
    {
      key: "images",
      label: "Images",
      type: "text" as const,
      editable: false,
      render: (value: any, row: Product) => (
        <div className="flex items-center space-x-2">
          {row.images && row.images.length > 0 ? (
            <>
              <div className="flex -space-x-2">
                {row.images.slice(0, 3).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-8 h-8 rounded border object-cover"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {row.images.length} image{row.images.length !== 1 ? 's' : ''}
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-400">No images</span>
          )}
          <div className="flex space-x-1">
            <ImageSearch
              productId={row.id}
              brand={row.brand}
              productName={row.name}
              category={row.category}
              currentImages={row.images || []}
              onImagesUpdate={(images) => handleImageUpdate(row.id, images)}
            />
            {row.images && row.images.length > 1 && (
              <ImageReorder
                productId={row.id}
                brand={row.brand}
                productName={row.name}
                category={row.category}
                images={row.images}
                onImagesUpdate={(images) => handleImageUpdate(row.id, images)}
              />
            )}
          </div>
        </div>
      )
    },
    {
      key: "price",
      label: "Price",
      type: "currency" as const,
      editable: true,
      render: (value: any, row: Product) => (
        <div>
          <EnhancedInlineEdit
            value={value}
            onChange={(newValue) => handleInlineEdit(row.id, "price", newValue)}
            type="currency"
            validation={validatePrice}
            format={(val) => formatCurrency(val)}
          />
          <div className="text-sm text-gray-500 line-through">{formatCurrency(row.mrp)}</div>
        </div>
      )
    },
    {
      key: "stockQuantity",
      label: "Stock",
      type: "number" as const,
      editable: true,
      render: (value: any, row: Product) => (
        <div>
          <EnhancedInlineEdit
            value={value}
            onChange={(newValue) => handleInlineEdit(row.id, "stockQuantity", newValue)}
            type="number"
            validation={validateStock}
          />
          <div className="text-sm text-gray-500">Threshold: {row.lowStockThreshold}</div>
        </div>
      )
    },
    {
      key: "actions",
      label: "Actions",
      type: "text" as const,
      editable: false,
      render: (value: any, row: Product) => (
        <div className="flex items-center space-x-1">
          <QuickEditPanel
            product={row}
            categories={categories}
            brands={brands}
            onUpdate={(productId, updates) => {
              const updatedProducts = products.map(p =>
                p.id === productId
                  ? { ...p, ...updates, updatedAt: new Date().toISOString() }
                  : p
              )
              setProducts(updatedProducts)
            }}
          />
          <ProductCloner
            product={row}
            categories={categories}
            brands={brands}
            onClone={handleCloneProduct}
          />
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      type: "text" as const,
      editable: false,
      render: (value: any, row: Product) => {
        const stockStatus = getStockStatus(row.stockQuantity, row.lowStockThreshold)
        return (
          <div className="space-y-1">
            <Badge className={stockStatus.color}>
              {stockStatus.text}
            </Badge>
            <div className="flex space-x-1">
              <EnhancedInlineEdit
                value={row.isActive}
                onChange={(newValue) => handleInlineEdit(row.id, "isActive", newValue)}
                type="boolean"
              />
              {row.isFeatured && (
                <Badge variant="outline">Featured</Badge>
              )}
            </div>
          </div>
        )
      }
    }
  ]

  const bulkActions = [
    {
      label: "Activate",
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: () => handleBulkAction("activate")
    },
    {
      label: "Deactivate",
      icon: <X className="h-4 w-4" />,
      onClick: () => handleBulkAction("deactivate"),
      variant: "destructive" as const
    },
    {
      label: "Set Featured",
      icon: <Star className="h-4 w-4" />,
      onClick: () => handleBulkAction("setFeatured")
    },
    {
      label: "Remove Featured",
      icon: <Star className="h-4 w-4" />,
      onClick: () => handleBulkAction("unsetFeatured")
    },
    {
      label: "Add Stock",
      icon: <Package className="h-4 w-4" />,
      onClick: () => handleBulkAction("updateStock")
    },
    {
      label: "Update Images",
      icon: <ImageIcon className="h-4 w-4" />,
      onClick: async () => {
        const selectedArray = Array.from(selectedRows)
        if (selectedArray.length === 0) {
          alert("Please select products to update images")
          return
        }
        
        if (confirm(`Are you sure you want to update images for ${selectedArray.length} product(s)?`)) {
          try {
            const response = await fetch("/api/admin/products/update-images", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                productIds: selectedArray
              }),
            })

            if (response.ok) {
              const result = await response.json()
              alert(result.message)
              setSelectedRows(new Set())
              window.location.reload()
            } else {
              alert("Failed to update images")
            }
          } catch (error) {
            console.error("Bulk image update error:", error)
            alert("Failed to update images")
          }
        }
      }
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => handleBulkAction("delete"),
      variant: "destructive" as const,
      confirm: "Are you sure you want to delete the selected products?"
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-black">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <Button onClick={handleAddProduct} className="bg-black hover:bg-gray-800 text-white border-black">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Quick Actions */}
      <QuickActions
        type="products"
        onAdd={handleAddProduct}
        onImport={() => alert("Import functionality coming soon")}
        onExport={() => alert("Export functionality coming soon")}
        onRefresh={() => window.location.reload()}
        onFilter={() => alert("Filter functionality coming soon")}
        onSearch={() => (document.querySelector('input[placeholder*="Search"]') as HTMLInputElement)?.focus()}
        customActions={[
          {
            label: "Low Stock",
            icon: <AlertTriangle className="h-4 w-4" />,
            onClick: () => {
              const lowStockProducts = products.filter(p => p.stockQuantity <= p.lowStockThreshold)
              setFilteredProducts(lowStockProducts)
            },
            badge: products.filter(p => p.stockQuantity <= p.lowStockThreshold).length.toString()
          },
          {
            label: "Auto Fetch Images",
            icon: <ImageIcon className="h-4 w-4" />,
            onClick: handleAutoFetchImages,
            badge: products.filter(p => !p.images || p.images.length === 0).length.toString()
          }
        ]}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-black" />
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-xl font-bold text-black">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Products</p>
                <p className="text-xl font-bold text-black">{products.filter(p => p.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-xl font-bold text-black">{products.filter(p => p.stockQuantity <= p.lowStockThreshold).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Avg. Price</p>
                <p className="text-xl font-bold text-black">
                  {formatCurrency(products.reduce((sum, p) => sum + p.price, 0) / products.length || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center justify-between">
        <BulkActions
          selectedCount={selectedRows.size}
          totalCount={filteredProducts.length}
          actions={bulkActions}
          onClearSelection={() => setSelectedRows(new Set())}
          onSelectAll={() => setSelectedRows(new Set(filteredProducts.map(p => p.id)))}
          type="products"
        />
        <BatchEditPanel
          selectedProductIds={Array.from(selectedRows)}
          products={products}
          categories={categories}
          brands={brands}
          onUpdate={handleBatchUpdate}
          onClearSelection={() => setSelectedRows(new Set())}
        />
      </div>

      {/* Search and Filters */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EditableTable
            data={filteredProducts}
            columns={tableColumns}
            onEdit={handleInlineEdit}
            onDelete={handleDeleteProduct}
            onView={handleEditProduct}
            onDuplicate={(id) => {
              const product = products.find(p => p.id === id)
              if (product) {
                setFormData({
                  name: product.name + " (Copy)",
                  description: product.description,
                  sku: product.sku + "-COPY",
                  price: product.price,
                  mrp: product.mrp,
                  stockQuantity: product.stockQuantity,
                  lowStockThreshold: product.lowStockThreshold,
                  category: product.category,
                  brand: product.brand,
                  isActive: product.isActive,
                  isFeatured: product.isFeatured
                })
                setIsDialogOpen(true)
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? "Update the product information below." : "Create a new product for your store."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Select value={formData.brand} onValueChange={(value) => setFormData({...formData, brand: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="mrp">MRP (₹)</Label>
                <Input
                  id="mrp"
                  type="number"
                  value={formData.mrp}
                  onChange={(e) => setFormData({...formData, mrp: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({...formData, stockQuantity: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({...formData, lowStockThreshold: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                />
                <Label htmlFor="isFeatured">Featured</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProduct}>
              {editingProduct ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}