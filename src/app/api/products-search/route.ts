import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database/connection';
import Product from '@/models/Product';
import { ApiResponse, PaginatedResponse, Product as ProductType, SearchFilters } from '@/types';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Search and filters
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const brand = searchParams.get('brand');
    const inStock = searchParams.get('inStock');
    const featured = searchParams.get('featured');

    // Sort
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // Build query
    const query: any = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = parseFloat(priceMin);
      if (priceMax) query.price.$lte = parseFloat(priceMax);
    }

    if (brand) {
      query.brand = new RegExp(brand, 'i');
    }

    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    const response: ApiResponse<PaginatedResponse<ProductType>> = {
      success: true,
      data: {
        data: products as ProductType[],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Products API error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch products',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.price || !body.category) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Name, price, and category are required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Generate SKU if not provided
    if (!body.sku) {
      body.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    const product = new Product(body);
    await product.save();

    const response: ApiResponse<ProductType> = {
      success: true,
      data: product.toObject() as ProductType,
      message: 'Product created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create product',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
