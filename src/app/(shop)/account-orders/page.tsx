'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Package, Eye, Download, ArrowLeft } from 'lucide-react';
import { AccountLayout } from '@/components/account/account-layout';

interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled' | 'returned';
  total: number;
  items: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }[];
  shippingAddress: string;
  trackingNumber?: string;
}

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API call
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        date: '2024-05-20',
        status: 'delivered',
        total: 189.99,
        items: [
          {
            id: '1',
            name: 'Classic Cotton T-Shirt',
            image: '/api/placeholder/100/100',
            price: 29.99,
            quantity: 2,
            size: 'M',
            color: 'Blue'
          },
          {
            id: '2',
            name: 'Denim Jeans',
            image: '/api/placeholder/100/100',
            price: 89.99,
            quantity: 1,
            size: '32',
            color: 'Dark Blue'
          }
        ],
        shippingAddress: '123 Main St, City, State 12345',
        trackingNumber: 'TRK123456789'
      },
      {
        id: 'ORD-002',
        date: '2024-05-18',
        status: 'shipped',
        total: 156.50,
        items: [
          {
            id: '3',
            name: 'Running Shoes',
            image: '/api/placeholder/100/100',
            price: 120.00,
            quantity: 1,
            size: '10',
            color: 'Black'
          },
          {
            id: '4',
            name: 'Sports Socks',
            image: '/api/placeholder/100/100',
            price: 18.25,
            quantity: 2,
            size: 'L',
            color: 'White'
          }
        ],
        shippingAddress: '123 Main St, City, State 12345',
        trackingNumber: 'TRK987654321'
      },
      {
        id: 'ORD-003',
        date: '2024-05-15',
        status: 'processing',
        total: 245.00,
        items: [
          {
            id: '5',
            name: 'Leather Jacket',
            image: '/api/placeholder/100/100',
            price: 245.00,
            quantity: 1,
            size: 'L',
            color: 'Black'
          }
        ],
        shippingAddress: '123 Main St, City, State 12345'
      },
      {
        id: 'ORD-004',
        date: '2024-05-10',
        status: 'cancelled',
        total: 75.99,
        items: [
          {
            id: '6',
            name: 'Summer Dress',
            image: '/api/placeholder/100/100',
            price: 75.99,
            quantity: 1,
            size: 'S',
            color: 'Red'
          }
        ],
        shippingAddress: '123 Main St, City, State 12345'
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter orders
  useEffect(() => {
    const filtered = orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      delivered: 'text-green-600 bg-green-100',
      shipped: 'text-blue-600 bg-blue-100',
      processing: 'text-yellow-600 bg-yellow-100',
      cancelled: 'text-red-600 bg-red-100',
      returned: 'text-purple-600 bg-purple-100'
    };
    return colors[status];
  };

  const downloadInvoice = (orderId: string) => {
    // Mock download - in real app, this would download a PDF
    alert(`Downloading invoice for order ${orderId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AccountLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/account-dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          </div>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Orders</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border">
                {/* Order Header */}
                <div className="p-6 border-b bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Order {order.id}</h3>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{order.items.length} items</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => downloadInvoice(order.id)}
                          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                        >
                          <Download className="w-4 h-4" />
                          Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            ${item.price} × {item.quantity}
                          </p>
                          {(item.size || item.color) && (
                            <p className="text-xs text-gray-500">
                              {item.size && `Size: ${item.size}`}
                              {item.size && item.color && ' • '}
                              {item.color && `Color: ${item.color}`}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center p-4 border rounded-lg bg-gray-50">
                        <p className="text-gray-600">+{order.items.length - 3} more items</p>
                      </div>
                    )}
                  </div>

                  {/* Tracking Info */}
                  {order.trackingNumber && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-blue-900">Tracking Information</h4>
                          <p className="text-blue-700">Tracking Number: {order.trackingNumber}</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          Track Package
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : "You haven't placed any orders yet"
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link
                href="/category/all"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Start Shopping
              </Link>
            )}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Order Details - {selectedOrder.id}</h2>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Order ID:</span> {selectedOrder.id}</p>
                      <p><span className="font-medium">Date:</span> {new Date(selectedOrder.date).toLocaleDateString()}</p>
                      <p><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </p>
                      <p><span className="font-medium">Total:</span> ${selectedOrder.total.toFixed(2)}</p>
                      {selectedOrder.trackingNumber && (
                        <p><span className="font-medium">Tracking:</span> {selectedOrder.trackingNumber}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                    <p className="text-sm text-gray-600">{selectedOrder.shippingAddress}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Items Ordered</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            ${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          {(item.size || item.color) && (
                            <p className="text-sm text-gray-500">
                              {item.size && `Size: ${item.size}`}
                              {item.size && item.color && ' • '}
                              {item.color && `Color: ${item.color}`}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
