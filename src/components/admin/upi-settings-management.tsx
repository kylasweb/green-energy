'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Settings, 
  Plus, 
  Edit2, 
  Trash2, 
  MoreVertical,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Save,
  X,
  AlertTriangle,
  Shield,
  Key
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface UpiSetting {
  id: string
  provider: 'razorpay' | 'payu' | 'phonepe' | 'gpay' | 'mock'
  name: string
  description?: string
  isTestMode: boolean
  isActive: boolean
  webhookUrl?: string
  timeoutMinutes: number
  maxRetries: number
  createdAt: string
  updatedAt: string
}

interface UpiSettingForm {
  provider: string
  apiKey: string
  apiSecret: string
  merchantId: string
  webhookSecret: string
  name: string
  description?: string
  isTestMode: boolean
  isActive: boolean
  webhookUrl?: string
  timeoutMinutes: number
  maxRetries: number
}

const PROVIDER_INFO = {
  razorpay: {
    name: 'Razorpay',
    description: 'Popular payment gateway with comprehensive UPI support',
    color: 'bg-blue-500',
    website: 'https://razorpay.com'
  },
  payu: {
    name: 'PayU',
    description: 'Leading payment solution provider in India',
    color: 'bg-green-500',
    website: 'https://payu.in'
  },
  phonepe: {
    name: 'PhonePe',
    description: 'Direct UPI integration with PhonePe platform',
    color: 'bg-purple-500',
    website: 'https://business.phonepe.com'
  },
  gpay: {
    name: 'Google Pay',
    description: 'Google Pay for Business integration',
    color: 'bg-red-500',
    website: 'https://pay.google.com/business'
  },
  mock: {
    name: 'Mock Gateway',
    description: 'Testing and development purposes only',
    color: 'bg-gray-500',
    website: '#'
  }
}

export default function UpiSettingsManagement() {
  const [settings, setSettings] = useState<UpiSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showSensitive, setShowSensitive] = useState(false)
  const [formData, setFormData] = useState<UpiSettingForm>({
    provider: 'razorpay',
    apiKey: '',
    apiSecret: '',
    merchantId: '',
    webhookSecret: '',
    name: '',
    description: '',
    isTestMode: true,
    isActive: false,
    webhookUrl: '',
    timeoutMinutes: 15,
    maxRetries: 3
  })
  const { toast } = useToast()

  // Fetch all settings
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/upi/settings')
      const data = await response.json()
      
      if (response.ok) {
        setSettings(data.settings || [])
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch UPI settings",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch UPI settings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  // Reset form
  const resetForm = () => {
    setFormData({
      provider: 'razorpay',
      apiKey: '',
      apiSecret: '',
      merchantId: '',
      webhookSecret: '',
      name: '',
      description: '',
      isTestMode: true,
      isActive: false,
      webhookUrl: '',
      timeoutMinutes: 15,
      maxRetries: 3
    })
    setEditingId(null)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingId 
        ? '/api/admin/upi/settings' 
        : '/api/admin/upi/settings'
      
      const method = editingId ? 'PUT' : 'POST'
      const payload = editingId 
        ? { id: editingId, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        })
        setIsDialogOpen(false)
        resetForm()
        await fetchSettings()
      } else {
        toast({
          title: "Error",
          description: data.error || `Failed to ${editingId ? 'update' : 'create'} setting`,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingId ? 'update' : 'create'} setting`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle edit
  const handleEdit = (setting: UpiSetting) => {
    setFormData({
      provider: setting.provider,
      apiKey: '', // Don't prefill sensitive data
      apiSecret: '',
      merchantId: '',
      webhookSecret: '',
      name: setting.name,
      description: setting.description || '',
      isTestMode: setting.isTestMode,
      isActive: setting.isActive,
      webhookUrl: setting.webhookUrl || '',
      timeoutMinutes: setting.timeoutMinutes,
      maxRetries: setting.maxRetries
    })
    setEditingId(setting.id)
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async (settingId: string) => {
    if (!confirm('Are you sure you want to delete this UPI setting? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/upi/settings?id=${settingId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        })
        await fetchSettings()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete setting",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete setting",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle activation toggle
  const handleToggleActive = async (settingId: string, currentStatus: boolean) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/upi/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: settingId,
          isActive: !currentStatus
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: `Setting ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
        })
        await fetchSettings()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update setting",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">UPI Gateway Settings</h2>
          <p className="text-muted-foreground">
            Configure and manage your UPI payment gateway integrations
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Setting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit UPI Setting' : 'Add New UPI Setting'}
              </DialogTitle>
              <DialogDescription>
                Configure your UPI payment gateway settings. All sensitive information will be encrypted.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Configuration Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Production Razorpay"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider *</Label>
                  <Select
                    value={formData.provider}
                    onValueChange={(value) => setFormData({...formData, provider: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PROVIDER_INFO).map(([key, info]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${info.color}`}></div>
                            {info.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Optional description for this configuration"
                  rows={2}
                />
              </div>

              {/* Sensitive Configuration */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/10">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <Label className="font-semibold">Sensitive Configuration</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSensitive(!showSensitive)}
                  >
                    {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key *</Label>
                    <Input
                      id="apiKey"
                      type={showSensitive ? "text" : "password"}
                      value={formData.apiKey}
                      onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                      placeholder="Your gateway API key"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="apiSecret">API Secret *</Label>
                    <Input
                      id="apiSecret"
                      type={showSensitive ? "text" : "password"}
                      value={formData.apiSecret}
                      onChange={(e) => setFormData({...formData, apiSecret: e.target.value})}
                      placeholder="Your gateway API secret"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="merchantId">Merchant ID *</Label>
                    <Input
                      id="merchantId"
                      type={showSensitive ? "text" : "password"}
                      value={formData.merchantId}
                      onChange={(e) => setFormData({...formData, merchantId: e.target.value})}
                      placeholder="Your merchant ID"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhookSecret">Webhook Secret *</Label>
                    <Input
                      id="webhookSecret"
                      type={showSensitive ? "text" : "password"}
                      value={formData.webhookSecret}
                      onChange={(e) => setFormData({...formData, webhookSecret: e.target.value})}
                      placeholder="Webhook secret for validation"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Configuration Options */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    type="url"
                    value={formData.webhookUrl}
                    onChange={(e) => setFormData({...formData, webhookUrl: e.target.value})}
                    placeholder="https://yourdomain.com/api/webhook/upi"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeoutMinutes">Timeout (Minutes)</Label>
                  <Input
                    id="timeoutMinutes"
                    type="number"
                    min={1}
                    max={30}
                    value={formData.timeoutMinutes}
                    onChange={(e) => setFormData({...formData, timeoutMinutes: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxRetries">Max Retries</Label>
                <Input
                  id="maxRetries"
                  type="number"
                  min={1}
                  max={5}
                  value={formData.maxRetries}
                  onChange={(e) => setFormData({...formData, maxRetries: parseInt(e.target.value)})}
                />
              </div>

              {/* Switches */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isTestMode">Test Mode</Label>
                  <Switch
                    id="isTestMode"
                    checked={formData.isTestMode}
                    onCheckedChange={(checked) => setFormData({...formData, isTestMode: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isActive">Set as Active</Label>
                    <p className="text-sm text-muted-foreground">
                      Only one setting can be active at a time
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingId ? 'Update Setting' : 'Create Setting'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Settings List */}
      <Card>
        <CardHeader>
          <CardTitle>Gateway Configurations</CardTitle>
          <CardDescription>
            Manage your UPI gateway settings and configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && settings.length === 0 ? (
            <div className="text-center py-8">Loading settings...</div>
          ) : settings.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No UPI Settings Found</h3>
              <p className="text-muted-foreground mb-4">
                Add your first UPI gateway configuration to start accepting payments
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Setting
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {settings.map((setting) => (
                <div key={setting.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${PROVIDER_INFO[setting.provider].color}`}></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{setting.name}</h4>
                          {setting.isActive && (
                            <Badge variant="default" className="text-xs">Active</Badge>
                          )}
                          {setting.isTestMode && (
                            <Badge variant="outline" className="text-xs">Test Mode</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {PROVIDER_INFO[setting.provider].name} • 
                          Updated {new Date(setting.updatedAt).toLocaleDateString()}
                        </p>
                        {setting.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {setting.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(setting.id, setting.isActive)}
                        disabled={loading}
                      >
                        {setting.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        {setting.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(setting)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(setting.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Additional details */}
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Timeout:</span>
                      <span className="ml-1">{setting.timeoutMinutes} min</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max Retries:</span>
                      <span className="ml-1">{setting.maxRetries}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Webhook:</span>
                      <span className="ml-1">{setting.webhookUrl ? '✅' : '❌'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert>
        <Shield className="w-4 h-4" />
        <AlertDescription>
          <strong>Security Notice:</strong> All sensitive information (API keys, secrets, merchant IDs) 
          are encrypted using AES-256-GCM encryption before storage. Only super admins can manage these settings.
        </AlertDescription>
      </Alert>
    </div>
  )
}