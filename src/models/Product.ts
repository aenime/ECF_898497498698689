import mongoose from 'mongoose';
import { Product } from '@/types';

const productSchema = new mongoose.Schema<Product>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
    },
    brand: {
      type: String,
    },
    images: [{
      type: String,
      required: true,
    }],
    sizes: [{
      type: String,
    }],
    colors: [{
      type: String,
    }],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    tags: [{
      type: String,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ sku: 1 });

const ProductModel = mongoose.models.Product || mongoose.model<Product>('Product', productSchema);

export default ProductModel;
export { ProductModel as Product };
