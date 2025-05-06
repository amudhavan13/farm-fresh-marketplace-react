
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export interface ProductFormData {
  name: string;
  shortDescription: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  images: File[];
  colors: string[];
  specifications: string[];
}

export const useAddProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    shortDescription: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: [],
    colors: ['Red'],
    specifications: ['']
  });
  
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.stock ||
      !formData.category ||
      formData.images.length === 0
    ) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send data to an API
      // Simulate a successful product add
      setTimeout(() => {
        toast({
          title: 'Product Added',
          description: 'The product has been successfully added to your store.',
        });
        
        // Reset form
        setFormData({
          name: '',
          shortDescription: '',
          description: '',
          price: '',
          stock: '',
          category: '',
          images: [],
          colors: ['Red'],
          specifications: ['']
        });
        setImagePreviewUrls([]);
        
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error',
        description: 'Failed to add product. Please try again.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newImages = [...formData.images, ...newFiles];
      setFormData({
        ...formData,
        images: newImages
      });
      
      // Create image previews
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
    }
  };
  
  const removeImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    
    const updatedPreviews = [...imagePreviewUrls];
    URL.revokeObjectURL(updatedPreviews[index]); // Clean up URL object
    updatedPreviews.splice(index, 1);
    
    setFormData({
      ...formData,
      images: updatedImages
    });
    setImagePreviewUrls(updatedPreviews);
  };
  
  const addColor = () => {
    setFormData({
      ...formData,
      colors: [...formData.colors, '']
    });
  };
  
  const updateColor = (index: number, value: string) => {
    const updatedColors = [...formData.colors];
    updatedColors[index] = value;
    setFormData({
      ...formData,
      colors: updatedColors
    });
  };
  
  const removeColor = (index: number) => {
    if (formData.colors.length <= 1) return;
    
    const updatedColors = [...formData.colors];
    updatedColors.splice(index, 1);
    setFormData({
      ...formData,
      colors: updatedColors
    });
  };
  
  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, '']
    });
  };
  
  const updateSpecification = (index: number, value: string) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index] = value;
    setFormData({
      ...formData,
      specifications: updatedSpecs
    });
  };
  
  const removeSpecification = (index: number) => {
    if (formData.specifications.length <= 1) return;
    
    const updatedSpecs = [...formData.specifications];
    updatedSpecs.splice(index, 1);
    setFormData({
      ...formData,
      specifications: updatedSpecs
    });
  };

  return {
    formData,
    imagePreviewUrls,
    isSubmitting,
    setFormData,
    handleSubmit,
    handleImageUpload,
    removeImage,
    addColor,
    updateColor,
    removeColor,
    addSpecification,
    updateSpecification,
    removeSpecification,
    navigate
  };
};
