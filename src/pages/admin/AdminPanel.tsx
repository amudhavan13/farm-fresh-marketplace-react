
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Plus, Edit, Eye, FileText, LineChart, Settings } from 'lucide-react';

interface AdminMenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

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
          
          {/* Reports (Placeholder) */}
          <AdminMenuItem 
            icon={<LineChart className="h-6 w-6 text-agri-700" />}
            title="Sales Reports"
            description="View sales analytics and generate reports"
            link="/admin/reports"
          />
          
          {/* Settings (Placeholder) */}
          <AdminMenuItem 
            icon={<Settings className="h-6 w-6 text-agri-700" />}
            title="Store Settings"
            description="Configure store policies and preferences"
            link="/admin/settings"
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;
