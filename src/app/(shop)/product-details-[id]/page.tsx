'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart';
import { Product } from '@/types';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    // This will be replaced with actual API call to fetch product
    setTimeout(() => {
      // Mock product data
      const mockProduct: Product = {
        _id: productId,
        name: 'Sample Product',
        description: 'This is a sample product description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        price: 1999,
        originalPrice: 2999,
        discount: 33,
        category: 'Fashion',
        subcategory: 'T-Shirts',
        brand: 'Sample Brand',
        images: ['/api/placeholder/600/600'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Red', 'Blue', 'Green'],
        stock: 10,
        sku: `SKU-${productId}`,
        isActive: true,
        isFeatured: true,
        rating: 4.5,
        reviewCount: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProduct(mockProduct);
      if (mockProduct.sizes && mockProduct.sizes.length > 0) {
        setSelectedSize(mockProduct.sizes[0]);
      }
      if (mockProduct.colors && mockProduct.colors.length > 0) {
        setSelectedColor(mockProduct.colors[0]);
      }
      setLoading(false);
    }, 1000);
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity, selectedSize, selectedColor);
      // Could show a toast notification here
      alert('Product added to cart!');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-500">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Product Image</span>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-500">{product.brand}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
                <span className="text-green-600 font-medium">
                  {product.discount}% off
                </span>
              </>
            )}
          </div>

          {product.rating && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating!)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-500">{product.description}</p>
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Size</h3>
              <div className="flex space-x-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                +
              </Button>
            </div>
          </div>

          {/* Stock Status */}
          <div>
            {product.stock > 0 ? (
              <p className="text-green-600">In Stock ({product.stock} available)</p>
            ) : (
              <p className="text-red-600">Out of Stock</p>
            )}
          </div>

          {/* Add to Cart Button */}
          <div className="space-y-3">
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
