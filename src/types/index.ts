
export interface User {
  id: string;
  username: string;
  email: string;
  address?: string;
  phoneNumber?: string;
  profilePicture?: string;
  isAdmin: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  images: string[];
  category: string;
  colors: string[];
  specifications: Record<string, string>;
  stock: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  images?: string[];
  date: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  color?: string;
  selected: boolean;
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
}

export interface Order {
  id: string;
  userId: string;
  username: string;
  items: OrderItem[];
  shippingAddress: {
    doorNumber: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'upi' | 'netBanking' | 'cashOnDelivery';
  status: OrderStatus;
  total: number;
  orderDate: string;
  deliveryDate?: string;
  canCancel: boolean;
  canReplace: boolean;
  canReturn: boolean;
}
