
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Plus, Edit, Eye, LineChart } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface AdminMenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

// Sample sales data for demonstration
const salesData = [
  { name: 'Jan', sales: 12 },
  { name: 'Feb', sales: 19 },
  { name: 'Mar', sales: 8 },
  { name: 'Apr', sales: 15 },
  { name: 'May', sales: 25 },
  { name: 'Jun', sales: 18 },
  { name: 'Jul', sales: 20 },
  { name: 'Aug', sales: 22 },
  { name: 'Sep', sales: 17 },
  { name: 'Oct', sales: 21 },
  { name: 'Nov', sales: 28 },
  { name: 'Dec', sales: 32 },
];

// Sample product sales data
const productSalesData = [
  { name: 'Tractor', sales: 15 },
  { name: 'Sprinkler', sales: 22 },
  { name: 'Harvester', sales: 18 },
  { name: 'Seeder', sales: 12 },
  { name: 'Plough', sales: 25 },
];

const AdminMenuItem = ({ icon, title, description, link }: AdminMenuItemProps) => (
  <Link to={link}>
    <Card className="p-6 h-full flex flex-col transition-all hover:shadow-md hover:bg-gray-50">
      <div className="mb-4 p-3 rounded-full bg-agri-100 w-fit">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </Card>
  </Link>
);

const AdminPanel = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [dataType, setDataType] = useState('time');
  
  if (!currentUser || !currentUser.isAdmin) {
    navigate('/');
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage your store, products, and orders</p>
        
        {/* Sales Report */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Sales Report</h2>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">View By</label>
              <Select
                value={timeFrame}
                onValueChange={setTimeFrame}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time frame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Data Type</label>
              <Select
                value={dataType}
                onValueChange={setDataType}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">Sales Over Time</SelectItem>
                  <SelectItem value="product">Sales By Product</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dataType === 'time' ? salesData : productSalesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#4ade80" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add Product */}
          <AdminMenuItem 
            icon={<Plus className="h-6 w-6 text-agri-700" />}
            title="Add Product"
            description="Create new product listings for your store"
            link="/admin/add-product"
          />
          
          {/* Update Products */}
          <AdminMenuItem 
            icon={<Edit className="h-6 w-6 text-agri-700" />}
            title="Update Products"
            description="Edit product details and update inventory"
            link="/admin/update-products"
          />
          
          {/* View Orders */}
          <AdminMenuItem 
            icon={<Eye className="h-6 w-6 text-agri-700" />}
            title="View Orders"
            description="Manage customer orders and track status"
            link="/admin/orders"
          />
          
          {/* Reports */}
          <AdminMenuItem 
            icon={<LineChart className="h-6 w-6 text-agri-700" />}
            title="Detailed Reports"
            description="View detailed sales analytics and generate reports"
            link="/admin/reports"
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;
