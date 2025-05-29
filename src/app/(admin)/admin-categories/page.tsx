'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Category {
  _id: string;
  name: string;
  description: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories-list');
      const data = await response.json();
      
      if (data.success && data.data) {
        // Get product count for each category
        const categoriesWithCount = await Promise.all(
          data.data.map(async (category: { _id: string; name: string; description?: string; isActive: boolean; createdAt: string }) => {
            const productResponse = await fetch(`/api/products-search?category=${category._id}&limit=1`);
            const productData = await productResponse.json();
            
            return {
              _id: category._id,
              name: category.name,
              description: category.description || '',
              productCount: productData.success ? productData.data.pagination.total : 0,
              isActive: category.isActive,
              createdAt: category.createdAt
            };
          })
        );
        
        setCategories(categoriesWithCount);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      const response = await fetch('/api/categories-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategory.name,
          description: newCategory.description,
          slug: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
          isActive: true
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh categories list
        fetchCategories();
        setNewCategory({ name: '', description: '' });
        setIsAddDialogOpen(false);
      } else {
        alert('Failed to add category: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to add category:', error);
      alert('Failed to add category');
    }
  };

  const toggleCategoryStatus = async (categoryId: string) => {
    try {
      const category = categories.find(c => c._id === categoryId);
      if (!category) return;

      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !category.isActive
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setCategories(categories.map(c => 
          c._id === categoryId ? { ...c, isActive: !c.isActive } : c
        ));
      } else {
        alert('Failed to update category status');
      }
    } catch (error) {
      console.error('Failed to update category:', error);
      alert('Failed to update category');
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        // Remove from local state
        setCategories(categories.filter(category => category._id !== categoryId));
      } else {
        alert('Failed to delete category: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600">Manage your product categories</p>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage your product categories</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new product category for your store.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <Label htmlFor="categoryDescription">Description</Label>
                <Input
                  id="categoryDescription"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Enter category description"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddCategory}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Add Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {categories.filter(c => c.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {categories.reduce((sum, c) => sum + c.productCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            Manage your product categories and their settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-gray-500">{category.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{category.productCount} items</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={category.isActive ? "default" : "outline"}
                      className={category.isActive ? "bg-green-100 text-green-800" : ""}
                    >
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCategoryStatus(category._id)}
                      >
                        {category.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => deleteCategory(category._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
