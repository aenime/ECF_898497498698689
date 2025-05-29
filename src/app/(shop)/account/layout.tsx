'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { User, Package, MapPin, Heart, Settings, LogOut } from 'lucide-react';

interface AccountLayoutProps {
  children: ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: '/account-dashboard',
      label: 'Dashboard',
      icon: User,
      description: 'Account overview'
    },
    {
      href: '/account-profile', 
      label: 'Profile',
      icon: User,
      description: 'Personal information'
    },
    {
      href: '/account-orders',
      label: 'Orders',
      icon: Package,
      description: 'Order history'
    },
    {
      href: '/account-addresses',
      label: 'Addresses',
      icon: MapPin,
      description: 'Delivery addresses'
    },
    {
      href: '/account-wishlist',
      label: 'Wishlist',
      icon: Heart,
      description: 'Saved items'
    }
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">My Account</h2>
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center p-3 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-orange-50 text-orange-600 border border-orange-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  );
                })}
                <div className="border-t pt-4 mt-4">
                  <button className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full text-left transition-colors">
                    <LogOut className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-medium">Logout</div>
                      <div className="text-xs text-gray-500">Sign out of account</div>
                    </div>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
