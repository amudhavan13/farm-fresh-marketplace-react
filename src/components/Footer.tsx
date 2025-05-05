
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-agri-800 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b border-agri-600 pb-2">ARUL JAYAM MACHINERY</h3>
            <p className="mb-4">Your trusted partner for quality agricultural machinery and equipment since 1995.</p>
            <div className="flex items-center mb-3">
              <MapPin className="h-5 w-5 mr-2 text-agri-200" />
              <p>123 Farm Equipment Road, Agricultural District, Tamil Nadu, 600001</p>
            </div>
            <div className="flex items-center mb-3">
              <Phone className="h-5 w-5 mr-2 text-agri-200" />
              <p>+91 98765 43210</p>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-agri-200" />
              <p>contact@aruljayammachinery.com</p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b border-agri-600 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-agri-200 transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-agri-200 transition-colors">Products</Link></li>
              <li><Link to="/cart" className="hover:text-agri-200 transition-colors">Cart</Link></li>
              <li><Link to="/orders" className="hover:text-agri-200 transition-colors">Orders</Link></li>
              <li><Link to="/profile" className="hover:text-agri-200 transition-colors">My Account</Link></li>
            </ul>
          </div>
          
          {/* Store Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b border-agri-600 pb-2">Store Hours</h3>
            <div className="flex items-center mb-3">
              <Clock className="h-5 w-5 mr-2 text-agri-200" />
              <div>
                <p className="font-medium">Monday - Saturday</p>
                <p>9:00 AM - 6:00 PM</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-agri-200" />
              <div>
                <p className="font-medium">Sunday</p>
                <p>Closed</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-agri-600 text-center">
          <p>&copy; {new Date().getFullYear()} ARUL JAYAM MACHINERY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
