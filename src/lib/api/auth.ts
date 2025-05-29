import { apiClient, API_ENDPOINTS, withErrorHandling } from './client';

// Authentication interfaces
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    isEmailVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

// Authentication service
export const authService = {
  // Login user
  login: async (credentials: LoginCredentials) => {
    return withErrorHandling(
      () => apiClient.post<AuthResponse>(API_ENDPOINTS.LOGIN, credentials),
      'Login failed'
    );
  },

  // Register new user
  register: async (userData: RegisterData) => {
    return withErrorHandling(
      () => apiClient.post<AuthResponse>(API_ENDPOINTS.REGISTER, userData),
      'Registration failed'
    );
  },

  // Logout user
  logout: async () => {
    return withErrorHandling(
      () => apiClient.post(API_ENDPOINTS.LOGOUT, {}, true),
      'Logout failed'
    );
  },

  // Verify email
  verifyEmail: async (token: string) => {
    return withErrorHandling(
      () => apiClient.post(API_ENDPOINTS.VERIFY_EMAIL, { token }),
      'Email verification failed'
    );
  },

  // Get current user profile
  getCurrentUser: async () => {
    return withErrorHandling(
      () => apiClient.get(API_ENDPOINTS.USER_PROFILE, true),
      'Failed to get user profile'
    );
  },

  // Update user profile
  updateProfile: async (profileData: Partial<RegisterData>) => {
    return withErrorHandling(
      () => apiClient.put(API_ENDPOINTS.UPDATE_PROFILE, profileData, true),
      'Failed to update profile'
    );
  },

  // Change password
  changePassword: async (passwordData: PasswordChangeData) => {
    return withErrorHandling(
      () => apiClient.post(API_ENDPOINTS.CHANGE_PASSWORD, passwordData, true),
      'Failed to change password'
    );
  }
};

// User management hooks and utilities
export const useAuth = () => {
  // This would be implemented with a context provider in a real app
  const isAuthenticated = () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('accessToken');
    }
    return false;
  };

  const getUser = () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  };

  const setUser = (user: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  };

  const clearAuth = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  };

  return {
    isAuthenticated: isAuthenticated(),
    user: getUser(),
    setUser,
    clearAuth
  };
};

export default authService;
