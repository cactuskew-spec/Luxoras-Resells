import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import HowItWorks from './components/HowItWorks';
import Community from './components/Community';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CategoryPage from './components/CategoryPage';
import ProductDetailPage from './components/ProductDetailPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { Product, CartItem, Order, StoreSettings } from './types';
import { PRODUCTS } from './data';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Custom routing states
  const [activeView, setActiveView] = useState<'home' | 'category' | 'product-detail' | 'admin-login' | 'admin-dashboard'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Dynamic Store Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('luxora_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing settings:', e);
      }
    }
    return {
      storeName: 'LUXORA RESELLS',
      logo: 'LUXORA',
      shippingPrice: 3,
      currency: '€',
      contactInfo: {
        email: 'info@luxora.lt',
        phone: '+37060000000',
        discord: 'https://discord.gg/s8DfbyZBX'
      }
    };
  });

  // Dynamic Products List (initialized from raw PRODUCTS array if not yet in localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('luxora_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Product[];
        return parsed.map(p => {
          if (p.category === 'BATAI' || p.category === 'Shoes') {
            return {
              ...p,
              sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
            };
          }
          return p;
        });
      } catch (e) {
        console.error('Error parsing products:', e);
      }
    }
    return PRODUCTS.map(p => ({
      ...p,
      stock: p.stock !== undefined ? p.stock : 10,
      status: p.status !== undefined ? p.status : 'In Stock'
    }));
  });

  // Dynamic Orders List (initialized with a few premium mock orders)
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('luxora_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing orders:', e);
      }
    }
    return [
      {
        id: 'ORD-9482',
        customerInfo: {
          fullName: 'Danielius Klimas',
          email: 'klimasdanielius433@gmail.com',
          phone: '+37064398112',
          address: 'Vilniaus g. 12-4',
          city: 'Vilnius',
          deliveryMethod: 'Omniva'
        },
        items: [
          { product: PRODUCTS[0], quantity: 1, selectedSize: 'M' }
        ],
        total: 31,
        status: 'Delivered',
        createdAt: '2026-07-10T12:30:00.000Z'
      },
      {
        id: 'ORD-7391',
        customerInfo: {
          fullName: 'Karolis Petrauskas',
          email: 'karolis.petra@gmail.com',
          phone: '+37068212345',
          address: 'Savanorių pr. 102',
          city: 'Kaunas',
          deliveryMethod: 'LPExpress'
        },
        items: [
          { product: PRODUCTS[2], quantity: 1, selectedSize: '43' }
        ],
        total: 123,
        status: 'Shipped',
        createdAt: '2026-07-12T15:45:00.000Z'
      },
      {
        id: 'ORD-2810',
        customerInfo: {
          fullName: 'Eglė Vasiliauskaitė',
          email: 'egle.vas@inbox.lt',
          phone: '+37061122334',
          address: 'Liepų g. 45',
          city: 'Klaipėda',
          deliveryMethod: 'DPD'
        },
        items: [
          { product: PRODUCTS[5], quantity: 1, selectedSize: '39' }
        ],
        total: 113,
        status: 'Pending',
        createdAt: '2026-07-13T09:15:00.000Z'
      }
    ];
  });

  // Keep state synced with localStorage on change
  useEffect(() => {
    localStorage.setItem('luxora_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('luxora_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('luxora_settings', JSON.stringify(settings));
  }, [settings]);

  // Admin login persistence state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('luxora_admin_logged_in') === 'true';
  });

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('luxora_admin_logged_in', 'true');
    setActiveView('admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('luxora_admin_logged_in');
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleCreateOrder = (customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    deliveryMethod: string;
  }) => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const shippingPrice = customerInfo.deliveryMethod === 'LPExpress' ? 2.50 : 3.00;
    const orderTotal = cart.reduce((sum, item) => {
      const price = item.product.discountPrice !== undefined ? item.product.discountPrice : item.product.price;
      return sum + price * item.quantity;
    }, 0) + shippingPrice;

    const newOrder: Order = {
      id: orderId,
      customerInfo,
      items: cart.map(item => ({
        product: item.product,
        quantity: item.quantity,
        selectedSize: item.selectedSize
      })),
      total: orderTotal,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update dynamic products stock
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const cartItem = cart.find(item => item.product.id === p.id);
        if (cartItem) {
          const newStock = Math.max(0, (p.stock || 0) - cartItem.quantity);
          return {
            ...p,
            stock: newStock,
            status: newStock === 0 ? 'Out of Stock' : p.status
          };
        }
        return p;
      });
    });
  };

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('luxora_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
  }, []);

  // Save cart to LocalStorage on change
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('luxora_cart', JSON.stringify(newCart));
  };

  const handleAddToCart = (product: Product, size: string) => {
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.selectedSize === size
    );

    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      saveCart(newCart);
    } else {
      saveCart([...cart, { product, quantity: 1, selectedSize: size }]);
    }
    
    // Automatically open the cart drawer when item is added so the user gets instant, beautiful feedback
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, size: string, change: number) => {
    const newCart = cart
      .map((item) => {
        if (item.product.id === productId && item.selectedSize === size) {
          const newQty = item.quantity + change;
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    saveCart(newCart);
  };

  const handleRemoveFromCart = (productId: string, size: string) => {
    const newCart = cart.filter(
      (item) => !(item.product.id === productId && item.selectedSize === size)
    );
    saveCart(newCart);
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  // Custom navigation handler to scroll smoothly, routing back to home first if on another view
  const handleNavClick = (sectionId: string) => {
    if (activeView !== 'home') {
      setActiveView('home');
      setTimeout(() => {
        executeScroll(sectionId);
      }, 100);
    } else {
      executeScroll(sectionId);
    }
  };

  const executeScroll = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setActiveView('category');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleProductClick = (product: Product) => {
    // Look up the latest live product state (e.g. up-to-date price, discount, or stock)
    const latestProduct = products.find(p => p.id === product.id) || product;
    setSelectedProduct(latestProduct);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Full-screen Standalone Secure Admin Login View
  if (activeView === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={handleAdminLoginSuccess}
        onBackToStore={() => setActiveView('home')}
      />
    );
  }

  // Full-screen Standalone Modern Luxury Admin Workspace
  if (activeView === 'admin-dashboard') {
    return (
      <AdminDashboard
        products={products}
        orders={orders}
        settings={settings}
        onLogout={handleAdminLogout}
        onUpdateProducts={setProducts}
        onUpdateOrders={setOrders}
        onUpdateSettings={setSettings}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-400 selection:text-black antialiased">
      
      {/* Header Navigation with Dynamic Store Logo */}
      <Header
        onNavClick={handleNavClick}
        cartCount={totalCartCount}
        onCartOpen={() => setIsCartOpen(true)}
        onCategoryClick={handleCategoryClick}
        logo={settings.logo}
      />

      {/* Main Content Switcher */}
      {activeView === 'home' && (
        <main>
          {/* Hero Section */}
          <Hero onNavClick={handleNavClick} />

          {/* Product Catalog Section - Controlled and Database Connected */}
          <ProductCatalog
            products={products}
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
            onCategoryClick={handleCategoryClick}
          />

          {/* Process Flow "Kaip veikia" Section */}
          <HowItWorks />

          {/* Community Link Section */}
          <Community />
        </main>
      )}

      {activeView === 'category' && (
        <CategoryPage
          products={products}
          category={selectedCategory!}
          onBackToHome={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
        />
      )}

      {activeView === 'product-detail' && (
        <ProductDetailPage
          key={selectedProduct!.id}
          product={products.find(p => p.id === selectedProduct!.id) || selectedProduct!}
          onBack={() => {
            // Go back to active category page if we came from one, otherwise to home
            if (selectedCategory) {
              setActiveView('category');
            } else {
              setActiveView('home');
            }
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Footer Section with Valdymas Administrator Trigger */}
      <Footer
        onScrollToTop={handleScrollToTop}
        onNavClick={handleNavClick}
        onAdminClick={() => {
          setActiveView(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login');
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
      />

      {/* Shared Persistent Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCreateOrder={handleCreateOrder}
        currency={settings.currency}
      />
    </div>
  );
}
