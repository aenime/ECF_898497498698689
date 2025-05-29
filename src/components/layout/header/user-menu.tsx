'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Heart, 
  Settings, 
  LogOut,
  ChevronDown 
} from 'lucide-react';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  // This will be enhanced with actual auth state later
  const isLoggedIn = true; // Set to true to show account features

  if (isLoggedIn) {
    return (
      <div className="relative">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1"
        >
          <User className="h-4 w-4" />
          Account
          <ChevronDown className="h-3 w-3" />
        </Button>
        
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-20">
              <div className="py-1">
                <Link 
                  href="/account-dashboard" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                <Link 
                  href="/account-profile" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <Link 
                  href="/account-orders" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Orders
                </Link>
                <Link 
                  href="/account-addresses" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Addresses
                </Link>
                <Link 
                  href="/account-wishlist" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </Link>
                <hr className="my-1" />
                <button 
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setIsOpen(false);
                    // Add logout logic here
                    console.log('Logout');
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Link href="/auth/login">
        <Button variant="ghost" size="sm">
          Login
        </Button>
      </Link>
      <Link href="/auth/register">
        <Button size="sm">
          Sign Up
        </Button>
      </Link>
    </div>
  );
}
