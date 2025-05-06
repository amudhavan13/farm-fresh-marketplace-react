
import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface FilterSidebarProps {
  products: Product[];
  onFilter: (filteredProducts: Product[]) => void;
  className?: string;
}

interface FilterOptions {
  priceRange: [number, number];
  categories: string[];
  colors: string[];
}

const FilterSidebar = ({ products, onFilter, className }: FilterSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 200000],
    categories: [],
    colors: []
  });

  // Calculate initial values
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      setFilters(prev => ({
        ...prev,
        priceRange: [minPrice, maxPrice]
      }));
    }
  }, [products]);

  // Extract unique categories and colors
  const uniqueCategories = [...new Set(products.map(p => p.category))];
  const uniqueColors = [...new Set(products.flatMap(p => p.colors))];

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [value[0], value[1]]
    }));
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      
      return { ...prev, categories };
    });
  };

  const toggleColor = (color: string) => {
    setFilters(prev => {
      const colors = prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color];
      
      return { ...prev, colors };
    });
  };

  const applyFilters = () => {
    let filteredProducts = [...products];
    
    // Filter by price
    filteredProducts = filteredProducts.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );
    
    // Filter by categories
    if (filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter(p => filters.categories.includes(p.category));
    }
    
    // Filter by colors
    if (filters.colors.length > 0) {
      filteredProducts = filteredProducts.filter(
        p => p.colors.some(color => filters.colors.includes(color))
      );
    }
    
    onFilter(filteredProducts);
    
    // On mobile, close the filter after applying
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const resetFilters = () => {
    const prices = products.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    setFilters({
      priceRange: [minPrice, maxPrice],
      categories: [],
      colors: []
    });
    
    onFilter(products);
  };

  return (
    <>
      {/* Mobile filter button */}
      <div className="md:hidden fixed bottom-4 right-4 z-10">
        <Button 
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 flex items-center justify-center"
        >
          <Filter className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Filter sidebar - hidden on mobile unless opened */}
      <div className={`
        ${className || ''}
        ${isOpen ? 'fixed inset-0 z-50 bg-black/50' : 'hidden md:block'}
      `}>
        <div className={`
          ${isOpen ? 'fixed right-0 top-0 h-full w-80' : ''}
          bg-white p-4 overflow-y-auto
          flex flex-col h-full
        `}>
          {/* Mobile header with close button */}
          {isOpen && (
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Filter Products</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          )}
          
          {/* Desktop header */}
          {!isOpen && (
            <h3 className="text-xl font-bold mb-4">Filter Products</h3>
          )}
          
          <div className="space-y-6 flex-1 overflow-y-auto">
            {/* Price Range */}
            <div>
              <h4 className="font-medium mb-2">Price Range</h4>
              <div className="px-2">
                <Slider
                  defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
                  min={0}
                  max={200000}
                  step={100}
                  onValueChange={handlePriceChange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm">
                  <span>₹{filters.priceRange[0].toLocaleString()}</span>
                  <span>₹{filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {/* Categories */}
            <div>
              <h4 className="font-medium mb-2">Categories</h4>
              <div className="space-y-2">
                {uniqueCategories.map(category => (
                  <div key={category} className="flex items-center">
                    <Checkbox 
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label 
                      htmlFor={`category-${category}`}
                      className="ml-2 text-sm font-normal cursor-pointer"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Colors */}
            <div>
              <h4 className="font-medium mb-2">Colors</h4>
              <div className="space-y-2">
                {uniqueColors.map(color => (
                  <div key={color} className="flex items-center">
                    <Checkbox 
                      id={`color-${color}`}
                      checked={filters.colors.includes(color)}
                      onCheckedChange={() => toggleColor(color)}
                    />
                    <Label 
                      htmlFor={`color-${color}`}
                      className="ml-2 text-sm font-normal cursor-pointer flex items-center"
                    >
                      <div 
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ 
                          backgroundColor: color.toLowerCase(),
                          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)' 
                        }}
                      ></div>
                      {color}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Filter actions */}
          <div className="mt-6 flex space-x-2 pt-4 border-t">
            <Button 
              onClick={applyFilters}
              className="flex-1"
            >
              Apply Filters
            </Button>
            <Button 
              onClick={resetFilters}
              variant="outline"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
