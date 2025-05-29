'use client';

import { Truck, Clock, MapPin, Package, CreditCard, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ShippingPolicyPage() {
  const shippingOptions = [
    {
      title: 'Standard Delivery',
      duration: '3-7 business days',
      cost: 'Free on orders above ₹499',
      description: 'Regular delivery for most items across the country',
      icon: <Package className="w-8 h-8 text-blue-600" />
    },
    {
      title: 'Express Delivery',
      duration: '1-2 business days',
      cost: '₹149 (Free on orders above ₹1999)',
      description: 'Faster delivery for urgent orders in major cities',
      icon: <Truck className="w-8 h-8 text-orange-600" />
    },
    {
      title: 'Same Day Delivery',
      duration: 'Within 12 hours',
      cost: '₹199',
      description: 'Available in select cities for orders placed before 2 PM',
      icon: <Clock className="w-8 h-8 text-green-600" />
    }
  ];

  const deliveryZones = [
    {
      zone: 'Metro Cities',
      cities: 'Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune',
      standardDelivery: '2-4 days',
      expressDelivery: '1-2 days',
      sameDayAvailable: true
    },
    {
      zone: 'Tier-1 Cities',
      cities: 'Ahmedabad, Jaipur, Lucknow, Kanpur, Nagpur, Indore, Bhopal',
      standardDelivery: '3-5 days',
      expressDelivery: '2-3 days',
      sameDayAvailable: false
    },
    {
      zone: 'Tier-2 Cities',
      cities: 'Agra, Nashik, Faridabad, Meerut, Rajkot, Varanasi',
      standardDelivery: '4-6 days',
      expressDelivery: '3-4 days',
      sameDayAvailable: false
    },
    {
      zone: 'Other Areas',
      cities: 'Rural and remote areas',
      standardDelivery: '5-7 days',
      expressDelivery: 'Not available',
      sameDayAvailable: false
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Fast, reliable delivery across the country. Learn about our shipping options, delivery times, and policies.
        </p>
      </div>

      {/* Shipping Options */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Options</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {shippingOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {option.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {option.title}
                </h3>
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  {option.duration}
                </div>
                <div className="text-lg font-medium text-green-600 mb-3">
                  {option.cost}
                </div>
                <p className="text-gray-600 text-sm">
                  {option.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Delivery Zones */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Delivery Coverage & Timeline</CardTitle>
          <p className="text-gray-600">
            Delivery times vary based on your location and selected shipping method
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Zone</th>
                  <th className="text-left py-3 px-4 font-semibold">Major Cities</th>
                  <th className="text-left py-3 px-4 font-semibold">Standard</th>
                  <th className="text-left py-3 px-4 font-semibold">Express</th>
                  <th className="text-left py-3 px-4 font-semibold">Same Day</th>
                </tr>
              </thead>
              <tbody>
                {deliveryZones.map((zone, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-4 px-4 font-medium">{zone.zone}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{zone.cities}</td>
                    <td className="py-4 px-4">{zone.standardDelivery}</td>
                    <td className="py-4 px-4">{zone.expressDelivery}</td>
                    <td className="py-4 px-4">
                      {zone.sameDayAvailable ? (
                        <span className="text-green-600">Available</span>
                      ) : (
                        <span className="text-gray-400">Not available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Information */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <span>Shipping Charges</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Free Shipping Eligibility</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Orders above ₹499: Free standard delivery</li>
                <li>• Orders above ₹1999: Free express delivery</li>
                <li>• Prime members: Free shipping on all orders</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Paid Shipping Rates</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Standard delivery: ₹49</li>
                <li>• Express delivery: ₹149</li>
                <li>• Same day delivery: ₹199</li>
                <li>• COD charges: ₹29 additional</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-green-600" />
              <span>Delivery Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Delivery Attempts</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Up to 3 delivery attempts</li>
                <li>• SMS/Email notifications before delivery</li>
                <li>• Rescheduling option available</li>
                <li>• Safe drop option for trusted locations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Special Instructions</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Add delivery notes during checkout</li>
                <li>• Contactless delivery available</li>
                <li>• ID verification for high-value items</li>
                <li>• Signature required for electronics</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shipping Restrictions */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Shipping Restrictions & Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Items with Special Handling</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Electronics & Appliances</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Installation service available for large appliances</li>
                  <li>• Open box delivery for verification</li>
                  <li>• Extended delivery time for remote areas</li>
                  <li>• Professional handling for fragile items</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Perishable & Food Items</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Temperature-controlled delivery</li>
                  <li>• Express delivery recommended</li>
                  <li>• Limited to major cities only</li>
                  <li>• Immediate pickup required</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Restrictions</h3>
            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-medium text-amber-900 mb-2">Areas with Limited Delivery</h4>
              <ul className="text-amber-800 text-sm space-y-1">
                <li>• Remote hilly areas may have extended delivery times</li>
                <li>• Some postal codes require courier hub pickup</li>
                <li>• High-security zones need additional verification</li>
                <li>• Island territories have restricted shipping options</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Processing */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-purple-600" />
            <span>Order Processing & Tracking</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Processing Timeline</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Order confirmation: Immediate</li>
              <li>• Payment verification: 2-4 hours</li>
              <li>• Order packaging: 1-2 business days</li>
              <li>• Dispatch notification: Email & SMS sent</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Real-time Tracking</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Live tracking link via SMS/Email</li>
              <li>• Delivery partner contact details</li>
              <li>• Estimated delivery time updates</li>
              <li>• Proof of delivery with signature/photo</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* International Shipping */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>International Shipping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Coming Soon!
            </h3>
            <p className="text-blue-800 mb-4">
              We're working on expanding our delivery network internationally. 
              Currently, we ship within India only.
            </p>
            <Button variant="outline" className="border-blue-600 text-blue-600">
              Notify Me When Available
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Questions About Shipping?
        </h3>
        <p className="text-gray-600 mb-6">
          Need help with your delivery or have special shipping requirements? We're here to help.
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild>
            <Link href="/support/order-tracking-page">
              Track Your Order
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/support/contact-page">
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
