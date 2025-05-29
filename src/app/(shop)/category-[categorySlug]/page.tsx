"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Filter, Grid, List } from "lucide-react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  inStock: boolean;
  rating?: number;
  reviews?: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [categorySlug]);

  const fetchCategoryAndProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch category details
      const categoryResponse = await fetch(`/api/categories`);
      const categoriesData = await categoryResponse.json();
      const foundCategory = categoriesData.find((cat: Category) => cat.slug === categorySlug);
      setCategory(foundCategory || null);

      // Fetch products for this category
      const productsResponse = await fetch(`/api/products-search?category=${categorySlug}`);
      const productsData = await productsResponse.json();
      setProducts(productsData.products || []);
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await fetch('/api/cart-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading category...</div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-8">The category you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
            {category.description && (
              <p className="text-gray-600 max-w-2xl mx-auto">{category.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{products.length} products</span>
            <div className="flex border border-gray-300 rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">No products found in this category.</p>
            <Link href="/">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {products.map((product) => (
              <Card key={product._id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {viewMode === 'grid' ? (
                    <>
                      {/* Product Image */}
                      <div className="aspect-square relative overflow-hidden bg-gray-100">
                        <img
                          src={product.images[0] || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <Badge className="absolute top-2 left-2 bg-red-500">
                            Sale
                          </Badge>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-4">
                        <Link href={`/product-details-${product._id}`}>
                          <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {product.rating && (
                          <div className="flex items-center gap-1 mb-3">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">
                              {product.rating} ({product.reviews || 0} reviews)
                            </span>
                          </div>
                        )}

                        <Button
                          onClick={() => handleAddToCart(product._id)}
                          disabled={!product.inStock}
                          className="w-full"
                          size="sm"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </div>
                    </>
                  ) : (
                    /* List View */
                    <div className="flex gap-4 p-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={product.images[0] || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/product-details-${product._id}`}>
                          <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <Button
                            onClick={() => handleAddToCart(product._id)}
                            disabled={!product.inStock}
                            size="sm"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}