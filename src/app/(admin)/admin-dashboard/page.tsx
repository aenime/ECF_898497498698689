'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  totalCategories: number;
  activeProducts: number;
  activeCategories: number;
  recentProducts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalCategories: 0,
    activeProducts: 0,
    activeCategories: 0,
    recentProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        console.error('Failed to fetch stats:', data.error);
        // Fallback to default values if API fails
        setStats({
          totalOrders: 0,
          totalRevenue: 0,
          totalProducts: 0,
          totalCustomers: 0,
          totalCategories: 0,
          activeProducts: 0,
          activeCategories: 0,
          recentProducts: 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Fallback to default values if API fails
      setStats({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalCustomers: 0,
        totalCategories: 0,
        activeProducts: 0,
        activeCategories: 0,
        recentProducts: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
          <p className="text-blue-600 text-sm">{stats.activeProducts} active</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Categories</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalCategories}</p>
          <p className="text-green-600 text-sm">{stats.activeCategories} active</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
          <p className="text-green-600 text-sm">From {stats.totalOrders} orders</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Recent Activity</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.recentProducts}</p>
          <p className="text-blue-600 text-sm">Products added recently</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="w-full" variant="outline">
            Add New Product
          </Button>
          <Button className="w-full" variant="outline">
            View Recent Orders
          </Button>
          <Button className="w-full" variant="outline">
            Manage Categories
          </Button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { id: 'ORD-001', customer: 'John Doe', amount: 2499, status: 'Delivered', date: '2024-01-15' },
                { id: 'ORD-002', customer: 'Jane Smith', amount: 1899, status: 'Shipped', date: '2024-01-14' },
                { id: 'ORD-003', customer: 'Mike Johnson', amount: 3299, status: 'Processing', date: '2024-01-13' },
              ].map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
