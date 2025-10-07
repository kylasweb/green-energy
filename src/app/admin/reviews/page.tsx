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
import { Switch } from "@/components/ui/switch"
import { 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  CheckCircle,
  MoreHorizontal,
  Filter
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Review {
  id: string
  productId: string
  productName: string
  productImage?: string
  userId: string
  userName: string
  userEmail: string
  rating: number
  title?: string
  comment: string
  isApproved: boolean
  isVisible: boolean
  helpfulCount: number
  unhelpfulCount: number
  isVerifiedPurchase: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [editForm, setEditForm] = useState({
    isApproved: false,
    isVisible: false
  })

  useEffect(() => {
    fetchReviews()
  }, [])

  useEffect(() => {
    let filtered = reviews.filter(review => {
      const matchesSearch = 
        review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.title?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "approved" && review.isApproved) ||
        (statusFilter === "pending" && !review.isApproved) ||
        (statusFilter === "visible" && review.isVisible) ||
        (statusFilter === "hidden" && !review.isVisible)
      
      const matchesRating = 
        ratingFilter === "all" || 
        review.rating.toString() === ratingFilter

      return matchesSearch && matchesStatus && matchesRating
    })
    
    setFilteredReviews(filtered)
  }, [searchTerm, statusFilter, ratingFilter, reviews])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      // Mock data for now - replace with actual API call
      const mockReviews: Review[] = [
        {
          id: "1",
          productId: "prod1",
          productName: "Solar Panel 400W",
          productImage: "/placeholder-product.jpg",
          userId: "user1",
          userName: "John Doe",
          userEmail: "john@example.com",
          rating: 5,
          title: "Excellent product!",
          comment: "Very happy with this solar panel. Great quality and excellent performance.",
          isApproved: true,
          isVisible: true,
          helpfulCount: 12,
          unhelpfulCount: 1,
          isVerifiedPurchase: true,
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T10:30:00Z"
        },
        {
          id: "2",
          productId: "prod2",
          productName: "Wind Turbine Kit",
          userId: "user2",
          userName: "Jane Smith",
          userEmail: "jane@example.com",
          rating: 4,
          title: "Good value for money",
          comment: "Works well but installation instructions could be better.",
          isApproved: false,
          isVisible: false,
          helpfulCount: 5,
          unhelpfulCount: 2,
          isVerifiedPurchase: true,
          createdAt: "2024-01-14T15:45:00Z",
          updatedAt: "2024-01-14T15:45:00Z"
        }
      ]
      setReviews(mockReviews)
      setFilteredReviews(mockReviews)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewReview = (review: Review) => {
    setSelectedReview(review)
    setIsDetailDialogOpen(true)
  }

  const handleEditReview = (review: Review) => {
    setEditingReview(review)
    setEditForm({
      isApproved: review.isApproved,
      isVisible: review.isVisible
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveReview = async () => {
    if (editingReview) {
      try {
        setLoading(true)
        
        // Mock API call - replace with actual implementation
        const updatedReviews = reviews.map(review =>
          review.id === editingReview.id
            ? { 
                ...review, 
                isApproved: editForm.isApproved,
                isVisible: editForm.isVisible,
                updatedAt: new Date().toISOString()
              }
            : review
        )
        setReviews(updatedReviews)
        setIsEditDialogOpen(false)
      } catch (error) {
        console.error('Error updating review:', error)
        alert('Failed to update review. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDeleteReview = async (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        setLoading(true)
        
        // Mock API call - replace with actual implementation
        const updatedReviews = reviews.filter(r => r.id !== id)
        setReviews(updatedReviews)
        setFilteredReviews(updatedReviews.filter(review => {
          const matchesSearch = 
            review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.title?.toLowerCase().includes(searchTerm.toLowerCase())
          
          const matchesStatus = 
            statusFilter === "all" || 
            (statusFilter === "approved" && review.isApproved) ||
            (statusFilter === "pending" && !review.isApproved) ||
            (statusFilter === "visible" && review.isVisible) ||
            (statusFilter === "hidden" && !review.isVisible)
          
          const matchesRating = 
            ratingFilter === "all" || 
            review.rating.toString() === ratingFilter

          return matchesSearch && matchesStatus && matchesRating
        }))
      } catch (error) {
        console.error('Error deleting review:', error)
        alert('Failed to delete review. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
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
          <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
          <p className="text-muted-foreground">
            Manage customer product reviews
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviews.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews.filter(r => r.isApproved).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews.filter(r => !r.isApproved).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews.length > 0 
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                : "0.0"
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>
            Manage and moderate customer product reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews, products, or customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="visible">Visible</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Rating filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reviews Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Helpful</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        {review.productImage && (
                          <img
                            src={review.productImage}
                            alt={review.productName}
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="max-w-[200px] truncate">{review.productName}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{review.userName}</div>
                        <div className="text-sm text-muted-foreground">{review.userEmail}</div>
                        {review.isVerifiedPurchase && (
                          <Badge variant="outline" className="text-xs mt-1">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-muted-foreground ml-1">
                          ({review.rating})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div>
                        {review.title && (
                          <div className="font-medium truncate">{review.title}</div>
                        )}
                        <div className="text-sm text-muted-foreground truncate">
                          {review.comment}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant={review.isApproved ? "default" : "secondary"}>
                          {review.isApproved ? "Approved" : "Pending"}
                        </Badge>
                        <Badge variant={review.isVisible ? "outline" : "secondary"} className="block w-fit">
                          {review.isVisible ? "Visible" : "Hidden"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="flex items-center">
                          <ThumbsUp className="w-3 h-3 mr-1 text-green-600" />
                          {review.helpfulCount}
                        </div>
                        <div className="flex items-center">
                          <ThumbsDown className="w-3 h-3 mr-1 text-red-600" />
                          {review.unhelpfulCount}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(review.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewReview(review)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditReview(review)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Status
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredReviews.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No reviews found
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {selectedReview.productImage && (
                  <img
                    src={selectedReview.productImage}
                    alt={selectedReview.productName}
                    className="w-16 h-16 rounded object-cover"
                  />
                )}
                <div>
                  <div className="font-medium">{selectedReview.productName}</div>
                  <div className="flex items-center space-x-1 mt-1">
                    {renderStars(selectedReview.rating)}
                    <span className="text-sm text-muted-foreground ml-2">
                      ({selectedReview.rating}/5)
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Customer</Label>
                <div className="text-sm text-muted-foreground">
                  <div>{selectedReview.userName}</div>
                  <div>{selectedReview.userEmail}</div>
                  {selectedReview.isVerifiedPurchase && (
                    <Badge variant="outline" className="mt-1">
                      Verified Purchase
                    </Badge>
                  )}
                </div>
              </div>

              {selectedReview.title && (
                <div>
                  <Label>Title</Label>
                  <p className="text-sm text-muted-foreground">{selectedReview.title}</p>
                </div>
              )}

              <div>
                <Label>Review</Label>
                <p className="text-sm text-muted-foreground">{selectedReview.comment}</p>
              </div>

              <div className="flex space-x-4">
                <div>
                  <Label>Status</Label>
                  <div className="space-y-1">
                    <Badge variant={selectedReview.isApproved ? "default" : "secondary"}>
                      {selectedReview.isApproved ? "Approved" : "Pending"}
                    </Badge>
                    <Badge variant={selectedReview.isVisible ? "outline" : "secondary"} className="block w-fit">
                      {selectedReview.isVisible ? "Visible" : "Hidden"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Helpfulness</Label>
                  <div className="flex items-center space-x-4 text-sm mt-1">
                    <div className="flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1 text-green-600" />
                      {selectedReview.helpfulCount} helpful
                    </div>
                    <div className="flex items-center">
                      <ThumbsDown className="w-4 h-4 mr-1 text-red-600" />
                      {selectedReview.unhelpfulCount} not helpful
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Created</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedReview.createdAt)}
                  </p>
                </div>
                <div>
                  <Label>Updated</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedReview.updatedAt)}
                  </p>
                </div>
              </div>
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
            <DialogTitle>Edit Review Status</DialogTitle>
            <DialogDescription>
              Update the approval and visibility status of this review.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="approved"
                checked={editForm.isApproved}
                onCheckedChange={(checked) => setEditForm({ ...editForm, isApproved: checked })}
              />
              <Label htmlFor="approved">Approved</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="visible"
                checked={editForm.isVisible}
                onCheckedChange={(checked) => setEditForm({ ...editForm, isVisible: checked })}
              />
              <Label htmlFor="visible">Visible to customers</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveReview}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}