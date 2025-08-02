"use client"

import { useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Keyboard,
  Command,
  Plus,
  Search,
  RefreshCw,
  Save,
  X,
  HelpCircle
} from "lucide-react"

interface KeyboardShortcutsProps {
  onNew?: () => void
  onSearch?: () => void
  onRefresh?: () => void
  onSave?: () => void
  onCancel?: () => void
  onHelp?: () => void
}

interface Shortcut {
  key: string
  description: string
  category: string
  action?: () => void
}

const defaultShortcuts: Shortcut[] = [
  {
    key: "Ctrl + N",
    description: "Create new item",
    category: "General",
    action: () => {}
  },
  {
    key: "Ctrl + F",
    description: "Focus search",
    category: "General",
    action: () => {}
  },
  {
    key: "Ctrl + R",
    description: "Refresh page",
    category: "General",
    action: () => {}
  },
  {
    key: "Ctrl + S",
    description: "Save changes",
    category: "Editing",
    action: () => {}
  },
  {
    key: "Esc",
    description: "Cancel/Close",
    category: "Editing",
    action: () => {}
  },
  {
    key: "Ctrl + A",
    description: "Select all",
    category: "Selection",
    action: () => {}
  },
  {
    key: "Delete",
    description: "Delete selected",
    category: "Selection",
    action: () => {}
  },
  {
    key: "Ctrl + D",
    description: "Duplicate item",
    category: "Editing",
    action: () => {}
  },
  {
    key: "Ctrl + E",
    description: "Edit item",
    category: "Editing",
    action: () => {}
  },
  {
    key: "F1",
    description: "Show help",
    category: "Help",
    action: () => {}
  }
]

export default function KeyboardShortcuts({
  onNew,
  onSearch,
  onRefresh,
  onSave,
  onCancel,
  onHelp
}: KeyboardShortcutsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(defaultShortcuts)

  useEffect(() => {
    // Update shortcuts with provided actions
    const updatedShortcuts = defaultShortcuts.map(shortcut => {
      const newShortcut = { ...shortcut }
      switch (shortcut.key) {
        case "Ctrl + N":
          if (onNew) newShortcut.action = onNew
          break
        case "Ctrl + F":
          if (onSearch) newShortcut.action = onSearch
          break
        case "Ctrl + R":
          if (onRefresh) newShortcut.action = onRefresh
          break
        case "Ctrl + S":
          if (onSave) newShortcut.action = onSave
          break
        case "Esc":
          if (onCancel) newShortcut.action = onCancel
          break
        case "F1":
          if (onHelp) newShortcut.action = onHelp
          break
      }
      return newShortcut
    })
    setShortcuts(updatedShortcuts)
  }, [onNew, onSearch, onRefresh, onSave, onCancel, onHelp])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement || 
        event.target instanceof HTMLSelectElement) {
      return
    }

    const key = event.key.toLowerCase()
    const ctrlKey = event.ctrlKey || event.metaKey
    const shiftKey = event.shiftKey
    const altKey = event.altKey

    let shortcutKey = ""
    if (ctrlKey) shortcutKey += "Ctrl + "
    if (shiftKey) shortcutKey += "Shift + "
    if (altKey) shortcutKey += "Alt + "
    shortcutKey += key.toUpperCase()

    // Handle special keys
    if (key === "escape") shortcutKey = "Esc"
    if (key === "f1") shortcutKey = "F1"
    if (key === "delete") shortcutKey = "Delete"
    if (key === " ") shortcutKey = "Space"

    const shortcut = shortcuts.find(s => s.key.toLowerCase() === shortcutKey.toLowerCase())
    if (shortcut && shortcut.action) {
      event.preventDefault()
      shortcut.action()
    }

    // F1 to show help
    if (key === "f1") {
      event.preventDefault()
      setIsOpen(true)
    }
  }, [shortcuts])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  const categories = Array.from(new Set(shortcuts.map(s => s.category)))

  const formatKey = (key: string) => {
    return key.split(" + ").map(part => (
      <kbd key={part} className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
        {part}
      </kbd>
    )).reduce((acc, curr) => (
      <>
        {acc}
        <span className="mx-1">+</span>
        {curr}
      </>
    ))
  }

  return (
    <>
      {/* Help button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        <HelpCircle className="h-4 w-4 mr-1" />
        <span className="text-xs">?</span>
      </Button>

      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Keyboard className="h-5 w-5" />
              <span>Keyboard Shortcuts</span>
            </DialogTitle>
            <DialogDescription>
              Press F1 anytime to show this help dialog. Here are all available keyboard shortcuts:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  {category === "General" && <Command className="h-4 w-4 mr-2" />}
                  {category === "Editing" && <Save className="h-4 w-4 mr-2" />}
                  {category === "Selection" && <Plus className="h-4 w-4 mr-2" />}
                  {category === "Help" && <HelpCircle className="h-4 w-4 mr-2" />}
                  {category}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {shortcuts
                    .filter(s => s.category === category)
                    .map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm">{shortcut.description}</span>
                        <div className="flex items-center space-x-1">
                          {formatKey(shortcut.key)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className="bg-blue-100 text-blue-800">Pro Tip</Badge>
            </div>
            <p className="text-sm text-blue-800">
              Keyboard shortcuts work everywhere in the admin panel. They're especially useful when you're working with large datasets and want to speed up your workflow.
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}