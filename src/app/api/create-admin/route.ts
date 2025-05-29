import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database/connection';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Admin user already exists',
        admin: {
          name: existingAdmin.name,
          email: existingAdmin.email,
          role: existingAdmin.role
        }
      });
    }
    
    // Create new admin (password will be hashed automatically by the model)
    const newAdmin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
    });
    
    await newAdmin.save();
    console.log('Admin user created successfully!');
    
    // Get all users for verification
    const users = await User.find({}).select('name email role');
    
    return NextResponse.json({ 
      message: 'Admin user created successfully!',
      admin: {
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      },
      allUsers: users
    });
    
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ 
      message: 'Error creating admin user',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
