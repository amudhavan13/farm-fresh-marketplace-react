
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { products } from '@/data/products';

export const useProductManagement = () => {
  const { toast } = useToast();
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

  // Calculate total stock
  const calculateTotalStock = () => {
    return products.reduce(
      (total, product) => total + product.stock + (inventoryUpdates[product.id] || 0), 
      0
    );
  };

  // Calculate low stock items
  const calculateLowStockItems = () => {
    return products.filter(product => 
      (product.stock + (inventoryUpdates[product.id] || 0)) < 5
    ).length;
  };

  return {
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
  };
};
