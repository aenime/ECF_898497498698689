import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database/connection';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { ApiResponse } from '@/types';

interface AdminStats {
  totalProducts: number;
  totalCategories: number;
  activeProducts: number;
  inactiveProducts: number;
  activeCategories: number;
  inactiveCategories: number;
  totalRevenue: number;
  recentProductsCount: number;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get product statistics
    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      totalCategories,
      activeCategories,
      inactiveCategories,
      recentProducts
    ] = await Promise.all([
      Product.countDocuments({}),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: false }),
      Category.countDocuments({}),
      Category.countDocuments({ isActive: true }),
      Category.countDocuments({ isActive: false }),
      Product.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
      })
    ]);

    // Calculate total revenue (mock for now, would come from orders)
    const totalRevenue = 0; // This would be calculated from actual orders

    const stats: AdminStats = {
      totalProducts,
      totalCategories,
      activeProducts,
      inactiveProducts,
      activeCategories,
      inactiveCategories,
      totalRevenue,
      recentProductsCount: recentProducts
    };

    const response: ApiResponse<AdminStats> = {
      success: true,
      data: stats,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Admin stats API error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch admin statistics',
    };
    return NextResponse.json(response, { status: 500 });
  }
}