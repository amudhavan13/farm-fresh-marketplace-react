
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Image } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ProductFormData {
  name: string;
  shortDescription: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  images: string[];
  colors: string[];
  specifications: { key: string; value: string }[];
}

const AddProduct = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    shortDescription: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: [''],
    colors: ['Red'],
    specifications: [{ key: '', value: '' }]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!currentUser || !currentUser.isAdmin) {
    navigate('/');
    return null;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.stock ||
      !formData.category ||
      !formData.images[0]
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
          images: [''],
          colors: ['Red'],
          specifications: [{ key: '', value: '' }]
        });
        
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
  
  const addImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, '']
    });
  };
  
  const updateImage = (index: number, value: string) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({
      ...formData,
      images: updatedImages
    });
  };
  
  const removeImage = (index: number) => {
    if (formData.images.length <= 1) return;
    
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages
    });
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
      specifications: [...formData.specifications, { key: '', value: '' }]
    });
  };
  
  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index] = {
      ...updatedSpecs[index],
      [field]: value
    };
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
  
  const colorOptions = [
    'Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Orange', 
    'Purple', 'Brown', 'Gray', 'Silver', 'Gold'
  ];
  
  const categoryOptions = [
    'Soil Preparation', 'Planting', 'Irrigation', 'Harvesting',
    'Fertilization', 'Testing Equipment', 'Storage'
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
          >
            Back to Dashboard
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>
              Enter all product information to create a new listing.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
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
              
              {/* Product Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Product Images*</h3>
                <p className="text-sm text-gray-600">
                  Add URLs for product images. The first image will be used as the main product image.
                </p>
                
                <div className="space-y-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <Image className="h-5 w-5 text-gray-500 mr-2" />
                          <Input
                            value={image}
                            onChange={(e) => updateImage(index, e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            disabled={isSubmitting}
                            required={index === 0}
                          />
                        </div>
                        
                        {image && (
                          <div className="mt-2 h-20 w-20 rounded overflow-hidden">
                            <img 
                              src={image} 
                              alt={`Product ${index}`} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Error";
                              }}
                            />
                          </div>
                        )}
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeImage(index)}
                        disabled={formData.images.length <= 1 || isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addImage}
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Image URL
                  </Button>
                </div>
              </div>
              
              {/* Colors */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Available Colors</h3>
                
                <div className="space-y-3">
                  {formData.colors.map((color, index) => (
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
                        disabled={formData.colors.length <= 1 || isSubmitting}
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
              
              {/* Specifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Specifications</h3>
                <p className="text-sm text-gray-600">
                  Add key specifications for your product.
                </p>
                
                <div className="space-y-3">
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2 items-start">
                      <Input
                        value={spec.key}
                        onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                        placeholder="Specification name (e.g. Weight)"
                        disabled={isSubmitting}
                      />
                      
                      <div className="flex gap-2">
                        <Input
                          value={spec.value}
                          onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                          placeholder="Value (e.g. 5kg)"
                          disabled={isSubmitting}
                          className="flex-grow"
                        />
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSpecification(index)}
                          disabled={formData.specifications.length <= 1 || isSubmitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate('/admin')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Product...' : 'Add Product'}
            </Button>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default AddProduct;
