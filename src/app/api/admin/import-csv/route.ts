import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/database/connection';
import Product from '@/models/Product';
import Category from '@/models/Category';

interface CSVProduct {
  Handle: string;
  Title: string;
  'Body (HTML)': string;
  Vendor: string;
  Type: string;
  Tags: string;
  Published: string;
  'Variant SKU': string;
  'Variant Inventory Qty': string;
  'Variant Price': string;
  'Variant Compare At Price': string;
  'Image Src': string;
  Status: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function parseCSV(csvText: string): CSVProduct[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = parseCSVLine(lines[0]);
  const products: CSVProduct[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length >= headers.length) {
      const product: any = {};
      headers.forEach((header, index) => {
        product[header] = values[index] || '';
      });
      products.push(product);
    }
  }
  
  return products;
}

function cleanDescription(htmlDescription: string): string {
  // Remove HTML tags and clean up the description
  return htmlDescription
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractColorsFromTags(tags: string): string[] {
  const colorKeywords = ['BLACK', 'WHITE', 'BLUE', 'RED', 'GREEN', 'YELLOW', 'PINK', 'VIOLET', 'GREY', 'ORANGE', 'PURPLE'];
  const tagArray = tags.split(',').map(tag => tag.trim().toUpperCase());
  return tagArray.filter(tag => colorKeywords.includes(tag));
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    const file = formData.get('csvFile') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No CSV file provided' },
        { status: 400 }
      );
    }
    
    const csvText = await file.text();
    const csvProducts = parseCSV(csvText);
    
    if (csvProducts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid products found in CSV' },
        { status: 400 }
      );
    }
    
    // Group products by handle to combine images
    const productGroups: { [handle: string]: CSVProduct[] } = {};
    
    csvProducts.forEach(csvProduct => {
      const handle = csvProduct.Handle;
      if (!handle) return;
      
      if (!productGroups[handle]) {
        productGroups[handle] = [];
      }
      productGroups[handle].push(csvProduct);
    });
    
    const importResults = {
      success: 0,
      errors: [] as string[],
      created: [] as string[]
    };
    
    // Process each product group
    for (const [handle, group] of Object.entries(productGroups)) {
      try {
        const mainProduct = group.find(p => p.Title) || group[0];
        if (!mainProduct.Title) continue;
        
        // Skip if product already exists
        const existingProduct = await Product.findOne({ 
          $or: [
            { sku: mainProduct['Variant SKU'] },
            { slug: createSlug(mainProduct.Title) }
          ]
        });
        
        if (existingProduct) {
          importResults.errors.push(`Product "${mainProduct.Title}" already exists`);
          continue;
        }
        
        // Find or create category
        let category = null;
        if (mainProduct.Type) {
          category = await Category.findOne({ 
            name: { $regex: new RegExp(`^${mainProduct.Type}$`, 'i') }
          });
          
          if (!category) {
            category = await Category.create({
              name: mainProduct.Type,
              slug: createSlug(mainProduct.Type),
              description: `${mainProduct.Type} products`,
              isActive: true
            });
          }
        }
        
        // Collect all images from the group
        const images = group
          .map(p => p['Image Src'])
          .filter(img => img && img.trim())
          .slice(0, 5); // Limit to 5 images
        
        // Extract colors from tags
        const colors = extractColorsFromTags(mainProduct.Tags);
        
        // Parse tags
        const tags = mainProduct.Tags
          ? mainProduct.Tags.split(',').map(tag => tag.trim())
          : [];
        
        // Calculate discount
        const price = parseFloat(mainProduct['Variant Price']) || 0;
        const originalPrice = parseFloat(mainProduct['Variant Compare At Price']) || price;
        const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
        
        // Create product
        const newProduct = await Product.create({
          name: mainProduct.Title,
          slug: createSlug(mainProduct.Title),
          description: cleanDescription(mainProduct['Body (HTML)']),
          price: price,
          originalPrice: originalPrice > price ? originalPrice : undefined,
          images: images,
          category: category ? category._id : undefined,
          brand: mainProduct.Vendor || 'Unknown',
          stock: parseInt(mainProduct['Variant Inventory Qty']) || 0,
          sku: mainProduct['Variant SKU'],
          discount: discount,
          tags: tags,
          colors: colors,
          sizes: ['One Size'], // Default for sarees
          isActive: mainProduct.Status === 'active' && mainProduct.Published === 'TRUE',
          isFeatured: false,
          rating: 0,
          reviewCount: 0,
          seo: {
            title: mainProduct.Title,
            description: cleanDescription(mainProduct['Body (HTML)']).substring(0, 160),
            keywords: tags
          }
        });
        
        importResults.success++;
        importResults.created.push(newProduct.name);
        
      } catch (error: any) {
        importResults.errors.push(`Error creating product "${handle}": ${error.message}`);
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        totalProcessed: Object.keys(productGroups).length,
        successCount: importResults.success,
        errorCount: importResults.errors.length,
        createdProducts: importResults.created,
        errors: importResults.errors
      }
    });
    
  } catch (error: any) {
    console.error('CSV import error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to import CSV' },
      { status: 500 }
    );
  }
}
