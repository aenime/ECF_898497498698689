"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  Phone, 
  MessageCircle, 
  Package, 
  RotateCcw, 
  Truck, 
  FileText, 
  Shield, 
  Info,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  const supportCategories = [
    {
      title: "Frequently Asked Questions",
      description: "Find quick answers to common questions about our products and services.",
      icon: <HelpCircle className="h-8 w-8 text-blue-600" />,
      href: "/support/faq-page",
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "Contact Us",
      description: "Get in touch with our customer support team for personalized assistance.",
      icon: <Phone className="h-8 w-8 text-green-600" />,
      href: "/support/contact-page",
      color: "bg-green-50 border-green-200"
    },
    {
      title: "Track Your Order",
      description: "Check the status and location of your orders with real-time tracking.",
      icon: <Package className="h-8 w-8 text-purple-600" />,
      href: "/support/order-tracking-page",
      color: "bg-purple-50 border-purple-200"
    },
    {
      title: "Return Policy",
      description: "Learn about our hassle-free return process and policy details.",
      icon: <RotateCcw className="h-8 w-8 text-orange-600" />,
      href: "/support/return-policy-page",
      color: "bg-orange-50 border-orange-200"
    },
    {
      title: "Shipping Policy",
      description: "Understand our shipping options, delivery times, and charges.",
      icon: <Truck className="h-8 w-8 text-indigo-600" />,
      href: "/support/shipping-policy-page",
      color: "bg-indigo-50 border-indigo-200"
    },
    {
      title: "About Us",
      description: "Learn more about our company, mission, and values.",
      icon: <Info className="h-8 w-8 text-teal-600" />,
      href: "/support/about-page",
      color: "bg-teal-50 border-teal-200"
    }
  ];

  const legalPages = [
    {
      title: "Terms of Service",
      description: "Read our complete terms and conditions for using our platform.",
      icon: <FileText className="h-6 w-6 text-gray-600" />,
      href: "/support/terms-of-service-page"
    },
    {
      title: "Privacy Policy",
      description: "Learn how we protect and handle your personal information.",
      icon: <Shield className="h-6 w-6 text-gray-600" />,
      href: "/support/privacy-policy-page"
    }
  ];

  const contactMethods = [
    {
      method: "Live Chat",
      description: "Get instant help from our support team",
      icon: <MessageCircle className="h-6 w-6 text-blue-600" />,
      action: "Start Chat",
      available: "Available 24/7"
    },
    {
      method: "Phone Support",
      description: "Call us for immediate assistance",
      icon: <Phone className="h-6 w-6 text-green-600" />,
      action: "Call Now",
      available: "+1 (555) 123-4567"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers, get help, and learn more about our services. We&apos;re here to help you have the best shopping experience possible.
          </p>
        </div>

        {/* Main Support Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How can we help you?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportCategories.map((category, index) => (
              <Link key={index} href={category.href}>
                <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer group ${category.color}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-shrink-0">
                        {category.icon}
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Contact Methods */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Need immediate help?</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {contactMethods.map((contact, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {contact.icon}
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">
                      {contact.method}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">{contact.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{contact.available}</span>
                    <Button variant="outline" size="sm">
                      {contact.action}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Legal Information */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Legal Information</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {legalPages.map((page, index) => (
              <Link key={index} href={page.href}>
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          {page.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {page.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {page.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Topics */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Popular Help Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/support/faq-page#account" className="text-blue-600 hover:text-blue-700 text-sm">
              • How to create an account
            </Link>
            <Link href="/support/faq-page#orders" className="text-blue-600 hover:text-blue-700 text-sm">
              • How to place an order
            </Link>
            <Link href="/support/faq-page#payment" className="text-blue-600 hover:text-blue-700 text-sm">
              • Payment methods accepted
            </Link>
            <Link href="/support/faq-page#shipping" className="text-blue-600 hover:text-blue-700 text-sm">
              • Delivery timeframes
            </Link>
            <Link href="/support/faq-page#returns" className="text-blue-600 hover:text-blue-700 text-sm">
              • How to return an item
            </Link>
            <Link href="/support/faq-page#support" className="text-blue-600 hover:text-blue-700 text-sm">
              • Contact customer service
            </Link>
          </div>
        </div>

        {/* Still need help section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6">
            Our customer support team is ready to assist you with any questions or concerns.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/support/contact-page">
              <Button size="lg">
                Contact Support
              </Button>
            </Link>
            <Link href="/support/faq-page">
              <Button variant="outline" size="lg">
                Browse FAQ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
