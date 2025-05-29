import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database/connection';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user and include password field for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { message: 'Account is deactivated' },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Return user info (without password)
    const userInfo = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json({
      message: 'Admin login successful',
      token,
      user: userInfo,
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
