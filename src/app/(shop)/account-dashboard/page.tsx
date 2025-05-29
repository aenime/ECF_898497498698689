'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AccountLayout } from '@/components/account/account-layout';
import { User, Package, Heart, MapPin, Settings, CreditCard, Star, Clock } from 'lucide-react';

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  wishlistItems: number;
  loyaltyPoints: number;
  memberSince: string;
}

interface RecentOrder {
  id: string;
  date: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  total: number;
  items: number;
}

export default function AccountDashboardPage() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    memberLevel: 'Gold'
  });
  const [stats, setStats] = useState<UserStats>({
    totalOrders: 24,
    totalSpent: 2450.00,
    wishlistItems: 12,
    loyaltyPoints: 1250,
    memberSince: '2024-01-15'
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API call
    const mockOrders: RecentOrder[] = [
      {
        id: 'ORD-001',
        date: '2024-05-20',
        status: 'delivered',
        total: 89.99,
        items: 2
      },
      {
        id: 'ORD-002',
        date: '2024-05-18',
        status: 'shipped',
        total: 156.50,
        items: 3
      },
      {
        id: 'ORD-003',
        date: '2024-05-15',
        status: 'processing',
        total: 245.00,
        items: 1
      }
    ];

    setTimeout(() => {
      setRecentOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: RecentOrder['status']) => {
    const colors = {
      delivered: 'text-green-600 bg-green-100',
      shipped: 'text-blue-600 bg-blue-100',
      processing: 'text-yellow-600 bg-yellow-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return colors[status];
  };

  const getMemberLevelColor = (level: string) => {
    const colors = {
      Bronze: 'text-orange-600 bg-orange-100',
      Silver: 'text-gray-600 bg-gray-100',
      Gold: 'text-yellow-600 bg-yellow-100',
      Platinum: 'text-purple-600 bg-purple-100'
    };
    return colors[level as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <AccountLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getMemberLevelColor(user.memberLevel)}`}>
                  {user.memberLevel} Member
                </span>
                <span className="text-sm text-gray-500">
                  Since {new Date(stats.memberSince).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/account-profile"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Settings className="w-4 h-4" />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalSpent.toFixed(2)}</p>
            </div>
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.wishlistItems}</p>
            </div>
            <Heart className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Loyalty Points</p>
              <p className="text-2xl font-bold text-gray-900">{stats.loyaltyPoints}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link href="/account-orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{order.id}</h4>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(order.date).toLocaleDateString()} • {order.items} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${order.total}</p>
                      <Link 
                        href={`/order-details/${order.id}`} 
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No orders yet</p>
                <Link href="/category/all" className="text-blue-600 hover:text-blue-700 text-sm">
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/account-orders"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Package className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Order History</span>
              </Link>
              
              <Link
                href="/account-wishlist"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Heart className="w-8 h-8 text-red-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Wishlist</span>
              </Link>
              
              <Link
                href="/account-addresses"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MapPin className="w-8 h-8 text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Addresses</span>
              </Link>
              
              <Link
                href="/account-profile"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-8 h-8 text-gray-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Loyalty Program */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm">
        <div className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Loyalty Program</h3>
              <p className="opacity-90">You have {stats.loyaltyPoints} points available</p>
              <p className="text-sm opacity-75 mt-1">
                Earn 1 point for every $1 spent • Redeem 100 points for $5 off
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{stats.loyaltyPoints}</div>
              <div className="text-sm opacity-75">Points</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2" 
                style={{ width: `${Math.min((stats.loyaltyPoints % 1000) / 10, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm opacity-75 mt-2">
              {1000 - (stats.loyaltyPoints % 1000)} points to next reward level
            </p>
          </div>
        </div>
      </div>
      </div>
    </AccountLayout>
  );
}
