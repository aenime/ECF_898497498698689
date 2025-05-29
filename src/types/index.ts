export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  subcategory?: string;
  brand?: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  stock: number;
  sku: string;
  tags?: string[];
  isActive: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
  name?: string; // For easier access in components
  image?: string; // Primary image URL
  discountPrice?: number; // Sale price if on discount
  maxQuantity?: number; // Stock limit
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: Address;
  billingAddress?: Address;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paymentId?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
  total: number;
}

export interface Address {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;  // Optional in responses, required for auth
  phone?: string;
  role: 'admin' | 'customer';
  isActive: boolean;
  addresses?: Address[];
  wishlist?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export interface Settings {
  _id: string;
  siteName: string;
  siteDescription: string;
  logo?: string;
  favicon?: string;
  primaryColor: string;
  secondaryColor: string;
  currency: string;
  taxRate: number;
  shippingRate: number;
  freeShippingThreshold: number;
  contactEmail: string;
  contactPhone: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  analytics: {
    googleAnalyticsId?: string;
  };
  payment: {
    upiGateway: {
      enabled: boolean;
      merchantId?: string;
      apiKey?: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Theme {
  _id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    muted: string;
    accent: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SearchFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  brand?: string;
  size?: string;
  color?: string;
  rating?: number;
  inStock?: boolean;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
  label: string;
}
