'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { Product } from '@/types';
import { toast } from 'sonner';

interface AddToCartModalProps {
  product: Product;
  children: React.ReactNode;
}

export function AddToCartModal({ product, children }: AddToCartModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    // Validate selections if product has sizes/colors
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    // Add to cart
    addItem(product, quantity, selectedSize, selectedColor);
    
    // Show success message
    toast.success(`${product.name} added to cart!`, {
      description: `Quantity: ${quantity}${selectedSize ? `, Size: ${selectedSize}` : ''}${selectedColor ? `, Color: ${selectedColor}` : ''}`,
    });

    // Reset and close
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
    setIsOpen(false);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Cart</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={product.images[0] || '/api/placeholder/80/80'}
                alt={product.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold text-gray-900">
                  ₹{(product.originalPrice || product.price).toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                )}
              </div>
              {product.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                  {product.reviewCount && (
                    <span className="text-sm text-gray-500">({product.reviewCount})</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                      selectedColor === color
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-lg font-medium min-w-[3ch] text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
                className="h-8 w-8 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-500 ml-2">
                {product.stock} available
              </span>
            </div>
          </div>

          {/* Stock Status */}
          {product.stock <= 5 && product.stock > 0 && (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              Only {product.stock} left in stock
            </Badge>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
