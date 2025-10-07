"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Check, 
  X, 
  Edit2, 
  Loader2,
  AlertTriangle,
  Save
} from "lucide-react"

interface EnhancedInlineEditProps {
  value: any
  onChange: (value: any) => void
  type: "text" | "number" | "currency" | "select" | "textarea" | "boolean" | "tags"
  options?: { value: string; label: string }[]
  placeholder?: string
  validation?: (value: any) => string | null
  onSave?: () => void
  onCancel?: () => void
  className?: string
  disabled?: boolean
  format?: (value: any) => string
  parse?: (value: string) => any
}

export default function EnhancedInlineEdit({
  value,
  onChange,
  type,
  options = [],
  placeholder,
  validation,
  onSave,
  onCancel,
  className = "",
  disabled = false,
  format,
  parse
}: EnhancedInlineEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null)

  useEffect(() => {
    setEditValue(value)
    setError(null)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select()
      }
    }
  }, [isEditing])

  const handleStartEdit = () => {
    if (disabled) return
    setIsEditing(true)
    setEditValue(value)
    setError(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditValue(value)
    setError(null)
    onCancel?.()
  }

  const handleSave = async () => {
    if (validation) {
      const validationError = validation(editValue)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    setIsSaving(true)
    try {
      await onChange(editValue)
      setIsEditing(false)
      setError(null)
      onSave?.()
    } catch (err) {
      setError("Failed to save")
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && type !== "textarea") {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  const formatValue = (val: any) => {
    if (format) {
      return format(val)
    }

    switch (type) {
      case "currency":
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR'
        }).format(val || 0)
      case "boolean":
        return val ? "Yes" : "No"
      case "tags":
        return Array.isArray(val) ? val.join(", ") : val || ""
      default:
        return val?.toString() || ""
    }
  }

  const parseValue = (val: string) => {
    if (parse) {
      return parse(val)
    }

    switch (type) {
      case "number":
      case "currency":
        return parseFloat(val) || 0
      case "boolean":
        return val === "true" || val === "yes" || val === "1"
      case "tags":
        return val.split(",").map(tag => tag.trim()).filter(tag => tag)
      default:
        return val
    }
  }

  const renderDisplayValue = () => {
    const displayValue = formatValue(value)
    
    if (type === "boolean") {
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={value}
            onCheckedChange={onChange}
            disabled={disabled}
            className="data-[state=checked]:bg-black"
          />
          <span className={value ? "text-black font-medium" : "text-gray-400"}>
            {displayValue}
          </span>
        </div>
      )
    }

    if (type === "tags" && Array.isArray(value) && value.length > 0) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 border border-gray-200">
              {tag}
            </Badge>
          ))}
        </div>
      )
    }

    return (
      <span className={value ? "" : "text-gray-400 italic"}>
        {displayValue || placeholder || "Click to edit"}
      </span>
    )
  }

  const renderEditInput = () => {
    const commonProps = {
      value: editValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = type === "number" || type === "currency" 
          ? e.target.value.replace(/[^\d.-]/g, "")
          : e.target.value
        setEditValue(parseValue(newValue))
        if (error) setError(null)
      },
      onKeyDown: handleKeyDown,
      disabled: isSaving,
      className: error ? "border-red-500" : "",
      placeholder
    }

    switch (type) {
      case "textarea":
        return (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            {...commonProps}
            rows={3}
            className="min-w-[200px]"
          />
        )
      case "select":
        return (
          <Select
            value={editValue?.toString() || ""}
            onValueChange={(value) => {
              setEditValue(value)
              if (error) setError(null)
            }}
            disabled={isSaving}
          >
            <SelectTrigger className="min-w-[200px]">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "boolean":
        return (
          <Switch
            checked={editValue}
            onCheckedChange={setEditValue}
            disabled={isSaving}
          />
        )
      default:
        return (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            {...commonProps}
            type={type === "number" || type === "currency" ? "number" : "text"}
            step={type === "currency" ? "0.01" : "1"}
            className="min-w-[200px]"
          />
        )
    }
  }

  if (disabled) {
    return (
      <div className={`p-2 rounded ${className}`}>
        {renderDisplayValue()}
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-start space-x-2">
          <div className="flex-1">
            {renderEditInput()}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving || !!error}
              className="h-8 w-8 p-0 bg-black hover:bg-gray-800 text-white border-black"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
              className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {error && (
          <div className="flex items-center space-x-1 text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
            <AlertTriangle className="h-3 w-3" />
            <span>{error}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group border border-transparent hover:border-gray-200 ${className}`}
      onClick={handleStartEdit}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {renderDisplayValue()}
        </div>
        <Edit2 className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  )
}