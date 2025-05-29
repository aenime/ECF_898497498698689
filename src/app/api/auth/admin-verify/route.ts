import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/database/connection';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
    };

    await dbConnect();

    // Find user in database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 401 }
      );
    }

    // Check if user is still admin and active
    if (user.role !== 'admin' || !user.isActive) {
      return NextResponse.json(
        { message: 'Access denied' },
        { status: 403 }
      );
    }

    const userInfo = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json({
      message: 'Token valid',
      user: userInfo,
    });

  } catch (error) {
    console.error('Admin token verification error:', error);
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 401 }
    );
  }
}
