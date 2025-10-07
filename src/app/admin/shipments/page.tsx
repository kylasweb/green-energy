"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal,
  Download,
  Send
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Shipment {
  id: string
  orderId: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  trackingNumber?: string
  carrier: string
  shippingMethod: string
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED" | "FAILED" | "RETURNED"
  estimatedDelivery?: string
  actualDelivery?: string
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  shippingCost: number
  items: Array<{
    productName: string
    quantity: number
    sku: string
  }>
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function AdminShipments() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [carrierFilter, setCarrierFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null)
  const [editForm, setEditForm] = useState({
    trackingNumber: "",
    carrier: "",
    status: "",
    estimatedDelivery: "",
    notes: ""
  })

  useEffect(() => {
    fetchShipments()
  }, [])

  useEffect(() => {
    let filtered = shipments.filter(shipment => {
      const matchesSearch = 
        shipment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || shipment.status === statusFilter
      const matchesCarrier = carrierFilter === "all" || shipment.carrier === carrierFilter

      return matchesSearch && matchesStatus && matchesCarrier
    })
    
    setFilteredShipments(filtered)
  }, [searchTerm, statusFilter, carrierFilter, shipments])

  const fetchShipments = async () => {
    try {
      setLoading(true)
      
      // Mock data - replace with actual API call
      const mockShipments: Shipment[] = [
        {
          id: "ship1",
          orderId: "order1",
          orderNumber: "ORD-2024-001",
          customerName: "John Doe",
          customerEmail: "john@example.com",
          customerPhone: "+91 98765 43210",
          shippingAddress: {
            address: "123 Green Street, Apartment 4B",
            city: "Mumbai",
            state: "Maharashtra", 
            zipCode: "400001",
            country: "India"
          },
          trackingNumber: "TRK123456789",
          carrier: "Blue Dart",
          shippingMethod: "Standard",
          status: "IN_TRANSIT",
          estimatedDelivery: "2024-01-20T10:00:00Z",
          weight: 15.5,
          dimensions: {
            length: 120,
            width: 80,
            height: 20
          },
          shippingCost: 250,
          items: [
            { productName: "Solar Panel 400W", quantity: 2, sku: "SP400W-001" },
            { productName: "Charge Controller 60A", quantity: 1, sku: "CC60A-001" }
          ],
          notes: "Handle with care - fragile solar equipment",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-18T14:20:00Z"
        },
        {
          id: "ship2",
          orderId: "order2", 
          orderNumber: "ORD-2024-002",
          customerName: "Jane Smith",
          customerEmail: "jane@example.com",
          customerPhone: "+91 87654 32109",
          shippingAddress: {
            address: "456 Eco Lane",
            city: "Bangalore",
            state: "Karnataka",
            zipCode: "560001", 
            country: "India"
          },
          trackingNumber: "TRK987654321",
          carrier: "DTDC",
          shippingMethod: "Express",
          status: "DELIVERED",
          estimatedDelivery: "2024-01-17T15:00:00Z",
          actualDelivery: "2024-01-17T13:30:00Z",
          weight: 8.2,
          dimensions: {
            length: 60,
            width: 40,
            height: 15
          },
          shippingCost: 180,
          items: [
            { productName: "Wind Turbine Kit", quantity: 1, sku: "WTK-001" }
          ],
          createdAt: "2024-01-14T09:15:00Z",
          updatedAt: "2024-01-17T13:30:00Z"
        }
      ]
      
      setShipments(mockShipments)
      setFilteredShipments(mockShipments)
    } catch (error) {
      console.error('Error fetching shipments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setIsDetailDialogOpen(true)
  }

  const handleEditShipment = (shipment: Shipment) => {
    setEditingShipment(shipment)
    setEditForm({
      trackingNumber: shipment.trackingNumber || "",
      carrier: shipment.carrier,
      status: shipment.status,
      estimatedDelivery: shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toISOString().split('T')[0] : "",
      notes: shipment.notes || ""
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveShipment = async () => {
    if (editingShipment) {
      try {
        setLoading(true)
        
        // Mock API call - replace with actual implementation
        const updatedShipments = shipments.map(shipment =>
          shipment.id === editingShipment.id
            ? { 
                ...shipment,
                trackingNumber: editForm.trackingNumber,
                carrier: editForm.carrier,
                status: editForm.status as Shipment["status"],
                estimatedDelivery: editForm.estimatedDelivery ? `${editForm.estimatedDelivery}T10:00:00Z` : undefined,
                notes: editForm.notes,
                updatedAt: new Date().toISOString()
              }
            : shipment
        )
        setShipments(updatedShipments)
        setIsEditDialogOpen(false)
      } catch (error) {
        console.error('Error updating shipment:', error)
        alert('Failed to update shipment. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-gray-100 text-gray-800"
      case "PROCESSING": return "bg-blue-100 text-blue-800" 
      case "SHIPPED": return "bg-purple-100 text-purple-800"
      case "IN_TRANSIT": return "bg-indigo-100 text-indigo-800"
      case "OUT_FOR_DELIVERY": return "bg-orange-100 text-orange-800"
      case "DELIVERED": return "bg-green-100 text-green-800"
      case "FAILED": return "bg-red-100 text-red-800"
      case "RETURNED": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  if (loading && shipments.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
          <p className="text-muted-foreground">
            Track and manage order shipments
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shipments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shipments.filter(s => s.status === "IN_TRANSIT" || s.status === "OUT_FOR_DELIVERY").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shipments.filter(s => s.status === "DELIVERED").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shipments.filter(s => s.status === "PENDING" || s.status === "PROCESSING").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Shipments</CardTitle>
          <CardDescription>
            Track and manage all order shipments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order number, customer, or tracking..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="RETURNED">Returned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={carrierFilter} onValueChange={setCarrierFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by carrier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Carriers</SelectItem>
                <SelectItem value="Blue Dart">Blue Dart</SelectItem>
                <SelectItem value="DTDC">DTDC</SelectItem>
                <SelectItem value="FedEx">FedEx</SelectItem>
                <SelectItem value="DHL">DHL</SelectItem>
                <SelectItem value="India Post">India Post</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Shipments Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{shipment.orderNumber}</div>
                        <div className="text-sm text-muted-foreground">
                          {shipment.items.length} item(s)
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{shipment.customerName}</div>
                        <div className="text-sm text-muted-foreground">{shipment.customerEmail}</div>
                        <div className="text-xs text-muted-foreground">
                          {shipment.shippingAddress.city}, {shipment.shippingAddress.state}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {shipment.trackingNumber ? (
                        <div className="font-mono text-sm">
                          {shipment.trackingNumber}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{shipment.carrier}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(shipment.status)}>
                        {shipment.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {shipment.actualDelivery ? (
                        <div>
                          <div className="text-sm">
                            {formatDate(shipment.actualDelivery)}
                          </div>
                          <Badge variant="default" className="text-xs">Delivered</Badge>
                        </div>
                      ) : shipment.estimatedDelivery ? (
                        <div>
                          <div className="text-sm">
                            {formatDate(shipment.estimatedDelivery)}
                          </div>
                          <span className="text-xs text-muted-foreground">Estimated</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">TBD</span>
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(shipment.shippingCost)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewShipment(shipment)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditShipment(shipment)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Shipment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Print Label
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="mr-2 h-4 w-4" />
                            Send Update
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredShipments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No shipments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Shipment Details</DialogTitle>
          </DialogHeader>
          {selectedShipment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order Number</Label>
                  <p className="text-sm text-muted-foreground">{selectedShipment.orderNumber}</p>
                </div>
                <div>
                  <Label>Tracking Number</Label>
                  <p className="text-sm text-muted-foreground font-mono">
                    {selectedShipment.trackingNumber || "Not assigned"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Carrier</Label>
                  <Badge variant="outline">{selectedShipment.carrier}</Badge>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedShipment.status)}>
                    {selectedShipment.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <div>
                <Label>Customer</Label>
                <div className="text-sm text-muted-foreground">
                  <div>{selectedShipment.customerName}</div>
                  <div>{selectedShipment.customerEmail}</div>
                  <div>{selectedShipment.customerPhone}</div>
                </div>
              </div>

              <div>
                <Label>Shipping Address</Label>
                <div className="text-sm text-muted-foreground">
                  <div>{selectedShipment.shippingAddress.address}</div>
                  <div>
                    {selectedShipment.shippingAddress.city}, {selectedShipment.shippingAddress.state} {selectedShipment.shippingAddress.zipCode}
                  </div>
                  <div>{selectedShipment.shippingAddress.country}</div>
                </div>
              </div>

              <div>
                <Label>Items</Label>
                <div className="space-y-2">
                  {selectedShipment.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.productName} (SKU: {item.sku})</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Weight</Label>
                  <p className="text-sm text-muted-foreground">{selectedShipment.weight} kg</p>
                </div>
                <div>
                  <Label>Dimensions</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedShipment.dimensions.length} × {selectedShipment.dimensions.width} × {selectedShipment.dimensions.height} cm
                  </p>
                </div>
                <div>
                  <Label>Shipping Cost</Label>
                  <p className="text-sm text-muted-foreground">{formatCurrency(selectedShipment.shippingCost)}</p>
                </div>
              </div>

              {selectedShipment.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="text-sm text-muted-foreground">{selectedShipment.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Shipment</DialogTitle>
            <DialogDescription>
              Update shipment tracking and delivery information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input
                id="trackingNumber"
                value={editForm.trackingNumber}
                onChange={(e) => setEditForm({ ...editForm, trackingNumber: e.target.value })}
                placeholder="Enter tracking number"
              />
            </div>
            <div>
              <Label htmlFor="carrier">Carrier</Label>
              <Select value={editForm.carrier} onValueChange={(value) => setEditForm({ ...editForm, carrier: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Blue Dart">Blue Dart</SelectItem>
                  <SelectItem value="DTDC">DTDC</SelectItem>
                  <SelectItem value="FedEx">FedEx</SelectItem>
                  <SelectItem value="DHL">DHL</SelectItem>
                  <SelectItem value="India Post">India Post</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={editForm.status} onValueChange={(value) => setEditForm({ ...editForm, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                  <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="RETURNED">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="estimatedDelivery">Estimated Delivery Date</Label>
              <Input
                id="estimatedDelivery"
                type="date"
                value={editForm.estimatedDelivery}
                onChange={(e) => setEditForm({ ...editForm, estimatedDelivery: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="Add notes about this shipment"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveShipment}>
              Update Shipment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}