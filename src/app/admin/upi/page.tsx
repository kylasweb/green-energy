'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UpiSettingsManagement from '@/components/admin/upi-settings-management'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  Smartphone, 
  TrendingUp, 
  DollarSign, 
  RefreshCw,
  Search,
  Filter,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw
} from 'lucide-react'
import { toast } from 'sonner'

interface Transaction {
  id: string
  orderId: string
  amount: number
  vpa: string
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'EXPIRED'
  gatewayTransactionId?: string
  createdAt: string
  order: {
    orderNumber: string
    customerName?: string
    customerEmail?: string
  }
  user?: {
    email: string
    name?: string
  }
}

interface Analytics {
  summary: {
    totalTransactions: number
    successfulTransactions: number
    failedTransactions: number
    refundedTransactions: number
    successRate: number
    totalVolume: number
    successfulVolume: number
    refundedVolume: number
    avgTransactionValue: number
  }
  trends: {
    daily: Array<{
      date: string
      total_transactions: number
      successful_transactions: number
      total_volume: number
      successful_volume: number
    }>
  }
  topVpas: Array<{
    vpa: string
    transactionCount: number
    totalAmount: number
  }>
  period: {
    startDate: string
    endDate: string
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function UpiManagementDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [refundDialog, setRefundDialog] = useState<Transaction | null>(null)
  const [refundReason, setRefundReason] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    userEmail: '',
    orderId: '',
    page: 1,
    limit: 20
  })

  useEffect(() => {
    loadAnalytics()
    loadTransactions()
  }, [])

  useEffect(() => {
    loadTransactions()
  }, [filters])

  const loadAnalytics = async () => {
    try {
      const endDate = new Date()
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      
      const response = await fetch(
        `/api/admin/upi/analytics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
      toast.error('Failed to load analytics')
    }
  }

  const loadTransactions = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') params.append(key, value.toString())
      })

      const response = await fetch(`/api/admin/upi/transactions?${params}`)
      
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions)
      }
    } catch (error) {
      console.error('Error loading transactions:', error)
      toast.error('Failed to load transactions')
    } finally {
      setIsLoading(false)
    }
  }

  const initiateRefund = async () => {
    if (!refundDialog || !refundReason.trim()) {
      toast.error('Please provide a refund reason')
      return
    }

    try {
      const response = await fetch(`/api/admin/upi/transactions/${refundDialog.id}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: refundReason.trim()
        })
      })

      if (response.ok) {
        toast.success('Refund initiated successfully')
        setRefundDialog(null)
        setRefundReason('')
        loadTransactions()
        loadAnalytics()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to initiate refund')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      SUCCESS: { variant: 'default', icon: CheckCircle, className: 'bg-green-100 text-green-800' },
      PENDING: { variant: 'secondary', icon: Clock, className: 'bg-yellow-100 text-yellow-800' },
      FAILED: { variant: 'destructive', icon: XCircle, className: 'bg-red-100 text-red-800' },
      REFUNDED: { variant: 'outline', icon: RotateCcw, className: 'bg-blue-100 text-blue-800' },
      EXPIRED: { variant: 'secondary', icon: Clock, className: 'bg-gray-100 text-gray-800' },
    }

    const config = variants[status] || variants.PENDING
    const Icon = config.icon

    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">UPI Management</h1>
          <p className="text-gray-600">Monitor and manage UPI transactions</p>
        </div>
        <Button onClick={() => { loadAnalytics(); loadTransactions(); }}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.summary.totalTransactions}</div>
              <p className="text-xs text-muted-foreground">
                Success Rate: {analytics.summary.successRate}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(analytics.summary.totalVolume)}
              </div>
              <p className="text-xs text-muted-foreground">
                Successful: {formatCurrency(analytics.summary.successfulVolume)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {analytics.summary.successfulTransactions}
              </div>
              <p className="text-xs text-muted-foreground">
                Average: {formatCurrency(analytics.summary.avgTransactionValue)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {analytics.summary.failedTransactions}
              </div>
              <p className="text-xs text-muted-foreground">
                Refunded: {analytics.summary.refundedTransactions}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value, page: 1 }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="SUCCESS">Success</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                      <SelectItem value="REFUNDED">Refunded</SelectItem>
                      <SelectItem value="EXPIRED">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="userEmail">User Email</Label>
                  <Input
                    id="userEmail"
                    placeholder="Search by email"
                    value={filters.userEmail}
                    onChange={(e) => setFilters(prev => ({ ...prev, userEmail: e.target.value, page: 1 }))}
                  />
                </div>

                <div>
                  <Label htmlFor="orderId">Order ID</Label>
                  <Input
                    id="orderId"
                    placeholder="Search by order"
                    value={filters.orderId}
                    onChange={(e) => setFilters(prev => ({ ...prev, orderId: e.target.value, page: 1 }))}
                  />
                </div>

                <div className="flex items-end">
                  <Button onClick={loadTransactions} className="w-full">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Transactions</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>VPA</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          Loading transactions...
                        </TableCell>
                      </TableRow>
                    ) : transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-mono text-sm">
                            {transaction.id.slice(-8)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{transaction.order.orderNumber}</div>
                              {transaction.order.customerName && (
                                <div className="text-sm text-gray-500">
                                  {transaction.order.customerName}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {transaction.user?.email || transaction.order.customerEmail || 'Guest'}
                          </TableCell>
                          <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                          <TableCell className="font-mono text-sm">{transaction.vpa}</TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          <TableCell>
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedTransaction(transaction)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {transaction.status === 'SUCCESS' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setRefundDialog(transaction)}
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {analytics && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Trends Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Transaction Trends</CardTitle>
                    <CardDescription>
                      Transaction volume and success rate over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analytics.trends.daily}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="total_transactions" 
                          stroke="#8884d8" 
                          name="Total Transactions"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="successful_transactions" 
                          stroke="#82ca9d" 
                          name="Successful"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Top VPAs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top UPI IDs</CardTitle>
                    <CardDescription>
                      Most frequently used UPI IDs by transaction count
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topVpas.slice(0, 5).map((vpa, index) => (
                        <div key={vpa.vpa} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{vpa.vpa}</div>
                            <div className="text-sm text-gray-500">
                              {vpa.transactionCount} transactions
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(vpa.totalAmount)}</div>
                            <div className="text-sm text-gray-500">
                              #{index + 1}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <UpiSettingsManagement />
        </TabsContent>
      </Tabs>

      {/* Transaction Details Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Transaction ID</Label>
                  <p className="font-mono text-sm">{selectedTransaction.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <p className="text-lg font-semibold">{formatCurrency(selectedTransaction.amount)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">UPI ID</Label>
                  <p className="font-mono text-sm">{selectedTransaction.vpa}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Order</Label>
                  <p>{selectedTransaction.order.orderNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created At</Label>
                  <p>{new Date(selectedTransaction.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {selectedTransaction.gatewayTransactionId && (
                <div>
                  <Label className="text-sm font-medium">Gateway Transaction ID</Label>
                  <p className="font-mono text-sm">{selectedTransaction.gatewayTransactionId}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={!!refundDialog} onOpenChange={() => setRefundDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Initiate Refund</DialogTitle>
            <DialogDescription>
              Process a refund for transaction {refundDialog?.id.slice(-8)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="refundReason">Refund Reason</Label>
              <Input
                id="refundReason"
                placeholder="Enter reason for refund"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
              />
            </div>
            {refundDialog && (
              <Alert>
                <AlertDescription>
                  This will initiate a refund of {formatCurrency(refundDialog.amount)} to {refundDialog.vpa}
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundDialog(null)}>
              Cancel
            </Button>
            <Button onClick={initiateRefund}>
              Process Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}