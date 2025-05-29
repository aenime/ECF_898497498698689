'use client';

import { RefreshCw, Package, Clock, Truck, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ReturnPolicyPage() {
  const returnSteps = [
    {
      step: '1',
      title: 'Initiate Return',
      description: 'Log into your account and select the item you want to return',
      icon: <Package className="w-6 h-6 text-blue-600" />
    },
    {
      step: '2',
      title: 'Schedule Pickup',
      description: 'Choose a convenient time slot for our team to collect the item',
      icon: <Clock className="w-6 h-6 text-orange-600" />
    },
    {
      step: '3',
      title: 'Item Collection',
      description: 'Our logistics partner will collect the item from your address',
      icon: <Truck className="w-6 h-6 text-green-600" />
    },
    {
      step: '4',
      title: 'Refund Processing',
      description: 'Once verified, your refund will be processed within 3-5 business days',
      icon: <RefreshCw className="w-6 h-6 text-purple-600" />
    }
  ];

  const eligibleItems = [
    'Clothing and Fashion Accessories',
    'Electronics (within 10 days)',
    'Home & Kitchen Items',
    'Books and Media',
    'Toys and Games',
    'Sports and Fitness Equipment'
  ];

  const nonEligibleItems = [
    'Personal care and hygiene products',
    'Food and grocery items',
    'Custom or personalized items',
    'Intimate apparel and swimwear',
    'Items with security seals removed',
    'Perishable goods'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Return Policy</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We want you to be completely satisfied with your purchase. If you're not happy with your order, we offer a hassle-free return process.
        </p>
      </div>

      {/* Policy Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center">
          <CardContent className="p-6">
            <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">30-Day Window</h3>
            <p className="text-gray-600">
              Return most items within 30 days of delivery
            </p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <RefreshCw className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Returns</h3>
            <p className="text-gray-600">
              No return shipping costs for most items
            </p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Refunds</h3>
            <p className="text-gray-600">
              Refunds processed within 3-5 business days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Return Process */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>How to Return Items</CardTitle>
          <p className="text-gray-600">
            Follow these simple steps to return your items
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {returnSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-orange-500 text-white text-sm font-bold px-2 py-1 rounded">
                      Step {step.step}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t">
            <Button className="bg-orange-500 hover:bg-orange-600" asChild>
              <Link href="/account-orders">
                Start Return Process
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Eligible vs Non-Eligible Items */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span>Eligible for Return</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {eligibleItems.map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <span>Not Eligible for Return</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {nonEligibleItems.map((item, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Terms */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Return Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Item Condition Requirements</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Items must be in original condition with all tags attached</li>
              <li>Original packaging and accessories must be included</li>
              <li>Items should be unused and unworn (except for size/fit verification)</li>
              <li>Electronics must include all original cables, manuals, and accessories</li>
              <li>Books must be in resalable condition without markings or damage</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Refund Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Refunds will be processed to the original payment method</li>
              <li>Credit card refunds may take 5-10 business days to appear</li>
              <li>UPI and digital wallet refunds are processed within 24-48 hours</li>
              <li>Cash on delivery orders will receive bank transfer refunds</li>
              <li>Shipping charges are refundable only if the return is due to our error</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Categories</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li><strong>Electronics:</strong> 10-day return window with original box and warranty cards</li>
              <li><strong>Large Appliances:</strong> Inspection required before pickup, may take additional time</li>
              <li><strong>Jewelry:</strong> Must be returned in original packaging with certificates</li>
              <li><strong>Mattresses:</strong> 100-night trial with free pickup and return</li>
              <li><strong>Mobile Phones:</strong> IMEI verification required, protective film must be intact</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Exchanges */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Exchanges</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            We offer exchanges for size and color variations within the return window. Exchange requests are subject to stock availability.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Quick Exchange Process:</h4>
            <ol className="list-decimal list-inside space-y-1 text-blue-800">
              <li>Select "Exchange" instead of "Return" in your order details</li>
              <li>Choose your preferred size/color</li>
              <li>Schedule pickup for the original item</li>
              <li>New item ships immediately upon pickup confirmation</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Questions About Returns?
        </h3>
        <p className="text-gray-600 mb-6">
          Our customer support team is here to help with any return-related queries.
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/support/contact-page">
              Contact Support
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/support/faq-page">
              View FAQ
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
