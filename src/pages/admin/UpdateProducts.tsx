
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Search, Edit, PlusCircle, MinusCircle, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const UpdateProducts = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryUpdates, setInventoryUpdates] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  
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
  
  // Calculate the total value of inventory
  const calculateTotalValue = () => {
    return products.reduce((total, product) => {
      const stockAfterUpdate = product.stock + (inventoryUpdates[product.id] || 0);
      return total + (product.price * stockAfterUpdate);
    }, 0);
  };

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
                                  onClick={() => setEditingProduct(product.id)}
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
      
      <Footer />
    </div>
  );
};

export default UpdateProducts;
