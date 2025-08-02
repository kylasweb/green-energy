"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Edit2, 
  Save, 
  X, 
  MoreVertical,
  Copy,
  Trash2,
  Eye,
  Package
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface EditableTableProps {
  data: any[]
  columns: {
    key: string
    label: string
    type?: "text" | "number" | "select" | "boolean" | "currency"
    editable?: boolean
    options?: { value: string; label: string }[]
    render?: (value: any, row: any) => React.ReactNode
  }[]
  onEdit?: (id: string, field: string, value: any) => void
  onSave?: (id: string) => void
  onDelete?: (id: string) => void
  onDuplicate?: (id: string) => void
  onView?: (id: string) => void
  actions?: {
    label: string
    icon: React.ReactNode
    onClick: (row: any) => void
    variant?: "default" | "outline" | "ghost" | "destructive"
  }[]
  idField?: string
}

export default function EditableTable({
  data,
  columns,
  onEdit,
  onSave,
  onDelete,
  onDuplicate,
  onView,
  actions,
  idField = "id",
}: EditableTableProps) {
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState<any>("")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  const handleCellClick = (id: string, field: string, value: any) => {
    if (columns.find(col => col.key === field)?.editable) {
      setEditingCell({ id, field })
      setEditValue(value)
    }
  }

  const handleCellSave = () => {
    if (editingCell && onEdit) {
      onEdit(editingCell.id, editingCell.field, editValue)
      if (onSave) {
        onSave(editingCell.id)
      }
    }
    setEditingCell(null)
    setEditValue("")
  }

  const handleCellCancel = () => {
    setEditingCell(null)
    setEditValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCellSave()
    } else if (e.key === "Escape") {
      handleCellCancel()
    }
  }

  const renderCell = (row: any, column: any) => {
    const value = row[column.key]
    const isEditing = editingCell?.id === row[idField] && editingCell?.field === column.key

    if (isEditing) {
      switch (column.type) {
        case "select":
          return (
            <Select value={editValue} onValueChange={setEditValue}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {column.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        case "boolean":
          return (
            <Select value={editValue.toString()} onValueChange={setEditValue}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          )
        case "number":
          return (
            <Input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
              className="w-24"
              onKeyDown={handleKeyDown}
              autoFocus
            />
          )
        case "currency":
          return (
            <Input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
              className="w-28"
              onKeyDown={handleKeyDown}
              autoFocus
            />
          )
        default:
          return (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-48"
              onKeyDown={handleKeyDown}
              autoFocus
            />
          )
      }
    }

    if (column.render) {
      return column.render(value, row)
    }

    switch (column.type) {
      case "currency":
        return formatCurrency(value)
      case "boolean":
        return (
          <Badge variant={value ? "default" : "secondary"}>
            {value ? "Yes" : "No"}
          </Badge>
        )
      case "select":
        const option = column.options?.find(opt => opt.value === value)
        return option ? (
          <Badge variant="outline">{option.label}</Badge>
        ) : value
      default:
        return value
    }
  }

  const toggleRowSelection = (id: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
  }

  const toggleAllRows = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(data.map(row => row[idField])))
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                type="checkbox"
                checked={selectedRows.size === data.length && data.length > 0}
                onChange={toggleAllRows}
                className="rounded border-gray-300"
              />
            </TableHead>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow 
              key={row[idField]} 
              className={selectedRows.has(row[idField]) ? "bg-blue-50" : ""}
            >
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedRows.has(row[idField])}
                  onChange={() => toggleRowSelection(row[idField])}
                  className="rounded border-gray-300"
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell 
                  key={column.key}
                  className={column.editable ? "cursor-pointer hover:bg-gray-50" : ""}
                  onClick={() => column.editable && handleCellClick(row[idField], column.key, row[column.key])}
                >
                  {renderCell(row, column)}
                </TableCell>
              ))}
              <TableCell>
                <div className="flex items-center space-x-1">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(row[idField])}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onDuplicate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicate(row[idField])}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(row[idField])}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  {actions?.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant || "ghost"}
                      size="sm"
                      onClick={() => action.onClick(row)}
                    >
                      {action.icon}
                    </Button>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Edit controls overlay */}
      {editingCell && (
        <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center space-x-2">
            <Button size="sm" onClick={handleCellSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCellCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to save, Escape to cancel
          </p>
        </div>
      )}
    </div>
  )
}