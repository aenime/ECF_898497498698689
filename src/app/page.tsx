'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShopLayout } from '@/components/layout/shop-layout';

interface CategoryType {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export default function HomePage() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories-list');
      const data = await response.json();
      
      if (data.success && data.data) {
        // Filter only active categories and limit to 6 for homepage
        const activeCategories = data.data
          .filter((category: CategoryType) => category.isActive)
          .slice(0, 6);
        setCategories(activeCategories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShopLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to FlipKart
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover amazing products at unbeatable prices. Your one-stop destination for all your shopping needs.
            </p>
            <Button size="lg" variant="secondary">
              Start Shopping
            </Button>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/category-${category.slug}`}
                    className="group text-center hover:transform hover:scale-105 transition-transform"
                  >
                    <div className="w-full h-32 bg-primary/10 rounded-lg mb-4 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="text-2xl font-semibold text-primary">
                        {category.name[0]}
                      </span>
                    </div>
                    <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <Link href="/search-results?featured=true">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No featured products available at the moment.</p>
              <Link href="/search-results">
                <Button className="mt-4">Browse All Products</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose FlipKart?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
                <p className="text-gray-500">Carefully curated products from trusted brands and sellers.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-500">Quick and reliable delivery to your doorstep.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
                <p className="text-gray-500">Safe and secure payment options for your peace of mind.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ShopLayout>
  );
}
