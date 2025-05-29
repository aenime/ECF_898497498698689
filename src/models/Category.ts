import mongoose from 'mongoose';
import { Category } from '@/types';

const categorySchema = new mongoose.Schema<Category>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
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

categorySchema.index({ slug: 1 });
categorySchema.index({ parentId: 1, isActive: 1 });

const CategoryModel = mongoose.models.Category || mongoose.model<Category>('Category', categorySchema);

export default CategoryModel;
export { CategoryModel as Category };
