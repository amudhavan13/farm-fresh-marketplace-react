
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { products } from '@/data/products';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

const Cart = () => {
  const [selectAll, setSelectAll] = useState(true);
  const { currentUser } = useAuth();
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    updateSelected,
    selectAll: selectAllItems,
    getSelectedCartTotal,
    getCartTotal,
    getSelectedItems
  } = useCart();
  const navigate = useNavigate();
  
  const findProductById = (id: string) => {
    return products.find(p => p.id === id);
  };
  
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    selectAllItems(checked);
  };
  
  const handleCheckout = () => {
    const selectedItems = getSelectedItems();
    if (selectedItems.length === 0) {
      return;
    }
    
    navigate('/checkout');
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">Please sign in to view your cart</p>
            <Link to="/login">
              <Button size="lg">Login</Button>
            </Link>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart!</p>
            <Link to="/">
              <Button size="lg">Shop Now</Button>
            </Link>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 py-3 border-b text-sm font-medium text-gray-600">
              <div className="col-span-1">
                <Checkbox 
                  checked={selectAll && cartItems.length > 0} 
                  onCheckedChange={handleSelectAll} 
                  id="select-all"
                />
              </div>
              <div className="col-span-6">Product</div>
              <div className="col-span-3">Quantity</div>
              <div className="col-span-2 text-right">Price</div>
            </div>
            
            {/* Cart Items */}
            <div className="space-y-4 mt-4">
              {cartItems.map(item => {
                const product = findProductById(item.productId);
                if (!product) return null;
                
                return (
                  <div 
                    key={item.productId} 
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 border-b items-center"
                  >
                    {/* Select Checkbox */}
                    <div className="md:col-span-1 flex md:block items-center">
                      <Checkbox 
                        checked={item.selected} 
                        onCheckedChange={(checked) => updateSelected(item.productId, !!checked)}
                        id={`select-${item.productId}`}
                      />
                      <div className="md:hidden ml-3 font-medium">Select</div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="md:col-span-6 flex items-center">
                      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="ml-4">
                        <Link 
                          to={`/product/${product.id}`}
                          className="font-medium text-gray-800 hover:text-agri-600"
                        >
                          {product.name}
                        </Link>
                        {item.color && (
                          <p className="text-sm text-gray-600">Color: {item.color}</p>
                        )}
                        <button 
                          onClick={() => removeFromCart(item.productId)}
                          className="text-sm text-red-500 hover:text-red-700 mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    {/* Quantity */}
                    <div className="md:col-span-3">
                      <div className="flex items-center">
                        <div className="md:hidden mr-4 font-medium">Quantity:</div>
                        <div className="flex items-center border rounded-md">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="w-10 text-center">{item.quantity}</span>
                          
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="md:col-span-2 md:text-right">
                      <div className="flex items-center justify-between md:block">
                        <div className="md:hidden font-medium">Price:</div>
                        <div className="font-medium">
                          ₹{(product.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Selected Items Subtotal</span>
                  <span>₹{getSelectedCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{getSelectedCartTotal().toLocaleString()}</span>
                </div>
              </div>
              
              <Button 
                onClick={handleCheckout}
                className="w-full"
                disabled={getSelectedItems().length === 0}
              >
                Proceed to Checkout
              </Button>
              
              <div className="mt-4">
                <Link 
                  to="/"
                  className="text-sm text-agri-600 hover:text-agri-700 flex justify-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
