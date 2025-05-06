
import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MinusCircle, PlusCircle, Edit, Search, Save } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
}

interface ProductTableProps {
  products: Product[];
  inventoryUpdates: Record<string, number>;
  handleInventoryChange: (productId: string, change: number) => void;
  openEditDialog: (productId: string) => void;
  handleSubmitUpdates: () => void;
  isSubmitting: boolean;
}

const ProductTable = ({
  products,
  inventoryUpdates,
  handleInventoryChange,
  openEditDialog,
  handleSubmitUpdates,
  isSubmitting
}: ProductTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter products by search term
  const filteredProducts = products.filter(
    product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
  );
};

export default ProductTable;
