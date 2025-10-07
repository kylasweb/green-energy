"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  Settings,
  Store,
  Mail,
  CreditCard,
  Truck,
  Shield,
  Palette,
  Database,
  Bell,
  Users,
  Globe,
  Lock,
  Save,
  AlertCircle
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface StoreSettings {
  storeName: string
  storeDescription: string
  storeEmail: string
  storePhone: string
  storeAddress: string
  storeCity: string
  storeState: string
  storeCountry: string
  storeZipCode: string
  storeLogo: string
  storeFavicon: string
  currency: string
  timezone: string
  language: string
}

interface PaymentSettings {
  razorpayEnabled: boolean
  razorpayKeyId: string
  razorpayKeySecret: string
  stripeEnabled: boolean
  stripePublishableKey: string
  stripeSecretKey: string
  codEnabled: boolean
  codMinAmount: number
  codMaxAmount: number
}

interface ShippingSettings {
  freeShippingThreshold: number
  standardShippingRate: number
  expressShippingRate: number
  internationalShipping: boolean
  processingDays: number
  deliveryDays: number
}

interface NotificationSettings {
  orderConfirmation: boolean
  orderShipped: boolean
  orderDelivered: boolean
  lowStock: boolean
  newCustomer: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  adminEmailAlerts: boolean
}

export default function AdminSettings() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: "Green Energy Store",
    storeDescription: "Your one-stop shop for renewable energy solutions",
    storeEmail: "admin@greenenergy.com",
    storePhone: "+91 12345 67890",
    storeAddress: "123 Green Street",
    storeCity: "Mumbai",
    storeState: "Maharashtra",
    storeCountry: "India", 
    storeZipCode: "400001",
    storeLogo: "/logo.svg",
    storeFavicon: "/favicon.ico",
    currency: "INR",
    timezone: "Asia/Kolkata",
    language: "en"
  })

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    razorpayEnabled: true,
    razorpayKeyId: "",
    razorpayKeySecret: "",
    stripeEnabled: false,
    stripePublishableKey: "",
    stripeSecretKey: "",
    codEnabled: true,
    codMinAmount: 0,
    codMaxAmount: 50000
  })

  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    freeShippingThreshold: 5000,
    standardShippingRate: 150,
    expressShippingRate: 300,
    internationalShipping: false,
    processingDays: 2,
    deliveryDays: 7
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    lowStock: true,
    newCustomer: true,
    emailNotifications: true,
    smsNotifications: false,
    adminEmailAlerts: true
  })

  const handleSaveStoreSettings = async () => {
    try {
      setLoading(true)
      // Mock API call - replace with actual implementation
      console.log('Saving store settings:', storeSettings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving store settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePaymentSettings = async () => {
    try {
      setLoading(true)
      // Mock API call - replace with actual implementation
      console.log('Saving payment settings:', paymentSettings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving payment settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveShippingSettings = async () => {
    try {
      setLoading(true)
      // Mock API call - replace with actual implementation
      console.log('Saving shipping settings:', shippingSettings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving shipping settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNotificationSettings = async () => {
    try {
      setLoading(true)
      // Mock API call - replace with actual implementation
      console.log('Saving notification settings:', notificationSettings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving notification settings:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your store settings and preferences
          </p>
        </div>
        {saved && (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Settings Saved!
          </Badge>
        )}
      </div>

      <Tabs defaultValue="store" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="store" className="flex items-center space-x-2">
            <Store className="h-4 w-4" />
            <span>Store</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Payments</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center space-x-2">
            <Truck className="h-4 w-4" />
            <span>Shipping</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="h-5 w-5" />
                <span>Store Information</span>
              </CardTitle>
              <CardDescription>
                Basic information about your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({...storeSettings, storeName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="storeEmail">Store Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={storeSettings.storeEmail}
                    onChange={(e) => setStoreSettings({...storeSettings, storeEmail: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="storeDescription">Store Description</Label>
                <Textarea
                  id="storeDescription"
                  value={storeSettings.storeDescription}
                  onChange={(e) => setStoreSettings({...storeSettings, storeDescription: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storePhone">Phone Number</Label>
                  <Input
                    id="storePhone"
                    value={storeSettings.storePhone}
                    onChange={(e) => setStoreSettings({...storeSettings, storePhone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={storeSettings.currency} onValueChange={(value) => setStoreSettings({...storeSettings, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Store Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="storeAddress">Address</Label>
                    <Input
                      id="storeAddress"
                      value={storeSettings.storeAddress}
                      onChange={(e) => setStoreSettings({...storeSettings, storeAddress: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="storeCity">City</Label>
                    <Input
                      id="storeCity"
                      value={storeSettings.storeCity}
                      onChange={(e) => setStoreSettings({...storeSettings, storeCity: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="storeState">State</Label>
                    <Input
                      id="storeState"
                      value={storeSettings.storeState}
                      onChange={(e) => setStoreSettings({...storeSettings, storeState: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="storeZipCode">Zip Code</Label>
                    <Input
                      id="storeZipCode"
                      value={storeSettings.storeZipCode}
                      onChange={(e) => setStoreSettings({...storeSettings, storeZipCode: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveStoreSettings} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Save Store Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Gateways</span>
              </CardTitle>
              <CardDescription>
                Configure payment methods for your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Razorpay */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Razorpay</h3>
                    <p className="text-sm text-muted-foreground">Accept payments via Razorpay</p>
                  </div>
                  <Switch
                    checked={paymentSettings.razorpayEnabled}
                    onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, razorpayEnabled: checked})}
                  />
                </div>
                {paymentSettings.razorpayEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                    <div>
                      <Label htmlFor="razorpayKeyId">Key ID</Label>
                      <Input
                        id="razorpayKeyId"
                        value={paymentSettings.razorpayKeyId}
                        onChange={(e) => setPaymentSettings({...paymentSettings, razorpayKeyId: e.target.value})}
                        placeholder="rzp_test_..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="razorpayKeySecret">Key Secret</Label>
                      <Input
                        id="razorpayKeySecret"
                        type="password"
                        value={paymentSettings.razorpayKeySecret}
                        onChange={(e) => setPaymentSettings({...paymentSettings, razorpayKeySecret: e.target.value})}
                        placeholder="••••••••••••••••"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Cash on Delivery */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Cash on Delivery</h3>
                    <p className="text-sm text-muted-foreground">Allow customers to pay on delivery</p>
                  </div>
                  <Switch
                    checked={paymentSettings.codEnabled}
                    onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, codEnabled: checked})}
                  />
                </div>
                {paymentSettings.codEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
                    <div>
                      <Label htmlFor="codMinAmount">Minimum Amount (₹)</Label>
                      <Input
                        id="codMinAmount"
                        type="number"
                        value={paymentSettings.codMinAmount}
                        onChange={(e) => setPaymentSettings({...paymentSettings, codMinAmount: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="codMaxAmount">Maximum Amount (₹)</Label>
                      <Input
                        id="codMaxAmount"
                        type="number"
                        value={paymentSettings.codMaxAmount}
                        onChange={(e) => setPaymentSettings({...paymentSettings, codMaxAmount: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button onClick={handleSavePaymentSettings} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Save Payment Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Shipping Configuration</span>
              </CardTitle>
              <CardDescription>
                Set up shipping rates and delivery options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (₹)</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    value={shippingSettings.freeShippingThreshold}
                    onChange={(e) => setShippingSettings({...shippingSettings, freeShippingThreshold: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="standardShippingRate">Standard Shipping Rate (₹)</Label>
                  <Input
                    id="standardShippingRate"
                    type="number"
                    value={shippingSettings.standardShippingRate}
                    onChange={(e) => setShippingSettings({...shippingSettings, standardShippingRate: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expressShippingRate">Express Shipping Rate (₹)</Label>
                  <Input
                    id="expressShippingRate"
                    type="number"
                    value={shippingSettings.expressShippingRate}
                    onChange={(e) => setShippingSettings({...shippingSettings, expressShippingRate: Number(e.target.value)})}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="internationalShipping"
                    checked={shippingSettings.internationalShipping}
                    onCheckedChange={(checked) => setShippingSettings({...shippingSettings, internationalShipping: checked})}
                  />
                  <Label htmlFor="internationalShipping">Enable International Shipping</Label>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="processingDays">Processing Days</Label>
                  <Input
                    id="processingDays"
                    type="number"
                    value={shippingSettings.processingDays}
                    onChange={(e) => setShippingSettings({...shippingSettings, processingDays: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryDays">Standard Delivery Days</Label>
                  <Input
                    id="deliveryDays"
                    type="number"
                    value={shippingSettings.deliveryDays}
                    onChange={(e) => setShippingSettings({...shippingSettings, deliveryDays: Number(e.target.value)})}
                  />
                </div>
              </div>

              <Button onClick={handleSaveShippingSettings} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Save Shipping Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Configure email and SMS notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Customer Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Order Confirmation</Label>
                      <p className="text-sm text-muted-foreground">Send confirmation when order is placed</p>
                    </div>
                    <Switch
                      checked={notificationSettings.orderConfirmation}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, orderConfirmation: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Order Shipped</Label>
                      <p className="text-sm text-muted-foreground">Send notification when order is shipped</p>
                    </div>
                    <Switch
                      checked={notificationSettings.orderShipped}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, orderShipped: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Order Delivered</Label>
                      <p className="text-sm text-muted-foreground">Send notification when order is delivered</p>
                    </div>
                    <Switch
                      checked={notificationSettings.orderDelivered}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, orderDelivered: checked})}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Admin Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Low Stock Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified when products are running low</p>
                    </div>
                    <Switch
                      checked={notificationSettings.lowStock}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, lowStock: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Customer Registration</Label>
                      <p className="text-sm text-muted-foreground">Get notified when new customers register</p>
                    </div>
                    <Switch
                      checked={notificationSettings.newCustomer}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, newCustomer: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Admin Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive important alerts via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.adminEmailAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, adminEmailAlerts: checked})}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Notification Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications via SMS (additional charges apply)</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveNotificationSettings} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}