export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string; // Dynamic or specific string categories
  price: number;
  discountPrice?: number;
  imageUrl: string;
  images?: string[];
  description?: string;
  sizes: string[];
  selectedSize?: string;
  stock?: number;
  status?: 'In Stock' | 'Out of Stock';
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface Order {
  id: string;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    deliveryMethod: string;
  };
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Paid' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface Customer {
  id: string; // Usually email
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  orderHistory: Order[];
  totalSpent: number;
}

export interface StoreSettings {
  storeName: string;
  logo: string;
  shippingPrice: number;
  currency: string;
  contactInfo: string | { email: string; phone: string; discord?: string };
}
