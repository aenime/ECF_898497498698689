// src/scripts/create-test-user.js
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection URL - replace with your actual connection string
const MONGODB_URI = 'mongodb://localhost:27017/ecom-nextjs';

async function seedUser() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    // Define a simple user schema
    const UserSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      isActive: Boolean,
      createdAt: Date,
      updatedAt: Date
    });

    // Check if User model already exists
    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'admin@example.com' });
    
    if (existingUser) {
      console.log('Admin user already exists');
      console.log('Updating password...');
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.updateOne(
        { email: 'admin@example.com' },
        { 
          $set: { 
            password: hashedPassword,
            role: 'admin',
            isActive: true 
          } 
        }
      );
      console.log('Password updated successfully!');
    } else {
      // Create new admin user
      console.log('Creating admin user...');
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const newUser = new User({
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await newUser.save();
      console.log('Admin user created successfully!');
    }
    
    // Show all users
    const users = await User.find({});
    console.log('Current users:', users.map(u => ({ name: u.name, email: u.email, role: u.role })));
    
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from database');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
seedUser();
