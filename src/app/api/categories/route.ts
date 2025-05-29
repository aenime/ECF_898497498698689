import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/connection';
import { Category } from '@/models/Category';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');
    const isActive = searchParams.has('isActive') 
      ? searchParams.get('isActive') === 'true' 
      : undefined;
    
    // Build query based on parameters
    const query: any = {};
    
    if (parentId) {
      query.parentId = parentId === 'null' ? null : parentId;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive;
    }
    
    // Fetch categories
    const categories = await Category.find(query).sort({ sortOrder: 1 }).lean();
    
    return NextResponse.json({
      success: true,
      categories
    });
    
  } catch (error: any) {
    console.error('Categories GET error:', error);
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Connect to database
    await connectToDatabase();
    
    // Check if category with same name or slug exists
    const existingCategory = await Category.findOne({
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
    
    // Create new category
    const category = await Category.create({
      ...body,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
      isActive: body.isActive !== undefined ? body.isActive : true,
      sortOrder: body.sortOrder || 0,
    });
    
    return NextResponse.json({
      success: true,
      category
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Category POST error:', error);
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}
