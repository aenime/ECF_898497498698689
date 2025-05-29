"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Shield, Eye, Lock, Database, Cookie, Bell, FileText } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/support">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Support
            </Button>
          </Link>
          <div className="text-center">
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: December 2024</p>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Commitment to Your Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-lg">
              At our e-commerce platform, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
            </p>
          </CardContent>
        </Card>

        {/* Section 1: Information We Collect */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              1. Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">Personal Information</h4>
                <ul className="list-disc pl-6 text-blue-800 space-y-1">
                  <li>Name and contact information</li>
                  <li>Email address and phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information</li>
                  <li>Account credentials</li>
                  <li>Date of birth (if provided)</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3">Usage Information</h4>
                <ul className="list-disc pl-6 text-purple-800 space-y-1">
                  <li>Browsing history and preferences</li>
                  <li>Purchase history and behavior</li>
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                  <li>Cookies and tracking data</li>
                  <li>Communication preferences</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: How We Use Your Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              2. How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              We use the information we collect about you for various purposes, including:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Service Delivery</h4>
                <ul className="list-disc pl-6 text-green-800 space-y-1">
                  <li>Process orders and payments</li>
                  <li>Deliver products and services</li>
                  <li>Manage your account</li>
                  <li>Provide customer support</li>
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">Communication</h4>
                <ul className="list-disc pl-6 text-orange-800 space-y-1">
                  <li>Send order confirmations</li>
                  <li>Provide shipping updates</li>
                  <li>Send marketing materials</li>
                  <li>Respond to inquiries</li>
                </ul>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-900 mb-2">Improvement</h4>
                <ul className="list-disc pl-6 text-indigo-800 space-y-1">
                  <li>Analyze usage patterns</li>
                  <li>Personalize experiences</li>
                  <li>Improve our services</li>
                  <li>Develop new features</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Information Sharing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. Information Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <div className="space-y-3">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h4 className="font-semibold text-yellow-900">Service Providers</h4>
                <p className="text-yellow-800">We may share information with trusted third-party service providers who assist us in operating our platform, processing payments, or delivering services.</p>
              </div>
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <h4 className="font-semibold text-red-900">Legal Requirements</h4>
                <p className="text-red-800">We may disclose information when required by law, court order, or government request, or to protect our rights and safety.</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <h4 className="font-semibold text-blue-900">Business Transfers</h4>
                <p className="text-blue-800">In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Data Security */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              4. Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Technical Safeguards</h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>SSL/TLS encryption</li>
                  <li>Secure data storage</li>
                  <li>Regular security audits</li>
                  <li>Access controls and monitoring</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Organizational Measures</h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Employee training programs</li>
                  <li>Data access restrictions</li>
                  <li>Incident response procedures</li>
                  <li>Regular policy updates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Cookies and Tracking */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cookie className="h-5 w-5 mr-2" />
              5. Cookies and Tracking Technologies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              We use cookies and similar tracking technologies to enhance your browsing experience and analyze how our platform is used.
            </p>
            <div className="space-y-3">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Essential Cookies</h4>
                <p className="text-green-800">Required for basic functionality such as shopping cart, user authentication, and security features.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Analytics Cookies</h4>
                <p className="text-blue-800">Help us understand how visitors interact with our platform to improve user experience.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Marketing Cookies</h4>
                <p className="text-purple-800">Used to deliver personalized advertisements and track marketing campaign effectiveness.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Your Rights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. Your Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded">
                  <h4 className="font-semibold text-blue-900">Access Rights</h4>
                  <p className="text-blue-800 text-sm">Request a copy of your personal data</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <h4 className="font-semibold text-green-900">Correction Rights</h4>
                  <p className="text-green-800 text-sm">Update or correct inaccurate information</p>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <h4 className="font-semibold text-orange-900">Deletion Rights</h4>
                  <p className="text-orange-800 text-sm">Request deletion of your personal data</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-purple-50 p-3 rounded">
                  <h4 className="font-semibold text-purple-900">Portability Rights</h4>
                  <p className="text-purple-800 text-sm">Receive your data in a portable format</p>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <h4 className="font-semibold text-red-900">Objection Rights</h4>
                  <p className="text-red-800 text-sm">Object to certain processing activities</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-semibold text-gray-900">Restriction Rights</h4>
                  <p className="text-gray-800 text-sm">Restrict how we process your data</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 7: Data Retention */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>7. Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Retention Periods:</h4>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Account Information:</strong> Retained while your account is active</li>
                <li><strong>Transaction Records:</strong> Retained for 7 years for tax and legal purposes</li>
                <li><strong>Marketing Data:</strong> Retained until you opt-out or for 2 years of inactivity</li>
                <li><strong>Support Records:</strong> Retained for 3 years after resolution</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 8: Children's Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>8. Children&apos;s Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Our platform is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-yellow-800">
                <strong>Note:</strong> If we discover that we have collected personal information from a child under 13, we will delete such information from our files promptly.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 9: International Transfers */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>9. International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and that appropriate safeguards are in place.
            </p>
          </CardContent>
        </Card>

        {/* Section 10: Changes to Privacy Policy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              10. Changes to This Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
            <p className="text-gray-700">
              We encourage you to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact Us About Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Data Protection Officer:</strong> privacy@example.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Address:</strong> 123 Privacy Street, City, State 12345</p>
            </div>
            <Separator className="my-4" />
            <div className="flex gap-4">
              <Link href="/support/contact-page">
                <Button variant="outline">Contact Support</Button>
              </Link>
              <Link href="/support/terms-of-service-page">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Terms of Service
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
