import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/connection';
import User from '@/models/User';
import { Product } from '@/models/Product';
import { authenticateUser, AuthenticatedRequest } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const req = request as AuthenticatedRequest;
    
    // This endpoint requires authentication
    const authError = await authenticateUser(req);
    if (authError) return authError;
    
    // Connect to database
    await connectToDatabase();
    
    // Get user with wishlist populated
    const user = await User.findById(req.user?.id).lean();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Populate product details for wishlist items if they exist
    let wishlistItems = [];
    
    if (user.wishlist && user.wishlist.length > 0) {
      // Get product details for wishlist items
      wishlistItems = await Product.find({
        _id: { $in: user.wishlist }
      }).lean();
    }
    
    return NextResponse.json({
      success: true,
      wishlist: wishlistItems
    });
    
  } catch (error: any) {
    console.error('Wishlist GET error:', error);
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const req = request as AuthenticatedRequest;
    
    // This endpoint requires authentication
    const authError = await authenticateUser(req);
    if (authError) return authError;
    
    // Parse request body
    const body = await request.json();
    
    if (!body.productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Verify product exists
    const product = await Product.findById(body.productId);
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Add product to user's wishlist
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { $addToSet: { wishlist: body.productId } }, // Use addToSet to avoid duplicates
      { new: true }
    ).lean();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Product added to wishlist'
    });
    
  } catch (error: any) {
    console.error('Wishlist POST error:', error);
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}
