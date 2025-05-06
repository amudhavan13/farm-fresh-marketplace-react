
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Trash2 } from 'lucide-react';

interface ProductImagesProps {
  imagePreviewUrls: string[];
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  isSubmitting: boolean;
}

const ProductImages = ({ 
  imagePreviewUrls, 
  handleImageUpload, 
  removeImage, 
  isSubmitting 
}: ProductImagesProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Product Images*</h3>
      <p className="text-sm text-gray-600">
        Upload product images. The first image will be used as the main product image.
      </p>
      
      <div className="space-y-4">
        <Label htmlFor="image-upload" className="cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">
              Click to upload product images
            </p>
          </div>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
            disabled={isSubmitting}
          />
        </Label>
        
        {imagePreviewUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {imagePreviewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <div className="h-32 w-full rounded overflow-hidden border">
                  <img 
                    src={url} 
                    alt={`Product ${index}`} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow opacity-80 hover:opacity-100"
                  onClick={() => removeImage(index)}
                  disabled={isSubmitting}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImages;
