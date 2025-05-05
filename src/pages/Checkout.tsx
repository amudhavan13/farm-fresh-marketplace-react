
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { products } from '@/data/products';
import { useToast } from '@/components/ui/use-toast';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type ShippingAddress = {
  doorNumber: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
};

type PaymentMethod = 'upi' | 'netBanking' | 'cashOnDelivery';

const Checkout = () => {
  const { currentUser } = useAuth();
  const { getSelectedItems, getSelectedCartTotal, createOrder } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [address, setAddress] = useState<ShippingAddress>({
    doorNumber: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cashOnDelivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const selectedItems = getSelectedItems();
  
  const findProductById = (id: string) => {
    return products.find(p => p.id === id);
  };
  
  const generateOrderSummary = (orderId: string) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('ARUL JAYAM MACHINERY', 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text('Order Summary', 105, 30, { align: 'center' });
    
    // Add order details
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderId}`, 14, 45);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 52);
    doc.text(`Customer: ${currentUser?.username}`, 14, 59);
    
    // Add shipping address
    doc.setFontSize(14);
    doc.text('Shipping Address:', 14, 70);
    doc.setFontSize(12);
    doc.text(`${address.doorNumber}, ${address.street}`, 14, 77);
    doc.text(`${address.city}, ${address.state} - ${address.pincode}`, 14, 84);
    
    // Add payment information
    doc.setFontSize(14);
    doc.text('Payment Method:', 14, 95);
    doc.setFontSize(12);
    doc.text(paymentMethod === 'cashOnDelivery' ? 'Cash on Delivery' : 
             paymentMethod === 'upi' ? 'UPI' : 'Net Banking', 14, 102);
    
    // Add order items
    const tableData = selectedItems.map(item => {
      const product = findProductById(item.productId);
      return [
        product?.name || '',
        item.quantity.toString(),
        `₹${product?.price.toLocaleString() || '0'}`,
        `₹${((product?.price || 0) * item.quantity).toLocaleString()}`
      ];
    });
    
    // Add total row
    tableData.push([
      'Total',
      '',
      '',
      `₹${getSelectedCartTotal().toLocaleString()}`
    ]);
    
    autoTable(doc, {
      head: [['Product', 'Quantity', 'Unit Price', 'Total']],
      body: tableData,
      startY: 110,
      theme: 'striped',
      headStyles: { fillColor: [46, 125, 50] }
    });
    
    // Add shop contact
    const finalY = (doc as any).lastAutoTable.finalY || 110;
    doc.text('Contact Us:', 14, finalY + 20);
    doc.text('ARUL JAYAM MACHINERY', 14, finalY + 27);
    doc.text('123 Farm Equipment Road, Agricultural District', 14, finalY + 34);
    doc.text('Tamil Nadu, 600001', 14, finalY + 41);
    doc.text('Phone: +91 98765 43210', 14, finalY + 48);
    doc.text('Email: contact@aruljayammachinery.com', 14, finalY + 55);
    
    // Add thank you note
    doc.setFontSize(14);
    doc.text('Thank you for your purchase!', 105, finalY + 70, { align: 'center' });
    
    return doc;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (selectedItems.length === 0) {
      navigate('/cart');
      return;
    }
    
    // Basic validation
    if (!address.doorNumber || !address.street || !address.city || !address.state || !address.pincode) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all address fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the order
      const orderId = createOrder(address, paymentMethod);
      
      // Generate and download the PDF
      const pdf = generateOrderSummary(orderId);
      pdf.save(`order-summary-${orderId}.pdf`);
      
      // Navigate to the orders page
      toast({
        title: 'Order Placed Successfully',
        description: `Your order #${orderId} has been placed.`,
      });
      
      navigate('/orders');
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: 'Error Processing Order',
        description: 'There was a problem processing your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }
  
  if (selectedItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="doorNumber">Door/Flat Number*</Label>
                    <Input
                      id="doorNumber"
                      value={address.doorNumber}
                      onChange={(e) => setAddress({ ...address, doorNumber: e.target.value })}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="street">Street/Area*</Label>
                    <Input
                      id="street"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City/Village*</Label>
                    <Input
                      id="city"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State*</Label>
                    <Input
                      id="state"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="pincode">PIN Code*</Label>
                    <Input
                      id="pincode"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      required
                      disabled={isSubmitting}
                      pattern="[0-9]{6}"
                      maxLength={6}
                      placeholder="6-digit PIN code"
                    />
                  </div>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                  className="space-y-4"
                  disabled={isSubmitting}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="cursor-pointer">UPI</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="netBanking" id="netBanking" />
                    <Label htmlFor="netBanking" className="cursor-pointer">Net Banking</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cashOnDelivery" id="cashOnDelivery" />
                    <Label htmlFor="cashOnDelivery" className="cursor-pointer">Cash on Delivery</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Payment Summary'}
              </Button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                {selectedItems.map(item => {
                  const product = findProductById(item.productId);
                  if (!product) return null;
                  
                  return (
                    <div key={item.productId} className="flex items-center py-2">
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="ml-4 flex-grow">
                        <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</h4>
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>Qty: {item.quantity}</span>
                          <span>₹{product.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{getSelectedCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{getSelectedCartTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
