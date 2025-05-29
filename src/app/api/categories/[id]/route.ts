import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/connection';
import { Category } from '@/models/Category';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params since it's a Promise in Next.js 15
    const { id } = await params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID format' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Find category
    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      category
    });
    
  } catch (error: any) {
    console.error('Category GET error:', error);
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params since it's a Promise in Next.js 15
    const { id } = await params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID format' },
        { status: 400 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Connect to database
    await connectToDatabase();
    
    // Check if updating to an existing name or slug
    if (body.name || body.slug) {
      const existingCategory = await Category.findOne({
        _id: { $ne: id },
        $or: [
          { name: body.name },
          { slug: body.slug }
        ]
      });
      
      if (existingCategory) {
        return NextResponse.json(
          { success: false, error: 'Category with this name or slug already exists' },
          { status: 400 }
        );
      }
    }
    
    // Update category
    const category = await Category.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      category
    });
    
  } catch (error: any) {
    console.error('Category PUT error:', error);
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params since it's a Promise in Next.js 15
    const { id } = await params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID format' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Check if category has child categories
    const childCategories = await Category.countDocuments({ parentId: id });
    
    if (childCategories > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete category with child categories' },
        { status: 400 }
      );
    }
    
    // Check if category has products
    const Product = mongoose.models.Product;
    if (Product) {
      const productsCount = await Product.countDocuments({ category: id });
      
      if (productsCount > 0) {
        return NextResponse.json(
          { success: false, error: 'Cannot delete category with assigned products' },
          { status: 400 }
        );
      }
    }
    
    // Delete category
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
    
  } catch (error: any) {
    console.error('Category DELETE error:', error);
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}
