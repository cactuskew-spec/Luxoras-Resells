import { useState } from 'react';
import { Product } from '../types';
import { ShoppingCart, Eye } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product, size: string) => void;
  onProductClick: (product: Product) => void;
  onCategoryClick: (category: 'KEPURĖS' | 'MEGZTINIAI' | 'MARŠKINĖLIAI' | 'KELNĖS' | 'ŠORTAI' | 'BATAI' | 'KUPRINĖS') => void;
}

type CategoryType = 'VISI' | 'KEPURĖS' | 'MEGZTINIAI' | 'MARŠKINĖLIAI' | 'KELNĖS' | 'ŠORTAI' | 'BATAI' | 'KUPRINĖS';

export default function ProductCatalog({
  products,
  onAddToCart,
  onProductClick,
  onCategoryClick,
}: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('VISI');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  const categories: CategoryType[] = [
    'VISI',
    'KEPURĖS',
    'MEGZTINIAI',
    'MARŠKINĖLIAI',
    'KELNĖS',
    'ŠORTAI',
    'BATAI',
    'KUPRINĖS',
  ];

  // Map Lithuanian filter category names to product categories if needed, or check both
  const filteredProducts = selectedCategory === 'VISI'
    ? products
    : products.filter(p => {
        // Support matching both LT name and EN key
        if (p.category === selectedCategory) return true;
        if (selectedCategory === 'KEPURĖS' && p.category === 'Hats') return true;
        if (selectedCategory === 'MEGZTINIAI' && p.category === 'Sweaters') return true;
        if (selectedCategory === 'MARŠKINĖLIAI' && p.category === 'T-Shirts') return true;
        if (selectedCategory === 'KELNĖS' && p.category === 'Pants') return true;
        if (selectedCategory === 'ŠORTAI' && p.category === 'Shorts') return true;
        if (selectedCategory === 'BATAI' && p.category === 'Shoes') return true;
        if (selectedCategory === 'KUPRINĖS' && p.category === 'Backpacks') return true;
        return false;
      });

  const handleCategoryClick = (cat: CategoryType) => {
    setSelectedCategory(cat);
    if (cat !== 'VISI') {
      onCategoryClick(cat);
    }
  };

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  const handleAddToCartClick = (product: Product) => {
    const size = selectedSizes[product.id] || product.sizes[0];
    onAddToCart(product, size);
  };

  return (
    <section id="catalog" className="py-20 bg-black border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section title */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-[10px] font-mono font-black tracking-[0.25em] text-[#F3ED1D] block mb-2">
              — KATALOGAS —
            </span>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
              NAUJAUSI <span className="text-[#F3ED1D]">DROPS</span>
            </h2>
          </div>
          <p className="text-neutral-500 font-mono text-xs max-w-sm uppercase">
            Spauskite ant prekių, kad peržiūrėtumėte detales, nuotraukas ir pilną aprašymą.
          </p>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex flex-wrap gap-2.5 mb-12" id="categories-tabs">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2 font-mono text-[11px] font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
                  isActive
                    ? 'border border-[#F3ED1D] text-[#F3ED1D] bg-neutral-900/40'
                    : 'border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 bg-transparent'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="products-grid">
          {filteredProducts.map((product) => {
            const currentSize = selectedSizes[product.id] || product.sizes[0];
            return (
              <div
                key={product.id}
                className="bg-[#0e0e0e] border border-neutral-900/60 overflow-hidden flex flex-col justify-between group relative"
              >
                {/* Image Container - Clickable */}
                <div
                  onClick={() => onProductClick(product)}
                  className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 cursor-pointer"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Subtle Hover Action overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <span className="bg-black text-[#F3ED1D] border border-[#F3ED1D] px-3.5 py-2 font-mono text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                      <Eye className="w-4 h-4" /> APŽIŪRĖTI
                    </span>
                  </div>

                  {/* Subtle top brand label inside card */}
                  <div className="absolute top-3 left-3 bg-black/70 px-2 py-0.5 border border-neutral-800 rounded">
                    <span className="text-[9px] font-mono font-bold tracking-wider text-yellow-400 uppercase">
                      {product.brand}
                    </span>
                  </div>
                </div>

                {/* Info and Purchase Footer */}
                <div className="p-4 bg-[#0a0a0a] border-t border-neutral-900 flex flex-col justify-between flex-1">
                  <div>
                    {/* Brand */}
                    <span className="text-[10px] font-mono font-extrabold tracking-wider text-neutral-500 uppercase block mb-1">
                      {product.brand}
                    </span>
                    {/* Title - Clickable */}
                    <h3
                      onClick={() => onProductClick(product)}
                      className="text-white text-sm font-bold tracking-tight line-clamp-1 mb-2 hover:text-[#F3ED1D] transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>
                  </div>

                  {/* Pricing, Sizes and Cart Controls */}
                  <div className="mt-2 space-y-3">
                    {/* Size Selector dropdown */}
                    {product.sizes.length > 1 && (
                      <div className="flex items-center justify-between gap-2 bg-[#0e0e0e] border border-neutral-900 p-1.5 rounded">
                        <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold pl-1">Dydis:</span>
                        <select
                          value={currentSize}
                          onChange={(e) => handleSizeChange(product.id, e.target.value)}
                          className="bg-transparent text-white text-xs font-mono font-bold focus:outline-none cursor-pointer pr-1"
                        >
                          {product.sizes.map(size => (
                            <option key={size} value={size} className="bg-black text-white">
                              {size}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 pt-1">
                      {/* Price */}
                      <div className="flex flex-col">
                        {product.discountPrice ? (
                          <>
                            <span className="text-xs text-neutral-500 line-through font-mono">
                              €{product.price}
                            </span>
                            <span className="text-sm font-black text-emerald-400 font-mono">
                              €{product.discountPrice}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-black text-[#F3ED1D] font-mono">
                            €{product.price}
                          </span>
                        )}
                      </div>

                      {/* Buy / Cart Action Button */}
                      <button
                        onClick={() => product.stock > 0 && product.status === 'In Stock' && handleAddToCartClick(product)}
                        disabled={product.stock <= 0 || product.status !== 'In Stock'}
                        className={`font-mono font-black text-[10px] tracking-wider px-3 py-2 flex items-center gap-1 transition-all cursor-pointer ${
                          product.stock <= 0 || product.status !== 'In Stock'
                            ? 'bg-neutral-900 text-neutral-500 cursor-not-allowed border border-neutral-800'
                            : 'bg-[#F3ED1D] hover:bg-white text-black'
                        }`}
                        id={`add-to-cart-${product.id}`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {product.stock <= 0 || product.status !== 'In Stock' ? 'IŠPARDUOTA' : 'Į KREPŠELĮ'}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
