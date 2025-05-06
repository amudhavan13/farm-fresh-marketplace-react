
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface ProductColorsProps {
  colors: string[];
  updateColor: (index: number, value: string) => void;
  removeColor: (index: number) => void;
  addColor: () => void;
  isSubmitting: boolean;
}

const colorOptions = [
  'Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Orange', 
  'Purple', 'Brown', 'Gray', 'Silver', 'Gold'
];

const ProductColors = ({ 
  colors, 
  updateColor, 
  removeColor, 
  addColor, 
  isSubmitting 
}: ProductColorsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Available Colors</h3>
      
      <div className="space-y-3">
        {colors.map((color, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-grow">
              <Select
                value={color}
                onValueChange={(value) => updateColor(index, value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id={`color-${index}`}>
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map(color => (
                    <SelectItem key={color} value={color}>
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: color.toLowerCase() }}
                        ></div>
                        {color}
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
              disabled={colors.length <= 1 || isSubmitting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addColor}
          disabled={isSubmitting}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Color
        </Button>
      </div>
    </div>
  );
};

export default ProductColors;
