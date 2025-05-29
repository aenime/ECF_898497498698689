'use client';

import { useState } from 'react';
import { Search, Truck, MapPin, Clock, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface OrderStatus {
  id: string;
  status: 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled';
  title: string;
  description: string;
  timestamp: string;
  location?: string;
}

interface TrackingData {
  orderNumber: string;
  status: 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
  currentLocation: string;
  timeline: OrderStatus[];
  items: {
    name: string;
    quantity: number;
    image: string;
  }[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
  };
}

export default function OrderTrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock tracking data for demonstration
  const mockTrackingData: TrackingData = {
    orderNumber: 'ORD123456789',
    status: 'out-for-delivery',
    estimatedDelivery: '2025-01-03',
    currentLocation: 'Local Delivery Hub, Your City',
    timeline: [
      {
        id: '1',
        status: 'processing',
        title: 'Order Confirmed',
        description: 'Your order has been received and is being processed',
        timestamp: '2025-01-01 10:30 AM'
      },
      {
        id: '2',
        status: 'shipped',
        title: 'Order Shipped',
        description: 'Your order has been shipped from our warehouse',
        timestamp: '2025-01-02 02:15 PM',
        location: 'Fulfillment Center, Distribution City'
      },
      {
        id: '3',
        status: 'out-for-delivery',
        title: 'Out for Delivery',
        description: 'Your order is on the way and will be delivered today',
        timestamp: '2025-01-03 08:00 AM',
        location: 'Local Delivery Hub, Your City'
      }
    ],
    items: [
      {
        name: 'Premium Wireless Headphones',
        quantity: 1,
        image: 'https://via.placeholder.com/80x80'
      },
      {
        name: 'USB-C Fast Charger',
        quantity: 1,
        image: 'https://via.placeholder.com/80x80'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main Street, Apt 4B',
      city: 'Anytown',
      postalCode: '12345'
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo purposes, show mock data for any tracking number
    if (trackingNumber.trim().length >= 6) {
      setTrackingData({
        ...mockTrackingData,
        orderNumber: trackingNumber.toUpperCase()
      });
    } else {
      setError('Order not found. Please check your tracking number and try again.');
    }

    setIsLoading(false);
  };

  const getStatusIcon = (status: string, isCompleted: boolean) => {
    if (isCompleted) {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    }
    
    switch (status) {
      case 'processing':
        return <Package className="w-6 h-6 text-blue-600" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-blue-600" />;
      case 'out-for-delivery':
        return <MapPin className="w-6 h-6 text-orange-600" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'cancelled':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Package className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'out-for-delivery':
        return 'text-orange-600 bg-orange-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
        <p className="text-xl text-gray-600">
          Enter your order number or tracking ID to get real-time updates
        </p>
      </div>

      {/* Tracking Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-6 h-6 text-orange-600" />
            <span>Track Your Package</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <Label htmlFor="tracking">Order Number / Tracking ID</Label>
              <Input
                id="tracking"
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter your order number (e.g., ORD123456789)"
                className="mt-1"
              />
              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Tracking...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Track Order
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tracking Results */}
      {trackingData && (
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order #{trackingData.orderNumber}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Current Status</h3>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingData.status)}`}>
                    {trackingData.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Estimated Delivery</h3>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {new Date(trackingData.estimatedDelivery).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Current Location</h3>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {trackingData.currentLocation}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Tracking Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {trackingData.timeline.map((event, index) => {
                  const isCompleted = index < trackingData.timeline.length - 1 || trackingData.status === 'delivered';
                  const isCurrent = index === trackingData.timeline.length - 1 && trackingData.status !== 'delivered';
                  
                  return (
                    <div key={event.id} className="flex space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(event.status, isCompleted)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-medium ${isCurrent ? 'text-orange-600' : 'text-gray-900'}`}>
                            {event.title}
                          </h3>
                          {isCurrent && (
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {event.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>{event.timestamp}</span>
                          {event.location && (
                            <>
                              <span>•</span>
                              <span>{event.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trackingData.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-600">
                <p className="font-medium text-gray-900">{trackingData.shippingAddress.name}</p>
                <p>{trackingData.shippingAddress.address}</p>
                <p>{trackingData.shippingAddress.city}, {trackingData.shippingAddress.postalCode}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Need Help with Your Order?
        </h3>
        <p className="text-gray-600 mb-4">
          If you have any questions about your order or tracking information, we're here to help.
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" asChild>
            <a href="/support/contact-page">
              Contact Support
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/support/faq-page">
              View FAQ
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
