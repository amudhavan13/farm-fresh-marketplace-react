import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCarousel from '@/components/ProductCarousel';
import { products } from '@/data/products';
import { Product, Review } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Plus, Minus, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  
  const { currentUser } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    // Find the product
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setMainImage(foundProduct.images[0]);
      setSelectedColor(foundProduct.colors[0]);
      
      // Save to recently viewed in localStorage
      if (currentUser) {
        const userId = currentUser.id;
        const savedRecentlyViewed = localStorage.getItem(`recentlyViewed_${userId}`);
        let recentlyViewed: string[] = [];
        
        try {
          if (savedRecentlyViewed) {
            recentlyViewed = JSON.parse(savedRecentlyViewed);
          }
        } catch (error) {
          console.error('Failed to parse recently viewed products:', error);
        }
        
        // Add current product to beginning of array and remove duplicates
        recentlyViewed = [foundProduct.id, ...recentlyViewed.filter(id => id !== foundProduct.id)];
        // Keep only the last 10 items
        if (recentlyViewed.length > 10) {
          recentlyViewed = recentlyViewed.slice(0, 10);
        }
        
        localStorage.setItem(`recentlyViewed_${userId}`, JSON.stringify(recentlyViewed));
      }
      
      // Find similar products (same category or with similar specifications)
      const similar = products
        .filter(p => 
          p.id !== id && 
          (p.category === foundProduct.category || 
            Object.entries(p.specifications).some(([key, value]) => 
              foundProduct.specifications[key] === value
            ))
        )
        .slice(0, 4);
      
      setSimilarProducts(similar);
    }
  }, [id, currentUser]);

  const handleQuantityChange = (amount: number) => {
    const newQuantity = Math.max(1, quantity + amount);
    // Don't allow more than stock
    if (product && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity, selectedColor);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Please Sign In",
        description: "You need to be logged in to submit a review",
        variant: "destructive"
      });
      return;
    }
    
    if (!product) return;
    
    const newReview: Review = {
      id: `review-${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      rating: reviewRating,
      comment: reviewComment,
      images: reviewImages.length > 0 ? reviewImages : undefined,
      date: new Date().toISOString(),
    };
    
    // Update the product's reviews
    const updatedProduct = {
      ...product,
      reviews: [newReview, ...product.reviews],
    };
    
    // Update the product in our data
    // In a real app, this would be an API call
    setProduct(updatedProduct);
    
    // Reset the form
    setReviewRating(5);
    setReviewComment('');
    setReviewImages([]);
    
    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    });
  };

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Product not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden border">
                <img 
                  src={mainImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {product.images.map(image => (
                  <button
                    key={image}
                    onClick={() => setMainImage(image)}
                    className={`aspect-square border rounded overflow-hidden ${
                      mainImage === image ? 'ring-2 ring-agri-500' : ''
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              {/* Ratings */}
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(averageRating) 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 ml-2">
                  {averageRating.toFixed(1)} ({product.reviews.length} reviews)
                </span>
              </div>
              
              {/* Price */}
              <div className="text-2xl font-bold text-agri-700 mb-4">
                ₹{product.price.toLocaleString()}
              </div>
              
              {/* Stock */}
              <div className={`mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </div>
              
              {/* Description */}
              <p className="text-gray-700 mb-6">{product.description}</p>
              
              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Colors</h3>
                <div className="flex space-x-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color 
                          ? 'border-agri-500' 
                          : 'border-transparent'
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase(),
                        boxShadow: selectedColor === color 
                          ? '0 0 0 2px rgba(0, 0, 0, 0.1)' 
                          : 'none'
                      }}
                      aria-label={color}
                    ></button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-1">Selected: {selectedColor}</p>
              </div>
              
              {/* Quantity */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Quantity</h3>
                <div className="flex items-center">
                  <Button
                    onClick={() => handleQuantityChange(-1)}
                    variant="outline"
                    size="icon"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-4 w-8 text-center">{quantity}</span>
                  <Button
                    onClick={() => handleQuantityChange(1)}
                    variant="outline"
                    size="icon"
                    disabled={product.stock <= quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Add to Cart Button */}
              <Button 
                onClick={handleAddToCart} 
                className="w-full md:w-auto py-2"
                size="lg"
                disabled={product.stock <= 0}
              >
                Add to Cart
              </Button>
            </div>
          </div>
          
          {/* Specifications and Reviews */}
          <Tabs defaultValue="specifications">
            <TabsList className="mb-4">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="specifications">
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Product Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="font-medium text-gray-700">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>
                
                {/* Review Form */}
                {currentUser && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-8">
                    <h3 className="font-bold mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      {/* Rating */}
                      <div>
                        <Label htmlFor="rating" className="mb-2 block">Rating</Label>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="focus:outline-none"
                            >
                              <Star 
                                className={`h-6 w-6 ${
                                  star <= reviewRating 
                                    ? 'text-yellow-400 fill-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Review Text */}
                      <div>
                        <Label htmlFor="comment" className="mb-2 block">Your Review</Label>
                        <Textarea
                          id="comment"
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your thoughts about the product..."
                          required
                        />
                      </div>
                      
                      {/* Image URLs (Optional) */}
                      <div>
                        <Label htmlFor="images" className="mb-2 block">
                          Image URLs (Optional)
                        </Label>
                        <div className="flex flex-col space-y-2">
                          {reviewImages.map((url, index) => (
                            <div key={index} className="flex items-center">
                              <Input
                                value={url}
                                onChange={(e) => {
                                  const newImages = [...reviewImages];
                                  newImages[index] = e.target.value;
                                  setReviewImages(newImages);
                                }}
                                placeholder="https://example.com/image.jpg"
                              />
                              <Button 
                                type="button" 
                                variant="ghost" 
                                className="ml-2"
                                onClick={() => {
                                  const newImages = [...reviewImages];
                                  newImages.splice(index, 1);
                                  setReviewImages(newImages);
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="flex items-center"
                            onClick={() => setReviewImages([...reviewImages, ''])}
                          >
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Add Image URL
                          </Button>
                        </div>
                      </div>
                      
                      <Button type="submit">Post Review</Button>
                    </form>
                  </div>
                )}
                
                {/* Review List */}
                {product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6">
                        <div className="flex items-center mb-2">
                          <h4 className="font-medium">{review.username}</h4>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-gray-500 text-sm">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex mb-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        
                        <p className="text-gray-700 mb-4">{review.comment}</p>
                        
                        {review.images && review.images.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {review.images.map((image, index) => (
                              <div key={index} className="w-16 h-16 rounded overflow-hidden">
                                <img 
                                  src={image} 
                                  alt={`Review image ${index + 1}`} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {similarProducts.map(product => (
                  <Link 
                    key={product.id} 
                    to={`/product/${product.id}`} 
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover product-image-transition"
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-1 truncate">{product.name}</h3>
                      <p className="font-bold text-agri-700">₹{product.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
