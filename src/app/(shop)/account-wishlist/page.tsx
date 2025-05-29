'use client'

import { useState, useEffect } from 'react'
import { AccountLayout } from '@/components/account/account-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  ShoppingCart, 
  Search, 
  Star, 
  Filter,
  Grid,
  List,
  Share2,
  Trash2
} from 'lucide-react'

interface WishlistItem {
  _id: string
  productId: string
  title: string
  brand: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviews: number
  image: string
  category: string
  size?: string
  color?: string
  inStock: boolean
  addedAt: string
}

const mockWishlistItems: WishlistItem[] = [
  {
    _id: '1',
    productId: 'prod-1',
    title: 'Premium Cotton T-Shirt',
    brand: 'StyleCraft',
    price: 799,
    originalPrice: 1299,
    discount: 38,
    rating: 4.3,
    reviews: 1247,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    category: 'T-Shirts',
    size: 'L',
    color: 'Navy Blue',
    inStock: true,
    addedAt: '2024-01-15T10:30:00Z'
  },
  {
    _id: '2',
    productId: 'prod-2',
    title: 'Denim Jacket',
    brand: 'UrbanFit',
    price: 2499,
    originalPrice: 3999,
    discount: 37,
    rating: 4.5,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400',
    category: 'Jackets',
    size: 'M',
    color: 'Dark Blue',
    inStock: true,
    addedAt: '2024-01-14T15:45:00Z'
  },
  {
    _id: '3',
    productId: 'prod-3',
    title: 'Casual Sneakers',
    brand: 'WalkMax',
    price: 1899,
    originalPrice: 2999,
    discount: 36,
    rating: 4.2,
    reviews: 456,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    category: 'Footwear',
    size: '9',
    color: 'White',
    inStock: false,
    addedAt: '2024-01-13T09:20:00Z'
  },
  {
    _id: '4',
    productId: 'prod-4',
    title: 'Formal Shirt',
    brand: 'ClassicWear',
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    rating: 4.1,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
    category: 'Shirts',
    size: 'L',
    color: 'Light Blue',
    inStock: true,
    addedAt: '2024-01-12T14:10:00Z'
  }
]

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(mockWishlistItems)
  const [filteredItems, setFilteredItems] = useState<WishlistItem[]>(mockWishlistItems)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter and sort items
  useEffect(() => {
    let filtered = wishlistItems

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter)
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'discount':
        filtered.sort((a, b) => b.discount - a.discount)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
    }

    setFilteredItems(filtered)
  }, [wishlistItems, searchTerm, categoryFilter, sortBy])

  const handleRemoveFromWishlist = async (itemId: string) => {
    if (confirm('Remove this item from your wishlist?')) {
      setWishlistItems(prev => prev.filter(item => item._id !== itemId))
    }
  }

  const handleAddToCart = async (item: WishlistItem) => {
    // Add to cart logic here
    console.log('Adding to cart:', item)
    // You might also want to remove from wishlist after adding to cart
    // handleRemoveFromWishlist(item._id)
  }

  const handleMoveAllToCart = async () => {
    const inStockItems = filteredItems.filter(item => item.inStock)
    if (inStockItems.length === 0) {
      alert('No items in stock to move to cart')
      return
    }
    
    if (confirm(`Move ${inStockItems.length} items to cart?`)) {
      // Add all in-stock items to cart
      console.log('Moving to cart:', inStockItems)
      // Remove from wishlist
      setWishlistItems(prev => prev.filter(item => !inStockItems.some(stockItem => stockItem._id === item._id)))
    }
  }

  const handleShareWishlist = () => {
    // Share wishlist logic
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist',
        text: `Check out my wishlist with ${wishlistItems.length} amazing items!`,
        url: window.location.href
      })
    } else {
      // Fallback to copy link
      navigator.clipboard.writeText(window.location.href)
      alert('Wishlist link copied to clipboard!')
    }
  }

  const categories = ['all', ...Array.from(new Set(wishlistItems.map(item => item.category)))]

  return (
    <AccountLayout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">{wishlistItems.length} items saved</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleShareWishlist}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            {filteredItems.filter(item => item.inStock).length > 0 && (
              <Button 
                onClick={handleMoveAllToCart}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Move All to Cart
              </Button>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search wishlist items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="lg:w-48">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="lg:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount">Highest Discount</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-md">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wishlist Items */}
        {filteredItems.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
          }>
            {filteredItems.map((item) => (
              <Card key={item._id} className={viewMode === 'list' ? 'flex' : ''}>
                <div className={viewMode === 'list' ? 'flex w-full' : ''}>
                  {/* Product Image */}
                  <div className={viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-square'}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className={`w-full h-full object-cover ${viewMode === 'grid' ? 'rounded-t-lg' : 'rounded-l-lg'}`}
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
                        <span className="text-white font-medium">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 line-clamp-2">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.brand}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveFromWishlist(item._id)}
                          className="text-red-600 hover:text-red-700 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 line-through">₹{item.originalPrice.toLocaleString()}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.discount}% OFF
                        </Badge>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{item.rating}</span>
                        <span className="text-sm text-gray-500">({item.reviews})</span>
                      </div>

                      {/* Size and Color */}
                      {(item.size || item.color) && (
                        <div className="flex gap-4 text-sm text-gray-600">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      )}

                      {/* Actions */}
                      <div className={`flex gap-2 pt-2 ${viewMode === 'list' ? 'flex-col sm:flex-row' : ''}`}>
                        <Button
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.inStock}
                          className="flex-1 flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </div>

                      {/* Added Date */}
                      <div className="text-xs text-gray-500 pt-1">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || categoryFilter !== 'all' ? 'No items found' : 'Your wishlist is empty'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Save items you love to buy them later'
                }
              </p>
              {(!searchTerm && categoryFilter === 'all') && (
                <Button onClick={() => window.location.href = '/shop'}>
                  Continue Shopping
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AccountLayout>
  )
}
