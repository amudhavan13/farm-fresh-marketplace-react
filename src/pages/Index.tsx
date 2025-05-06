
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCarousel from '@/components/ProductCarousel';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import { Product } from '@/types';
import { products } from '@/data/products';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Index = () => {
  const { currentUser } = useAuth();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  
  // Get top selling products (products with most reviews for demo)
  const topSellingProducts = [...products]
    .sort((a, b) => b.reviews.length - a.reviews.length)
    .slice(0, 4);
  
  // Load recently viewed products from localStorage
  useEffect(() => {
    if (currentUser) {
      const savedRecentlyViewed = localStorage.getItem(`recentlyViewed_${currentUser.id}`);
      if (savedRecentlyViewed) {
        try {
          const recentIds = JSON.parse(savedRecentlyViewed) as string[];
          const recentProducts = recentIds
            .map(id => products.find(p => p.id === id))
            .filter((p): p is Product => p !== undefined);
          setRecentlyViewed(recentProducts);
        } catch (error) {
          console.error('Failed to parse recently viewed products:', error);
        }
      }
    } else {
      setRecentlyViewed([]);
    }
  }, [currentUser]);
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }
    
    const searchResults = products.filter(
      product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredProducts(searchResults);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Carousel */}
        <section className="bg-gradient-to-r from-agri-700 to-agri-800 py-8">
          <div className="container mx-auto">
            <ProductCarousel products={topSellingProducts} title="" />
          </div>
        </section>
        
        {/* Search Bar */}
        <section className="container mx-auto px-4 py-6">
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
            <button 
              type="submit" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </section>
        
        {/* Recently Viewed Products */}
        {recentlyViewed.length > 0 && (
          <section className="container mx-auto px-4 mb-6">
            <h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentlyViewed.slice(0, 4).map(product => (
                <ProductCard key={`recent-${product.id}`} product={product} />
              ))}
            </div>
          </section>
        )}
        
        {/* Products Section with Filter */}
        <section className="container mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold mb-6">All Products</h2>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filter Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <FilterSidebar 
                products={products} 
                onFilter={setFilteredProducts} 
              />
            </div>
            
            {/* Product Grid */}
            <div className="flex-grow">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-lg text-gray-600">No products found matching your criteria.</p>
                  <button 
                    onClick={() => setFilteredProducts(products)}
                    className="mt-4 bg-agri-500 hover:bg-agri-600 text-white px-4 py-2 rounded"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
