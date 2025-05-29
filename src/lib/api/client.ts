// API configuration and utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  VERIFY_EMAIL: '/auth/verify-email',
  
  // User Management
  USER_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  CHANGE_PASSWORD: '/user/change-password',
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAILS: (id: string) => `/products/${id}`,
  SEARCH_PRODUCTS: '/products/search',
  FEATURED_PRODUCTS: '/products/featured',
  
  // Categories
  CATEGORIES: '/categories',
  CATEGORY_PRODUCTS: (slug: string) => `/categories/${slug}/products`,
  
  // Cart
  CART: '/cart',
  ADD_TO_CART: '/cart/add',
  UPDATE_CART_ITEM: (itemId: string) => `/cart/items/${itemId}`,
  REMOVE_FROM_CART: (itemId: string) => `/cart/items/${itemId}`,
  CLEAR_CART: '/cart/clear',
  
  // Orders
  ORDERS: '/orders',
  ORDER_DETAILS: (id: string) => `/orders/${id}`,
  CREATE_ORDER: '/orders',
  
  // Addresses
  ADDRESSES: '/addresses',
  ADD_ADDRESS: '/addresses',
  UPDATE_ADDRESS: (id: string) => `/addresses/${id}`,
  DELETE_ADDRESS: (id: string) => `/addresses/${id}`,
  
  // Wishlist
  WISHLIST: '/wishlist',
  ADD_TO_WISHLIST: '/wishlist/add',
  REMOVE_FROM_WISHLIST: (productId: string) => `/wishlist/${productId}`,
  
  // Admin endpoints
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
  ADMIN_CATEGORIES: '/admin/categories',
};

// HTTP methods
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiRequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

// Token management
export const tokenManager = {
  getAccessToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  },
  
  setAccessToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  },
  
  getRefreshToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  },
  
  setRefreshToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', token);
    }
  },
  
  clearTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
};

// Main API client
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      body,
      headers = {},
      requiresAuth = false
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    };

    // Add authorization header if required
    if (requiresAuth) {
      const token = tokenManager.getAccessToken();
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }
    }

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      ...(body && { body: JSON.stringify(body) })
    };

    try {
      const response = await fetch(url, requestOptions);
      
      // Handle token refresh for 401 errors
      if (response.status === 401 && requiresAuth) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the original request with new token
          requestHeaders.Authorization = `Bearer ${tokenManager.getAccessToken()}`;
          const retryResponse = await fetch(url, {
            ...requestOptions,
            headers: requestHeaders
          });
          return this.handleResponse<T>(retryResponse);
        } else {
          // Refresh failed, redirect to login
          tokenManager.clearTokens();
          window.location.href = '/account-login';
          throw new Error('Authentication failed');
        }
      }

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as unknown as T;
  }

  private async refreshAccessToken(): Promise<boolean> {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.REFRESH_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        tokenManager.setAccessToken(data.accessToken);
        if (data.refreshToken) {
          tokenManager.setRefreshToken(data.refreshToken);
        }
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    return false;
  }

  // Public methods for different HTTP verbs
  async get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', requiresAuth });
  }

  async post<T>(endpoint: string, body?: any, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, requiresAuth });
  }

  async put<T>(endpoint: string, body?: any, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, requiresAuth });
  }

  async patch<T>(endpoint: string, body?: any, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body, requiresAuth });
  }

  async delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', requiresAuth });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Utility functions for common API patterns
export const withErrorHandling = async <T>(
  apiCall: () => Promise<T>,
  errorMessage = 'An error occurred'
): Promise<{ data?: T; error?: string }> => {
  try {
    const data = await apiCall();
    return { data };
  } catch (error) {
    console.error(errorMessage, error);
    return { error: error instanceof Error ? error.message : errorMessage };
  }
};

// File upload utility
export const uploadFile = async (
  file: File,
  endpoint: string,
  requiresAuth = true
): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  if (requiresAuth) {
    const token = tokenManager.getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
};

// Query parameter builder
export const buildQueryParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export default apiClient;
