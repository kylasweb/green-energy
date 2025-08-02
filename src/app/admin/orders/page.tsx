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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Eye, 
  Truck, 
  CheckCircle, 
  XCircle,
  Clock,
  DollarSign,
  Package,
  User,
  MapPin,
  Calendar,
  Filter
} from "lucide-react"

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  customerState: string
  customerCountry: string
  customerZipCode: string
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED"
  paymentMethod: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

interface OrderItem {
  id: string
  productName: string
  quantity: number
  price: number
  total: number
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<string>("")
  const [statusNotes, setStatusNotes] = useState("")

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockOrders: Order[] = [
      {
        id: "1",
        orderNumber: "ORD-2024-001",
        customerName: "Rajesh Kumar",
        customerEmail: "rajesh.kumar@email.com",
        customerPhone: "+91 98765 43210",
        customerAddress: "123 Main Street, Andheri East",
        customerCity: "Mumbai",
        customerState: "Maharashtra",
        customerCountry: "India",
        customerZipCode: "400069",
        subtotal: 2400,
        tax: 432,
        shipping: 0,
        discount: 0,
        total: 2832,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        paymentMethod: "Online Payment",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T11:00:00Z",
        items: [
          { id: "1", productName: "Amaron 2.5L", quantity: 2, price: 758, total: 1516 },
          { id: "2", productName: "Amaron Z4", quantity: 1, price: 875, total: 875 }
        ]
      },
      {
        id: "2",
        orderNumber: "ORD-2024-002",
        customerName: "Priya Sharma",
        customerEmail: "priya.sharma@email.com",
        customerPhone: "+91 98765 43211",
        customerAddress: "456 Park Avenue, Indiranagar",
        customerCity: "Bangalore",
        customerState: "Karnataka",
        customerCountry: "India",
        customerZipCode: "560038",
        subtotal: 4875,
        tax: 877.5,
        shipping: 0,
        discount: 0,
        total: 5752.5,
        status: "PROCESSING",
        paymentStatus: "PAID",
        paymentMethod: "Cash on Delivery",
        createdAt: "2024-01-15T14:20:00Z",
        updatedAt: "2024-01-15T15:30:00Z",
        items: [
          { id: "3", productName: "Luminous Inverter", quantity: 1, price: 2500, total: 2500 },
          { id: "4", productName: "Amaron Z5", quantity: 2, price: 1030, total: 2060 }
        ]
      },
      {
        id: "3",
        orderNumber: "ORD-2024-003",
        customerName: "Amit Patel",
        customerEmail: "amit.patel@email.com",
        customerPhone: "+91 98765 43212",
        customerAddress: "789 Gandhi Road, Navrangpura",
        customerCity: "Ahmedabad",
        customerState: "Gujarat",
        customerCountry: "India",
        customerZipCode: "380009",
        subtotal: 1130,
        tax: 203.4,
        shipping: 0,
        discount: 0,
        total: 1333.4,
        status: "PENDING",
        paymentStatus: "PENDING",
        paymentMethod: "Online Payment",
        createdAt: "2024-01-14T16:45:00Z",
        updatedAt: "2024-01-14T16:45:00Z",
        items: [
          { id: "5", productName: "Amaron Z5", quantity: 1, price: 1030, total: 1030 }
        ]
      },
      {
        id: "4",
        orderNumber: "ORD-2024-004",
        customerName: "Sunita Reddy",
        customerEmail: "sunita.reddy@email.com",
        customerPhone: "+91 98765 43213",
        customerAddress: "321 Beach Road, Besant Nagar",
        customerCity: "Chennai",
        customerState: "Tamil Nadu",
        customerCountry: "India",
        customerZipCode: "600090",
        subtotal: 3864,
        tax: 695.52,
        shipping: 0,
        discount: 0,
        total: 4559.52,
        status: "SHIPPED",
        paymentStatus: "PAID",
        paymentMethod: "Online Payment",
        createdAt: "2024-01-14T09:15:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
        items: [
          { id: "6", productName: "Exide Battery", quantity: 1, price: 3200, total: 3200 },
          { id: "7", productName: "Amaron 2.5L", quantity: 1, price: 758, total: 758 }
        ]
      },
      {
        id: "5",
        orderNumber: "ORD-2024-005",
        customerName: "Vikram Singh",
        customerEmail: "vikram.singh@email.com",
        customerPhone: "+91 98765 43214",
        customerAddress: "654 Hill Road, Malabar Hill",
        customerCity: "Mumbai",
        customerState: "Maharashtra",
        customerCountry: "India",
        customerZipCode: "400006",
        subtotal: 7610,
        tax: 1369.8,
        shipping: 0,
        discount: 0,
        total: 8979.8,
        status: "DELIVERED",
        paymentStatus: "PAID",
        paymentMethod: "Online Payment",
        createdAt: "2024-01-13T13:20:00Z",
        updatedAt: "2024-01-15T16:30:00Z",
        items: [
          { id: "8", productName: "Amaron 5L", quantity: 3, price: 1130, total: 3390 },
          { id: "9", productName: "Luminous Inverter", quantity: 2, price: 2500, total: 5000 }
        ]
      }
    ]
    
    setOrders(mockOrders)
    setFilteredOrders(mockOrders)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = orders.filter(order =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter)
    }
    
    setFilteredOrders(filtered)
  }, [searchTerm, statusFilter, orders])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailDialogOpen(true)
  }

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setStatusNotes("")
    setIsStatusDialogOpen(true)
  }

  const handleSaveStatus = () => {
    if (selectedOrder && newStatus) {
      const updatedOrders = orders.map(order =>
        order.id === selectedOrder.id
          ? { 
              ...order, 
              status: newStatus as Order["status"],
              updatedAt: new Date().toISOString()
            }
          : order
      )
      setOrders(updatedOrders)
      setIsStatusDialogOpen(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800"
      case "CONFIRMED": return "bg-blue-100 text-blue-800"
      case "PROCESSING": return "bg-purple-100 text-purple-800"
      case "SHIPPED": return "bg-indigo-100 text-indigo-800"
      case "DELIVERED": return "bg-green-100 text-green-800"
      case "CANCELLED": return "bg-red-100 text-red-800"
      case "REFUNDED": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-800"
      case "PENDING": return "bg-yellow-100 text-yellow-800"
      case "FAILED": return "bg-red-100 text-red-800"
      case "REFUNDED": return "bg-gray-100 text-gray-800"
      case "PARTIALLY_REFUNDED": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "REFUNDED", label: "Refunded" }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage customer orders and track their status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-xl font-bold">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold">{orders.filter(o => o.status === "PENDING").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-xl font-bold">{orders.filter(o => o.status === "PROCESSING").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold">
                  {formatCurrency(orders.reduce((sum, o) => sum + o.total, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(order.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(order)}>
                          <Truck className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Complete order information and items
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="grid gap-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Order Number:</span> {selectedOrder.orderNumber}</div>
                    <div><span className="font-medium">Date:</span> {formatDate(selectedOrder.createdAt)}</div>
                    <div><span className="font-medium">Status:</span> 
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div><span className="font-medium">Payment:</span> 
                      <Badge className={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                        {selectedOrder.paymentStatus}
                      </Badge>
                    </div>
                    <div><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedOrder.customerName}</div>
                    <div><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</div>
                    <div><span className="font-medium">Phone:</span> {selectedOrder.customerPhone}</div>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-1 mt-0.5 text-gray-500" />
                      <div>
                        <div>{selectedOrder.customerAddress}</div>
                        <div>{selectedOrder.customerCity}, {selectedOrder.customerState}</div>
                        <div>{selectedOrder.customerCountry} - {selectedOrder.customerZipCode}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell>{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18% GST):</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{formatCurrency(selectedOrder.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>{formatCurrency(selectedOrder.discount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
            {selectedOrder && (
              <Button onClick={() => {
                setIsDetailDialogOpen(false)
                handleUpdateStatus(selectedOrder)
              }}>
                Update Status
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Update the status for order {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this status update..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}