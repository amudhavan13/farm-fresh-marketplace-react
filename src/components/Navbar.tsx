
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Home, Package } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsHPUdeeW67M7jsF1y4JxssrQB4ab90-VRfA&s" 
              alt="Arul Jayam Machinery" 
              className="w-10 h-10 mr-2"
            />
            <span className="font-bold text-xl text-agri-700 hidden md:inline">ARUL JAYAM MACHINERY</span>
          </Link>
        </div>

        <div className="flex items-center space-x-1 md:space-x-4">
          <Link to="/" className="flex items-center px-2 py-1 text-gray-700 hover:text-agri-700 transition-colors">
            <Home className="w-5 h-5 mr-1" />
            <span className="hidden md:inline">Home</span>
          </Link>
          
          <Link to="/cart" className="flex items-center px-2 py-1 text-gray-700 hover:text-agri-700 transition-colors relative">
            <ShoppingCart className="w-5 h-5 mr-1" />
            <span className="hidden md:inline">Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-agri-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          <Link to="/orders" className="flex items-center px-2 py-1 text-gray-700 hover:text-agri-700 transition-colors">
            <Package className="w-5 h-5 mr-1" />
            <span className="hidden md:inline">Orders</span>
          </Link>
          
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <Link to="/profile" className="flex items-center px-2 py-1 text-gray-700 hover:text-agri-700 transition-colors">
                <User className="w-5 h-5 mr-1" />
                <span className="hidden md:inline">{currentUser.username}</span>
              </Link>
              
              {currentUser.isAdmin && (
                <Link to="/admin" className="hidden md:block px-3 py-1 text-sm text-agri-700 bg-agri-50 rounded hover:bg-agri-100 transition-colors">
                  Admin Panel
                </Link>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="hidden md:block"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
