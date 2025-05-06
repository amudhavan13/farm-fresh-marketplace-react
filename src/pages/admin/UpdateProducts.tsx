
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { products } from '@/data/products';
import { Search, Edit, PlusCircle, MinusCircle, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UpdateProducts = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryUpdates, setInventoryUpdates] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productEdit, setProductEdit] = useState({
    name: '',
    price: '',
    description: '',
    shortDescription: '',
    colors: [] as string[]
  });
  
  if (!currentUser || !currentUser.isAdmin) {
    navigate('/');
    return null;
  }
  
  // Filter products by search term
  const filteredProducts = products.filter(
    product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle inventory change
  const handleInventoryChange = (productId: string, change: number) => {
    const currentStock = products.find(p => p.id === productId)?.stock || 0;
    const currentUpdate = inventoryUpdates[productId] || 0;
    const newValue = currentUpdate + change;
    
    // Don't allow reducing below zero
    if (currentStock + newValue < 0) return;
    
    setInventoryUpdates({
      ...inventoryUpdates,
      [productId]: newValue
    });
  };
  
  // Open edit dialog
  const openEditDialog = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setProductEdit({
        name: product.name,
        price: product.price.toString(),
        description: product.description,
        shortDescription: product.shortDescription,
        colors: [...product.colors]
      });
      setEditingProduct(productId);
    }
  };
  
  // Handle color change in edit dialog
  const handleColorChange = (index: number, value: string) => {
    const updatedColors = [...productEdit.colors];
    updatedColors[index] = value;
    setProductEdit({
      ...productEdit,
      colors: updatedColors
    });
  };
  
  // Add new color in edit dialog
  const addColor = () => {
    setProductEdit({
      ...productEdit,
      colors: [...productEdit.colors, 'Red']
    });
  };
  
  // Remove color in edit dialog
  const removeColor = (index: number) => {
    if (productEdit.colors.length <= 1) return;
    
    const updatedColors = [...productEdit.colors];
    updatedColors.splice(index, 1);
    setProductEdit({
      ...productEdit,
      colors: updatedColors
    });
  };
  
  // Handle submit inventory updates
  const handleSubmitUpdates = () => {
    if (Object.keys(inventoryUpdates).length === 0) {
      toast({
        title: 'No Updates',
        description: 'No inventory changes to submit.',
        variant: 'default',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would send the updates to an API
    // For now, we'll simulate a delay and show a success message
    setTimeout(() => {
      toast({
        title: 'Inventory Updated',
        description: `Successfully updated ${Object.keys(inventoryUpdates).length} product${
          Object.keys(inventoryUpdates).length > 1 ? 's' : ''
        }.`,
      });
      
      // Reset updates
      setInventoryUpdates({});
      setIsSubmitting(false);
    }, 1000);
  };
  
  // Handle submit product edit
  const handleSubmitEdit = () => {
    if (!editingProduct) return;
    
    setIsSubmitting(true);
    
    // In a real app, this would send the updates to an API
    // For now, we'll simulate a delay and show a success message
    setTimeout(() => {
      toast({
        title: 'Product Updated',
        description: 'Product details have been updated successfully.',
      });
      
      setEditingProduct(null);
      setIsSubmitting(false);
    }, 1000);
  };
  
  // Calculate the total value of inventory
  const calculateTotalValue = () => {
    return products.reduce((total, product) => {
      const stockAfterUpdate = product.stock + (inventoryUpdates[product.id] || 0);
      return total + (product.price * stockAfterUpdate);
    }, 0);
  };

  // Color options
  const colorOptions = [
    'Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Orange', 
    'Purple', 'Brown', 'Gray', 'Silver', 'Gold'
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Update Products</h1>
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
          >
            Back to Dashboard
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with stats */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Total Stock</p>
                  <p className="text-2xl font-bold">
                    {products.reduce(
                      (total, product) => total + product.stock + (inventoryUpdates[product.id] || 0), 
                      0
                    )}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Inventory Value</p>
                  <p className="text-2xl font-bold">₹{calculateTotalValue().toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Low Stock Items</p>
                  <p className="text-2xl font-bold">
                    {products.filter(product => 
                      (product.stock + (inventoryUpdates[product.id] || 0)) < 5
                    ).length}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate('/admin/add-product')}
                >
                  Add New Product
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Product table */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Product Inventory</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>New Stock</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded overflow-hidden mr-3">
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="line-clamp-1">{product.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.category}</Badge>
                            </TableCell>
                            <TableCell>₹{product.price.toLocaleString()}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>
                              <div className={`flex items-center ${
                                (inventoryUpdates[product.id] || 0) > 0 
                                  ? 'text-green-600' 
                                  : (inventoryUpdates[product.id] || 0) < 0 
                                  ? 'text-red-600' 
                                  : ''
                              }`}>
                                {product.stock + (inventoryUpdates[product.id] || 0)}
                                {(inventoryUpdates[product.id] || 0) !== 0 && (
                                  <span className="ml-1">
                                    ({inventoryUpdates[product.id] > 0 ? '+' : ''}
                                    {inventoryUpdates[product.id]})
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleInventoryChange(product.id, -1)}
                                  disabled={isSubmitting}
                                >
                                  <MinusCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleInventoryChange(product.id, 1)}
                                  disabled={isSubmitting}
                                >
                                  <PlusCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditDialog(product.id)}
                                  disabled={isSubmitting}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6">
                            No products found matching your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleSubmitUpdates}
                  disabled={Object.keys(inventoryUpdates).length === 0 || isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Updating...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Edit Product Dialog */}
      <Dialog open={editingProduct !== null} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="product-name" className="text-sm font-medium">Product Name</label>
              <Input
                id="product-name"
                value={productEdit.name}
                onChange={(e) => setProductEdit({...productEdit, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="product-price" className="text-sm font-medium">Price (₹)</label>
              <Input
                id="product-price"
                type="number"
                value={productEdit.price}
                onChange={(e) => setProductEdit({...productEdit, price: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="product-short-desc" className="text-sm font-medium">Short Description</label>
              <Input
                id="product-short-desc"
                value={productEdit.shortDescription}
                onChange={(e) => setProductEdit({...productEdit, shortDescription: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="product-desc" className="text-sm font-medium">Full Description</label>
              <Textarea
                id="product-desc"
                value={productEdit.description}
                onChange={(e) => setProductEdit({...productEdit, description: e.target.value})}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Available Colors</label>
              <div className="space-y-3">
                {productEdit.colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-grow">
                      <Select
                        value={color}
                        onValueChange={(value) => handleColorChange(index, value)}
                      >
                        <SelectTrigger id={`edit-color-${index}`}>
                          <SelectValue placeholder="Select a color" />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map(colorOption => (
                            <SelectItem key={colorOption} value={colorOption}>
                              <div className="flex items-center">
                                <div 
                                  className="w-4 h-4 rounded-full mr-2"
                                  style={{ backgroundColor: colorOption.toLowerCase() }}
                                ></div>
                                {colorOption}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeColor(index)}
                      disabled={productEdit.colors.length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addColor}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Color
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmitEdit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default UpdateProducts;
