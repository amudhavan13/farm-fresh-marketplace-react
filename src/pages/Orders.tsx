
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types';
import { Calendar, Package, AlertCircle } from 'lucide-react';

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  switch (status) {
    case OrderStatus.PENDING:
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case OrderStatus.PROCESSING:
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Processing</Badge>;
    case OrderStatus.SHIPPED:
      return <Badge variant="outline" className="bg-indigo-100 text-indigo-800">Shipped</Badge>;
    case OrderStatus.DELIVERED:
      return <Badge variant="outline" className="bg-green-100 text-green-800">Delivered</Badge>;
    case OrderStatus.CANCELLED:
      return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
    case OrderStatus.RETURNED:
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">Returned</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const Orders = () => {
  const { currentUser } = useAuth();
  const { orders, cancelOrder, requestReplacement, requestReturn } = useCart();
  const navigate = useNavigate();
  
  // For replacement/return dialogs
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [reason, setReason] = useState('');
  
  // Filter to show only current user's orders
  const userOrders = orders.filter(order => order.userId === currentUser?.id);
  
  const handleCancelOrder = (orderId: string) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(orderId);
    }
  };
  
  const handleReplaceOrder = () => {
    if (!reason) return;
    requestReplacement(selectedOrderId, reason);
    setReason('');
  };
  
  const handleReturnOrder = () => {
    if (!reason) return;
    requestReturn(selectedOrderId, reason);
    setReason('');
  };
  
  if (!currentUser) {
    navigate('/login');
    return null;
  }
  
  if (userOrders.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <div className="text-center">
            <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold mb-4">No Orders Yet</h1>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
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
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        
        <div className="space-y-6">
          {userOrders.map(order => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id.split('-').pop()}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(order.orderDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-sm mt-1">₹{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {/* Order Items */}
                  {order.items.map(item => (
                    <div key={item.productId} className="flex items-center py-2 border-b">
                      <div className="flex-grow">
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="flex flex-wrap gap-x-4 text-sm text-gray-600 mt-1">
                          <span>Qty: {item.quantity}</span>
                          {item.color && <span>Color: {item.color}</span>}
                          <span>₹{item.price.toLocaleString()} each</span>
                        </div>
                      </div>
                      <div className="text-right font-medium">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  
                  {/* Shipping Address */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.doorNumber}, {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-wrap gap-2 bg-gray-50">
                {/* Cancel Order Button */}
                {order.canCancel && (
                  <Button
                    variant="outline"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel Order
                  </Button>
                )}
                
                {/* Replace Order Button */}
                {order.canReplace && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        Replace Order
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Replacement</DialogTitle>
                        <DialogDescription>
                          Please provide a reason for your replacement request.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Textarea
                          placeholder="Please describe the issue with your order..."
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        />
                      </div>
                      <DialogFooter>
                        <Button onClick={handleReplaceOrder}>Submit Request</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                
                {/* Return Order Button */}
                {order.canReturn && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        Return Order
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Return Product</DialogTitle>
                        <DialogDescription>
                          Please select a reason for your return request.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <RadioGroup
                          value={reason}
                          onValueChange={setReason}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="not_as_described" id="not_as_described" />
                            <Label htmlFor="not_as_described">Product not as described</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="not_working" id="not_working" />
                            <Label htmlFor="not_working">Product is not working</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="quality" id="quality" />
                            <Label htmlFor="quality">Build quality is not worth the price</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other">Other reason</Label>
                          </div>
                        </RadioGroup>
                        
                        {reason === 'other' && (
                          <Textarea
                            placeholder="Please provide details..."
                            className="mt-4"
                            onChange={(e) => setReason(`other: ${e.target.value}`)}
                          />
                        )}
                      </div>
                      <DialogFooter>
                        <Button onClick={handleReturnOrder}>Submit Request</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                
                {/* Download Invoice Button */}
                <Button variant="outline">
                  Download Invoice
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Orders;
