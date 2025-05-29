import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database/connection';
import Product from '@/models/Product';
import { ApiResponse, Product as ProductType } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const product = await Product.findById(params.id).lean();

    if (!product) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Product not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<ProductType> = {
      success: true,
      data: product as ProductType,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get product error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch product',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    
    const product = await Product.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    ).lean();

    if (!product) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Product not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<ProductType> = {
      success: true,
      data: product as ProductType,
      message: 'Product updated successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Update product error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update product',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Product not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<null> = {
      success: true,
      message: 'Product deleted successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Delete product error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete product',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
