import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/connection';
import { Product } from '@/models/Product';
import { z } from 'zod';

const addToCartSchema = z.object({
  productId: z.string(),
  size: z.string().optional(),
  color: z.string().optional(),
  quantity: z.number().min(1).default(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = addToCartSchema.parse(body);

    await connectToDatabase();
    
    // Verify product exists and is available
    const product = await Product.findById(validatedData.productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!product.inStock) {
      return NextResponse.json(
        { error: 'Product is out of stock' },
        { status: 400 }
      );
    }

    // Check if requested size is available
    if (validatedData.size && product.sizes && !product.sizes.includes(validatedData.size)) {
      return NextResponse.json(
        { error: 'Selected size is not available' },
        { status: 400 }
      );
    }

    // Check if requested color is available
    if (validatedData.color && product.colors && !product.colors.includes(validatedData.color)) {
      return NextResponse.json(
        { error: 'Selected color is not available' },
        { status: 400 }
      );
    }

    // Return success with product details for cart
    return NextResponse.json({
      success: true,
      item: {
        productId: product._id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.images[0],
        size: validatedData.size,
        color: validatedData.color,
        quantity: validatedData.quantity,
        maxQuantity: product.stock
      }
    });

  } catch (error) {
    console.error('Cart add error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
