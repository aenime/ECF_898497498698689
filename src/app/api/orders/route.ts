import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/connection';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { z } from 'zod';

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    size: z.string().optional(),
    color: z.string().optional(),
    price: z.number()
  })),
  shippingAddress: z.object({
    fullName: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string().default('India')
  }),
  paymentMethod: z.enum(['cod', 'online', 'wallet']),
  customerInfo: z.object({
    email: z.string().email(),
    phone: z.string(),
    firstName: z.string(),
    lastName: z.string()
  })
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    await connectToDatabase();

    // Calculate total amount and verify products
    let totalAmount = 0;
    const orderItems = [];

    for (const item of validatedData.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      if (!product.inStock || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const itemPrice = product.discountPrice || product.price;
      totalAmount += itemPrice * item.quantity;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        productImage: product.images[0],
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: itemPrice,
        subtotal: itemPrice * item.quantity
      });
    }

    // Create order
    const order = new Order({
      orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      items: orderItems,
      totalAmount,
      shippingAddress: validatedData.shippingAddress,
      paymentMethod: validatedData.paymentMethod,
      customerInfo: validatedData.customerInfo,
      status: 'pending',
      paymentStatus: validatedData.paymentMethod === 'cod' ? 'pending' : 'pending'
    });

    const savedOrder = await order.save();

    // Update product stock
    for (const item of validatedData.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: savedOrder._id,
        orderNumber: savedOrder.orderNumber,
        totalAmount: savedOrder.totalAmount,
        status: savedOrder.status,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    });

  } catch (error) {
    console.error('Order creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid order data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    await connectToDatabase();

    let query = {};
    if (orderId) {
      query = { _id: orderId };
    } else if (email) {
      query = { 'customerInfo.email': email };
    } else if (phone) {
      query = { 'customerInfo.phone': phone };
    } else {
      return NextResponse.json(
        { error: 'Order ID, email, or phone is required' },
        { status: 400 }
      );
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
