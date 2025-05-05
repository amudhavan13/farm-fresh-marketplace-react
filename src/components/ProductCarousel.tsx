
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '@/types';

interface ProductCarouselProps {
  products: Product[];
  title: string;
}

const ProductCarousel = ({ products, title }: ProductCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxVisibleItems = 4;
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsToShow = products.length > maxVisibleItems ? maxVisibleItems : products.length;
  const totalPages = Math.ceil(products.length / itemsToShow);

  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      const newIndex = Math.max(0, Math.min(index, products.length - itemsToShow));
      setCurrentIndex(newIndex);
      
      const itemWidth = containerRef.current.offsetWidth / itemsToShow;
      containerRef.current.scrollTo({
        left: newIndex * itemWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleNext = () => {
    const nextPage = Math.min(currentIndex + itemsToShow, products.length - itemsToShow);
    scrollToIndex(nextPage);
  };

  const handlePrev = () => {
    const prevPage = Math.max(currentIndex - itemsToShow, 0);
    scrollToIndex(prevPage);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      scrollToIndex(currentIndex);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex]);

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        
        {totalPages > 1 && (
          <div className="flex space-x-2">
            <button 
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-1 rounded-full bg-agri-100 text-agri-700 hover:bg-agri-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button 
              onClick={handleNext}
              disabled={currentIndex >= products.length - itemsToShow}
              className="p-1 rounded-full bg-agri-100 text-agri-700 hover:bg-agri-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
      
      <div 
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-hide snap-x scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map(product => (
          <div 
            key={product.id}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 p-2 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
