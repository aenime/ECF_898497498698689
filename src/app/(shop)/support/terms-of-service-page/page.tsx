"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, FileText, Shield, AlertTriangle, Users } from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
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
            <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
            <p className="text-gray-600">Last updated: December 2024</p>
          </div>
        </div>

        {/* Terms Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Effective Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              These Terms of Service ("Terms") were last updated on December 1, 2024, and are effective immediately for all users of our e-commerce platform.
            </p>
          </CardContent>
        </Card>

        {/* Section 1: Acceptance of Terms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              By accessing and using our e-commerce platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p className="text-gray-700">
              These Terms apply to all visitors, users, and others who access or use our service.
            </p>
          </CardContent>
        </Card>

        {/* Section 2: Use License */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. Use License</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Permission is granted to temporarily download one copy of the materials on our platform for personal, non-commercial transitory viewing only.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">This license shall automatically terminate if you violate any of these restrictions:</h4>
              <ul className="list-disc pl-6 text-blue-800 space-y-1">
                <li>Modify or copy the materials</li>
                <li>Use the materials for commercial purposes or public display</li>
                <li>Attempt to reverse engineer any software contained on our platform</li>
                <li>Remove any copyright or proprietary notations from the materials</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Account Terms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              3. Account Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Your Responsibilities:</h4>
                <ul className="list-disc pl-6 text-green-800 space-y-1">
                  <li>Maintain account security</li>
                  <li>Keep information updated</li>
                  <li>Use strong passwords</li>
                  <li>Notify us of unauthorized access</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2">Prohibited Activities:</h4>
                <ul className="list-disc pl-6 text-red-800 space-y-1">
                  <li>Share account credentials</li>
                  <li>Create multiple accounts</li>
                  <li>Use automated systems</li>
                  <li>Violate any laws or regulations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Products and Services */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. Products and Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Certain products or services may be available exclusively online through our platform. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-yellow-800">
                    <strong>Important:</strong> We reserve the right to limit the quantities of any products or services and to discontinue any product at any time.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Pricing and Payment */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. Pricing and Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>All prices are subject to change without notice</li>
              <li>We accept major credit cards and PayPal</li>
              <li>Payment must be received before order processing</li>
              <li>Additional charges may apply for expedited shipping</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 6: Privacy Policy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              6. Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service.
            </p>
            <Link href="/support/privacy-policy-page">
              <Button variant="outline">View Privacy Policy</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Section 7: Limitation of Liability */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>7. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our platform.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 italic">
                Some jurisdictions do not allow the exclusion of implied warranties or limitation of liability for consequential or incidental damages. These limitations may not apply to you.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 8: Termination */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>8. Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever.
            </p>
            <p className="text-gray-700">
              Upon termination, your right to use the service will cease immediately. If you wish to terminate your account, you may simply discontinue using the service.
            </p>
          </CardContent>
        </Card>

        {/* Section 9: Changes to Terms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>9. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
            <p className="text-gray-700">
              What constitutes a material change will be determined at our sole discretion. By continuing to access or use our service after any revisions become effective, you agree to be bound by the revised terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> legal@example.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Address:</strong> 123 Legal Street, City, State 12345</p>
            </div>
            <Separator className="my-4" />
            <div className="flex gap-4">
              <Link href="/support/contact-page">
                <Button variant="outline">Contact Support</Button>
              </Link>
              <Link href="/support/privacy-policy-page">
                <Button variant="outline">Privacy Policy</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
