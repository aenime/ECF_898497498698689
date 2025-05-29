import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/connection';
import User from '@/models/User';
import { authenticateUser, AuthenticatedRequest } from '@/lib/auth/middleware';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const req = request as AuthenticatedRequest;
    
    // This endpoint requires authentication
    const authError = await authenticateUser(req);
    if (authError) return authError;
    
    const productId = params.id;
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Remove product from user's wishlist
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { $pull: { wishlist: productId } },
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
      message: 'Product removed from wishlist'
    });
    
  } catch (error: any) {
    console.error('Wishlist DELETE error:', error);
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}
