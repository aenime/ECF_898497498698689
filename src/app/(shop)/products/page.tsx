'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddToCartModal } from '@/components/ui/add-to-cart-modal';
import { Heart, ShoppingCart, Search, Grid, List, Star } from 'lucide-react';
import { Product } from '@/types';

interface ProductFilters {
  category: string;
  priceRange: [number, number];
  brand: string;
  rating: number;
  inStock: boolean;
}

export default function ProductCatalog() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams?.get('category') || '',
    priceRange: [0, 10000],
    brand: '',
    rating: 0,
    inStock: true
  });

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products-search?limit=50');
      const data = await response.json();
      
      if (data.success && data.data?.data) {
        // API returns data in data.data.data array
        setProducts(data.data.data);
      } else {
        console.log('No products found in response:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesBrand = !filters.brand || product.brand === filters.brand;
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const matchesRating = !product.rating || product.rating >= filters.rating;
      const matchesStock = !filters.inStock || product.stock > 0;

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesRating && matchesStock;
    });
  }, [products, searchTerm, filters]);

  // Sort logic
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  const categories = Array.from(new Set(products.map(p => p.category)));
  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <div className="aspect-square bg-gray-200 overflow-hidden">
          <Image
            src={product.images[0] || '/api/placeholder/300/300'}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {product.discount && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            {product.discount}% OFF
          </Badge>
        )}
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
        </button>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <Badge variant="outline" className="bg-white">Out of Stock</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          {product.brand && <Badge variant="outline" className="text-xs">{product.brand}</Badge>}
        </div>
        <Link href={`/product-details-${product._id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-orange-600 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
        
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating!) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({product.reviewCount || 0})</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>

        <AddToCartModal product={product}>
          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </AddToCartModal>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Catalog</h1>
        <p className="text-gray-600">Discover amazing products at great prices</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 items-center">
          <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.brand} onValueChange={(value) => setFilters({...filters, brand: value})}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Brands</SelectItem>
              {brands.map(brand => (
                <SelectItem key={brand} value={brand!}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {sortedProducts.length} of {products.length} products
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {/* Products Grid */}
      {sortedProducts.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {sortedProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mb-4">
            <Search className="w-16 h-16 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
          <Button onClick={() => {
            setSearchTerm('');
            setFilters({
              category: '',
              priceRange: [0, 10000],
              brand: '',
              rating: 0,
              inStock: true
            });
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Load More Button */}
      {sortedProducts.length > 0 && sortedProducts.length >= 12 && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      )}
    </div>
  );
}
