import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, AuthenticatedRequest, getCurrentUser } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const req = request as AuthenticatedRequest;
    
    // Check if the user is authenticated
    const authError = await authenticateUser(req);
    if (authError) return authError;
    
    // Get user data from database
    const user = await getCurrentUser(req);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user
    });
    
  } catch (error: unknown) {
    console.error('User verification error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
