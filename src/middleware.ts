import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define paths that require admin authentication
  const isAdminPath = path.startsWith('/admin') || 
                     path.startsWith('/api/admin');

  // Define paths that require user authentication  
  const isUserPath = path.startsWith('/account') || 
                    path.startsWith('/api/user') || 
                    path.startsWith('/checkout');

  // Skip middleware for non-protected paths
  if (!isAdminPath && !isUserPath) {
    return NextResponse.next();
  }

  // Handle admin paths
  if (isAdminPath) {
    // Skip login page
    if (path === '/admin-login') {
      return NextResponse.next();
    }

    try {
      // Check for admin token in Authorization header or cookies
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
      
      // If no auth header, check cookies (for client-side requests)
      if (!token) {
        // For server-side middleware, we'll let the client-side auth handle it
        return NextResponse.next();
      }

      // Verify admin token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        email: string;
        role: string;
      };

      if (decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin-login', request.url));
      }

    } catch (jwtError) {
      // Token is invalid, redirect to admin login
      console.log('Invalid admin token:', jwtError);
      const loginUrl = new URL('/admin-login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle user paths - similar logic for user authentication
  if (isUserPath) {
    // Add user authentication logic here if needed
    // For now, just pass through
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure which paths this middleware applies to
export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/checkout/:path*',
    '/api/admin/:path*',
    '/api/user/:path*',
    '/api/products-:path*/:path*',
  ],
};
