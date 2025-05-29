'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '@/stores/cart';
import { Button } from '@/components/ui/button';
import { SearchBar } from './search-bar';
import { CartIcon } from './cart-icon';
import { UserMenu } from './user-menu';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Men', href: '/category/men' },
    { name: 'Women', href: '/category/women' },
    { name: 'Kids', href: '/category/kids' },
    { name: 'Electronics', href: '/category/electronics' },
    { name: 'Home & Living', href: '/category/home-living' },
  ];

  return (
    <header className="header-sticky w-full border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-orange-500"></div>
            <span className="text-xl font-bold">FlipKart</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4">
            <SearchBar />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/account-wishlist" className="hidden md:block">
              <Button variant="ghost" size="sm">
                Wishlist
              </Button>
            </Link>
            
            {/* Admin Link */}
            <Link href="/admin-login" className="hidden md:block">
              <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                Admin
              </Button>
            </Link>
            
            <Link href="/shopping-cart">
              <CartIcon count={itemCount} />
            </Link>

            <UserMenu />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/account-wishlist"
                className="px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Wishlist
              </Link>
              <Link
                href="/admin-login"
                className="px-2 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Login
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
