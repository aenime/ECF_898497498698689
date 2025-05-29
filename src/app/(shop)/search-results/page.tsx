'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Grid, List, Search, Filter, Heart } from 'lucide-react'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  brand: string
  sizes: string[]
  colors: string[]
  inStock: boolean
  rating: number
  reviewCount: number
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [priceRange, setPriceRange] = useState('')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchSearchResults()
  }, [query, sortBy, priceRange, selectedBrands])

  const fetchSearchResults = async () => {
    try {
      setLoading(true)
      // Mock API call - replace with actual API endpoint
      const mockProducts: Product[] = [
        {
          _id: '1',
          name: 'Cotton T-Shirt',
          description: 'Comfortable cotton t-shirt perfect for casual wear',
          price: 599,
          originalPrice: 799,
          images: ['/api/placeholder/300/400'],
          category: 'clothing',
          brand: 'Brand A',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Red', 'Blue', 'White'],
          inStock: true,
          rating: 4.2,
          reviewCount: 156
        },
        {
          _id: '2',
          name: 'Denim Jeans',
          description: 'Classic blue denim jeans with perfect fit',
          price: 1299,
          originalPrice: 1599,
          images: ['/api/placeholder/300/400'],
          category: 'clothing',
          brand: 'Brand B',
          sizes: ['28', '30', '32', '34'],
          colors: ['Blue', 'Black'],
          inStock: true,
          rating: 4.5,
          reviewCount: 203
        }
      ]
      
      // Filter products based on search query
      const filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase())
      )
      
      setProducts(filteredProducts)
    } catch (error) {
      console.error('Error fetching search results:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  const clearFilters = () => {
    setPriceRange('')
    setSelectedBrands([])
    setSortBy('relevance')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Search Results for &quot;{query}&quot;
        </h1>
        <p className="text-gray-600">
          {products.length} {products.length === 1 ? 'result' : 'results'} found
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={!priceRange && selectedBrands.length === 0}
          >
            Clear Filters
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Customer Rating</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-64 space-y-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Price Range</h3>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-500">Under ₹500</SelectItem>
                    <SelectItem value="500-1000">₹500 - ₹1000</SelectItem>
                    <SelectItem value="1000-2000">₹1000 - ₹2000</SelectItem>
                    <SelectItem value="2000+">₹2000+</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Brands</h3>
                <div className="space-y-2">
                  {['Brand A', 'Brand B', 'Brand C'].map(brand => (
                    <label key={brand} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="rounded"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products Grid/List */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {products.map(product => (
                <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className={viewMode === 'list' ? 'flex' : ''}>
                    <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : 'relative'}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className={`w-full ${viewMode === 'list' ? 'h-48' : 'h-64'} object-cover`}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 bg-white"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <h3 className="font-semibold mb-1 line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold">₹{product.price}</span>
                        {product.originalPrice && (
                          <>
                            <span className="text-sm line-through text-gray-500">
                              ₹{product.originalPrice}
                            </span>
                            <Badge variant="destructive" className="text-xs">
                              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </Badge>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${
                                i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          ({product.reviewCount})
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.sizes.slice(0, 3).map(size => (
                          <Badge key={size} variant="outline" className="text-xs">
                            {size}
                          </Badge>
                        ))}
                        {product.sizes.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{product.sizes.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <Button className="w-full" disabled={!product.inStock}>
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}