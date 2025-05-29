'use client';

import { useState } from 'react';
import { useCartStore } from '@/stores/cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Minus, 
  Plus, 
  X, 
  ShoppingBag, 
  Tag, 
  Truck, 
  Shield, 
  Heart,
  Star
} from 'lucide-react';

export default function CartPage() {
  const { 
    items, 
    selectedItems,
    removeItem, 
    updateQuantity, 
    clearCart, 
    getTotalItems,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    subtotal,
    tax,
    shipping,
    total,
    promoCode,
    promoDiscount,
    applyPromoCode,
    removePromoCode
  } = useCartStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    
    setPromoLoading(true);
    setPromoError('');
    
    const success = await applyPromoCode(promoInput.trim());
    
    if (success) {
      setPromoInput('');
    } else {
      setPromoError('Invalid or expired promo code');
    }
    
    setPromoLoading(false);
  };

  const isAllSelected = selectedItems.length === items.length && items.length > 0;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link href="/products">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1">{getTotalItems()} items in your cart</p>
        </div>
        <Button variant="outline" onClick={clearCart} className="text-red-600 border-red-600 hover:bg-red-50">
          Clear Cart
        </Button>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          {/* Select All */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(checked: boolean) => {
                      if (checked) {
                        selectAllItems();
                      } else {
                        deselectAllItems();
                      }
                    }}
                  />
                  <span className="font-medium">
                    {selectedItems.length > 0 
                      ? `${selectedItems.length}/${items.length} items selected`
                      : 'Select all items'
                    }
                  </span>
                </div>
                {selectedItems.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      selectedItems.forEach(item => {
                        removeItem(item.productId, item.size, item.color);
                      });
                    }}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Remove Selected
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cart Items List */}
          <div className="space-y-4">
            {items.map((item) => {
              const isSelected = selectedItems.some(
                selectedItem => 
                  selectedItem.productId === item.productId &&
                  selectedItem.size === item.size &&
                  selectedItem.color === item.color
              );
              
              const discountPrice = item.product.price;
              const originalPrice = item.product.originalPrice;
              const hasDiscount = originalPrice && originalPrice > discountPrice;

              return (
                <Card 
                  key={`${item.productId}-${item.size}-${item.color}`} 
                  className={`transition-all duration-200 ${isSelected ? 'ring-2 ring-orange-500' : ''}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Selection Checkbox */}
                      <div className="pt-1">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleItemSelection(item.productId, item.size, item.color)}
                        />
                      </div>

                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0 relative">
                        <Image
                          src={item.product.images[0] || '/placeholder-product.jpg'}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 hover:text-orange-600">
                              <Link href={`/products/${item.productId}`}>
                                {item.product.name}
                              </Link>
                            </h3>
                            
                            <div className="mt-1 space-y-1">
                              <p className="text-sm text-gray-500">Brand: {item.product.brand}</p>
                              {item.size && (
                                <p className="text-sm text-gray-500">Size: {item.size}</p>
                              )}
                              {item.color && (
                                <p className="text-sm text-gray-500">Color: {item.color}</p>
                              )}
                            </div>

                            {/* Rating */}
                            {item.product.rating && (
                              <div className="flex items-center mt-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.floor(item.product.rating || 0) 
                                          ? 'text-yellow-400 fill-current' 
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600 ml-2">
                                  ({item.product.reviewCount || 0})
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.productId, item.size, item.color)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Remove item"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Quantity and Price */}
                        <div className="mt-4 flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size, item.color)}
                                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 text-lg font-medium min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size, item.color)}
                                className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={item.quantity >= (item.product.stock || 10)}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            {/* Wishlist */}
                            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                              <Heart className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              ₹{(discountPrice * item.quantity).toLocaleString()}
                            </div>
                            {hasDiscount && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{(originalPrice! * item.quantity).toLocaleString()}
                                </span>
                                <Badge variant="destructive" className="text-xs">
                                  {Math.round(((originalPrice! - discountPrice) / originalPrice!) * 100)}% OFF
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="mt-3 flex items-center text-sm text-green-600">
                          <Truck className="w-4 h-4 mr-2" />
                          <span>Free delivery by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Promo Code */}
              <div className="mb-6 border-b pb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Apply Promo Code
                </h3>
                
                {promoCode ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3">
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-green-700 font-medium">{promoCode.code}</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          setPromoError('');
                        }}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleApplyPromo}
                        disabled={promoLoading || !promoInput.trim()}
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        {promoLoading ? 'Applying...' : 'Apply'}
                      </Button>
                    </div>
                    {promoError && (
                      <p className="text-red-500 text-sm">{promoError}</p>
                    )}
                    <div className="text-xs text-gray-500">
                      Try: SAVE10, FLAT100, BUY2GET1
                    </div>
                  </div>
                )}
              </div>
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo Discount</span>
                    <span>-₹{promoDiscount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span className="font-medium">₹{Math.round(tax).toLocaleString()}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{Math.round(total).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href="/checkout" className="block">
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600" 
                    size="lg"
                    disabled={selectedItems.length === 0}
                  >
                    Proceed to Checkout ({selectedItems.length} items)
                  </Button>
                </Link>
                <Link href="/products" className="block">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Security Badges */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center text-sm text-gray-500">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>100% Secure Checkout</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-200"></div>
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900">Sample Product {i}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-gray-900 font-bold">₹999</span>
                  <span className="text-gray-500 line-through text-sm">₹1299</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
