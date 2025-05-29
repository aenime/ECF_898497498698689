'use client';

import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Phone, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "How do I create an account?",
      answer: "To create an account, click the 'Sign Up' button in the top right corner of our website. Fill in your email, password, and basic information. You'll receive a confirmation email to verify your account.",
      category: "account"
    },
    {
      id: 2,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, UPI, net banking, and cash on delivery (COD) for eligible orders.",
      category: "payment"
    },
    {
      id: 3,
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can track your order by visiting the 'Track Order' page or logging into your account and checking order history.",
      category: "orders"
    },
    {
      id: 4,
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Some items like personal care products and food items are not eligible for return.",
      category: "returns"
    },
    {
      id: 5,
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-7 business days. Express shipping delivers within 1-2 business days. Same-day delivery is available in select cities for orders placed before 2 PM.",
      category: "shipping"
    },
    {
      id: 6,
      question: "Can I cancel my order?",
      answer: "You can cancel your order within 24 hours of placing it if it hasn't been shipped yet. Go to your order history and click 'Cancel Order'. If already shipped, you can return it once received.",
      category: "orders"
    },
    {
      id: 7,
      question: "How do I change my password?",
      answer: "Go to your account settings, click on 'Security', then 'Change Password'. Enter your current password and new password twice to confirm the change.",
      category: "account"
    },
    {
      id: 8,
      question: "What if I receive a damaged product?",
      answer: "If you receive a damaged product, please contact us within 48 hours with photos of the damage. We'll arrange for a replacement or full refund immediately.",
      category: "returns"
    },
    {
      id: 9,
      question: "Do you offer international shipping?",
      answer: "Currently, we ship within the country only. We're working on expanding our international shipping options and will update customers once available.",
      category: "shipping"
    },
    {
      id: 10,
      question: "How can I apply a coupon code?",
      answer: "During checkout, you'll see a 'Promo Code' field. Enter your coupon code and click 'Apply'. The discount will be reflected in your order total before payment.",
      category: "payment"
    },
    {
      id: 11,
      question: "Can I modify my shipping address after placing an order?",
      answer: "Address changes are possible within 2 hours of placing the order. Contact customer support immediately. Once the order is processed for shipping, address changes are not possible.",
      category: "orders"
    },
    {
      id: 12,
      question: "What is your customer support availability?",
      answer: "Our customer support is available Monday to Sunday, 8 AM to 11 PM. You can reach us via phone, email, or live chat. We respond to emails within 24 hours.",
      category: "support"
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'account', label: 'Account & Login' },
    { value: 'orders', label: 'Orders & Tracking' },
    { value: 'payment', label: 'Payment & Billing' },
    { value: 'shipping', label: 'Shipping & Delivery' },
    { value: 'returns', label: 'Returns & Refunds' },
    { value: 'support', label: 'Customer Support' }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about our products, services, and policies.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-3 text-lg"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className={selectedCategory === category.value ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4 mb-12">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map(faq => (
            <Card key={faq.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-medium text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  {openItems.includes(faq.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openItems.includes(faq.id) && (
                  <div className="px-6 pb-6">
                    <div className="border-t pt-4">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or category filter.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <Phone className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 text-sm mb-4">
              Speak directly with our support team
            </p>
            <p className="font-medium text-gray-900 mb-2">+1 (555) 123-4567</p>
            <p className="text-sm text-gray-500">Mon-Fri: 9 AM - 9 PM</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm mb-4">
              Get instant help from our team
            </p>
            <Button className="bg-green-600 hover:bg-green-700">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <Mail className="w-8 h-8 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm mb-4">
              Send us a detailed inquiry
            </p>
            <Link href="/support/contact-page">
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                Contact Us
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Still Need Help */}
      <div className="mt-12 text-center bg-gray-50 rounded-lg p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Still need help?
        </h3>
        <p className="text-gray-600 mb-4">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/support/contact-page">
            <Button className="bg-orange-500 hover:bg-orange-600">
              Contact Support
            </Button>
          </Link>
          <Link href="/support/order-tracking-page">
            <Button variant="outline">
              Track Your Order
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
