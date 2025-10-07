"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
// Charts temporarily disabled - add recharts later
// import { 
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend
// } from 'recharts'
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Eye,
  MousePointer,
  Calendar,
  Target,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

interface AnalyticsData {
  totalRevenue: number
  revenueGrowth: number
  totalOrders: number
  ordersGrowth: number
  totalCustomers: number
  customersGrowth: number
  conversionRate: number
  averageOrderValue: number
  monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>
  topCategories: Array<{ name: string; value: number; percentage: number }>
  topProducts: Array<{ name: string; sales: number; revenue: number }>
  customerSegments: Array<{ segment: string; count: number; percentage: number }>
  trafficSources: Array<{ source: string; visits: number; conversions: number }>
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      // Mock analytics data - replace with actual API call
      const mockData: AnalyticsData = {
        totalRevenue: 1250000,
        revenueGrowth: 12.5,
        totalOrders: 2847,
        ordersGrowth: 8.3,
        totalCustomers: 1523,
        customersGrowth: 15.2,
        conversionRate: 3.2,
        averageOrderValue: 439,
        monthlyRevenue: [
          { month: 'Jan', revenue: 85000, orders: 180 },
          { month: 'Feb', revenue: 92000, orders: 205 },
          { month: 'Mar', revenue: 78000, orders: 165 },
          { month: 'Apr', revenue: 108000, orders: 235 },
          { month: 'May', revenue: 125000, orders: 290 },
          { month: 'Jun', revenue: 142000, orders: 315 },
          { month: 'Jul', revenue: 158000, orders: 350 },
          { month: 'Aug', revenue: 175000, orders: 385 },
          { month: 'Sep', revenue: 165000, orders: 370 },
          { month: 'Oct', revenue: 185000, orders: 410 },
          { month: 'Nov', revenue: 198000, orders: 445 },
          { month: 'Dec', revenue: 210000, orders: 475 }
        ],
        topCategories: [
          { name: 'Solar Panels', value: 45, percentage: 45 },
          { name: 'Wind Turbines', value: 25, percentage: 25 },
          { name: 'Battery Systems', value: 20, percentage: 20 },
          { name: 'Inverters', value: 8, percentage: 8 },
          { name: 'Accessories', value: 2, percentage: 2 }
        ],
        topProducts: [
          { name: 'Solar Panel 400W Monocrystalline', sales: 156, revenue: 124800 },
          { name: 'Wind Turbine Generator 1000W', sales: 89, revenue: 89000 },
          { name: 'Lithium Battery 100Ah', sales: 234, revenue: 117000 },
          { name: 'MPPT Charge Controller 60A', sales: 198, revenue: 59400 },
          { name: 'Pure Sine Wave Inverter 2000W', sales: 145, revenue: 72500 }
        ],
        customerSegments: [
          { segment: 'New Customers', count: 456, percentage: 30 },
          { segment: 'Returning Customers', count: 689, percentage: 45 },
          { segment: 'VIP Customers', count: 234, percentage: 15 },
          { segment: 'Inactive Customers', count: 144, percentage: 10 }
        ],
        trafficSources: [
          { source: 'Organic Search', visits: 12450, conversions: 398 },
          { source: 'Direct', visits: 8750, conversions: 315 },
          { source: 'Social Media', visits: 5630, conversions: 180 },
          { source: 'Email Marketing', visits: 3420, conversions: 205 },
          { source: 'Paid Ads', visits: 6890, conversions: 276 }
        ]
      }
      
      setAnalytics(mockData)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  const formatPercentage = (num: number, showSign = true) => {
    const sign = showSign && num > 0 ? '+' : ''
    return `${sign}${num.toFixed(1)}%`
  }

  if (loading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your business performance and insights
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.revenueGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
              )}
              <span className={analytics.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                {formatPercentage(analytics.revenueGrowth)} from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.totalOrders)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.ordersGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
              )}
              <span className={analytics.ordersGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                {formatPercentage(analytics.ordersGrowth)} from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.totalCustomers)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {analytics.customersGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
              )}
              <span className={analytics.customersGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                {formatPercentage(analytics.customersGrowth)} from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(analytics.conversionRate, false)}</div>
            <p className="text-xs text-muted-foreground">
              AOV: {formatCurrency(analytics.averageOrderValue)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Monthly Revenue & Orders
            </CardTitle>
            <CardDescription>Revenue and order trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Revenue Chart - Install recharts to enable</p>
            </div>
          </CardContent>
        </Card>

        {/* Categories Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="mr-2 h-5 w-5" />
              Sales by Category
            </CardTitle>
            <CardDescription>Revenue distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Category Chart - Install recharts to enable</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Tables Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products by sales and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>Customer breakdown by engagement level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.customerSegments.map((segment) => (
                <div key={segment.segment} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">{segment.segment}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{formatNumber(segment.count)}</span>
                    <Badge variant="secondary">{segment.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
          <CardDescription>Website traffic and conversion by source</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Visits</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>Conversion Rate</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.trafficSources.map((source) => {
                  const conversionRate = (source.conversions / source.visits) * 100
                  return (
                    <TableRow key={source.source}>
                      <TableCell className="font-medium">{source.source}</TableCell>
                      <TableCell>{formatNumber(source.visits)}</TableCell>
                      <TableCell>{formatNumber(source.conversions)}</TableCell>
                      <TableCell>{formatPercentage(conversionRate, false)}</TableCell>
                      <TableCell>
                        <Badge variant={conversionRate > 3 ? "default" : conversionRate > 2 ? "secondary" : "destructive"}>
                          {conversionRate > 3 ? "Excellent" : conversionRate > 2 ? "Good" : "Needs Improvement"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}