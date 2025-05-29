'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  estimatedDelivery: string;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    productName: string;
    productImage: string;
    quantity: number;
    size?: string;
    color?: string;
    price: number;
    subtotal: number;
  }>;
  createdAt: string;
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setError('Order ID not found');
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders?orderId=${orderId}`);
      const data = await response.json();
      
      if (data.success && data.orders.length > 0) {
        setOrder(data.orders[0]);
      } else {
        setError('Order not found');
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'Unable to find your order details.'}</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your purchase. Your order has been placed successfully.</p>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="border-b pb-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Order Number:</span>
              <span className="ml-2 font-medium">{order.orderNumber}</span>
            </div>
            <div>
              <span className="text-gray-600">Order Date:</span>
              <span className="ml-2 font-medium">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Payment Method:</span>
              <span className="ml-2 font-medium capitalize">{order.paymentMethod}</span>
            </div>
            <div>
              <span className="text-gray-600">Estimated Delivery:</span>
              <span className="ml-2 font-medium">
                {new Date(order.estimatedDelivery || Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h3>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 py-4 border-b last:border-b-0">
                <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0">
                  <img
                    src={item.productImage || '/placeholder-product.jpg'}
                    alt={item.productName}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900">{item.productName}</h4>
                  <div className="text-sm text-gray-500">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.size && item.color && <span> • </span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </div>
                  <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  ₹{item.subtotal}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total Amount</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
        <div className="text-sm text-gray-600">
          <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.addressLine1}</p>
          {order.shippingAddress.addressLine2 && (
            <p>{order.shippingAddress.addressLine2}</p>
          )}
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Payment: <span className="font-medium capitalize">{order.paymentStatus}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" asChild>
          <Link href={`/track-order?orderNumber=${order.orderNumber}`}>
            Track Your Order
          </Link>
        </Button>
        <Button asChild>
          <Link href="/">
            Continue Shopping
          </Link>
        </Button>
      </div>

      {/* Contact Info */}
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>
          Need help with your order? 
          <a href="mailto:support@myntra.com" className="text-blue-600 hover:underline ml-1">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
