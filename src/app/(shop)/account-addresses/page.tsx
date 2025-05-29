'use client'

import { useState, useEffect } from 'react'
import { AccountLayout } from '@/components/account/account-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  MapPin, 
  Edit, 
  Trash2, 
  Home, 
  Briefcase,
  MapPinIcon
} from 'lucide-react'

interface Address {
  _id: string
  type: 'home' | 'work' | 'other'
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  landmark?: string
  isDefault: boolean
}

const mockAddresses: Address[] = [
  {
    _id: '1',
    type: 'home',
    fullName: 'John Doe',
    phone: '+91 9876543210',
    addressLine1: '123 Main Street, Apartment 4B',
    addressLine2: 'Near Central Mall',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    landmark: 'Opposite ABC Bank',
    isDefault: true
  },
  {
    _id: '2',
    type: 'work',
    fullName: 'John Doe',
    phone: '+91 9876543210',
    addressLine1: '456 Business Park, Tower C, 5th Floor',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400070',
    landmark: 'Near Metro Station',
    isDefault: false
  }
]

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState({
    type: 'home' as Address['type'],
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    isDefault: false
  })

  const resetForm = () => {
    setFormData({
      type: 'home',
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      isDefault: false
    })
    setEditingAddress(null)
    setShowAddForm(false)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingAddress) {
      // Update existing address
      setAddresses(prev => prev.map(addr => 
        addr._id === editingAddress._id 
          ? { ...addr, ...formData }
          : addr
      ))
    } else {
      // Add new address
      const newAddress: Address = {
        _id: Date.now().toString(),
        ...formData
      }
      
      // If this is the default address, unset all others
      if (formData.isDefault) {
        setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })))
      }
      
      setAddresses(prev => [...prev, newAddress])
    }
    
    resetForm()
  }

  const handleEdit = (address: Address) => {
    setFormData({
      type: address.type,
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      landmark: address.landmark || '',
      isDefault: address.isDefault
    })
    setEditingAddress(address)
    setShowAddForm(true)
  }

  const handleDelete = async (addressId: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(prev => prev.filter(addr => addr._id !== addressId))
    }
  }

  const handleSetDefault = async (addressId: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr._id === addressId
    })))
  }

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="h-5 w-5 text-blue-600" />
      case 'work':
        return <Briefcase className="h-5 w-5 text-green-600" />
      default:
        return <MapPinIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const getAddressTypeColor = (type: string) => {
    switch (type) {
      case 'home':
        return 'bg-blue-100 text-blue-800'
      case 'work':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AccountLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Saved Addresses</h1>
            <p className="text-gray-600 mt-2">Manage your delivery addresses</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Address
          </Button>
        </div>

        {/* Addresses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card key={address._id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getAddressTypeIcon(address.type)}
                    <Badge className={getAddressTypeColor(address.type)}>
                      {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                    </Badge>
                    {address.isDefault && (
                      <Badge variant="outline" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(address._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-medium text-gray-900">{address.fullName}</div>
                  <div className="text-sm text-gray-600">{address.phone}</div>
                  <div className="text-sm text-gray-700">
                    {address.addressLine1}
                    {address.addressLine2 && <><br />{address.addressLine2}</>}
                    <br />
                    {address.city}, {address.state} - {address.pincode}
                    {address.landmark && <><br />Landmark: {address.landmark}</>}
                  </div>
                </div>
                {!address.isDefault && (
                  <div className="mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetDefault(address._id)}
                    >
                      Set as Default
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Address Modal */}
        {showAddForm && (
          <Dialog open={showAddForm} onOpenChange={() => resetForm()}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Address Type */}
                <div>
                  <Label htmlFor="type">Address Type</Label>
                  <div className="flex gap-2 mt-2">
                    {['home', 'work', 'other'].map((type) => (
                      <Button
                        key={type}
                        type="button"
                        size="sm"
                        variant={formData.type === type ? 'default' : 'outline'}
                        onClick={() => handleInputChange('type', type)}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Address Lines */}
                <div>
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    value={formData.addressLine1}
                    onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                    placeholder="House/Flat/Building number and street"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    value={formData.addressLine2}
                    onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                    placeholder="Area, Colony, Street (Optional)"
                  />
                </div>

                {/* City, State, Pincode */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                  />
                </div>

                {/* Landmark */}
                <div>
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    value={formData.landmark}
                    onChange={(e) => handleInputChange('landmark', e.target.value)}
                    placeholder="Nearby landmark (Optional)"
                  />
                </div>

                {/* Default Address */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isDefault">Set as default address</Label>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingAddress ? 'Update Address' : 'Add Address'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Empty State */}
        {addresses.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
              <p className="text-gray-600 mb-4">Add your first delivery address to get started</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AccountLayout>
  )
}
