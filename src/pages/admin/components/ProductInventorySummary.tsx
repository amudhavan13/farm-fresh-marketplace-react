
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ProductInventorySummaryProps {
  totalProducts: number;
  totalStock: number;
  inventoryValue: number;
  lowStockItems: number;
}

const ProductInventorySummary = ({
  totalProducts,
  totalStock,
  inventoryValue,
  lowStockItems,
}: ProductInventorySummaryProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-2xl font-bold">{totalProducts}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Total Stock</p>
          <p className="text-2xl font-bold">{totalStock}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Inventory Value</p>
          <p className="text-2xl font-bold">₹{inventoryValue.toLocaleString()}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Low Stock Items</p>
          <p className="text-2xl font-bold">{lowStockItems}</p>
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
  );
};

export default ProductInventorySummary;
