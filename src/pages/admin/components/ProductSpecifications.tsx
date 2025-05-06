
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

interface ProductSpecificationsProps {
  specifications: string[];
  updateSpecification: (index: number, value: string) => void;
  removeSpecification: (index: number) => void;
  addSpecification: () => void;
  isSubmitting: boolean;
}

const ProductSpecifications = ({ 
  specifications, 
  updateSpecification, 
  removeSpecification, 
  addSpecification, 
  isSubmitting 
}: ProductSpecificationsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Specifications</h3>
      <p className="text-sm text-gray-600">
        Add specifications for your product (e.g., "Weight: 5kg", "Dimensions: 10x20x30cm").
      </p>
      
      <div className="space-y-3">
        {specifications.map((spec, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={spec}
              onChange={(e) => updateSpecification(index, e.target.value)}
              placeholder="Weight: 5kg, Dimensions: 10x20x30cm"
              disabled={isSubmitting}
              className="flex-grow"
            />
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeSpecification(index)}
              disabled={specifications.length <= 1 || isSubmitting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSpecification}
          disabled={isSubmitting}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Specification
        </Button>
      </div>
    </div>
  );
};

export default ProductSpecifications;
