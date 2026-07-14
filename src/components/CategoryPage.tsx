import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';

interface CategoryPageProps {
  products: Product[];
  category: string;
  onBackToHome: () => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, size: string) => void;
}

export default function CategoryPage({
  products,
  category,
  onBackToHome,
  onProductClick,
  onAddToCart,
}: CategoryPageProps) {
  // Filter products by category, supporting both Lithuanian navigation headers and English database values
  const filteredProducts = products.filter((p) => {
    if (p.category === category) return true;
    if (category === 'KEPURĖS' && p.category === 'Hats') return true;
    if (category === 'MEGZTINIAI' && p.category === 'Sweaters') return true;
    if (category === 'MARŠKINĖLIAI' && p.category === 'T-Shirts') return true;
    if (category === 'KELNĖS' && p.category === 'Pants') return true;
    if (category === 'ŠORTAI' && p.category === 'Shorts') return true;
    if (category === 'BATAI' && p.category === 'Shoes') return true;
    if (category === 'KUPRINĖS' && p.category === 'Backpacks') return true;
    return false;
  });

  // Category specific display settings
  const categoryHeaders: Record<string, { title: string; subtitle: string; description: string }> = {
    MARŠKINĖLIAI: {
      title: 'MARŠKINĖLIAI',
      subtitle: 'T-SHIRTS & TEES',
      description: 'Aukščiausios kokybės medvilnė, modernūs kirpimai ir riboto leidimo grafiniai dizainai iš geriausių streetwear brendų.',
    },
    'T-Shirts': {
      title: 'MARŠKINĖLIAI',
      subtitle: 'T-SHIRTS & TEES',
      description: 'Aukščiausios kokybės medvilnė, modernūs kirpimai ir riboto leidimo grafiniai dizainai iš geriausių streetwear brendų.',
    },
    MEGZTINIAI: {
      title: 'MEGZTINIAI',
      subtitle: 'HOODIES & SWEATERS',
      description: 'Sunkūs audiniai, jaukūs kapišonai ir išskirtinis įvaizdis šaltuoju sezono metu. Tikras komfortas ir stilius.',
    },
    Sweaters: {
      title: 'MEGZTINIAI',
      subtitle: 'HOODIES & SWEATERS',
      description: 'Sunkūs audiniai, jaukūs kapišonai ir išskirtinis įvaizdis šaltuoju sezono metu. Tikras komfortas ir stilius.',
    },
    KELNĖS: {
      title: 'KELNĖS',
      subtitle: 'PANTS & CARGOS',
      description: 'Baggy stiliaus cargo kelnės, tvirtas ripstop audinys ir funkcionalus dizainas, sukurtas kasdieniam judėjimui.',
    },
    Pants: {
      title: 'KELNĖS',
      subtitle: 'PANTS & CARGOS',
      description: 'Baggy stiliaus cargo kelnės, tvirtas ripstop audinys ir funkcionalus dizainas, sukurtas kasdieniam judėjimui.',
    },
    ŠORTAI: {
      title: 'ŠORTAI',
      subtitle: 'SHORTS & SUMMER',
      description: 'Lengvi nailono šortai bei laisvalaikio modeliai karštoms vasaros dienoms miesto gatvėse.',
    },
    Shorts: {
      title: 'ŠORTAI',
      subtitle: 'SHORTS & SUMMER',
      description: 'Lengvi nailono šortai bei laisvalaikio modeliai karštoms vasaros dienoms miesto gatvėse.',
    },
    KEPURĖS: {
      title: 'KEPURĖS',
      subtitle: 'HEADWEAR & BEANIES',
      description: 'Rumbuoto mezgimo kepurės ir stilingi aksesuarai, užbaigiantys jūsų unikalų streetwear derinį.',
    },
    Hats: {
      title: 'KEPURĖS',
      subtitle: 'HEADWEAR & BEANIES',
      description: 'Rumbuoto mezgimo kepurės ir stilingi aksesuarai, užbaigiantys jūsų unikalų streetwear derinį.',
    },
    BATAI: {
      title: 'BATAI',
      subtitle: 'PREMIUM SNEAKERS',
      description: 'Išskirtiniai sneakeriai, legendiniai siluetai bei patogios zomšinės klumpės jūsų kasdieniam komfortui.',
    },
    Shoes: {
      title: 'BATAI',
      subtitle: 'PREMIUM SNEAKERS',
      description: 'Išskirtiniai sneakeriai, legendiniai siluetai bei patogios zomšinės klumpės jūsų kasdieniam komfortui.',
    },
    KUPRINĖS: {
      title: 'KUPRINĖS',
      subtitle: 'BAGS & BACKPACKS',
      description: 'Tvirtos, iš Cordura balistinio nailono pagamintos kuprinės ir aksesuarai, pasiruošę bet kokiems iššūkiams.',
    },
    Backpacks: {
      title: 'KUPRINĖS',
      subtitle: 'BAGS & BACKPACKS',
      description: 'Tvirtos, iš Cordura balistinio nailono pagamintos kuprinės ir aksesuarai, pasiruošę bet kokiems iššūkiams.',
    },
    Perfumes: {
      title: 'KVEPALAI',
      subtitle: 'NICHÉ PERFUMES',
      description: 'Prabangūs, nišiniai ir populiariausi aromatai, pabrėžiantys jūsų unikalų įvaizdį ir stilių.',
    },
    Accessories: {
      title: 'AKSESUARAI',
      subtitle: 'STREETWEAR ACCESSORIES',
      description: 'Stilingi diržai, akiniai, apyrankės ir smulkūs dizaino elementai pilnam jūsų derinio išbaigtumui.',
    }
  };

  const headerInfo = categoryHeaders[category] || {
    title: category,
    subtitle: 'PREMIUM DROPS',
    description: 'Išskirtiniai drabužiai ir aksesuarai iš jūsų mėgstamiausių streetwear prekių ženklų.',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-black text-white pt-28 pb-20 px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Navigation / Breadcrumb */}
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={onBackToHome}
            className="group flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-[#F3ED1D] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            GRĮŽTI Į PRADŽIĄ
          </button>
          <span className="text-neutral-700 font-mono text-xs">/</span>
          <span className="font-mono text-xs text-neutral-500 uppercase">{category}</span>
        </div>

        {/* Category Hero Block (Geometric Balance style) */}
        <div className="border border-neutral-900 bg-[#070707] p-8 sm:p-12 mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative overflow-hidden">
          {/* Decorative design grid overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <div className="w-full h-full bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>

          <div className="space-y-4 max-w-2xl relative z-10">
            <span className="text-[10px] font-mono font-black tracking-[0.25em] text-[#F3ED1D]">
              {headerInfo.subtitle}
            </span>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight uppercase text-white leading-none">
              {headerInfo.title}
            </h1>
            <p className="text-sm text-neutral-400 font-light leading-relaxed">
              {headerInfo.description}
            </p>
          </div>

          <div className="bg-black/40 border border-neutral-800/80 px-5 py-4 font-mono text-xs text-neutral-500 relative z-10">
            TURIME SANDĖLYJE:{' '}
            <span className="text-white font-bold">{filteredProducts.length} PREK.</span>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 border border-neutral-900 rounded bg-[#070707]">
            <p className="text-neutral-500 font-mono text-sm uppercase mb-4">Atsiprašome, šioje kategorijoje prekių šiuo metu nėra.</p>
            <button
              onClick={onBackToHome}
              className="bg-[#F3ED1D] text-black px-6 py-3 font-mono font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
            >
              Grįžti į pagrindinį
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#0e0e0e] border border-neutral-900 flex flex-col group relative"
              >
                {/* Image Box */}
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
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <span className="bg-black text-[#F3ED1D] border border-[#F3ED1D] px-4 py-2 font-mono text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                      <Eye className="w-4 h-4" /> PERŽIŪRĖTI DETAILS
                    </span>
                  </div>

                  <div className="absolute top-4 left-4 bg-black/80 px-3 py-1 border border-neutral-800 rounded">
                    <span className="text-[9px] font-mono font-bold tracking-wider text-[#F3ED1D] uppercase">
                      {product.brand}
                    </span>
                  </div>
                </div>

                {/* Info and action bar */}
                <div className="p-6 bg-[#0a0a0a] border-t border-neutral-900 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-500 uppercase block mb-1">
                      {product.brand}
                    </span>
                    <h3
                      onClick={() => onProductClick(product)}
                      className="text-white text-base font-bold tracking-tight hover:text-[#F3ED1D] transition-colors cursor-pointer mb-2 line-clamp-1"
                    >
                      {product.name}
                    </h3>
                    <p className="text-neutral-500 text-xs font-light line-clamp-2 leading-relaxed mb-4">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-neutral-900 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-neutral-600 uppercase font-bold">Kaina:</span>
                      {product.discountPrice ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-bold text-neutral-500 line-through font-mono">
                            €{product.price}
                          </span>
                          <span className="text-base font-black text-emerald-400 font-mono">
                            €{product.discountPrice}
                          </span>
                        </div>
                      ) : (
                        <span className="text-base font-black text-[#F3ED1D] font-mono">
                          €{product.price}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onProductClick(product)}
                      className="bg-neutral-900 hover:bg-[#F3ED1D] text-white hover:text-black font-mono font-bold text-[10px] tracking-wider px-4 py-2.5 flex items-center gap-2 border border-neutral-800 hover:border-[#F3ED1D] transition-all cursor-pointer"
                    >
                      APŽIŪRĖTI
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
