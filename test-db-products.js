// Test script to check products in the database
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Initialize environment variables
dotenv.config();

// MongoDB connection URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/e-commerce';

// Product schema (simplified version of your actual schema)
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  images: [String],
  category: String,
  brand: String,
  stock: Number,
  sku: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
});

// Create model
const Product = mongoose.model('Product', productSchema);

async function checkProducts() {
  try {
    // Connect to MongoDB
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully!');
    
    // Count products
    const productCount = await Product.countDocuments();
    console.log(`Total products in database: ${productCount}`);
    
    // Get a few products
    if (productCount > 0) {
      console.log('\nListing most recent products:');
      const products = await Product.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name price sku brand stock isActive category createdAt')
        .lean();
      
      products.forEach((product, index) => {
        console.log(`\nProduct ${index + 1}:`);
        console.log(`- Name: ${product.name}`);
        console.log(`- SKU: ${product.sku}`);
        console.log(`- Price: ${product.price}`);
        console.log(`- Brand: ${product.brand}`);
        console.log(`- Stock: ${product.stock}`);
        console.log(`- Category: ${product.category}`);
        console.log(`- Active: ${product.isActive}`);
        console.log(`- Created: ${product.createdAt}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

checkProducts().catch(console.error);

// Export to make module valid
export {};
