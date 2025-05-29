import mongoose from 'mongoose';
import { User, Address } from '@/types';

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

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Don't include password in query results by default
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'customer'],
      default: 'customer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    addresses: [addressSchema],
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) return next();
  
  try {
    const bcrypt = require('bcryptjs');
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to check if password is correct
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<User>('User', userSchema);
