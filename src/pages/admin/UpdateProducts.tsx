
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useProductManagement } from '@/hooks/useProductManagement';

// Custom Components
import ProductInventorySummary from './components/ProductInventorySummary';
import ProductTable from './components/ProductTable';
import ProductEditDialog from './components/ProductEditDialog';

const UpdateProducts = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const {
    products,
    inventoryUpdates,
    isSubmitting,
    editingProduct,
    productEdit,
    setProductEdit,
    setEditingProduct,
    handleInventoryChange,
    openEditDialog,
    handleSubmitUpdates,
    handleSubmitEdit,
    calculateTotalValue,
    calculateTotalStock,
    calculateLowStockItems
  } = useProductManagement();
  
  if (!currentUser || !currentUser.isAdmin) {
    navigate('/');
    return null;
  }
  
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
            <ProductInventorySummary 
              totalProducts={products.length}
              totalStock={calculateTotalStock()}
              inventoryValue={calculateTotalValue()}
              lowStockItems={calculateLowStockItems()}
            />
          </div>
          
          {/* Product table */}
          <div className="lg:col-span-3">
            <ProductTable 
              products={products}
              inventoryUpdates={inventoryUpdates}
              handleInventoryChange={handleInventoryChange}
              openEditDialog={openEditDialog}
              handleSubmitUpdates={handleSubmitUpdates}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </main>
      
      {/* Edit Product Dialog */}
      <ProductEditDialog 
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        productEdit={productEdit}
        setProductEdit={setProductEdit}
        handleSubmitEdit={handleSubmitEdit}
        isSubmitting={isSubmitting}
      />
      
      <Footer />
    </div>
  );
};

export default UpdateProducts;
