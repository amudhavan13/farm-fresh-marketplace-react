
import { useEffect, useState } from 'react';
import { Product } from '@/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductCarouselProps {
  products: Product[];
  title: string;
}

const ProductCarousel = ({ products, title }: ProductCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoSlideInterval = 5000; // 5 seconds

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      );
    }, autoSlideInterval);
    
    return () => clearInterval(interval);
  }, [products.length]);

  return (
    <div className="my-4">
      {title && <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>}
      
      <Carousel 
        className="w-full mx-auto max-w-5xl"
        setApi={(api) => {
          if (api) {
            api.scrollTo(currentIndex);
          }
        }}
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className="flex justify-center">
              <div className="relative w-full max-w-md overflow-hidden rounded-lg shadow-lg">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
