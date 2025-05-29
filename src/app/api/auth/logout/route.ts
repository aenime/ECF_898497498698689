import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Create a response that clears the auth cookies
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    // Clear the authentication cookies
    response.cookies.set({
      name: 'token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // expire immediately
    });
    
    response.cookies.set({
      name: 'refreshToken',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // expire immediately
    });
    
    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { success: false, error: error.message || 'Logout failed' },
      { status: 500 }
    );
  }
}
