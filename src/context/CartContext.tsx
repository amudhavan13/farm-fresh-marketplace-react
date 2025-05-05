
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CartItem, Product, Order, OrderStatus } from '../types';
import { products } from '../data/products';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: string, quantity: number, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateSelected: (productId: string, selected: boolean) => void;
  selectAll: (selected: boolean) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getSelectedCartTotal: () => number;
  getSelectedItems: () => CartItem[];
  getCartItemCount: () => number;
  orders: Order[];
  createOrder: (
    shippingAddress: Order['shippingAddress'],
    paymentMethod: Order['paymentMethod']
  ) => string;
  getOrder: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  requestReplacement: (orderId: string, reason: string) => void;
  requestReturn: (orderId: string, reason: string) => void;
  markOrderAsDelivered: (orderId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const { currentUser } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.id;
      const savedCart = localStorage.getItem(`cart_${userId}`);
      const savedOrders = localStorage.getItem(`orders_${userId}`);
      
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
          localStorage.removeItem(`cart_${userId}`);
        }
      }
      
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders));
        } catch (error) {
          console.error('Failed to parse orders from localStorage:', error);
          localStorage.removeItem(`orders_${userId}`);
        }
      }
    } else {
      // Clear cart when logged out
      setCartItems([]);
      setOrders([]);
    }
  }, [currentUser]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.id;
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
    }
  }, [cartItems, currentUser]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.id;
      localStorage.setItem(`orders_${userId}`, JSON.stringify(orders));
    }
  }, [orders, currentUser]);

  const findProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };

  const addToCart = (productId: string, quantity: number, color?: string) => {
    if (!currentUser) {
      toast({
        title: "Please Sign In",
        description: "You need to be logged in to add items to your cart",
        variant: "destructive"
      });
      return;
    }
    
    const product = findProductById(productId);
    if (!product) return;
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === productId);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity, color: color || item.color }
            : item
        );
      } else {
        return [...prevItems, { productId, quantity, color, selected: true }];
      }
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
    
    const product = findProductById(productId);
    if (product) {
      toast({
        title: "Removed from Cart",
        description: `${product.name} has been removed from your cart.`,
      });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const updateSelected = (productId: string, selected: boolean) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, selected } : item
      )
    );
  };

  const selectAll = (selected: boolean) => {
    setCartItems(prevItems =>
      prevItems.map(item => ({ ...item, selected }))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = findProductById(item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const getSelectedCartTotal = () => {
    return cartItems
      .filter(item => item.selected)
      .reduce((total, item) => {
        const product = findProductById(item.productId);
        return total + (product ? product.price * item.quantity : 0);
      }, 0);
  };

  const getSelectedItems = () => {
    return cartItems.filter(item => item.selected);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const createOrder = (
    shippingAddress: Order['shippingAddress'],
    paymentMethod: Order['paymentMethod']
  ): string => {
    if (!currentUser) return '';
    
    const selectedItems = getSelectedItems();
    if (selectedItems.length === 0) return '';
    
    const orderItems = selectedItems.map(item => {
      const product = findProductById(item.productId)!;
      return {
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        color: item.color
      };
    });
    
    const orderTotal = getSelectedCartTotal();
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      status: OrderStatus.PENDING,
      total: orderTotal,
      orderDate: new Date().toISOString(),
      canCancel: true,
      canReplace: false,
      canReturn: false
    };
    
    setOrders(prev => [...prev, newOrder]);
    
    // Remove ordered items from cart
    setCartItems(prev => prev.filter(item => !item.selected));
    
    toast({
      title: "Order Placed Successfully",
      description: `Order #${newOrder.id} has been placed.`,
    });
    
    return newOrder.id;
  };

  const getOrder = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: OrderStatus.CANCELLED, canCancel: false, canReplace: false, canReturn: false }
          : order
      )
    );
    
    toast({
      title: "Order Cancelled",
      description: `Order #${orderId} has been cancelled.`,
    });
  };

  const requestReplacement = (orderId: string, reason: string) => {
    // In a real app, this would send the request to the backend
    toast({
      title: "Replacement Requested",
      description: `Your replacement request for order #${orderId} has been submitted.`,
    });
  };

  const requestReturn = (orderId: string, reason: string) => {
    // In a real app, this would send the request to the backend
    toast({
      title: "Return Requested",
      description: `Your return request for order #${orderId} has been submitted.`,
    });
  };

  const markOrderAsDelivered = (orderId: string) => {
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
              ...order,
              status: OrderStatus.DELIVERED,
              deliveryDate: new Date().toISOString(),
              canCancel: false,
              canReplace: true,
              canReturn: true
            }
          : order
      )
    );
    
    // Set a timeout to disable replacement and return after 2 weeks
    // In a real app, this would be handled by the backend
    setTimeout(() => {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, canReplace: false, canReturn: false }
            : order
        )
      );
    }, 1000 * 60 * 60 * 24 * 14); // 14 days
    
    toast({
      title: "Order Delivered",
      description: `Order #${orderId} has been marked as delivered.`,
    });
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateSelected,
    selectAll,
    clearCart,
    getCartTotal,
    getSelectedCartTotal,
    getSelectedItems,
    getCartItemCount,
    orders,
    createOrder,
    getOrder,
    updateOrderStatus,
    cancelOrder,
    requestReplacement,
    requestReturn,
    markOrderAsDelivered
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
