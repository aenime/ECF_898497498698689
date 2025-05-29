'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ImportResult {
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  createdProducts: string[];
  errors: string[];
}

export default function ImportProducts() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setImportResult(null);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      alert('Please select a CSV file first');
      return;
    }

    setImporting(true);
    setProgress(0);
    setImportResult(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const formData = new FormData();
      formData.append('csvFile', selectedFile);

      const response = await fetch('/api/admin/import-csv', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (data.success) {
        setImportResult(data.data);
      } else {
        alert('Import failed: ' + data.error);
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Import failed: ' + error);
    } finally {
      setImporting(false);
    }
  };

  const downloadSampleCSV = () => {
    const sampleData = `Handle,Title,Body (HTML),Vendor,Type,Tags,Published,Variant SKU,Variant Inventory Qty,Variant Price,Variant Compare At Price,Image Src,Status
sample-product,Sample Product,"<p>This is a sample product description</p>",SampleBrand,Clothing,"COTTON, CASUAL, SUMMER",TRUE,SAMPLE-001,10,1999.00,2499.00,https://example.com/image1.jpg,active
sample-product,,,,,,,,,,,,https://example.com/image2.jpg,
sample-product-2,Another Sample,"<p>Another sample product</p>",SampleBrand,Electronics,"TECH, GADGET",TRUE,SAMPLE-002,5,5999.00,7999.00,https://example.com/image3.jpg,active`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-products.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Import Products</h1>
        <p className="text-gray-600 mt-2">Import products from CSV file</p>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Import Instructions
          </CardTitle>
          <CardDescription>
            Follow these guidelines for successful product import
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-sm mb-2">Required Fields:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Handle (unique identifier)</li>
                <li>• Title (product name)</li>
                <li>• Variant Price</li>
                <li>• Variant SKU</li>
                <li>• Status (active/inactive)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Optional Fields:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Body (HTML) - Product description</li>
                <li>• Vendor - Brand name</li>
                <li>• Type - Category</li>
                <li>• Tags - Comma separated</li>
                <li>• Variant Compare At Price - Original price</li>
                <li>• Image Src - Product images</li>
                <li>• Variant Inventory Qty - Stock quantity</li>
              </ul>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={downloadSampleCSV}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Sample CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>
            Select a CSV file containing product data to import
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="csvFile">CSV File</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              disabled={importing}
            />
          </div>

          {selectedFile && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Selected file:</strong> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            </div>
          )}

          {importing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 animate-spin" />
                <span className="text-sm">Importing products...</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-gray-500">{progress}% complete</p>
            </div>
          )}

          <Button 
            onClick={handleImport}
            disabled={!selectedFile || importing}
            className="w-full"
          >
            {importing ? 'Importing...' : 'Import Products'}
          </Button>
        </CardContent>
      </Card>

      {/* Import Results */}
      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {importResult.errorCount === 0 ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              Import Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800">Total Processed</h4>
                <p className="text-2xl font-bold text-blue-600">{importResult.totalProcessed}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800">Successfully Created</h4>
                <p className="text-2xl font-bold text-green-600">{importResult.successCount}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-800">Errors</h4>
                <p className="text-2xl font-bold text-red-600">{importResult.errorCount}</p>
              </div>
            </div>

            {/* Success Messages */}
            {importResult.createdProducts.length > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Successfully Created Products</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 max-h-32 overflow-y-auto">
                    {importResult.createdProducts.map((product, index) => (
                      <div key={index} className="text-sm">• {product}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Error Messages */}
            {importResult.errors.length > 0 && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Import Errors</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 max-h-32 overflow-y-auto">
                    {importResult.errors.map((error, index) => (
                      <div key={index} className="text-sm">• {error}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
