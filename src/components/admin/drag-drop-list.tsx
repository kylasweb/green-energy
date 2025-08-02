"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  GripVertical,
  Eye,
  Edit,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown
} from "lucide-react"

interface DragDropItem {
  id: string
  name: string
  description?: string
  status?: string
  order?: number
  [key: string]: any
}

interface DragDropListProps {
  items: DragDropItem[]
  onReorder: (items: DragDropItem[]) => void
  onEdit?: (item: DragDropItem) => void
  onDelete?: (id: string) => void
  onView?: (item: DragDropItem) => void
  onAdd?: () => void
  renderItem?: (item: DragDropItem) => React.ReactNode
  sortable?: boolean
  showOrder?: boolean
}

export default function DragDropList({
  items,
  onReorder,
  onEdit,
  onDelete,
  onView,
  onAdd,
  renderItem,
  sortable = true,
  showOrder = true
}: DragDropListProps) {
  const [draggedItem, setDraggedItem] = useState<DragDropItem | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (item: DragDropItem, e: React.DragEvent) => {
    if (!sortable) return
    
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", item.id)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (!sortable || !draggedItem) return
    
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    if (!sortable || !draggedItem) return
    
    e.preventDefault()
    
    const draggedIndex = items.findIndex(item => item.id === draggedItem.id)
    if (draggedIndex === targetIndex) return
    
    const newItems = [...items]
    const [removed] = newItems.splice(draggedIndex, 1)
    newItems.splice(targetIndex, 0, removed)
    
    // Update order numbers
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1
    }))
    
    onReorder(updatedItems)
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  const moveItem = (index: number, direction: "up" | "down") => {
    if (!sortable) return
    
    const newItems = [...items]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newItems.length) return
    
    const [removed] = newItems.splice(index, 1)
    newItems.splice(targetIndex, 0, removed)
    
    // Update order numbers
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1
    }))
    
    onReorder(updatedItems)
  }

  const defaultRenderItem = (item: DragDropItem) => (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-3">
        {sortable && (
          <div className="cursor-move text-gray-400 hover:text-gray-600">
            <GripVertical className="h-4 w-4" />
          </div>
        )}
        
        {showOrder && (
          <Badge variant="outline" className="text-xs">
            #{item.order || items.indexOf(item) + 1}
          </Badge>
        )}
        
        <div>
          <div className="font-medium">{item.name}</div>
          {item.description && (
            <div className="text-sm text-gray-500">{item.description}</div>
          )}
          {item.status && (
            <Badge variant="secondary" className="text-xs mt-1">
              {item.status}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {sortable && (
          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveItem(items.findIndex(i => i.id === item.id), "up")}
              disabled={items.findIndex(i => i.id === item.id) === 0}
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveItem(items.findIndex(i => i.id === item.id), "down")}
              disabled={items.findIndex(i => i.id === item.id) === items.length - 1}
            >
              <ArrowDown className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        {onView && (
          <Button variant="ghost" size="sm" onClick={() => onView(item)}>
            <Eye className="h-4 w-4" />
          </Button>
        )}
        
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
        
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-2">
      {onAdd && (
        <Button onClick={onAdd} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      )}
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <Card
            key={item.id}
            className={`transition-all duration-200 ${
              draggedItem?.id === item.id ? "opacity-50" : ""
            } ${
              dragOverIndex === index ? "border-blue-500 bg-blue-50" : ""
            }`}
            draggable={sortable}
            onDragStart={(e) => handleDragStart(item, e)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <CardContent className="p-0">
              {renderItem ? renderItem(item) : defaultRenderItem(item)}
            </CardContent>
          </Card>
        ))}
        
        {items.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No items found</p>
              {onAdd && (
                <Button onClick={onAdd} className="mt-2" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      
      {sortable && (
        <div className="text-xs text-gray-500 text-center">
          Drag and drop to reorder items or use the arrow buttons
        </div>
      )}
    </div>
  )
}