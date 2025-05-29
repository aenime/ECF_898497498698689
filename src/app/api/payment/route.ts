import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/database/connection';
import { Order } from '@/models/Order';

// Mock payment integration - in production, this would connect to a payment gateway
const processMockPayment = async (orderId: string, amount: number) => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate successful payment 90% of the time
  const isSuccessful = Math.random() < 0.9;
  
  return {
    success: isSuccessful,
    transactionId: isSuccessful ? `txn_${Date.now()}` : '',
    message: isSuccessful ? 'Payment processed successfully' : 'Payment failed',
  };
};

const paymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  amount: z.number().positive("Amount must be positive"),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet']),
  paymentDetails: z.object({
    cardNumber: z.string().optional(),
    cardholderName: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
    upiId: z.string().optional(),
    bankName: z.string().optional(),
    walletProvider: z.string().optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = paymentSchema.parse(body);
    
    // Connect to database
    await connectToDatabase();
    
    // Find the order
    const order = await Order.findById(validatedData.orderId);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Verify amount matches order total
    if (Math.abs(order.total - validatedData.amount) > 0.01) { // Allow small rounding differences
      return NextResponse.json(
        { success: false, error: 'Payment amount does not match order total' },
        { status: 400 }
      );
    }
    
    // Process payment (mock implementation)
    const paymentResult = await processMockPayment(
      validatedData.orderId,
      validatedData.amount
    );
    
    if (!paymentResult.success) {
      return NextResponse.json(
        { success: false, error: paymentResult.message },
        { status: 400 }
      );
    }
    
    // Update order payment status
    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    order.paymentId = paymentResult.transactionId;
    await order.save();
    
    return NextResponse.json({
      success: true,
      message: 'Payment successful',
      transaction: {
        id: paymentResult.transactionId,
        amount: validatedData.amount,
        currency: 'INR',
        timestamp: new Date(),
      },
      redirectUrl: `/order-success?orderId=${validatedData.orderId}`,
    });
    
  } catch (error: any) {
    console.error('Payment processing error:', error);
    
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
      { success: false, error: error.message || 'Payment processing failed' },
      { status: 500 }
    );
  }
}
