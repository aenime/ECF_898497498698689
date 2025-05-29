// Create admin user script for e-com nextjs
import mongoose from 'mongoose';
import { connectToDatabase } from '../lib/database/connection';
import User from '../models/User';

async function createAdmin() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Connected to database');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
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
    }
    
    // Display all users
    const users = await User.find({});
    console.log('All users:', users.map(u => ({ 
      name: u.name, 
      email: u.email, 
      role: u.role 
    })));
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

// Run the function
createAdmin();
