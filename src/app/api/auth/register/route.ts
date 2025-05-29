import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/connection';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_not_for_production';
const JWT_EXPIRES_IN = '7d';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = registerSchema.parse(body);
    
    // Connect to database
    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Create new user (password will be hashed by pre-save hook)
    const user = await User.create({
      ...validatedData,
      role: 'customer',
      isActive: true
    });
    
    // Create JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Create refresh token
    const refreshToken = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    
    // Set cookies
    const response = NextResponse.json({
      success: true,
      user: userResponse,
      token,
      refreshToken
    }, { status: 201 });
    
    // Set HTTP-only cookies for better security
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
    
    response.cookies.set({
      name: 'refreshToken',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
    
    return response;
    
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
