'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Edit, Ban, CheckCircle } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'blocked' | 'inactive';
  lastOrderDate: string;
  loyaltyPoints: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1 234 567 8900',
        joinDate: '2024-01-15',
        totalOrders: 12,
        totalSpent: 2450.00,
        status: 'active',
        lastOrderDate: '2024-05-20',
        loyaltyPoints: 245
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+1 234 567 8901',
        joinDate: '2024-02-10',
        totalOrders: 8,
        totalSpent: 1890.00,
        status: 'active',
        lastOrderDate: '2024-05-18',
        loyaltyPoints: 189
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.j@email.com',
        phone: '+1 234 567 8902',
        joinDate: '2024-03-05',
        totalOrders: 3,
        totalSpent: 450.00,
        status: 'inactive',
        lastOrderDate: '2024-04-10',
        loyaltyPoints: 45
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah.w@email.com',
        phone: '+1 234 567 8903',
        joinDate: '2024-01-20',
        totalOrders: 25,
        totalSpent: 5670.00,
        status: 'active',
        lastOrderDate: '2024-05-25',
        loyaltyPoints: 567
      },
      {
        id: '5',
        name: 'Robert Brown',
        email: 'robert.b@email.com',
        phone: '+1 234 567 8904',
        joinDate: '2024-04-01',
        totalOrders: 0,
        totalSpent: 0,
        status: 'blocked',
        lastOrderDate: 'Never',
        loyaltyPoints: 0
      }
    ];

    setTimeout(() => {
      setCustomers(mockCustomers);
      setFilteredCustomers(mockCustomers);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and search customers
  useEffect(() => {
    let filtered = customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort customers
    filtered = filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'joinDate':
          aValue = new Date(a.joinDate).getTime();
          bValue = new Date(b.joinDate).getTime();
          break;
        case 'totalSpent':
          aValue = a.totalSpent;
          bValue = b.totalSpent;
          break;
        case 'totalOrders':
          aValue = a.totalOrders;
          bValue = b.totalOrders;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleStatusChange = (customerId: string, newStatus: Customer['status']) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === customerId 
          ? { ...customer, status: newStatus }
          : customer
      )
    );
  };

  const getStatusBadge = (status: Customer['status']) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      blocked: 'bg-red-100 text-red-800'
    };
    return badges[status];
  };

  const exportCustomers = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Join Date', 'Total Orders', 'Total Spent', 'Status'],
      ...filteredCustomers.map(customer => [
        customer.name,
        customer.email,
        customer.phone,
        customer.joinDate,
        customer.totalOrders.toString(),
        customer.totalSpent.toFixed(2),
        customer.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'customers.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage your customers and their information</p>
        </div>
        <button
          onClick={exportCustomers}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="joinDate">Sort by Join Date</option>
              <option value="totalSpent">Sort by Total Spent</option>
              <option value="totalOrders">Sort by Total Orders</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
          <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Active Customers</h3>
          <p className="text-2xl font-bold text-green-600">
            {customers.filter(c => c.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-blue-600">
            ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Avg Order Value</h3>
          <p className="text-2xl font-bold text-purple-600">
            ${(customers.reduce((sum, c) => sum + c.totalSpent, 0) / 
               customers.reduce((sum, c) => sum + c.totalOrders, 0) || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Joined {new Date(customer.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.totalOrders} orders</div>
                    <div className="text-sm text-gray-500">
                      Last: {customer.lastOrderDate === 'Never' ? 'Never' : 
                             new Date(customer.lastOrderDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${customer.totalSpent.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {customer.loyaltyPoints} points
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowCustomerModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {customer.status === 'active' && (
                        <button
                          onClick={() => handleStatusChange(customer.id, 'blocked')}
                          className="text-red-600 hover:text-red-900"
                          title="Block Customer"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                      {customer.status === 'blocked' && (
                        <button
                          onClick={() => handleStatusChange(customer.id, 'active')}
                          className="text-green-600 hover:text-green-900"
                          title="Activate Customer"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showCustomerModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Customer Details</h2>
                <button
                  onClick={() => setShowCustomerModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Join Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Orders</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.totalOrders}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Spent</label>
                  <p className="mt-1 text-sm text-gray-900">${selectedCustomer.totalSpent.toFixed(2)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loyalty Points</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCustomer.loyaltyPoints}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedCustomer.status)}`}>
                    {selectedCustomer.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
