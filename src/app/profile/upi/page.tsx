'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  StarOff, 
  Smartphone,
  Info
} from 'lucide-react'
import { toast } from 'sonner'

interface SavedVpa {
  id: string
  vpa: string
  isDefault: boolean
  createdAt: string
}

export default function VpaManagementPage() {
  const [vpas, setVpas] = useState<SavedVpa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingVpa, setIsAddingVpa] = useState(false)
  const [newVpa, setNewVpa] = useState('')
  const [editingVpa, setEditingVpa] = useState<SavedVpa | null>(null)
  const [editVpaValue, setEditVpaValue] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadVpas()
  }, [])

  const loadVpas = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/vpas')
      
      if (response.ok) {
        const data = await response.json()
        setVpas(data.vpas)
      } else {
        setError('Failed to load saved UPI IDs')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const validateVpa = (vpaString: string) => {
    const vpaRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/
    return vpaRegex.test(vpaString)
  }

  const addVpa = async () => {
    if (!newVpa.trim()) {
      toast.error('Please enter a UPI ID')
      return
    }

    if (!validateVpa(newVpa.trim())) {
      toast.error('Please enter a valid UPI ID format')
      return
    }

    if (vpas.some(vpa => vpa.vpa === newVpa.trim())) {
      toast.error('This UPI ID is already saved')
      return
    }

    try {
      setIsAddingVpa(true)
      const response = await fetch('/api/user/vpas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vpa: newVpa.trim() })
      })

      if (response.ok) {
        toast.success('UPI ID added successfully')
        setNewVpa('')
        loadVpas()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to add UPI ID')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setIsAddingVpa(false)
    }
  }

  const updateVpa = async () => {
    if (!editingVpa || !editVpaValue.trim()) {
      toast.error('Please enter a valid UPI ID')
      return
    }

    if (!validateVpa(editVpaValue.trim())) {
      toast.error('Please enter a valid UPI ID format')
      return
    }

    if (vpas.some(vpa => vpa.vpa === editVpaValue.trim() && vpa.id !== editingVpa.id)) {
      toast.error('This UPI ID already exists')
      return
    }

    try {
      const response = await fetch(`/api/user/vpas/${editingVpa.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vpa: editVpaValue.trim() })
      })

      if (response.ok) {
        toast.success('UPI ID updated successfully')
        setEditingVpa(null)
        setEditVpaValue('')
        loadVpas()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update UPI ID')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    }
  }

  const deleteVpa = async (vpaId: string) => {
    try {
      const response = await fetch(`/api/user/vpas/${vpaId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('UPI ID deleted successfully')
        loadVpas()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete UPI ID')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setDeleteConfirm(null)
    }
  }

  const setDefaultVpa = async (vpaId: string) => {
    try {
      const response = await fetch(`/api/user/vpas/${vpaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ setAsDefault: true })
      })

      if (response.ok) {
        toast.success('Default UPI ID updated')
        loadVpas()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update default UPI ID')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    }
  }

  const startEdit = (vpa: SavedVpa) => {
    setEditingVpa(vpa)
    setEditVpaValue(vpa.vpa)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage UPI IDs</h1>
        <p className="text-gray-600">
          Add and manage your UPI IDs for faster checkout
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Add New VPA */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New UPI ID
          </CardTitle>
          <CardDescription>
            Add a new UPI ID for quick payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="newVpa" className="sr-only">UPI ID</Label>
              <Input
                id="newVpa"
                placeholder="yourname@paytm"
                value={newVpa}
                onChange={(e) => setNewVpa(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addVpa()}
              />
            </div>
            <Button onClick={addVpa} disabled={isAddingVpa}>
              {isAddingVpa ? 'Adding...' : 'Add'}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Format: username@provider (e.g., user@paytm, user@phonepe)
          </p>
        </CardContent>
      </Card>

      {/* Saved VPAs List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Saved UPI IDs ({vpas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vpas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Smartphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No UPI IDs saved yet</p>
              <p className="text-sm">Add your first UPI ID above to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {vpas.map((vpa) => (
                <div
                  key={vpa.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{vpa.vpa}</div>
                      <div className="text-sm text-gray-500">
                        Added on {new Date(vpa.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {vpa.isDefault && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Default
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!vpa.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDefaultVpa(vpa.id)}
                        title="Set as default"
                      >
                        <StarOff className="h-4 w-4" />
                      </Button>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(vpa)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit UPI ID</DialogTitle>
                          <DialogDescription>
                            Update your UPI ID information
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="editVpa">UPI ID</Label>
                            <Input
                              id="editVpa"
                              value={editVpaValue}
                              onChange={(e) => setEditVpaValue(e.target.value)}
                              placeholder="yourname@paytm"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingVpa(null)
                              setEditVpaValue('')
                            }}
                          >
                            Cancel
                          </Button>
                          <Button onClick={updateVpa}>
                            Update
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog 
                      open={deleteConfirm === vpa.id} 
                      onOpenChange={(open) => setDeleteConfirm(open ? vpa.id : null)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(vpa.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete UPI ID</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{vpa.vpa}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteVpa(vpa.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}