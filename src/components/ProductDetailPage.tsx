import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailPageProps {
  key?: string;
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, size: string) => void;
}

export default function ProductDetailPage({
  product,
  onBack,
  onAddToCart,
}: ProductDetailPageProps) {
  // Safe extraction of images list (fallback to main imageUrl if no list)
  const imageList = product.images && product.images.length > 0 
    ? product.images 
    : [product.imageUrl];

  const [activeImage, setActiveImage] = useState(imageList[0]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Standard sizes to display as buttons, as requested by the user
  const isClothing = ['KEPURĖS', 'MEGZTINIAI', 'MARŠKINĖLIAI', 'KELNĖS', 'ŠORTAI', 'Sweaters', 'T-Shirts', 'Pants', 'Shorts', 'Hats', 'Backpacks'].includes(product.category);
  const standardSizes = isClothing 
    ? ['XS', 'S', 'M', 'L', 'XL', 'XXL'] 
    : product.sizes; // for shoes or accessories, show their specific sizes (e.g. 42, 43, 44 or One Size)

  const handleAddToCartClick = () => {
    if (product.stock <= 0 || product.status !== 'In Stock') {
      return;
    }
    if (!selectedSize) {
      alert('Prašome pasirinkti dydį prieš pridedant į krepšelį!');
      return;
    }
    onAddToCart(product, selectedSize);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-black text-white pt-28 pb-20 px-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Back navigation */}
        <div className="mb-10">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-[#F3ED1D] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            GRĮŽTI Į SĄRAŠĄ
          </button>
        </div>

        {/* Product Details Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="product-detail-view">
          
          {/* LEFT COLUMN: Multi-image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="border border-neutral-900 bg-[#070707] aspect-[3/4] w-full overflow-hidden relative">
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#F3ED1D] text-black px-3 py-1 font-mono text-[9px] font-black tracking-widest uppercase">
                LIMITED DROP
              </div>
            </div>

            {/* Thumbnail Gallery Buttons */}
            {imageList.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {imageList.map((imgUrl, idx) => {
                  const isActive = activeImage === imgUrl;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`aspect-[3/4] bg-[#070707] border transition-all overflow-hidden cursor-pointer ${
                        isActive 
                          ? 'border-[#F3ED1D] ring-1 ring-[#F3ED1D]' 
                          : 'border-neutral-900 hover:border-neutral-700'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} galerija ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Interactive Product Info & Add to Cart */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Brand and category labels */}
              <div className="flex items-center gap-3">
                <span className="bg-neutral-900 border border-neutral-800 text-neutral-400 px-3 py-1 font-mono text-[10px] font-bold tracking-widest uppercase">
                  {product.brand}
                </span>
                <span className="text-neutral-500 font-mono text-xs uppercase">
                  {product.category}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase leading-none">
                {product.name}
              </h1>

              {/* Price display */}
              <div className="py-4 border-y border-neutral-900 flex items-baseline gap-3">
                <span className="text-neutral-500 font-mono text-xs uppercase">Kaina:</span>
                {product.discountPrice ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-lg font-bold text-neutral-500 line-through font-mono">
                      €{product.price}
                    </span>
                    <span className="text-3xl font-black text-emerald-400 font-mono">
                      €{product.discountPrice}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-black text-[#F3ED1D] font-mono">
                    €{product.price}
                  </span>
                )}
                <span className="text-xs text-neutral-500 font-mono">(PVM įskaičiuotas, apmokėjimas pavedimu)</span>
              </div>

              {/* Product Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">Aprašymas</h3>
                <p className="text-neutral-300 text-sm font-light leading-relaxed">
                  {product.description || 'Šis produktas pagamintas iš aukščiausios kokybės medžiagų, pasižymi ypatingu patvarumu ir atitinka aukščiausius streetwear standartus.'}
                </p>
              </div>

              {/* Size Selector Buttons */}
              <div className="space-y-3.5 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
                    Pasirinkite Dydį:
                  </span>
                  {selectedSize && (
                    <span className="text-xs font-mono text-[#F3ED1D] font-bold">
                      Pasirinkta: {selectedSize}
                    </span>
                  )}
                </div>

                {/* Grid layout for buttons */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {standardSizes.map((size) => {
                    const isAvailable = product.sizes.includes(size) || size === 'One Size';
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 font-mono text-xs font-bold uppercase transition-all ${
                          !isAvailable
                            ? 'bg-neutral-950 text-neutral-800 border border-neutral-950/40 line-through cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#F3ED1D] text-black border border-[#F3ED1D] font-black'
                            : 'bg-[#0a0a0a] text-neutral-300 border border-neutral-900 hover:border-neutral-700 hover:text-white cursor-pointer'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add to Cart Actions */}
              <div className="pt-6 space-y-3">
                <button
                  disabled={product.stock <= 0 || product.status !== 'In Stock'}
                  onClick={handleAddToCartClick}
                  className={`w-full py-4.5 font-mono font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 cursor-pointer border ${
                    product.stock <= 0 || product.status !== 'In Stock'
                      ? 'bg-neutral-900 border-neutral-850 text-neutral-500 cursor-not-allowed'
                      : addedFeedback
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-[#F3ED1D] border-[#F3ED1D] text-black hover:bg-white hover:border-white'
                  }`}
                >
                  {product.stock <= 0 || product.status !== 'In Stock' ? (
                    'ŠIUO METU IŠPARDUOTA'
                  ) : addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" /> PRIDĖTA SĖKMINGAI!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> ĮDĖTI Į KREPŠELĮ
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Premium assurances & security notices */}
            <div className="mt-8 pt-6 border-t border-neutral-900 space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#F3ED1D] mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase font-mono">100% Autentiškumas garantuotas</h4>
                  <p className="text-neutral-500 text-[11px] font-light">Kiekvienas dropas yra rankiniu būdu patikrinamas prieš pateikiant pardavimui. Jokios rizikos gauti klastotę.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck className="w-4 h-4 text-[#F3ED1D] mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase font-mono">Greitas siuntimas Lietuvoje</h4>
                  <p className="text-neutral-500 text-[11px] font-light">Išsiunčiame per LPExpress, Omniva arba DPD paštomatus iškart po gauto bankinio apmokėjimo pavedimo.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RefreshCw className="w-4 h-4 text-[#F3ED1D] mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase font-mono">Skaidri pagalba Discord</h4>
                  <p className="text-neutral-500 text-[11px] font-light">Kilus bet kokiems klausimams apie dydį ar prekę, esame pasiekiami gyvai mūsų Discord bendruomenėje.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </motion.div>
  );
}
