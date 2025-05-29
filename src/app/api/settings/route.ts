import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/connection';
import mongoose from 'mongoose';
import { z } from 'zod';

// Define a Settings schema and model if it doesn't exist in the models folder
// Define this inline since it's a simple model
let Settings: any;

try {
  Settings = mongoose.model('Settings');
} catch {
  const settingsSchema = new mongoose.Schema({
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    group: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  }, { timestamps: true });

  Settings = mongoose.model('Settings', settingsSchema);
}

// Validation schema
const settingsSchema = z.object({
  key: z.string().trim().min(1, "Key is required"),
  value: z.any(),
  group: z.string().trim().min(1, "Group is required"),
  isPublic: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const group = searchParams.get('group');
    const key = searchParams.get('key');
    const publicOnly = searchParams.get('publicOnly') === 'true';
    
    // Connect to database
    await connectToDatabase();
    
    // Build query
    const query: any = {};
    
    if (group) {
      query.group = group;
    }
    
    if (key) {
      query.key = key;
    }
    
    if (publicOnly) {
      query.isPublic = true;
    }
    
    // Get settings
    const settings = await Settings.find(query).lean();
    
    // Format as an object if requested
    if (searchParams.get('format') === 'object') {
      const settingsObject: Record<string, any> = {};
      
      for (const setting of settings) {
        if (!settingsObject[setting.group]) {
          settingsObject[setting.group] = {};
        }
        settingsObject[setting.group][setting.key] = setting.value;
      }
      
      return NextResponse.json({
        success: true,
        settings: settingsObject
      });
    }
    
    // Return as array
    return NextResponse.json({
      success: true,
      settings
    });
    
  } catch (error: any) {
    console.error('Settings GET error:', error);
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validatedData = settingsSchema.parse(body);
    
    // Connect to database
    await connectToDatabase();
    
    // Check if setting exists
    const existingSetting = await Settings.findOne({
      key: validatedData.key,
      group: validatedData.group,
    });
    
    if (existingSetting) {
      // Update existing setting
      existingSetting.value = validatedData.value;
      existingSetting.isPublic = validatedData.isPublic;
      await existingSetting.save();
      
      return NextResponse.json({
        success: true,
        setting: existingSetting
      });
    }
    
    // Create new setting
    const setting = await Settings.create(validatedData);
    
    return NextResponse.json({
      success: true,
      setting
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Settings POST error:', error);
    
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
      { success: false, error: error.message || 'Failed to save setting' },
      { status: 500 }
    );
  }
}
