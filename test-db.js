// Test direct database connection
const mongoose = require('mongoose');
require('dotenv').config();

// Set up better error handling for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

async function testDbConnection() {
  console.log('Starting database connection test...');
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    console.log(`Connecting to: ${MONGODB_URI}`);
    
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Define a simple product schema
    const productSchema = new mongoose.Schema({
      name: String,
      price: Number,
      description: String,
      category: String,
      brand: String,
      sku: {
        type: String,
        unique: true
      },
      images: [String],
      stock: Number,
      isActive: Boolean
    });
    
    // Create model
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
    
    // Create a test product
    const testProduct = new Product({
      name: 'Test Product from Script',
      price: 999,
      description: 'This is a test product created directly with MongoDB driver',
      category: 'Test',
      brand: 'Test Brand',
      sku: `TEST-${Date.now()}`,
      images: ['https://example.com/test.jpg'],
      stock: 10,
      isActive: true
    });
    
    // Save the product
    const savedProduct = await testProduct.save();
    console.log('Successfully created test product:', savedProduct);
    
    // Find all products
    const allProducts = await Product.find();
    console.log(`Total products in database: ${allProducts.length}`);
    
  } catch (error) {
    console.error('Database test error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testDbConnection();
