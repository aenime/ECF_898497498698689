import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/connection';
import { Product } from '@/models/Product';
import { z } from 'zod';

// Schema for product creation validation
const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  originalPrice: z.number().positive("Original price must be positive").optional(),
  discount: z.number().min(0).max(100).optional(),
  category: z.string(),
  subcategory: z.string().optional(),
  brand: z.string().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  stock: z.number().int().min(0),
  sku: z.string(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  weight: z.number().optional(),
  dimensions: z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
  }).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = productSchema.parse(body);
    
    // Connect to database
    await connectToDatabase();
    
    // Create new product
    const product = await Product.create(validatedData);
    
    return NextResponse.json({
      success: true,
      product
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Product creation error:', error);
    
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
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Duplicate product information', 
          field: Object.keys(error.keyValue)[0] 
        },
        { status: 400 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
