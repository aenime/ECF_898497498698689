'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/stores/cart';

interface OrderDetails {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  paymentMethod: string;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  const orderId = searchParams?.get('orderId');
  
  useEffect(() => {
    // Clear cart after successful order
    clearCart();
    
    // Fetch order details if orderId exists
    if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          const response = await fetch(`/api/orders/${orderId}`);
          const data = await response.json();
          
          if (data.success && data.data) {
            setOrderDetails(data.data);
          }
        } catch (error) {
          console.error('Error fetching order details:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderId, clearCart]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Your order has been confirmed and is being processed.
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-8">
          <CardContent className="p-6">
            {orderDetails ? (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
                <div className="space-y-3 border-b border-gray-100 pb-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order Number:</span>
                    <span className="font-medium">{orderDetails.orderNumber}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span>{new Date(orderDetails.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="capitalize bg-green-100 text-green-800 py-1 px-2 rounded text-xs">
                      {orderDetails.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Method:</span>
                    <span className="capitalize">{orderDetails.paymentMethod}</span>
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-900 font-medium">Total Amount:</span>
                    <span className="text-xl font-bold">₹{orderDetails.total?.toFixed(2)}</span>
                  </div>
                </div>
              </>
            ) : null}
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Order Confirmation</h3>
                  <p className="text-sm text-gray-600">
                    You&apos;ll receive an email confirmation with your order details shortly.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Processing & Shipping</h3>
                  <p className="text-sm text-gray-600">
                    Your order will be processed and shipped within 1-2 business days.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Delivery</h3>
                  <p className="text-sm text-gray-600">
                    Your order will be delivered within 3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/account/orders">
              <Button variant="outline" size="lg">
                View Orders
              </Button>
            </Link>
          </div>
          
          <div className="text-sm text-gray-500">
            Order confirmation: {orderDetails?.orderNumber || `#${Date.now().toString().slice(-6)}`}
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            If you have any questions about your order, don&apos;t hesitate to reach out to our customer support team.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/support/contact">
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </Link>
            <Link href={`/account/orders${orderDetails ? `/${orderDetails._id}` : ''}`}>
              <Button variant="outline" size="sm">
                Track Order
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
