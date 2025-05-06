
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ProductFormData } from '@/hooks/useAddProduct';

interface BasicProductInfoProps {
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  isSubmitting: boolean;
}

const categoryOptions = [
  'Soil Preparation', 'Planting', 'Irrigation', 'Harvesting',
  'Fertilization', 'Testing Equipment', 'Storage'
];

const BasicProductInfo = ({ formData, setFormData, isSubmitting }: BasicProductInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name*</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category*</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
            disabled={isSubmitting}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short Description* (For product listings)</Label>
        <Input
          id="shortDescription"
          value={formData.shortDescription}
          onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
          disabled={isSubmitting}
          maxLength={100}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Full Description*</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={isSubmitting}
          className="min-h-[150px]"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)*</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity*</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            step="1"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            disabled={isSubmitting}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default BasicProductInfo;
