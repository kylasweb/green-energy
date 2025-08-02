"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Save,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  RotateCcw
} from "lucide-react"

interface AutoSaveProps {
  data: any
  onSave: (data: any) => Promise<void>
  debounceMs?: number
  enabled?: boolean
  showStatus?: boolean
}

type SaveStatus = "idle" | "saving" | "saved" | "error" | "pending"

export default function AutoSave({
  data,
  onSave,
  debounceMs = 2000,
  enabled = true,
  showStatus = true
}: AutoSaveProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [pendingChanges, setPendingChanges] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  const saveData = useCallback(async (dataToSave: any) => {
    if (!enabled) return

    try {
      setSaveStatus("saving")
      setError(null)
      
      await onSave(dataToSave)
      
      setSaveStatus("saved")
      setLastSaved(new Date())
      setPendingChanges(false)
      
      // Reset to idle after 2 seconds
      setTimeout(() => {
        setSaveStatus("idle")
      }, 2000)
    } catch (err) {
      console.error("Auto-save failed:", err)
      setSaveStatus("error")
      setError(err instanceof Error ? err.message : "Save failed")
      setPendingChanges(true)
    }
  }, [onSave, enabled])

  const triggerSave = useCallback(() => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }
    
    setSaveStatus("pending")
    setPendingChanges(true)
    
    const timeout = setTimeout(() => {
      saveData(data)
    }, debounceMs)
    
    setSaveTimeout(timeout)
  }, [data, saveData, debounceMs])

  const forceSave = useCallback(async () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
      setSaveTimeout(null)
    }
    await saveData(data)
  }, [data, saveData, saveTimeout])

  const discardChanges = useCallback(() => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
      setSaveTimeout(null)
    }
    setSaveStatus("idle")
    setPendingChanges(false)
    setError(null)
  }, [saveTimeout])

  useEffect(() => {
    if (!enabled) return

    // Trigger save when data changes
    triggerSave()
    
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout)
      }
    }
  }, [data, enabled, triggerSave])

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout)
      }
    }
  }, [saveTimeout])

  const getStatusIcon = () => {
    switch (saveStatus) {
      case "saving":
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
      case "saved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Save className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (saveStatus) {
      case "saving":
        return "Saving..."
      case "saved":
        return "All changes saved"
      case "error":
        return `Save failed: ${error}`
      case "pending":
        return "Unsaved changes"
      default:
        return lastSaved ? `Last saved ${lastSaved.toLocaleTimeString()}` : "No changes"
    }
  }

  const getStatusColor = () => {
    switch (saveStatus) {
      case "saving":
        return "bg-blue-100 text-blue-800"
      case "saved":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!showStatus) {
    return null
  }

  return (
    <Card className="border-dashed">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">
              {getStatusText()}
            </span>
            {pendingChanges && (
              <Badge variant="outline" className="text-xs">
                Pending
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {pendingChanges && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={forceSave}
                  disabled={saveStatus === "saving"}
                >
                  <Save className="h-3 w-3 mr-1" />
                  Save Now
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={discardChanges}
                  disabled={saveStatus === "saving"}
                >
                  <X className="h-3 w-3 mr-1" />
                  Discard
                </Button>
              </>
            )}
            {saveStatus === "error" && (
              <Button
                variant="outline"
                size="sm"
                onClick={forceSave}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </div>
        
        {saveStatus === "pending" && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-blue-600 h-1 rounded-full transition-all duration-1000"
                style={{ width: "100%" }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Auto-saving in {Math.ceil(debounceMs / 1000)} seconds...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}