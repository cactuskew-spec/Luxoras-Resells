import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, size: string, change: number) => void;
  onRemoveFromCart: (productId: string, size: string) => void;
  onClearCart: () => void;
  onCreateOrder?: (customerInfo: { fullName: string; email: string; phone: string; address: string; city: string; deliveryMethod: string; }) => void;
  currency?: string;
}


export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onCreateOrder,
  currency = '€'
}: CartDrawerProps) {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'LPExpress' | 'Omniva' | 'DPD'>('Omniva');

  // Calculate pricing with potential active discount prices on products
  const getProductPrice = (item: CartItem) => {
    return item.product.discountPrice !== undefined ? item.product.discountPrice : item.product.price;
  };

  const getShippingPrice = (method: 'LPExpress' | 'Omniva' | 'DPD') => {
    return method === 'LPExpress' ? 2.50 : 3.00;
  };

  const itemsSubtotal = cart.reduce((sum, item) => sum + getProductPrice(item) * item.quantity, 0);
  const shippingPrice = getShippingPrice(deliveryMethod);
  const totalWithShipping = itemsSubtotal + shippingPrice;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCreateOrder) {
      onCreateOrder({
        fullName,
        email,
        phone,
        address,
        city,
        deliveryMethod
      });
    }
    setCheckoutStep('success');
  };

  const handleCopyOrderForDiscord = () => {
    const orderText = `**NAUJAS UŽSAKYMAS LUXORA RESELLS**
Vardas: ${fullName}
Telefonas: ${phone}
El. paštas: ${email}
Pristatymas: ${deliveryMethod === 'LPExpress' ? 'LP Express' : deliveryMethod} (${address}, ${city}) - €${shippingPrice.toFixed(2)}

**Prekės:**
${cart.map(item => `- ${item.product.brand} ${item.product.name} (Dydis: ${item.selectedSize}) x${item.quantity} - €${(getProductPrice(item) * item.quantity).toFixed(2)}`).join('\n')}

**Prekių suma:** €${itemsSubtotal.toFixed(2)}
**Siuntimas:** €${shippingPrice.toFixed(2)}
**Bendra suma:** €${totalWithShipping.toFixed(2)}
*Mokėjimo būdas: Bankinis pavedimas (Bank Transfer)*`;

    navigator.clipboard.writeText(orderText);
    alert('Užsakymo informacija nukopijuota! Galite nusiųsti ją mums į Discord greitesniam patvirtinimui.');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
            id="cart-overlay"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0a0a] border-l border-neutral-800 z-50 flex flex-col shadow-2xl"
            id="cart-drawer"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-yellow-400" />
                <h3 className="font-sans text-lg font-bold tracking-tight text-white uppercase">Pirkinių Krepšelis</h3>
                <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full font-mono">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-neutral-400 hover:text-white transition-colors hover:bg-neutral-900 rounded"
                id="close-cart-btn"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Switcher */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-neutral-500" />
                  </div>
                  <h4 className="text-white font-bold mb-1">Jūsų krepšelis tuščias</h4>
                  <p className="text-neutral-500 text-sm max-w-xs mb-6">
                    Įsidėkite patinkančių drabužių ar batų iš mūsų naujausių drops!
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold uppercase text-xs tracking-wider px-6 py-3 border border-white transition-colors"
                    id="start-shopping-btn"
                  >
                    Pradėti Pirkti
                  </button>
                </div>
              ) : checkoutStep === 'cart' ? (
                /* Cart Items List */
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedSize}`}
                      className="flex gap-4 p-4 bg-neutral-950 border border-neutral-900 rounded-lg group"
                    >
                      <div className="w-20 h-20 bg-neutral-900 overflow-hidden rounded flex-shrink-0 border border-neutral-800">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-yellow-400 tracking-wider font-mono block uppercase">
                            {item.product.brand}
                          </span>
                          <h4 className="text-white text-sm font-bold line-clamp-1">{item.product.name}</h4>
                          <span className="inline-block bg-neutral-900 text-neutral-400 font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 mt-1 border border-neutral-800 rounded">
                            Dydis: {item.selectedSize}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-neutral-800 rounded bg-neutral-900 overflow-hidden">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, -1)}
                              className="p-1 px-2 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold font-mono text-white">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, 1)}
                              className="p-1 px-2 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-yellow-400 font-bold font-mono text-sm">
                              {currency}{getProductPrice(item) * item.quantity}
                            </span>
                            <button
                              onClick={() => onRemoveFromCart(item.product.id, item.selectedSize)}
                              className="text-neutral-500 hover:text-red-500 p-1 transition-colors"
                              title="Pašalinti"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : checkoutStep === 'checkout' ? (
                /* Checkout Form */
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <h4 className="text-white font-bold border-b border-neutral-800 pb-2 uppercase tracking-wide text-xs">Pristatymo duomenys</h4>
                  
                  <div>
                    <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-1">Vardas ir Pavardė *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                      placeholder="Danielius K."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-1">El. Paštas *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                      placeholder="pavyzdys@gmail.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-1">Telefonas *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                      placeholder="+3706xxxxxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-1">Paštomato adresas / Gatvė *</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                      placeholder="pvz: Vilniaus g. 8, Omniva paštomatas"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-1">Miestas *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-400 rounded px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                      placeholder="Vilnius"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-1">Siuntimo būdas *</label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {(['Omniva', 'LPExpress', 'DPD'] as const).map((method) => {
                        const price = getShippingPrice(method);
                        const label = method === 'LPExpress' ? 'LP Express' : method;
                        return (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setDeliveryMethod(method)}
                            className={`py-2 px-1 text-[10px] font-mono font-bold border transition-colors flex flex-col items-center justify-center gap-0.5 rounded ${
                              deliveryMethod === method
                                ? 'bg-yellow-400 text-black border-yellow-400'
                                : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                            }`}
                          >
                            <span>{label}</span>
                            <span className={deliveryMethod === method ? 'text-black opacity-80 text-[9px] font-bold' : 'text-neutral-500 text-[9px]'}>
                              {currency}{price.toFixed(2)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="bg-neutral-950 p-4 border border-neutral-900 rounded-lg space-y-2 text-[11px] font-mono">
                    <div className="flex justify-between text-neutral-400">
                      <span>PREKIŲ SUMA:</span>
                      <span className="text-white font-bold">{currency}{itemsSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>PRISTATYMAS ({deliveryMethod === 'LPExpress' ? 'LP Express' : deliveryMethod}):</span>
                      <span className="text-white font-bold">{currency}{shippingPrice.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-neutral-900 pt-2 flex justify-between font-bold text-white text-xs">
                      <span className="uppercase">BENDRA SUMA:</span>
                      <span className="text-yellow-400 text-sm font-black">{currency}{totalWithShipping.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-neutral-950 p-3 border border-neutral-900 rounded-lg text-xs text-neutral-400 space-y-1.5 font-mono">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-yellow-400" />
                      APMOKĖJIMO INFORMACIJA:
                    </p>
                    <p>Užsakymą užregistravus gausite bankinius duomenis pavedimui atlikti. Prekės bus išsiųstos iškart po apmokėjimo.</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="w-1/3 bg-transparent hover:bg-neutral-900 text-white font-bold uppercase text-xs tracking-wider py-3 border border-neutral-800 transition-colors"
                    >
                      Atgal
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold uppercase text-xs tracking-wider py-3 border border-white transition-colors"
                    >
                      Pateikti užsakymą
                    </button>
                  </div>
                </form>
              ) : (
                /* Success Screen */
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-black" />
                  </div>
                  <h4 className="text-white text-xl font-bold uppercase tracking-wide">Užsakymas Priimtas!</h4>
                  <div className="bg-neutral-950 p-4 border border-neutral-900 rounded-lg space-y-2 text-left max-w-sm">
                    <p className="text-xs font-mono text-neutral-400 uppercase">Apmokėjimas atliekamas pavedimu:</p>
                    <div className="space-y-1 text-sm font-mono text-white bg-neutral-900 p-2.5 rounded border border-neutral-800">
                      <div><span className="text-neutral-500">Gavėjas:</span> LUXORA RESELLS</div>
                      <div><span className="text-neutral-500">Sąskaita (IBAN):</span> LT96 7300 0101 4920 3821</div>
                      <div><span className="text-neutral-500">Suma:</span> <span className="text-yellow-400 font-bold">{currency}{totalWithShipping.toFixed(2)}</span></div>
                      <div><span className="text-neutral-500">Paskirtis:</span> LUX-{Math.floor(1000 + Math.random() * 9000)}</div>
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                      Atlikus mokėjimą, atsiųskite mums pavedimo kopiją el. paštu arba tiesiogiai per Discord greitesniam siuntimui!
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 w-full max-w-sm">
                    <button
                      onClick={handleCopyOrderForDiscord}
                      className="w-full bg-[#5865F2] hover:bg-opacity-90 text-white font-bold uppercase text-xs tracking-wider py-3 border border-transparent transition-colors flex items-center justify-center gap-2"
                    >
                      Kopijuoti užsakymą Discordui
                    </button>
                    <button
                      onClick={() => {
                        onClearCart();
                        setCheckoutStep('cart');
                        onClose();
                      }}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold uppercase text-xs tracking-wider py-3 border border-white transition-colors"
                    >
                      Uždaryti & Tęsti Naršymą
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Summary (only if checkoutStep is 'cart') */}
            {cart.length > 0 && checkoutStep === 'cart' && (
              <div className="p-6 border-t border-neutral-800 bg-neutral-950">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-neutral-400 text-sm font-mono uppercase font-bold">Tarpinė suma:</span>
                  <span className="text-yellow-400 text-2xl font-black font-mono">{currency}{itemsSubtotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setCheckoutStep('checkout')}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold uppercase text-sm tracking-wider py-4 border border-white transition-all hover:-translate-y-0.5 active:translate-y-0 text-center block"
                  id="checkout-btn"
                >
                  Tęsti Užsakymą
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
