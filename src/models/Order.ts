import mongoose from 'mongoose';
import { Order, Address, OrderItem } from '@/types';

const addressSchema = new mongoose.Schema<Address>({
  name: {
    type: String,
    required: true,
  },
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: 'India',
  },
  phone: {
    type: String,
  },
});

const orderItemSchema = new mongoose.Schema<OrderItem>({
  productId: {
    type: String,
    required: true,
  },
  product: {
    type: Object,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  size: {
    type: String,
  },
  color: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
});

const orderSchema = new mongoose.Schema<Order>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    customerInfo: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    shippingAddress: {
      type: addressSchema,
      required: true,
    },
    billingAddress: {
      type: addressSchema,
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    shipping: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    trackingNumber: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

const OrderModel = mongoose.models.Order || mongoose.model<Order>('Order', orderSchema);

export default OrderModel;
export { OrderModel as Order };
