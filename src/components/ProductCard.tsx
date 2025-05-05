
import { Link } from 'react-router-dom';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product.id}`}>
        <div className="h-48 overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover product-image-transition"
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2 line-clamp-1">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.shortDescription}</p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-agri-700">₹{product.price.toLocaleString()}</span>
            <button className="bg-agri-500 hover:bg-agri-600 text-white px-3 py-1 rounded text-sm transition-colors">
              View Product
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
