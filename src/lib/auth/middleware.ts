import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/database/connection';
import User from '@/models/User';
import { User as UserType } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_not_for_production';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    role: string;
  };
}

export async function authenticateUser(
  req: AuthenticatedRequest
): Promise<NextResponse | null> {
  try {
    // Get token from authorization header or cookie
    const authHeader = req.headers.get('authorization');
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
      req.user = decoded;
      return null; // No error, continue to next handler
    } catch {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'Authentication error' },
      { status: 500 }
    );
  }
}

export async function isAdmin(
  req: AuthenticatedRequest
): Promise<NextResponse | null> {
  // First check authentication
  const authResponse = await authenticateUser(req);
  if (authResponse) return authResponse;

  try {
    // If user is not admin, deny access
    if (req.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // User is admin, continue
    return null;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Authorization error' },
      { status: 500 }
    );
  }
}

export async function getCurrentUser(req: AuthenticatedRequest) {
  // First check authentication
  const authResponse = await authenticateUser(req);
  if (authResponse) return null;

  try {
    await connectToDatabase();
    const userDoc = await User.findById(req.user?.id).lean();
    
    if (!userDoc) {
      return null;
    }
    
    // Convert Mongoose document to plain object and type as UserType
    const user = userDoc as unknown as UserType;
    
    // Create a new object without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    // Keep the error log since it's useful for debugging
    if (error instanceof Error) {
      console.error('Get current user error:', error.message);
    } else {
      console.error('Get current user error:', error);
    }
    return null;
  }
}
