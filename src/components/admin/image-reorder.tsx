"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  GripVertical, 
  Plus, 
  Trash2, 
  Eye,
  Upload,
  Download,
  RotateCcw
} from "lucide-react"
import ImageSearch from "./image-search"

interface ImageReorderProps {
  productId: string
  brand: string
  productName?: string
  category?: string
  images: string[]
  onImagesUpdate: (images: string[]) => void
}

interface DragItem {
  index: number
  id: string
  type: 'image'
}

export default function ImageReorder({ 
  productId, 
  brand, 
  productName, 
  category, 
  images, 
  onImagesUpdate 
}: ImageReorderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set())

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = "move"
    setDraggedItem({ index, id: `image-${index}`, type: 'image' })
    e.dataTransfer.setData("text/plain", `image-${index}`)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem.index === targetIndex) {
      setDragOverIndex(null)
      return
    }

    const newImages = [...images]
    const [movedImage] = newImages.splice(draggedItem.index, 1)
    newImages.splice(targetIndex, 0, movedImage)
    
    onImagesUpdate(newImages)
    setDragOverIndex(null)
    setDraggedItem(null)
  }

  const handleImageSelect = (index: number) => {
    const newSelected = new Set(selectedImages)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedImages(newSelected)
  }

  const handleDeleteSelected = () => {
    if (selectedImages.size === 0) return
    
    if (confirm(`Are you sure you want to delete ${selectedImages.size} image(s)?`)) {
      const newImages = images.filter((_, index) => !selectedImages.has(index))
      onImagesUpdate(newImages)
      setSelectedImages(new Set())
    }
  }

  const handleAddImages = (newImages: string[]) => {
    const updatedImages = [...images, ...newImages]
    onImagesUpdate(updatedImages)
  }

  const handleSetPrimary = (index: number) => {
    const newImages = [...images]
    const [primaryImage] = newImages.splice(index, 1)
    newImages.unshift(primaryImage)
    onImagesUpdate(newImages)
  }

  const handleDownloadAll = () => {
    images.forEach((imageUrl, index) => {
      const link = document.createElement('a')
      link.href = imageUrl
      link.download = `${brand}-${productName || 'product'}-${index + 1}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  const handleResetOrder = () => {
    if (confirm("Are you sure you want to reset the image order?")) {
      onImagesUpdate(images)
      setSelectedImages(new Set())
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reorder ({images.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Product Images</DialogTitle>
          <DialogDescription>
            Drag and drop to reorder images, set primary image, or add new images
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Action Bar */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {images.length} image{images.length !== 1 ? 's' : ''}
              </span>
              {selectedImages.size > 0 && (
                <Badge variant="secondary" className="bg-red-100 text-red-700 border border-red-200">
                  {selectedImages.size} selected
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <ImageSearch
                productId={productId}
                brand={brand}
                productName={productName}
                category={category}
                currentImages={images}
                onImagesUpdate={handleAddImages}
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadAll}
                disabled={images.length === 0}
                className="border-gray-300 hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
              
              {selectedImages.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                  className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedImages.size})
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetOrder}
                className="border-gray-300 hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                className={`
                  relative group border-2 rounded-lg overflow-hidden transition-all
                  ${dragOverIndex === index ? 'border-black bg-black bg-opacity-5' : 'border-gray-200'}
                  ${selectedImages.has(index) ? 'ring-2 ring-red-500' : ''}
                  ${index === 0 ? 'ring-2 ring-green-500' : ''}
                  cursor-move hover:shadow-md hover:border-gray-300
                `}
              >
                {/* Primary Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className="bg-green-600 text-white border-green-600">Primary</Badge>
                  </div>
                )}
                
                {/* Selection Checkbox */}
                <div className="absolute top-2 right-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedImages.has(index)}
                    onChange={() => handleImageSelect(index)}
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Image */}
                <img
                  src={imageUrl}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-32 object-cover bg-gray-50"
                />

                {/* Drag Handle */}
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                </div>

                {/* Index Badge */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  {index + 1}
                </div>

                {/* Quick Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        window.open(imageUrl, '_blank')
                      }}
                      className="h-8 w-8 p-0 bg-white hover:bg-gray-100 border-gray-300"
                    >
                      <Eye className="h-4 w-4 text-gray-700" />
                    </Button>
                    {index !== 0 && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSetPrimary(index)}
                        className="h-8 w-8 p-0 bg-white hover:bg-gray-100 border-gray-300"
                      >
                        <Upload className="h-4 w-4 text-gray-700" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Add Image Placeholder */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-32 hover:border-gray-400 transition-colors bg-gray-50">
              <ImageSearch
                productId={productId}
                brand={brand}
                productName={productName}
                category={category}
                currentImages={images}
                onImagesUpdate={handleAddImages}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-2 text-black">How to use:</h4>
            <ul className="space-y-1 text-xs">
              <li>• Drag and drop images to reorder them</li>
              <li>• Click the upload icon to set an image as primary</li>
              <li>• Select multiple images using checkboxes and delete them</li>
              <li>• Click "Add Images" to search for and add new images</li>
              <li>• The first image is automatically set as primary</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} className="border-gray-300 hover:bg-gray-50">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}