
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ProductEditDialogProps {
  editingProduct: string | null;
  setEditingProduct: (id: string | null) => void;
  productEdit: {
    name: string;
    price: string;
    description: string;
    shortDescription: string;
    colors: string[];
  };
  setProductEdit: (product: any) => void;
  handleSubmitEdit: () => void;
  isSubmitting: boolean;
}

// Color options
const colorOptions = [
  'Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Orange', 
  'Purple', 'Brown', 'Gray', 'Silver', 'Gold'
];

const ProductEditDialog = ({
  editingProduct,
  setEditingProduct,
  productEdit,
  setProductEdit,
  handleSubmitEdit,
  isSubmitting
}: ProductEditDialogProps) => {

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

  return (
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
  );
};

export default ProductEditDialog;
