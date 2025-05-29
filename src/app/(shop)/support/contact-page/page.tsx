'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      category: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: <Phone className="w-8 h-8 text-blue-600" />,
      title: "Phone Support",
      description: "Speak with our customer service team",
      contact: "+1 (555) 123-4567",
      availability: "Mon-Fri: 9 AM - 9 PM"
    },
    {
      icon: <Mail className="w-8 h-8 text-green-600" />,
      title: "Email Support",
      description: "Send us an email for detailed inquiries",
      contact: "support@flipkart.com",
      availability: "24/7 Response within 24 hours"
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-purple-600" />,
      title: "Live Chat",
      description: "Chat with our support team instantly",
      contact: "Available on website",
      availability: "Mon-Sun: 8 AM - 11 PM"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're here to help! Reach out to us through any of the methods below or fill out the contact form.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Contact Methods */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <div className="space-y-6">
            {contactMethods.map((method, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {method.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {method.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {method.description}
                      </p>
                      <p className="font-medium text-gray-900 mb-1">
                        {method.contact}
                      </p>
                      <p className="text-sm text-gray-500">
                        {method.availability}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Office Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-6 h-6 text-red-600" />
                <span>Our Office</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">FlipKart Headquarters</p>
                <p className="text-gray-600">123 Commerce Street</p>
                <p className="text-gray-600">Tech City, TC 12345</p>
                <p className="text-gray-600">United States</p>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Office Hours: Mon-Fri 9 AM - 6 PM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <p className="text-gray-600">
                Fill out the form below and we'll respond as soon as possible.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleSelectChange('category', value)}
                      required
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="order">Order Support</SelectItem>
                        <SelectItem value="returns">Returns & Refunds</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing & Payment</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                    rows={6}
                    placeholder="Please provide detailed information about your inquiry..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Link */}
      <div className="mt-12 text-center">
        <div className="bg-gray-50 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Need Quick Answers?
          </h3>
          <p className="text-gray-600 mb-4">
            Check out our frequently asked questions for instant help.
          </p>
          <Button variant="outline" asChild>
            <a href="/support/faq-page">
              Visit FAQ Section
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
