
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Download } from 'lucide-react';

// Sample data for demonstration
const monthlySalesData = [
  { name: 'Jan', sales: 12, revenue: 450000 },
  { name: 'Feb', sales: 19, revenue: 720000 },
  { name: 'Mar', sales: 8, revenue: 320000 },
  { name: 'Apr', sales: 15, revenue: 580000 },
  { name: 'May', sales: 25, revenue: 950000 },
  { name: 'Jun', sales: 18, revenue: 680000 },
  { name: 'Jul', sales: 20, revenue: 760000 },
  { name: 'Aug', sales: 22, revenue: 830000 },
  { name: 'Sep', sales: 17, revenue: 640000 },
  { name: 'Oct', sales: 21, revenue: 790000 },
  { name: 'Nov', sales: 28, revenue: 1050000 },
  { name: 'Dec', sales: 32, revenue: 1200000 },
];

const productSalesData = [
  { name: 'Tractor', sales: 15, revenue: 750000 },
  { name: 'Sprinkler', sales: 22, revenue: 440000 },
  { name: 'Harvester', sales: 18, revenue: 900000 },
  { name: 'Seeder', sales: 12, revenue: 240000 },
  { name: 'Plough', sales: 25, revenue: 500000 },
];

const categorySalesData = [
  { name: 'Soil Preparation', value: 35 },
  { name: 'Planting', value: 25 },
  { name: 'Irrigation', value: 20 },
  { name: 'Harvesting', value: 15 },
  { name: 'Testing Equipment', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [dataView, setDataView] = useState('sales');
  
  if (!currentUser || !currentUser.isAdmin) {
    navigate('/');
    return null;
  }
  
  const handleExportData = () => {
    // In a real app, this would generate a CSV or PDF report
    alert('Report would be downloaded in a real application');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Sales Reports</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/admin')}
            >
              Back to Dashboard
            </Button>
            <Button onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">215</p>
              <p className="text-xs text-green-500 mt-1">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹8,970,000</p>
              <p className="text-xs text-green-500 mt-1">+8% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Average Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹41,720</p>
              <p className="text-xs text-red-500 mt-1">-2% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Top Selling Category</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Soil Preparation</p>
              <p className="text-xs text-gray-500 mt-1">35% of total sales</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Time Period</label>
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
            <label className="block text-sm font-medium mb-1">Data View</label>
            <Select
              value={dataView}
              onValueChange={setDataView}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Units Sold</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="time">
          <TabsList className="mb-6">
            <TabsTrigger value="time">Sales Over Time</TabsTrigger>
            <TabsTrigger value="product">Sales By Product</TabsTrigger>
            <TabsTrigger value="category">Sales By Category</TabsTrigger>
          </TabsList>
          
          <TabsContent value="time" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlySalesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey={dataView === 'sales' ? 'sales' : 'revenue'} 
                        stroke="#8884d8" 
                        name={dataView === 'sales' ? 'Units Sold' : 'Revenue (₹)'} 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="product" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={productSalesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey={dataView === 'sales' ? 'sales' : 'revenue'} 
                        fill="#82ca9d" 
                        name={dataView === 'sales' ? 'Units Sold' : 'Revenue (₹)'} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="category" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categorySalesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categorySalesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Reports;
