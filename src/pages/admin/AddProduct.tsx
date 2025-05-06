
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAddProduct } from '@/hooks/useAddProduct';
import BasicProductInfo from './components/BasicProductInfo';
import ProductImages from './components/ProductImages';
import ProductColors from './components/ProductColors';
import ProductSpecifications from './components/ProductSpecifications';

const AddProduct = () => {
  const { currentUser } = useAuth();
  const { 
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
  } = useAddProduct();
  
  if (!currentUser || !currentUser.isAdmin) {
    navigate('/');
    return null;
  }

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
              <BasicProductInfo 
                formData={formData}
                setFormData={setFormData}
                isSubmitting={isSubmitting}
              />
              
              {/* Product Images */}
              <ProductImages 
                imagePreviewUrls={imagePreviewUrls}
                handleImageUpload={handleImageUpload}
                removeImage={removeImage}
                isSubmitting={isSubmitting}
              />
              
              {/* Colors */}
              <ProductColors 
                colors={formData.colors}
                updateColor={updateColor}
                removeColor={removeColor}
                addColor={addColor}
                isSubmitting={isSubmitting}
              />
              
              {/* Specifications */}
              <ProductSpecifications 
                specifications={formData.specifications}
                updateSpecification={updateSpecification}
                removeSpecification={removeSpecification}
                addSpecification={addSpecification}
                isSubmitting={isSubmitting}
              />
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
