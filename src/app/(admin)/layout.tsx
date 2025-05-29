'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { AdminAuthProvider, useAdminAuth, withAdminAuth } from '@/components/admin/AdminAuthProvider';

interface AdminLayoutProps {
  children: ReactNode;
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const { user, logout } = useAdminAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin-dashboard" className="text-xl font-bold text-gray-900">
                Admin Panel
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name}
              </span>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                View Store
              </Link>
              <button 
                onClick={logout}
                className="text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              <Link
                href="/admin-dashboard"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
              >
                Dashboard
              </Link>
              <Link
                href="/admin-products"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
              >
                Products
              </Link>
              <Link
                href="/admin-import"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
              >
                Import CSV
              </Link>
              <Link
                href="/admin-categories"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
              >
                Categories
              </Link>
              <Link
                href="/admin-orders"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
              >
                Orders
              </Link>
              <Link
                href="/admin-customers"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
              >
                Customers
              </Link>
              <Link
                href="/admin-settings"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
              >
                Settings
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

const ProtectedAdminLayout = withAdminAuth(AdminLayoutContent);

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminAuthProvider>
      <ProtectedAdminLayout>{children}</ProtectedAdminLayout>
    </AdminAuthProvider>
  );
}
