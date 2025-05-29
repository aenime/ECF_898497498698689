import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/connection';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { authenticateUser, AuthenticatedRequest } from '@/lib/auth/middleware';
import { z } from 'zod';

const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    size: z.string().optional(),
    color: z.string().optional(),
  })),
  shippingAddress: z.object({
    name: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    country: z.string(),
    phone: z.string(),
  }),
  paymentMethod: z.enum(['cod', 'online', 'wallet']),
  promoCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const req = request as AuthenticatedRequest;
    
    // Optionally require authentication for checkout
    // Uncomment if you want to restrict checkout to authenticated users only
    // const authError = await authenticateUser(req);
    // if (authError) return authError;
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = checkoutSchema.parse(body);
    
    // Connect to database
    await connectToDatabase();
    
    // Generate order number
    const orderNumber = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
    
    // Fetch and validate products, calculate totals
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of validatedData.items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product with ID ${item.productId} not found` },
          { status: 404 }
        );
      }
      
      // Check if sufficient stock is available
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
          },
          { status: 400 }
        );
      }
      
      // Calculate item total
      const itemPrice = product.price;
      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;
      
      // Add to order items
      orderItems.push({
        product: item.productId,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        total: itemTotal,
      });
      
      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }
    
    // Calculate taxes, shipping and total
    const tax = subtotal * 0.18; // 18% tax
    const shipping = subtotal > 1000 ? 0 : 100; // Free shipping over ₹1000
    const discount = 0;
    
    // Apply promo code if any
    // Add promo code logic here
    
    const total = subtotal + tax + shipping - discount;
    
    // Create order
    const order = await Order.create({
      orderNumber,
      userId: req.user?.id, // Will be undefined for guest checkout
      customerInfo: {
        name: validatedData.shippingAddress.name,
        email: body.email || 'guest@example.com',
        phone: validatedData.shippingAddress.phone,
      },
      shippingAddress: validatedData.shippingAddress,
      billingAddress: body.billingAddress || validatedData.shippingAddress,
      items: orderItems,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: validatedData.paymentMethod,
      notes: body.notes,
    });
    
    return NextResponse.json({
      success: true,
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
      },
      redirectUrl: `/order-success?orderId=${order._id}`,
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Checkout error:', error);
    
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
    
    return NextResponse.json(
      { success: false, error: error.message || 'Checkout failed' },
      { status: 500 }
    );
  }
}
