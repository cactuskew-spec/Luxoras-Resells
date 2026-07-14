import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  ShoppingBag as OrderIcon,
  Users,
  Settings as SettingsIcon,
  LogOut,
  TrendingUp,
  AlertTriangle,
  Euro,
  Plus,
  Edit2,
  Trash2,
  X,
  Upload,
  Search,
  ChevronRight,
  User,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Truck,
  PackageCheck,
  Package,
  Clock,
  Ban,
  FileText
} from 'lucide-react';
import { Product, Order, Customer, StoreSettings } from '../types';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  settings: StoreSettings;
  onLogout: () => void;
  onUpdateProducts: (newProducts: Product[]) => void;
  onUpdateOrders: (newOrders: Order[]) => void;
  onUpdateSettings: (newSettings: StoreSettings) => void;
}

type TabType = 'dashboard' | 'products' | 'categories' | 'orders' | 'customers' | 'settings';

export default function AdminDashboard({
  products,
  orders,
  settings,
  onLogout,
  onUpdateProducts,
  onUpdateOrders,
  onUpdateSettings
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  // Product state management variables
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('VISI');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for Product
  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCategory, setProdCategory] = useState('Sweaters');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodDiscountPrice, setProdDiscountPrice] = useState<number | undefined>(undefined);
  const [prodSizes, setProdSizes] = useState<string[]>(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
  const [prodStock, setProdStock] = useState(10);
  const [prodStatus, setProdStatus] = useState<'In Stock' | 'Out of Stock'>('In Stock');
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [imageInputUrl, setImageInputUrl] = useState('');
  const [sizeType, setSizeType] = useState<'apparel' | 'footwear'>('apparel');
  const [formError, setFormError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Category browse modal
  const [browseCategory, setBrowseCategory] = useState<string | null>(null);

  // Order state variables
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('VISI');

  // Customer state variables
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');

  // Settings form states (preloaded with current settings)
  const [storeName, setStoreName] = useState(settings.storeName);
  const [logoText, setLogoText] = useState(settings.logo);
  const [shippingPrice, setShippingPrice] = useState(settings.shippingPrice);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currency);
  const [contactEmail, setContactEmail] = useState<string>(() => {
    if (typeof settings.contactInfo === 'string') {
      return settings.contactInfo;
    }
    return settings.contactInfo?.email || '';
  });
  const [settingsSuccessMessage, setSettingsSuccessMessage] = useState(false);

  // Admin login credentials states
  const [adminEmail, setAdminEmail] = useState(() => {
    try {
      const saved = localStorage.getItem('luxora_admin_credentials');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.email || 'admin@luxora.com';
      }
    } catch (e) {}
    return 'admin@luxora.com';
  });

  const [adminPassword, setAdminPassword] = useState(() => {
    try {
      const saved = localStorage.getItem('luxora_admin_credentials');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.password || 'admin123';
      }
    } catch (e) {}
    return 'admin123';
  });

  // Category translations and list
  const requestedCategories = [
    { key: 'Hats', lt: 'Kepurės (Hats)' },
    { key: 'Perfumes', lt: 'Kvepalai (Perfumes)' },
    { key: 'Sweaters', lt: 'Megztiniai (Sweaters)' },
    { key: 'T-Shirts', lt: 'Marškinėliai (T-Shirts)' },
    { key: 'Pants', lt: 'Kelnės (Pants)' },
    { key: 'Shorts', lt: 'Šortai (Shorts)' },
    { key: 'Accessories', lt: 'Aksesuarai (Accessories)' },
    { key: 'Shoes', lt: 'Batai (Shoes)' },
    { key: 'Backpacks', lt: 'Kuprinės (Backpacks)' },
  ];

  // Helper size templates
  const apparelSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const footwearSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];

  // Metrics calculations
  const totalProducts = products.length;
  const totalOrdersCount = orders.length;
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const lowStockProducts = products.filter(p => p.stock <= 3 || p.status === 'Out of Stock');
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  // Aggregate customer details from orders
  const getAggregatedCustomers = (): Customer[] => {
    const customerMap = new Map<string, Customer>();

    orders.forEach(order => {
      const email = order.customerInfo.email.trim().toLowerCase();
      const existing = customerMap.get(email);
      if (existing) {
        existing.orderHistory.push(order);
        if (order.status !== 'Cancelled') {
          existing.totalSpent += order.total;
        }
      } else {
        customerMap.set(email, {
          id: email,
          fullName: order.customerInfo.fullName,
          email: order.customerInfo.email,
          phone: order.customerInfo.phone,
          address: order.customerInfo.address,
          city: order.customerInfo.city,
          orderHistory: [order],
          totalSpent: order.status !== 'Cancelled' ? order.total : 0
        });
      }
    });

    return Array.from(customerMap.values());
  };

  const aggregatedCustomers = getAggregatedCustomers();

  // Handle open modal for ADD Product
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdBrand('');
    setProdDesc('');
    setProdCategory('Sweaters');
    setSizeType('apparel');
    setProdPrice(0);
    setProdDiscountPrice(undefined);
    setProdSizes(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
    setProdStock(10);
    setProdStatus('In Stock');
    setProdImages([
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop'
    ]);
    setImageInputUrl('');
    setFormError('');
    setIsProductModalOpen(true);
  };

  // Handle open modal for EDIT Product
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdBrand(product.brand);
    setProdDesc(product.description || '');
    setProdCategory(product.category);
    const isFootwear = product.category === 'Shoes' || product.category === 'BATAI' || product.category === 'batai' || product.category === 'shoes';
    setSizeType(isFootwear ? 'footwear' : 'apparel');
    setProdPrice(product.price);
    setProdDiscountPrice(product.discountPrice);
    setProdSizes(product.sizes);
    setProdStock(product.stock);
    setProdStatus(product.status);
    setProdImages(product.images || [product.imageUrl]);
    setImageInputUrl('');
    setFormError('');
    setIsProductModalOpen(true);
  };

  // Save or Add product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodBrand || prodImages.length === 0) {
      setFormError('Prašome užpildyti visus privalomus laukus (pavadinimą, prekinį ženklą) ir įkelti bent vieną nuotrauką.');
      return;
    }
    setFormError('');

    const calculatedStatus = prodStock <= 0 ? 'Out of Stock' : prodStatus;

    if (editingProduct) {
      // Edit mode
      const updated = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: prodName,
            brand: prodBrand,
            description: prodDesc,
            category: prodCategory,
            price: prodPrice,
            discountPrice: prodDiscountPrice || undefined,
            sizes: prodSizes,
            stock: Number(prodStock),
            status: calculatedStatus,
            imageUrl: prodImages[0],
            images: prodImages
          };
        }
        return p;
      });
      onUpdateProducts(updated);
    } else {
      // Create mode
      const newId = `${prodBrand.toLowerCase().replace(/\s+/g, '-')}-${prodName.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`;
      const newProduct: Product = {
        id: newId,
        name: prodName,
        brand: prodBrand,
        description: prodDesc,
        category: prodCategory,
        price: prodPrice,
        discountPrice: prodDiscountPrice || undefined,
        sizes: prodSizes,
        stock: Number(prodStock),
        status: calculatedStatus,
        imageUrl: prodImages[0],
        images: prodImages
      };
      onUpdateProducts([newProduct, ...products]);
    }

    setIsProductModalOpen(false);
  };

  // Custom confirmation dialog trigger
  const triggerConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(null);
      }
    });
  };

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    triggerConfirm(
      'Ištrinti prekę',
      'Ar tikrai norite ištrinti šią prekę iš savo duomenų bazės? Šis veiksmas yra neatšaukiamas.',
      () => {
        const remaining = products.filter(p => p.id !== productId);
        onUpdateProducts(remaining);
      }
    );
  };

  // Add custom image URL
  const handleAddImageUrl = () => {
    if (imageInputUrl.trim()) {
      setProdImages([...prodImages, imageInputUrl.trim()]);
      setImageInputUrl('');
    }
  };

  // Remove image from array
  const handleRemoveImageIndex = (index: number) => {
    setProdImages(prodImages.filter((_, i) => i !== index));
  };

  // Simulate Image Upload with image compression to prevent browser freezing and LocalStorage quota issues
  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray: File[] = Array.from(e.target.files);
      const newImagesPromises = filesArray.map((file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              const maxDim = 600; // 600px is perfect for sharp thumbnails and details

              if (width > height) {
                if (width > maxDim) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                }
              } else {
                if (height > maxDim) {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                // Compress to highly optimized JPEG with 0.7 quality
                resolve(canvas.toDataURL('image/jpeg', 0.7));
              } else {
                resolve(event.target?.result as string || '');
              }
            };
            img.onerror = () => {
              resolve(event.target?.result as string || '');
            };
            img.src = event.target?.result as string || '';
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newImagesPromises).then(base64Urls => {
        setProdImages(prev => [...prev, ...base64Urls]);
      }).catch(err => {
        console.error('Error reading/compressing files:', err);
      });
    }
  };

  // Update order status
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status };
      }
      return o;
    });
    onUpdateOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  // Delete order
  const handleDeleteOrder = (orderId: string) => {
    triggerConfirm(
      'Ištrinti užsakymą',
      'Ar tikrai norite ištrinti šį užsakymą iš sistemos? Šis veiksmas yra neatšaukiamas.',
      () => {
        const remaining = orders.filter(o => o.id !== orderId);
        onUpdateOrders(remaining);
        setSelectedOrder(null);
      }
    );
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedContactInfo = typeof settings.contactInfo === 'object' && settings.contactInfo !== null
      ? { ...settings.contactInfo, email: contactEmail }
      : contactEmail;

    onUpdateSettings({
      storeName,
      logo: logoText,
      shippingPrice: Number(shippingPrice),
      currency: currencySymbol,
      contactInfo: updatedContactInfo
    });

    // Save admin credentials
    localStorage.setItem('luxora_admin_credentials', JSON.stringify({
      email: adminEmail,
      password: adminPassword
    }));

    setSettingsSuccessMessage(true);
    setTimeout(() => setSettingsSuccessMessage(false), 3000);
  };

  // Size toggle helpers
  const handleToggleSize = (size: string) => {
    if (prodSizes.includes(size)) {
      setProdSizes(prodSizes.filter(s => s !== size));
    } else {
      setProdSizes([...prodSizes, size]);
    }
  };

  // Navigation utilities
  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500/10 border border-amber-500/40 text-amber-400';
      case 'Paid':
        return 'bg-blue-500/10 border border-blue-500/40 text-blue-400';
      case 'Packed':
        return 'bg-purple-500/10 border border-purple-500/40 text-purple-400';
      case 'Shipped':
        return 'bg-indigo-500/10 border border-indigo-500/40 text-indigo-400';
      case 'Delivered':
        return 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400';
      case 'Cancelled':
        return 'bg-red-500/10 border border-red-500/40 text-red-400';
      default:
        return 'bg-neutral-800 text-neutral-400';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-3.5 h-3.5" />;
      case 'Paid':
        return <Euro className="w-3.5 h-3.5" />;
      case 'Packed':
        return <Package className="w-3.5 h-3.5" />;
      case 'Shipped':
        return <Truck className="w-3.5 h-3.5" />;
      case 'Delivered':
        return <PackageCheck className="w-3.5 h-3.5" />;
      case 'Cancelled':
        return <Ban className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 flex flex-col md:flex-row antialiased font-sans selection:bg-yellow-400 selection:text-black">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-neutral-900 flex flex-col justify-between shrink-0">
        <div>
          {/* Sidebar Brand Header */}
          <div className="p-6 border-b border-neutral-900 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-[0.2em] text-yellow-400 uppercase">
                {settings.logo}
              </span>
              <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">
                Valdymo Skydelis
              </span>
            </div>
            <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 px-2 py-0.5 rounded font-mono text-[9px] font-bold">
              ADMIN
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {[
              { id: 'dashboard', label: 'Suvestinė', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'products', label: 'Prekės', icon: <ShoppingBag className="w-4 h-4" />, count: products.length },
              { id: 'categories', label: 'Kategorijos', icon: <Layers className="w-4 h-4" />, count: requestedCategories.length },
              { id: 'orders', label: 'Užsakymai', icon: <OrderIcon className="w-4 h-4" />, count: orders.length },
              { id: 'customers', label: 'Klientai', icon: <Users className="w-4 h-4" />, count: aggregatedCustomers.length },
              { id: 'settings', label: 'Nustatymai', icon: <SettingsIcon className="w-4 h-4" /> }
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-md transition-all font-mono text-xs uppercase font-bold tracking-wider cursor-pointer ${
                    isActive
                      ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/10'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-sans font-bold ${
                      isActive ? 'bg-black text-yellow-400' : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-neutral-900">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 rounded transition-all font-mono text-xs font-bold uppercase tracking-widest cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> ATSIJUNGTI
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        
        {/* Dynamic Page Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-900">
          <div>
            <span className="text-[9px] font-mono font-bold tracking-[0.25em] text-neutral-500 uppercase block mb-1">
              — {settings.storeName} —
            </span>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">
              {activeTab === 'dashboard' && 'Skydelio Suvestinė'}
              {activeTab === 'products' && 'Prekių Duomenų Bazė'}
              {activeTab === 'categories' && 'Kategorijų Apžvalga'}
              {activeTab === 'orders' && 'Užsakymų Valdymas'}
              {activeTab === 'customers' && 'Klientų Sąskaitos'}
              {activeTab === 'settings' && 'Sistemos Nustatymai'}
            </h1>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-neutral-500 uppercase">
            <span>Serverio statusas:</span>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span> ONLINE
            </span>
          </div>
        </div>

        {/* Tab 1: Dashboard / Metrics */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Bento Grid Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Metric 1: Total Revenue */}
              <div className="bg-[#0a0a0a] border border-neutral-900 p-6 rounded-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <TrendingUp className="w-20 h-20 text-yellow-400" />
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase font-black tracking-wider block mb-2">Bendra Apyvarta</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black font-mono text-white">
                    {settings.currency}{totalRevenue.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-emerald-400 mt-2">Visos patvirtintos pajamos</p>
              </div>

              {/* Metric 2: Total Orders */}
              <div className="bg-[#0a0a0a] border border-neutral-900 p-6 rounded-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <OrderIcon className="w-20 h-20 text-yellow-400" />
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase font-black tracking-wider block mb-2">Iš Viso Užsakymų</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black font-mono text-white">{totalOrdersCount}</span>
                </div>
                <p className="text-[10px] font-mono text-neutral-400 mt-2">Pateikti pirkinių krepšeliai</p>
              </div>

              {/* Metric 3: Total Products */}
              <div className="bg-[#0a0a0a] border border-neutral-900 p-6 rounded-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <ShoppingBag className="w-20 h-20 text-yellow-400" />
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase font-black tracking-wider block mb-2">Asortimento Prekės</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black font-mono text-white">{totalProducts}</span>
                </div>
                <p className="text-[10px] font-mono text-yellow-400 mt-2">Aktyvūs modeliai kataloge</p>
              </div>

              {/* Metric 4: Low Stock warning */}
              <div className={`border p-6 rounded-lg relative overflow-hidden group ${
                lowStockProducts.length > 0
                  ? 'bg-amber-950/10 border-amber-900/40'
                  : 'bg-[#0a0a0a] border-neutral-900'
              }`}>
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <AlertTriangle className="w-20 h-20 text-amber-500" />
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase font-black tracking-wider block mb-2">Mažas Prekių Likutis</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-black font-mono ${lowStockProducts.length > 0 ? 'text-amber-400' : 'text-white'}`}>
                    {lowStockProducts.length}
                  </span>
                </div>
                <p className={`text-[10px] font-mono mt-2 ${lowStockProducts.length > 0 ? 'text-amber-500' : 'text-neutral-500'}`}>
                  {lowStockProducts.length > 0 ? 'Prekės, kurių sandėlyje ≤ 3 vnt.' : 'Visų prekių atsargos pakankamos'}
                </p>
              </div>
            </div>

            {/* Bottom Row split: Recent Orders & Low Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Recent Orders List (Left / span 2) */}
              <div className="lg:col-span-2 bg-[#0a0a0a] border border-neutral-900 rounded-lg p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-900">
                    <h3 className="font-sans text-sm font-black uppercase tracking-wider text-white">Naujausi Užsakymai</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-neutral-400 hover:text-yellow-400 font-mono text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      Visi užsakymai <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {recentOrders.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500 font-mono text-xs uppercase">
                      Pateiktų užsakymų dar nėra.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse font-mono text-xs">
                        <thead>
                          <tr className="border-b border-neutral-900 text-neutral-500">
                            <th className="pb-3 uppercase tracking-wider">Užsakymas ID</th>
                            <th className="pb-3 uppercase tracking-wider">Klientas</th>
                            <th className="pb-3 uppercase tracking-wider">Miestas</th>
                            <th className="pb-3 uppercase tracking-wider">Suma</th>
                            <th className="pb-3 uppercase tracking-wider">Statusas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((o) => (
                            <tr
                              key={o.id}
                              onClick={() => {
                                setSelectedOrder(o);
                                setActiveTab('orders');
                              }}
                              className="border-b border-neutral-900/60 hover:bg-neutral-950/50 cursor-pointer transition-colors group"
                            >
                              <td className="py-3 font-bold text-yellow-400 group-hover:text-white">{o.id}</td>
                              <td className="py-3 text-neutral-300">{o.customerInfo.fullName}</td>
                              <td className="py-3 text-neutral-400">{o.customerInfo.city}</td>
                              <td className="py-3 font-black text-white">{settings.currency}{o.total}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 w-fit ${getStatusBadgeClass(o.status)}`}>
                                  {getStatusIcon(o.status)}
                                  {o.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Low Stock List (Right / span 1) */}
              <div className="bg-[#0a0a0a] border border-neutral-900 rounded-lg p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-900">
                    <h3 className="font-sans text-sm font-black uppercase tracking-wider text-white">Mažas Likutis</h3>
                    <span className="text-[10px] font-mono text-amber-500 uppercase font-black">ATSARGOS</span>
                  </div>

                  {lowStockProducts.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500 font-mono text-xs uppercase">
                      Visų prekių sandėlio atsargos geros!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {lowStockProducts.slice(0, 5).map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleOpenEditModal(p)}
                          className="flex items-center gap-3 p-2 bg-[#0e0e0e] border border-neutral-900 hover:border-neutral-800 transition-all rounded cursor-pointer group"
                        >
                          <div className="w-10 h-10 bg-neutral-900 rounded overflow-hidden flex-shrink-0">
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white truncate group-hover:text-yellow-400 transition-colors">
                              {p.name}
                            </h4>
                            <span className="text-[9px] font-mono text-neutral-500 uppercase block">
                              {p.brand} — {p.category}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                              p.stock === 0 ? 'bg-red-950 text-red-400' : 'bg-amber-950 text-amber-400'
                            }`}>
                              {p.stock} VNT.
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Products Management */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Control Bar: Search, Category, Add Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0a0a] p-4 border border-neutral-900 rounded-lg">
              
              <div className="flex flex-wrap gap-3 flex-1">
                {/* Search input */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Ieškoti pagal pavadinimą, prekinį ženklą..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded-md pl-10 pr-4 py-2 text-xs text-white focus:outline-none transition-colors font-mono"
                  />
                </div>

                {/* Category selector */}
                <select
                  value={selectedProductCategory}
                  onChange={(e) => setSelectedProductCategory(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-400 focus:border-yellow-400 rounded-md px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="VISI">Visos Kategorijos</option>
                  {requestedCategories.map(cat => (
                    <option key={cat.key} value={cat.key}>{cat.lt}</option>
                  ))}
                </select>
              </div>

              {/* Add Product Button */}
              <button
                onClick={handleOpenAddModal}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-mono font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-yellow-400/10 shrink-0"
              >
                <Plus className="w-4 h-4" /> Pridėti prekę
              </button>

            </div>

            {/* Products Table Card */}
            <div className="bg-[#0a0a0a] border border-neutral-900 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-neutral-900 bg-neutral-950 text-neutral-500">
                      <th className="p-4 uppercase tracking-wider">Prekė</th>
                      <th className="p-4 uppercase tracking-wider">Kategorija</th>
                      <th className="p-4 uppercase tracking-wider">Kaina</th>
                      <th className="p-4 uppercase tracking-wider">Nuolaida</th>
                      <th className="p-4 uppercase tracking-wider">Likutis</th>
                      <th className="p-4 uppercase tracking-wider">Statusas</th>
                      <th className="p-4 uppercase tracking-wider text-right">Veiksmai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter(p => {
                        const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.brand.toLowerCase().includes(productSearch.toLowerCase());
                        const matchesCategory = selectedProductCategory === 'VISI' || p.category === selectedProductCategory;
                        return matchesSearch && matchesCategory;
                      })
                      .map((p) => (
                        <tr key={p.id} className="border-b border-neutral-900/60 hover:bg-neutral-950/40 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-16 bg-neutral-900 border border-neutral-800 rounded overflow-hidden shrink-0">
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wide block mb-0.5">
                                  {p.brand}
                                </span>
                                <h4 className="text-white font-sans text-sm font-bold truncate max-w-xs">{p.name}</h4>
                                <span className="text-[9px] text-neutral-500 block truncate max-w-xs">ID: {p.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-neutral-300 uppercase font-bold text-[10px]">
                            {requestedCategories.find(c => c.key === p.category)?.lt || p.category}
                          </td>
                          <td className="p-4 text-white font-black text-sm">
                            {settings.currency}{p.price}
                          </td>
                          <td className="p-4 font-bold">
                            {p.discountPrice ? (
                              <span className="text-emerald-400">{settings.currency}{p.discountPrice}</span>
                            ) : (
                              <span className="text-neutral-600">—</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              p.stock === 0 ? 'bg-red-950 text-red-400' : p.stock <= 3 ? 'bg-amber-950 text-amber-400' : 'bg-neutral-900 text-neutral-300'
                            }`}>
                              {p.stock} VNT.
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              p.status === 'In Stock' && p.stock > 0
                                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                                : 'bg-red-500/10 border border-red-500/30 text-red-400'
                            }`}>
                              {p.status === 'In Stock' && p.stock > 0 ? 'Parduodama' : 'Išparduota'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="p-2 bg-neutral-900 hover:bg-yellow-400 hover:text-black border border-neutral-800 rounded text-neutral-400 transition-all cursor-pointer"
                                title="Redaguoti prekę"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-2 bg-neutral-900 hover:bg-red-500 hover:text-white border border-neutral-800 rounded text-neutral-400 transition-all cursor-pointer"
                                title="Ištrinti prekę"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Categories Overview */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl font-light">
              Mūsų parduotuvėje yra nustatytos šios <span className="text-white font-bold">9 pagrindinės kategorijos</span>.
              Žemiau matote kiekvienos kategorijos užpildymą, prekių kiekį sandėlyje ir galite tiesiogiai peržiūrėti bei filtruoti joje esančius produktus.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {requestedCategories.map((cat) => {
                const categoryProducts = products.filter(p => p.category === cat.key);
                const categoryStockCount = categoryProducts.reduce((sum, p) => sum + p.stock, 0);

                return (
                  <div
                    key={cat.key}
                    className="bg-[#0a0a0a] border border-neutral-900 rounded-lg p-6 flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                      <Layers className="w-20 h-20 text-yellow-400" />
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] font-mono text-yellow-400 uppercase font-black tracking-wider block">Kategorija</span>
                      <h3 className="text-lg font-black text-white group-hover:text-yellow-400 transition-colors uppercase">
                        {cat.lt}
                      </h3>
                      <div className="flex gap-4 font-mono text-xs pt-2">
                        <div>
                          <span className="text-neutral-500 block uppercase text-[10px]">Modeliai:</span>
                          <span className="text-white font-bold">{categoryProducts.length} prek.</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block uppercase text-[10px]">Iš viso vnt.:</span>
                          <span className="text-white font-bold">{categoryStockCount} vnt.</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setBrowseCategory(cat.key)}
                      className="mt-6 w-full py-2.5 bg-neutral-900 hover:bg-[#F3ED1D] text-neutral-400 hover:text-black font-mono font-bold text-[10px] tracking-wider uppercase border border-neutral-850 hover:border-[#F3ED1D] transition-all cursor-pointer"
                    >
                      Peržiūrėti Prekes
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Orders Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0a0a] p-4 border border-neutral-900 rounded-lg">
              
              <div className="flex flex-wrap gap-3 flex-1">
                {/* Search Order */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Ieškoti užsakymų pagal ID, klientą, telefoną..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded-md pl-10 pr-4 py-2 text-xs text-white focus:outline-none transition-colors font-mono"
                  />
                </div>

                {/* Status Selector filter */}
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-400 focus:border-yellow-400 rounded-md px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="VISI">Visi Statusai</option>
                  <option value="Pending">Pending (Laukiantys)</option>
                  <option value="Paid">Paid (Apmokėti)</option>
                  <option value="Packed">Packed (Supakuoti)</option>
                  <option value="Shipped">Shipped (Išsiųsti)</option>
                  <option value="Delivered">Delivered (Pristatyti)</option>
                  <option value="Cancelled">Cancelled (Atšaukti)</option>
                </select>
              </div>

            </div>

            {/* Orders list card */}
            <div className="bg-[#0a0a0a] border border-neutral-900 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-neutral-900 bg-neutral-950 text-neutral-500">
                      <th className="p-4 uppercase tracking-wider">Užsakymas</th>
                      <th className="p-4 uppercase tracking-wider">Klientas</th>
                      <th className="p-4 uppercase tracking-wider">Prekės</th>
                      <th className="p-4 uppercase tracking-wider">Suma</th>
                      <th className="p-4 uppercase tracking-wider">Pristatymas</th>
                      <th className="p-4 uppercase tracking-wider">Statusas</th>
                      <th className="p-4 uppercase tracking-wider text-right">Veiksmai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(o => {
                        const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customerInfo.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customerInfo.phone.includes(orderSearch) ||
                          o.customerInfo.email.toLowerCase().includes(orderSearch.toLowerCase());
                        const matchesStatus = orderStatusFilter === 'VISI' || o.status === orderStatusFilter;
                        return matchesSearch && matchesStatus;
                      })
                      .map((o) => {
                        const totalQuantity = o.items.reduce((sum, item) => sum + item.quantity, 0);
                        return (
                          <tr key={o.id} className="border-b border-neutral-900/60 hover:bg-neutral-950/40 transition-colors">
                            <td className="p-4 font-bold text-yellow-400">
                              {o.id}
                            </td>
                            <td className="p-4">
                              <div className="min-w-[120px]">
                                <span className="font-sans font-bold text-white block">{o.customerInfo.fullName}</span>
                                <span className="text-[10px] text-neutral-500 block">{o.customerInfo.email}</span>
                              </div>
                            </td>
                            <td className="p-4 text-neutral-300">
                              <span className="font-bold">{totalQuantity} vnt.</span> ({o.items.length} skirtingos prekės)
                            </td>
                            <td className="p-4 text-white font-black text-sm">
                              {settings.currency}{o.total}
                            </td>
                            <td className="p-4 text-neutral-400 text-[10px]">
                              <span className="font-bold text-white block">{o.customerInfo.deliveryMethod}</span>
                              {o.customerInfo.city}
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1.5 w-fit ${getStatusBadgeClass(o.status)}`}>
                                {getStatusIcon(o.status)}
                                {o.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedOrder(o)}
                                  className="px-3 py-1.5 bg-neutral-900 hover:bg-yellow-400 hover:text-black border border-neutral-800 rounded font-mono text-[10px] text-neutral-400 hover:border-yellow-400 font-bold transition-all cursor-pointer uppercase"
                                >
                                  Detaliau
                                </button>
                                <button
                                  onClick={() => handleDeleteOrder(o.id)}
                                  className="p-1.5 bg-neutral-900 hover:bg-red-500 hover:text-white border border-neutral-800 rounded text-neutral-400 transition-all cursor-pointer"
                                  title="Ištrinti užsakymą"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Customers CRM */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <p className="text-neutral-400 text-sm max-w-2xl font-light">
              Žemiau matote automatiškai pagal pirkimo el. paštą sugrupuotus klientų profilius, jų bendrą išleistą sumą ir įsigytų prekių istoriją.
            </p>

            {/* Customers Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0a0a] p-4 border border-neutral-900 rounded-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Ieškoti klientų pagal vardą, el. paštą, miestą..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded-md pl-10 pr-4 py-2 text-xs text-white focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            {/* Customers table */}
            <div className="bg-[#0a0a0a] border border-neutral-900 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-neutral-900 bg-neutral-950 text-neutral-500">
                      <th className="p-4 uppercase tracking-wider">Klientas</th>
                      <th className="p-4 uppercase tracking-wider">Kontaktai</th>
                      <th className="p-4 uppercase tracking-wider">Miestas</th>
                      <th className="p-4 uppercase tracking-wider">Užsakymai</th>
                      <th className="p-4 uppercase tracking-wider">Išleista suma</th>
                      <th className="p-4 uppercase tracking-wider text-right">Veiksmai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aggregatedCustomers
                      .filter(c => {
                        return c.fullName.toLowerCase().includes(customerSearch.toLowerCase()) ||
                          c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
                          c.city.toLowerCase().includes(customerSearch.toLowerCase());
                      })
                      .map((c) => (
                        <tr key={c.id} className="border-b border-neutral-900/60 hover:bg-neutral-950/40 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                                <User className="w-4 h-4 text-yellow-400" />
                              </div>
                              <span className="font-sans font-bold text-white text-sm">{c.fullName}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <span className="text-neutral-300 block">{c.email}</span>
                              <span className="text-[10px] text-neutral-500 font-bold block">{c.phone}</span>
                            </div>
                          </td>
                          <td className="p-4 text-neutral-400">
                            {c.city}
                          </td>
                          <td className="p-4 font-bold text-white">
                            {c.orderHistory.length} užsakym.
                          </td>
                          <td className="p-4 text-yellow-400 font-black text-sm">
                            {settings.currency}{c.totalSpent}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedCustomer(c)}
                              className="px-3 py-1.5 bg-neutral-900 hover:bg-yellow-400 hover:text-black border border-neutral-800 rounded font-mono text-[10px] text-neutral-400 hover:border-yellow-400 font-bold transition-all cursor-pointer uppercase"
                            >
                              Istorija
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Global Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-xl">
            <div className="bg-[#0a0a0a] border border-neutral-900 rounded-lg p-8 relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-yellow-500/20 via-yellow-400 to-yellow-500/20"></div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {settingsSuccessMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-950/40 border border-emerald-900/60 p-3 flex gap-2 items-center text-xs font-mono text-emerald-400"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Nustatymai sėkmingai išsaugoti! Pokyčiai aktyvūs el. parduotuvėje.</span>
                  </motion.div>
                )}

                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-2 tracking-wider">Parduotuvės Pavadinimas</label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded px-3 py-2.5 text-sm text-white focus:outline-none transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-2 tracking-wider">Logotipas (tekstinis)</label>
                  <input
                    type="text"
                    required
                    value={logoText}
                    onChange={(e) => setLogoText(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded px-3 py-2.5 text-sm text-white focus:outline-none transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-2 tracking-wider">Valiutos Simbolis</label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded px-3 py-2.5 text-sm text-white focus:outline-none transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-2 tracking-wider">Kontaktinis El. Paštas / Informacija</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded px-3 py-2.5 text-sm text-white focus:outline-none transition-colors font-mono"
                  />
                </div>

                <div className="border-t border-neutral-900 pt-6 mt-6 space-y-4">
                  <h4 className="text-xs font-mono font-black text-yellow-400 uppercase tracking-widest">— ADMINISTRATORIAUS PRIEIGA —</h4>
                  
                  <div>
                    <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-2 tracking-wider">Prisijungimo Vardas / El. Paštas</label>
                    <input
                      type="text"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded px-3 py-2.5 text-sm text-white focus:outline-none transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-2 tracking-wider">Prisijungimo Slaptažodis</label>
                    <input
                      type="text"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded px-3 py-2.5 text-sm text-white focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-mono font-bold text-xs uppercase tracking-widest py-3.5 rounded transition-all cursor-pointer shadow-lg shadow-yellow-400/10"
                >
                  IŠSAUGOTI NUSTATYMUS
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* Overlay Drawer: Product ADD/EDIT Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-[#0a0a0a] border-l border-neutral-850 z-50 flex flex-col shadow-2xl overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-neutral-900 bg-neutral-950/80 sticky top-0 z-10 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 bg-yellow-400/10 text-yellow-400 rounded">
                    <ShoppingBag className="w-4 h-4" />
                  </span>
                  <h3 className="font-sans text-base font-black uppercase tracking-wider text-white">
                    {editingProduct ? 'Redaguoti prekę' : 'Pridėti naują prekę'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white transition-colors hover:bg-neutral-900 rounded cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveProduct} className="p-6 space-y-6 flex-1">
                
                {/* Brand & Name */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-1.5">Prekinis ženklas *</label>
                    <input
                      type="text"
                      required
                      placeholder="pvz: NIKE, BAPE"
                      value={prodBrand}
                      onChange={(e) => setProdBrand(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded px-3 py-2 text-xs text-white focus:outline-none transition-colors font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-1.5">Prekės pavadinimas *</label>
                    <input
                      type="text"
                      required
                      placeholder="pvz: Air Max 95 „Neon“"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded px-3 py-2 text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-1.5">Kategorija *</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        setProdCategory(newCat);
                        if (newCat === 'Shoes' || newCat === 'BATAI') {
                          setProdSizes(footwearSizes);
                        } else {
                          setProdSizes(apparelSizes);
                        }
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 focus:border-yellow-400 rounded px-3 py-2 focus:outline-none cursor-pointer"
                    >
                      {requestedCategories.map(cat => (
                        <option key={cat.key} value={cat.key}>{cat.lt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-1.5">Pardavimo Statusas *</label>
                    <select
                      value={prodStatus}
                      onChange={(e) => setProdStatus(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 focus:border-yellow-400 rounded px-3 py-2 focus:outline-none cursor-pointer"
                    >
                      <option value="In Stock">In Stock (Turime sandėlyje)</option>
                      <option value="Out of Stock">Out of Stock (Išparduota)</option>
                    </select>
                  </div>
                </div>

                {/* Price, Discount Price, Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-1.5">Kaina ({settings.currency}) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded px-3 py-2 text-xs text-white focus:outline-none transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-1.5">Nuolaidos kaina ({settings.currency})</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="Nėra"
                      value={prodDiscountPrice !== undefined ? prodDiscountPrice : ''}
                      onChange={(e) => setProdDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded px-3 py-2 text-xs text-white focus:outline-none transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-1.5">Likutis sandėlyje *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={prodStock}
                      onChange={(e) => setProdStock(Number(e.target.value))}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded px-3 py-2 text-xs text-white focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-1.5">Aprašymas</label>
                  <textarea
                    rows={4}
                    placeholder="Sunkus storas audinys, gotikinis stilius..."
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded px-3 py-2 text-xs text-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Sizes Selection */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-mono font-bold text-neutral-400 uppercase">Dydžiai *</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSizeType('apparel');
                          setProdSizes(apparelSizes);
                        }}
                        className={`text-[9px] font-mono font-bold border px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          sizeType === 'apparel'
                            ? 'bg-yellow-400 text-black border-yellow-400'
                            : 'bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white'
                        }`}
                      >
                        Drabužių dydžiai
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSizeType('footwear');
                          setProdSizes(footwearSizes);
                        }}
                        className={`text-[9px] font-mono font-bold border px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          sizeType === 'footwear'
                            ? 'bg-yellow-400 text-black border-yellow-400'
                            : 'bg-neutral-900 border-neutral-850 text-neutral-400 hover:text-white'
                        }`}
                      >
                        Batų dydžiai
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 bg-neutral-950 p-3 border border-neutral-900 rounded">
                    {(sizeType === 'footwear' ? footwearSizes : apparelSizes).map((size) => {
                      const isSelected = prodSizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleToggleSize(size)}
                          className={`px-3 py-1.5 font-mono text-[10px] font-bold rounded border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-yellow-400 text-black border-yellow-400'
                              : 'bg-neutral-900 text-neutral-500 border-neutral-850 hover:text-white hover:border-neutral-700'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Image Upload list */}
                <div>
                  <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-2">Nuotraukos (Palaikoma keletas nuotraukų) *</label>
                  
                  {/* Local Simulated File Input Upload */}
                  <div className="flex items-center gap-3 bg-neutral-950 border border-neutral-900 p-4 rounded mb-4">
                    <div className="flex-1">
                      <p className="text-[10px] font-mono text-neutral-500 uppercase font-black mb-1">Įkelkite iš kompiuterio:</p>
                      <label className="flex items-center gap-2 justify-center py-2.5 px-4 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 rounded cursor-pointer text-xs font-mono font-bold uppercase transition-all">
                        <Upload className="w-4 h-4 text-yellow-400" />
                        Pasirinkti Failus (Keli)
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleSimulatedUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="shrink-0 w-[1px] h-12 bg-neutral-850"></div>
                    <div className="flex-1">
                      <p className="text-[10px] font-mono text-neutral-500 uppercase font-black mb-1">Pridėti iš interneto URL:</p>
                      <div className="flex gap-1">
                        <input
                          type="text"
                          placeholder="https://..."
                          value={imageInputUrl}
                          onChange={(e) => setImageInputUrl(e.target.value)}
                          className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-yellow-400 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="bg-yellow-400 text-black px-3 rounded font-mono text-xs font-bold cursor-pointer hover:bg-white transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Images List Row */}
                  {prodImages.length === 0 ? (
                    <div className="text-center py-8 bg-neutral-950 border border-dashed border-neutral-850 rounded text-xs font-mono text-neutral-500 uppercase">
                      Būtina pridėti bent 1 nuotrauką
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 bg-neutral-950 p-3 border border-neutral-900 rounded">
                      {prodImages.map((img, idx) => (
                        <div key={idx} className="aspect-[3/4] bg-neutral-900 border border-neutral-800 rounded relative group overflow-hidden">
                          <img src={img} alt="Product image preview" className="w-full h-full object-cover" />
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleRemoveImageIndex(idx)}
                              className="p-1 bg-black/80 text-red-400 hover:text-red-500 rounded cursor-pointer shadow"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {idx === 0 && (
                            <div className="absolute bottom-0 left-0 right-0 bg-yellow-400 text-black text-[8px] font-black font-mono text-center uppercase py-0.5">
                              Pagrindinė
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {formError && (
                  <div className="bg-red-950/40 border border-red-900/60 p-3 text-[11px] font-mono text-red-400 rounded">
                    {formError}
                  </div>
                )}

                {/* Actions bottom */}
                <div className="pt-4 border-t border-neutral-900 flex gap-3 sticky bottom-0 bg-[#0a0a0a] pb-2">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="w-1/3 bg-transparent hover:bg-neutral-900 text-neutral-400 hover:text-white font-mono font-bold text-xs uppercase tracking-wider py-3 border border-neutral-850 transition-colors cursor-pointer"
                  >
                    Atšaukti
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 bg-yellow-400 hover:bg-yellow-500 text-black font-mono font-bold text-xs uppercase tracking-wider py-3 border border-transparent shadow-lg shadow-yellow-400/10 transition-all cursor-pointer"
                  >
                    Išsaugoti prekę
                  </button>
                </div>

              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Overlay Drawer: Order Details View & Edit status */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-[#0a0a0a] border-l border-neutral-850 z-50 flex flex-col shadow-2xl overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-neutral-900 bg-neutral-950/80 sticky top-0 z-10 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono text-yellow-400 uppercase font-black block mb-0.5">UŽSAKYMAS DETALIAU</span>
                  <h3 className="font-sans text-base font-black uppercase text-white">
                    Užsakymo nr. {selectedOrder.id}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-neutral-400 hover:text-white transition-colors hover:bg-neutral-900 rounded cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6">
                
                {/* Status controls */}
                <div className="bg-neutral-950 p-4 border border-neutral-900 rounded-lg">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase font-black block mb-2">Užsakymo Statusas</span>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {(['Pending', 'Paid', 'Packed', 'Shipped', 'Delivered', 'Cancelled'] as const).map((st) => {
                      const isCurrent = selectedOrder.status === st;
                      return (
                        <button
                          key={st}
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                          className={`py-2 text-[10px] font-mono font-bold border transition-all cursor-pointer rounded ${
                            isCurrent
                              ? getStatusBadgeClass(st) + ' border-2 shadow-sm shadow-yellow-400/5'
                              : 'bg-neutral-900 text-neutral-500 border-neutral-855 hover:text-white hover:border-neutral-700'
                          }`}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Customer Information Section */}
                <div className="bg-[#0e0e0e] border border-neutral-900 rounded-lg p-5 space-y-3 font-mono text-xs text-neutral-300">
                  <h4 className="font-sans font-bold text-white text-sm border-b border-neutral-900 pb-2 uppercase tracking-wide flex items-center gap-1.5">
                    <User className="w-4 h-4 text-yellow-400" /> Kliento Duomenys
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-500 uppercase">Vardas:</span>
                      <span className="text-white font-bold">{selectedOrder.customerInfo.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 uppercase">El. paštas:</span>
                      <span className="text-white font-bold">{selectedOrder.customerInfo.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 uppercase">Telefonas:</span>
                      <span className="text-white font-bold">{selectedOrder.customerInfo.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 uppercase">Pristatymas:</span>
                      <span className="text-white font-bold">{selectedOrder.customerInfo.deliveryMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 uppercase">Adresas:</span>
                      <span className="text-white font-bold text-right max-w-[300px] truncate">{selectedOrder.customerInfo.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 uppercase">Miestas:</span>
                      <span className="text-white font-bold">{selectedOrder.customerInfo.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 uppercase">Data/Laikas:</span>
                      <span className="text-white font-bold">
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ordered Products list */}
                <div className="space-y-3">
                  <h4 className="font-sans font-bold text-white text-sm uppercase tracking-wide flex items-center gap-1.5">
                    <OrderIcon className="w-4 h-4 text-yellow-400" /> Užsakytos prekės
                  </h4>
                  
                  <div className="space-y-3.5 bg-neutral-950 p-4 border border-neutral-900 rounded-lg">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-2 bg-[#0e0e0e] border border-neutral-900 rounded">
                        <div className="w-12 h-16 bg-neutral-900 rounded border border-neutral-800 overflow-hidden shrink-0">
                          <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-yellow-400 tracking-wider font-mono block uppercase">
                              {item.product.brand}
                            </span>
                            <h5 className="text-white text-xs font-bold truncate">{item.product.name}</h5>
                            <span className="inline-block bg-neutral-900 text-neutral-400 font-mono text-[9px] uppercase font-bold px-1 py-0.5 mt-0.5 border border-neutral-800 rounded">
                              Dydis: {item.selectedSize}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs font-mono mt-1 pt-1 border-t border-neutral-900/60">
                            <span className="text-neutral-500">
                              {settings.currency}{item.product.price} x {item.quantity} vnt.
                            </span>
                            <span className="text-white font-black">
                              {settings.currency}{item.product.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="border-t border-neutral-900 pt-3 space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between text-neutral-500">
                        <span>Pristatymas:</span>
                        <span>€{(selectedOrder.customerInfo?.deliveryMethod === 'LPExpress' ? 2.50 : 3.00).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-white pt-1">
                        <span>KREPŠELIO BENDRA SUMA:</span>
                        <span className="text-yellow-400 text-base">{settings.currency}{selectedOrder.total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Danger operations */}
                <div className="pt-6 border-t border-neutral-900 flex gap-2">
                  <button
                    onClick={() => handleDeleteOrder(selectedOrder.id)}
                    className="w-full bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 text-red-400 rounded py-3 font-mono font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer text-center"
                  >
                    IŠTRINTI UŽSAKYMĄ
                  </button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Overlay Drawer: Browse items by Category */}
      <AnimatePresence>
        {browseCategory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setBrowseCategory(null)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-[#0a0a0a] border-l border-neutral-850 z-50 flex flex-col shadow-2xl overflow-y-auto"
            >
              <div className="p-6 border-b border-neutral-900 bg-neutral-950/80 sticky top-0 z-10 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono text-yellow-400 uppercase font-black block mb-0.5">KATEGORIJOS PREKĖS</span>
                  <h3 className="font-sans text-base font-black uppercase text-white">
                    {requestedCategories.find(c => c.key === browseCategory)?.lt}
                  </h3>
                </div>
                <button
                  onClick={() => setBrowseCategory(null)}
                  className="p-1 text-neutral-400 hover:text-white transition-colors hover:bg-neutral-900 rounded cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {products.filter(p => p.category === browseCategory).length === 0 ? (
                  <p className="text-center py-12 text-neutral-500 font-mono text-xs uppercase">
                    Šioje kategorijoje prekių šiuo metu nėra.
                  </p>
                ) : (
                  products
                    .filter(p => p.category === browseCategory)
                    .map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          handleOpenEditModal(p);
                          setBrowseCategory(null);
                        }}
                        className="flex items-center justify-between p-3 bg-[#0e0e0e] border border-neutral-900 rounded hover:border-neutral-800 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 bg-neutral-900 border border-neutral-850 rounded overflow-hidden">
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="text-[9px] font-mono text-yellow-400 block font-bold uppercase">{p.brand}</span>
                            <h4 className="text-xs font-bold text-white group-hover:text-yellow-400 transition-colors">{p.name}</h4>
                            <span className="text-[9px] font-mono text-neutral-500 font-bold block mt-0.5">Likutis: {p.stock} vnt.</span>
                          </div>
                        </div>
                        <span className="text-white font-black font-mono text-xs">
                          {settings.currency}{p.price}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Overlay Drawer: Customer details and order history history */}
      <AnimatePresence>
        {selectedCustomer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-[#0a0a0a] border-l border-neutral-850 z-50 flex flex-col shadow-2xl overflow-y-auto"
            >
              <div className="p-6 border-b border-neutral-900 bg-neutral-950/80 sticky top-0 z-10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-yellow-400/10 text-yellow-400 rounded">
                    <User className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[10px] font-mono text-yellow-400 uppercase font-black block mb-0.5">KLIENTO ISTORIJA</span>
                    <h3 className="font-sans text-base font-black uppercase text-white">{selectedCustomer.fullName}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1 text-neutral-400 hover:text-white transition-colors hover:bg-neutral-900 rounded cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Profile quick metadata */}
                <div className="bg-[#0e0e0e] border border-neutral-900 p-4 rounded space-y-2 font-mono text-xs text-neutral-300">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Mail className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Phone className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-400">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{selectedCustomer.address}, {selectedCustomer.city}</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-900 flex justify-between text-white font-bold text-xs">
                    <span>IŠ VISO IŠLEISTO CAPITAL:</span>
                    <span className="text-yellow-400">{settings.currency}{selectedCustomer.totalSpent}</span>
                  </div>
                </div>

                {/* History orders logs */}
                <div className="space-y-3.5">
                  <h4 className="font-sans font-black text-sm text-white uppercase tracking-wider flex items-center gap-1">
                    <FileText className="w-4 h-4 text-yellow-400" /> Užsakymų Istorija ({selectedCustomer.orderHistory.length})
                  </h4>

                  <div className="space-y-3">
                    {selectedCustomer.orderHistory.map((o) => (
                      <div
                        key={o.id}
                        onClick={() => {
                          setSelectedOrder(o);
                          setSelectedCustomer(null);
                          setActiveTab('orders');
                        }}
                        className="bg-neutral-950 p-4 border border-neutral-900 hover:border-neutral-800 rounded flex justify-between items-center cursor-pointer transition-all group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-yellow-400 group-hover:text-white transition-colors">{o.id}</span>
                            <span className="text-[9px] text-neutral-500 font-mono">{new Date(o.createdAt).toLocaleDateString()}</span>
                          </div>
                          <span className="text-xs text-neutral-400 font-mono">
                            {o.items.reduce((sum, item) => sum + item.quantity, 0)} vnt. už {settings.currency}{o.total}
                          </span>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold flex items-center gap-1 ${getStatusBadgeClass(o.status)}`}>
                          {getStatusIcon(o.status)}
                          {o.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Dialog */}
      <AnimatePresence>
        {confirmDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDialog(null)}
              className="fixed inset-0 bg-black z-[100] cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-0 m-auto w-full max-w-sm h-fit bg-[#0a0a0a] border border-neutral-850 p-6 z-[101] rounded-lg shadow-2xl flex flex-col space-y-4"
            >
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 className="font-sans text-sm font-black uppercase tracking-wider text-white">
                  {confirmDialog.title}
                </h3>
              </div>
              <p className="text-neutral-400 font-mono text-[11px] leading-relaxed">
                {confirmDialog.message}
              </p>
              <div className="flex gap-3 pt-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setConfirmDialog(null)}
                  className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-white rounded border border-neutral-800 transition-colors cursor-pointer uppercase font-bold"
                >
                  Atšaukti
                </button>
                <button
                  type="button"
                  onClick={confirmDialog.onConfirm}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors cursor-pointer uppercase font-bold"
                >
                  Patvirtinti
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
