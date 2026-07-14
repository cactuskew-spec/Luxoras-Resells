import { useState, useRef, useEffect } from 'react';
import { Menu, X, ShoppingBag, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onNavClick: (sectionId: string) => void;
  cartCount: number;
  onCartOpen: () => void;
  onCategoryClick: (category: string) => void;
  logo?: string;
}

export default function Header({
  onNavClick,
  cartCount,
  onCartOpen,
  onCategoryClick,
  logo = 'LUXORA'
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories: Array<'KEPURĖS' | 'MEGZTINIAI' | 'MARŠKINĖLIAI' | 'KELNĖS' | 'ŠORTAI' | 'BATAI' | 'KUPRINĖS'> = [
    'MARŠKINĖLIAI',
    'MEGZTINIAI',
    'KELNĖS',
    'ŠORTAI',
    'BATAI',
    'KEPURĖS',
    'KUPRINĖS',
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => onNavClick('hero')}
          className="flex items-center gap-2 group focus:outline-none cursor-pointer"
        >
          <span className="text-xl font-extrabold uppercase tracking-[0.2em] text-[#F3ED1D]">
            {logo}
          </span>
        </button>

        {/* Desktop Navigation & CTAs */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8 font-mono text-xs font-bold tracking-[0.15em] relative">
            {/* PRADINIS Link */}
            <button
              onClick={() => onNavClick('hero')}
              className="text-neutral-400 hover:text-white uppercase relative py-2 group cursor-pointer transition-colors"
            >
              PRADINIS
            </button>

            {/* KATALOGAS Link */}
            <button
              onClick={() => onNavClick('catalog')}
              className="text-neutral-400 hover:text-white uppercase relative py-2 group cursor-pointer transition-colors"
            >
              KATALOGAS
            </button>

            {/* KATEGORIJOS Dropdown Toggle */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-neutral-400 hover:text-white uppercase py-2 flex items-center gap-1 cursor-pointer transition-colors"
              >
                KATEGORIJOS <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-neutral-950 border border-neutral-800 shadow-2xl py-2 flex flex-col font-mono text-[10px] tracking-wider font-extrabold z-50">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onCategoryClick(cat);
                        setDropdownOpen(false);
                      }}
                      className="text-left px-5 py-3 text-neutral-400 hover:text-black hover:bg-[#F3ED1D] transition-all border-b border-neutral-900 last:border-0 cursor-pointer uppercase"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* KAIP VEIKIA Link */}
            <button
              onClick={() => onNavClick('process')}
              className="text-neutral-400 hover:text-white uppercase relative py-2 group cursor-pointer transition-colors"
            >
              KAIP VEIKIA
            </button>
          </nav>

          <div className="flex items-center gap-4 pl-4 border-l border-neutral-800">
            {/* Cart Icon Button */}
            <button
              onClick={onCartOpen}
              className="relative p-2.5 hover:bg-neutral-900 rounded-full text-white transition-colors cursor-pointer group"
              id="header-cart-toggle"
              aria-label="Atidaryti krepšelį"
            >
              <ShoppingBag className="w-5 h-5 group-hover:text-yellow-400 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center font-mono">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Discord Link Button */}
            <a
              href="https://discord.gg/s8DfbyZBX"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all"
            >
              DISCORD
            </a>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-3">
          {/* Cart Icon Button */}
          <button
            onClick={onCartOpen}
            className="relative p-2 text-white hover:text-yellow-400 transition-colors cursor-pointer"
            id="mobile-cart-toggle"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </button>

          {/* Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:text-yellow-400 focus:outline-none p-1"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-neutral-900 px-6 py-6 space-y-4 font-mono text-sm">
          <div className="space-y-3">
            {/* PRADINIS */}
            <button
              onClick={() => {
                onNavClick('hero');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-neutral-400 hover:text-white uppercase py-2 font-bold tracking-wider"
            >
              PRADINIS
            </button>

            {/* KATALOGAS */}
            <button
              onClick={() => {
                onNavClick('catalog');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-neutral-400 hover:text-white uppercase py-2 font-bold tracking-wider"
            >
              KATALOGAS
            </button>

            {/* KATEGORIJOS (Collapsible) */}
            <div>
              <button
                onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                className="w-full text-left text-neutral-400 hover:text-white uppercase py-2 font-bold tracking-wider flex justify-between items-center"
              >
                KATEGORIJOS <ChevronDown className={`w-4 h-4 transition-transform ${mobileCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileCategoriesOpen && (
                <div className="pl-4 mt-2 space-y-2 border-l border-neutral-800">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onCategoryClick(cat);
                        setMobileMenuOpen(false);
                        setMobileCategoriesOpen(false);
                      }}
                      className="block w-full text-left text-neutral-500 hover:text-white py-1.5 text-xs font-bold uppercase tracking-wider"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* KAIP VEIKIA */}
            <button
              onClick={() => {
                onNavClick('process');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-neutral-400 hover:text-white uppercase py-2 font-bold tracking-wider"
            >
              KAIP VEIKIA
            </button>
          </div>

          <div className="pt-4 border-t border-neutral-900 flex flex-col gap-3">
            <a
              href="https://discord.gg/s8DfbyZBX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-yellow-400 text-black py-3 font-bold uppercase text-xs tracking-wider"
            >
              DISCORD BENDRUOMENĖ
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
