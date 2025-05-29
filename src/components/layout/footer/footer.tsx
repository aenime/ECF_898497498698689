import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">FlipKart</h3>
            <p className="text-sm text-gray-500 mb-4">
              Your one-stop destination for all your shopping needs. Quality products at affordable prices.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-gray-900">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297L6.688 14.134c.581.652 1.419 1.061 2.348 1.061c1.734 0 3.13-1.396 3.13-3.13c0-.929-.409-1.767-1.061-2.348l1.557-1.557c.807.88 1.297 2.031 1.297 3.328C13.959 14.222 11.512 16.669 8.449 16.988z"/>
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">QUICK LINKS</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/support/about-page" className="text-gray-500 hover:text-gray-900">About Us</Link></li>
              <li><Link href="/support/contact-page" className="text-gray-500 hover:text-gray-900">Contact Us</Link></li>
              <li><Link href="/support/faq-page" className="text-gray-500 hover:text-gray-900">FAQ</Link></li>
              <li><Link href="/support/order-tracking-page" className="text-gray-500 hover:text-gray-900">Track Your Order</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-semibold text-sm mb-4">CUSTOMER CARE</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/support/return-policy-page" className="text-gray-500 hover:text-gray-900">Return Policy</Link></li>
              <li><Link href="/support/shipping-policy-page" className="text-gray-500 hover:text-gray-900">Shipping Policy</Link></li>
              <li><Link href="/support/terms-of-service-page" className="text-gray-500 hover:text-gray-900">Terms of Service</Link></li>
              <li><Link href="/support/privacy-policy-page" className="text-gray-500 hover:text-gray-900">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-sm mb-4">STAY UPDATED</h3>
            <p className="text-sm text-gray-600 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="w-full px-3 py-2 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2025 FlipKart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
