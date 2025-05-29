import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database/connection';
import Category from '@/models/Category';
import { ApiResponse, Category as CategoryType } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const query: any = {};
    
    if (parentId) {
      query.parentId = parentId;
    }
    
    if (!includeInactive) {
      query.isActive = true;
    }

    const categories = await Category.find(query)
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    const response: ApiResponse<CategoryType[]> = {
      success: true,
      data: categories as CategoryType[],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Categories API error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch categories',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    
    if (!body.name) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Category name is required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Generate slug if not provided
    if (!body.slug) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const category = new Category(body);
    await category.save();

    const response: ApiResponse<CategoryType> = {
      success: true,
      data: category.toObject() as CategoryType,
      message: 'Category created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Create category error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create category',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
