
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { OrderStatus, Order } from '@/types';
import { Search, CheckCircle, Package, Truck, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

const ViewOrders = () => {
  const { currentUser } = useAuth();
  const { orders, updateOrderStatus, markOrderAsDelivered } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!currentUser || !currentUser.isAdmin) {
    navigate('/');
    return null;
  }
  
  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Handle status change
  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    if (status === OrderStatus.DELIVERED) {
      markOrderAsDelivered(orderId);
    } else {
      updateOrderStatus(orderId, status);
    }
    
    toast({
      title: 'Order Updated',
      description: `Order ${orderId.split('-').pop()} status changed to ${status}.`,
    });
  };
  
  // Mark all items as done
  const handleCompleteOrder = (order: Order) => {
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      markOrderAsDelivered(order.id);
      
      toast({
        title: 'Order Completed',
        description: `Order ${order.id.split('-').pop()} has been marked as delivered.`,
      });
      
      setIsSubmitting(false);
    }, 1000);
  };
  
  // Calculate statistics
  const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING).length;
  const processingOrders = orders.filter(o => o.status === OrderStatus.PROCESSING).length;
  const shippedOrders = orders.filter(o => o.status === OrderStatus.SHIPPED).length;
  const deliveredOrders = orders.filter(o => o.status === OrderStatus.DELIVERED).length;
  const totalRevenue = orders
    .filter(o => o.status !== OrderStatus.CANCELLED)
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Orders</h1>
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
          >
            Back to Dashboard
          </Button>
        </div>
        
        {/* Order Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{pendingOrders}</p>
              </div>
              <Package className="h-8 w-8 text-yellow-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold">{processingOrders}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shipped</p>
                <p className="text-2xl font-bold">{shippedOrders}</p>
              </div>
              <Truck className="h-8 w-8 text-indigo-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl font-bold">{deliveredOrders}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-agri-500" />
            </CardContent>
          </Card>
        </div>
        
        {/* Order List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle>Order List</CardTitle>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={OrderStatus.PROCESSING}>Processing</SelectItem>
                    <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
                    <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
                    <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
                    <SelectItem value={OrderStatus.RETURNED}>Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-600">No orders found matching your criteria.</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredOrders.map(order => (
                  <AccordionItem key={order.id} value={order.id} className="border rounded-lg">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left">
                        <div className="flex flex-col">
                          <span className="font-medium">Order #{order.id.split('-').pop()}</span>
                          <span className="text-sm text-gray-600">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex flex-col">
                          <span className="font-medium">{order.username}</span>
                          <span className="text-sm text-gray-600">
                            {order.items.length} items
                          </span>
                        </div>
                        
                        <div className="flex flex-col items-start sm:items-end">
                          <OrderStatusBadge status={order.status} />
                          <span className="text-sm font-medium">₹{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4">
                        {/* Order Items */}
                        <div>
                          <h4 className="font-medium mb-2">Order Items</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Total</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.items.map(item => (
                                <TableRow key={item.productId}>
                                  <TableCell>
                                    <div className="font-medium">{item.name}</div>
                                    {item.color && <div className="text-xs text-gray-600">Color: {item.color}</div>}
                                  </TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>₹{item.price.toLocaleString()}</TableCell>
                                  <TableCell>₹{(item.price * item.quantity).toLocaleString()}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                                <TableCell className="font-bold">₹{order.total.toLocaleString()}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                        
                        {/* Customer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Shipping Address</h4>
                            <p>
                              {order.shippingAddress.doorNumber}, {order.shippingAddress.street}<br />
                              {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                              {order.shippingAddress.pincode}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Payment Information</h4>
                            <p>
                              Method: {order.paymentMethod === 'cashOnDelivery' 
                                ? 'Cash on Delivery' 
                                : order.paymentMethod === 'upi' 
                                ? 'UPI' 
                                : 'Net Banking'
                              }
                              <br />
                              Status: {['cancelled', 'returned'].includes(order.status) 
                                ? 'Refunded' 
                                : order.status === 'delivered' 
                                ? 'Paid' 
                                : 'Pending'
                              }
                            </p>
                          </div>
                        </div>
                        
                        {/* Order Actions */}
                        <div className="flex flex-wrap gap-2 border-t pt-4">
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                            disabled={isSubmitting || order.status === OrderStatus.CANCELLED || order.status === OrderStatus.RETURNED}
                          >
                            <SelectTrigger className="w-full sm:w-40">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                              <SelectItem value={OrderStatus.PROCESSING}>Processing</SelectItem>
                              <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
                              <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
                              <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button
                            onClick={() => handleCompleteOrder(order)}
                            disabled={
                              isSubmitting || 
                              order.status === OrderStatus.DELIVERED || 
                              order.status === OrderStatus.CANCELLED ||
                              order.status === OrderStatus.RETURNED
                            }
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Delivered
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default ViewOrders;
