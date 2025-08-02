"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Search, 
  Image as ImageIcon, 
  Download, 
  RefreshCw,
  Check,
  Loader2
} from "lucide-react"

interface ImageSearchProps {
  productId: string
  brand: string
  productName?: string
  category?: string
  currentImages?: string[]
  onImagesUpdate: (images: string[]) => void
}

interface SearchResult {
  url: string
  selected: boolean
}

export default function ImageSearch({ 
  productId, 
  brand, 
  productName, 
  category, 
  currentImages = [],
  onImagesUpdate 
}: ImageSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>(currentImages)

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/products/search-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand,
          productName,
          category
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const results = data.images.map((url: string) => ({
          url,
          selected: selectedImages.includes(url)
        }))
        setSearchResults(results)
      } else {
        console.error("Image search failed")
      }
    } catch (error) {
      console.error("Error searching for images:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageSelect = (url: string) => {
    const newResults = searchResults.map(result => ({
      ...result,
      selected: result.url === url ? !result.selected : result.selected
    }))
    setSearchResults(newResults)

    const newSelected = newResults
      .filter(r => r.selected)
      .map(r => r.url)
    setSelectedImages(newSelected)
  }

  const handleSaveImages = async () => {
    try {
      const response = await fetch("/api/admin/products/update-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          images: selectedImages
        }),
      })

      if (response.ok) {
        onImagesUpdate(selectedImages)
        setIsOpen(false)
      } else {
        console.error("Failed to update images")
      }
    } catch (error) {
      console.error("Error updating images:", error)
    }
  }

  const handleAutoGenerate = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/products/update-images", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productIds: [productId]
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Refresh the product data
          window.location.reload()
        }
      }
    } catch (error) {
      console.error("Error auto-generating image:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ImageIcon className="h-4 w-4 mr-2" />
          {currentImages.length > 0 ? "Update Images" : "Add Images"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Search Product Images</DialogTitle>
          <DialogDescription>
            Search for product images based on brand: {brand}
            {productName && ` - Product: ${productName}`}
            {category && ` - Category: ${category}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Controls */}
          <div className="flex gap-2">
            <Button 
              onClick={handleSearch} 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search Images
            </Button>
            <Button 
              variant="outline" 
              onClick={handleAutoGenerate}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Auto Generate
            </Button>
          </div>

          {/* Current Images */}
          {currentImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Current Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {currentImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Current product image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Search Results</CardTitle>
                <CardDescription className="text-xs">
                  Click on images to select them for your product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                        result.selected 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleImageSelect(result.url)}
                    >
                      <img
                        src={result.url}
                        alt={`Search result ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      {result.selected && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs">
                        Image {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Images Preview */}
          {selectedImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Selected Images ({selectedImages.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Selected image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border-2 border-blue-500"
                      />
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-blue-500">
                        {index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveImages}
            disabled={selectedImages.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Save {selectedImages.length} Image{selectedImages.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}