'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Search, 
  Download, 
  Eye, 
  Edit, 
  Truck,
  Package,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

interface Order {
  _id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    phone: string
  }
  items: Array<{
    productId: string
    title: string
    quantity: number
    price: number
    image: string
  }>
  totalAmount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: string
  shippingAddress: {
    street: string
    city: string
    state: string
    pincode: string
  }
  createdAt: string
  updatedAt: string
}

const mockOrders: Order[] = [
  {
    _id: '1',
    orderNumber: 'ORD-2024-001',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210'
    },
    items: [
      {
        productId: '1',
        title: 'Premium Cotton T-Shirt',
        quantity: 2,
        price: 799,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100'
      }
    ],
    totalAmount: 1598,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    shippingAddress: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z'
  },
  {
    _id: '2',
    orderNumber: 'ORD-2024-002',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+91 8765432109'
    },
    items: [
      {
        productId: '2',
        title: 'Denim Jacket',
        quantity: 1,
        price: 2499,
        image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=100'
      }
    ],
    totalAmount: 2499,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    shippingAddress: {
      street: '456 Park Avenue',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    },
    createdAt: '2024-01-14T15:45:00Z',
    updatedAt: '2024-01-15T09:15:00Z'
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />
    case 'confirmed':
      return <CheckCircle className="h-4 w-4" />
    case 'processing':
      return <Package className="h-4 w-4" />
    case 'shipped':
      return <Truck className="h-4 w-4" />
    case 'delivered':
      return <CheckCircle className="h-4 w-4" />
    case 'cancelled':
      return <XCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'confirmed':
      return 'bg-blue-100 text-blue-800'
    case 'processing':
      return 'bg-orange-100 text-orange-800'
    case 'shipped':
      return 'bg-purple-100 text-purple-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    case 'refunded':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  // Filter orders based on search and filters
  useEffect(() => {
    let filtered = orders

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === paymentFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter, paymentFilter])

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    // Update order status
    setOrders(prev => prev.map(order => 
      order._id === orderId 
        ? { ...order, status: newStatus as Order['status'], updatedAt: new Date().toISOString() }
        : order
    ))
  }

  const handleExportOrders = () => {
    // Export orders to CSV
    const csvData = filteredOrders.map(order => ({
      OrderNumber: order.orderNumber,
      Customer: order.customer.name,
      Email: order.customer.email,
      Total: `₹${order.totalAmount}`,
      Status: order.status,
      PaymentStatus: order.paymentStatus,
      Date: new Date(order.createdAt).toLocaleDateString()
    }))

    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csvString], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'orders.csv'
    a.click()
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
        </div>
        <Button onClick={handleExportOrders} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Orders
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.processing}</div>
            <div className="text-sm text-gray-600">Processing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
            <div className="text-sm text-gray-600">Shipped</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            <div className="text-sm text-gray-600">Delivered</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders, customers..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-sm text-gray-500">{order.customer.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {order.items[0]?.image && (
                          <img 
                            src={order.items[0].image} 
                            alt={order.items[0].title}
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="text-sm">{order.items[0]?.title}</div>
                          {order.items.length > 1 && (
                            <div className="text-xs text-gray-500">+{order.items.length - 1} more</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">₹{order.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        <span className="capitalize">{order.paymentStatus}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowOrderDetails(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Select
                          value={order.status}
                          onValueChange={(value: string) => handleUpdateOrderStatus(order._id, value)}
                        >
                          <SelectTrigger className="w-[120px] h-8">
                            <Edit className="h-4 w-4 mr-1" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Order Details</h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowOrderDetails(false)}
                >
                  ×
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Order Number</label>
                  <div className="text-lg font-medium">{selectedOrder.orderNumber}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date</label>
                  <div>{new Date(selectedOrder.createdAt).toLocaleString()}</div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-medium mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <div>{selectedOrder.customer.name}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <div>{selectedOrder.customer.email}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <div>{selectedOrder.customer.phone}</div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-medium mb-3">Shipping Address</h3>
                <div className="text-gray-700">
                  {selectedOrder.shippingAddress.street}<br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br />
                  {selectedOrder.shippingAddress.pincode}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{item.price.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">each</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total Amount</span>
                  <span className="text-xl font-bold">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <span className="text-sm">{selectedOrder.paymentMethod}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
