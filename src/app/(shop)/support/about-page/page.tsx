'use client';

import { Truck, Shield, Users, Award, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function AboutPage() {
  const features = [
    {
      icon: <Truck className="w-8 h-8 text-blue-600" />,
      title: "Fast Delivery",
      description: "Quick and reliable delivery across the country with real-time tracking."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Secure Shopping",
      description: "Your data and transactions are protected with industry-leading security."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Customer First",
      description: "24/7 customer support to help you with all your shopping needs."
    },
    {
      icon: <Award className="w-8 h-8 text-yellow-600" />,
      title: "Quality Products",
      description: "Curated selection of high-quality products from trusted brands."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          About FlipKart
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Your trusted e-commerce partner since 2024. We're dedicated to bringing you the best shopping experience with quality products, competitive prices, and exceptional service.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/products">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
              Start Shopping
            </Button>
          </Link>
          <Link href="/support/contact-page">
            <Button size="lg" variant="outline">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            At FlipKart, we believe shopping should be simple, enjoyable, and accessible to everyone. Our mission is to democratize commerce by providing a platform where customers can discover, explore, and purchase products that enhance their lives.
          </p>
          <p className="text-gray-600">
            We're committed to supporting both customers and sellers by creating a trusted marketplace that prioritizes quality, affordability, and convenience.
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
          <p className="text-gray-600 mb-4">
            To become the most loved and trusted e-commerce platform, where every interaction creates value for our customers, sellers, and communities.
          </p>
          <p className="text-gray-600">
            We envision a future where technology seamlessly connects people with the products they need, making shopping an effortless and delightful experience.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose FlipKart?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-16 text-white">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold mb-2">1M+</div>
            <div className="text-blue-100">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">50K+</div>
            <div className="text-blue-100">Products</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">500+</div>
            <div className="text-blue-100">Brands</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">99.9%</div>
            <div className="text-blue-100">Uptime</div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Get in Touch
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <Phone className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-600">+1 (555) 123-4567</p>
          </div>
          <div className="text-center">
            <Mail className="w-8 h-8 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600">support@flipkart.com</p>
          </div>
          <div className="text-center">
            <MapPin className="w-8 h-8 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
            <p className="text-gray-600">123 Commerce Street<br />Tech City, TC 12345</p>
          </div>
        </div>
      </div>
    </div>
  );
}
