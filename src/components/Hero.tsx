import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onNavClick: (sectionId: string) => void;
}

export default function Hero({ onNavClick }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-[95vh] flex flex-col justify-between bg-black overflow-hidden pt-24 pb-12 px-6">
      {/* Background Sparkles & Starfield (Subtle visual accent from the screenshot) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[2px] h-[2px] bg-yellow-400 rounded-full opacity-40"></div>
        <div className="absolute top-[40%] right-[15%] w-[3px] h-[3px] bg-white rounded-full opacity-30"></div>
        <div className="absolute bottom-[30%] left-[25%] w-[1.5px] h-[1.5px] bg-white rounded-full opacity-20"></div>
        <div className="absolute bottom-[15%] right-[30%] w-[2.5px] h-[2.5px] bg-yellow-400 rounded-full opacity-30"></div>
        <div className="absolute top-[10%] right-[40%] w-[1px] h-[1px] bg-white rounded-full opacity-10"></div>
        <div className="absolute top-[70%] left-[45%] w-[2px] h-[2px] bg-yellow-400 rounded-full opacity-50"></div>
        <div className="absolute top-[30%] left-[70%] w-[2px] h-[2px] bg-white rounded-full opacity-20"></div>
        <div className="absolute bottom-[45%] right-[8%] w-[1.5px] h-[1.5px] bg-white rounded-full opacity-30"></div>
      </div>

      {/* Main content wrapper */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="max-w-4xl text-left space-y-8">
          
          {/* Top category/label */}
          <div className="flex items-center gap-3 font-mono text-[10px] font-black tracking-[0.3em] text-neutral-400">
            <span className="text-[#F3ED1D]">————</span>
            <span className="text-white">PREMIUM RESELLS</span>
            <span className="text-[#F3ED1D]">—</span>
            <span className="text-[#F3ED1D]">LT / EU</span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-7xl sm:text-9xl font-black tracking-tight text-white leading-none uppercase">
              LUXORA
            </h1>
            <h2 className="text-7xl sm:text-9xl font-black tracking-tight text-[#F3ED1D] leading-none uppercase drop-shadow-[0_0_20px_rgba(243,237,29,0.15)]">
              RESELLS
            </h2>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-neutral-400 max-w-lg leading-relaxed font-light">
            Patikrinti premium brendai. Greitas pristatymas. Pilnas skaidrumas. Stone Island, Palace, Supreme — ir dar daugiau. Jokio rizikos.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 pt-4">
            <button
              onClick={() => onNavClick('catalog')}
              className="bg-[#F3ED1D] hover:bg-[#d6cf12] text-black font-mono font-black text-xs uppercase tracking-[0.15em] px-8 py-4.5 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              PERŽIŪRĖTI DROPS <ArrowRight className="w-4 h-4" />
            </button>
            
            <a
              href="https://discord.gg/s8DfbyZBX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center sm:justify-start gap-2.5 font-mono text-xs font-bold tracking-widest text-neutral-400 hover:text-white transition-colors py-3"
            >
              <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              PRISIJUNGTI DISCORD
            </a>
          </div>

        </div>
      </div>

      {/* Bottom stats row */}
      <div className="max-w-7xl mx-auto w-full pt-12 border-t border-neutral-900 grid grid-cols-3 gap-6 sm:gap-12">
        <div className="space-y-1.5">
          <span className="block text-3xl sm:text-5xl font-extrabold text-white leading-none font-mono">50+</span>
          <span className="block text-[10px] sm:text-[11px] font-mono tracking-widest text-neutral-500 uppercase leading-relaxed">
            IŠSKIRTINIAI MODELIAI
          </span>
        </div>
        <div className="space-y-1.5">
          <span className="block text-3xl sm:text-5xl font-extrabold text-white leading-none font-mono">100%</span>
          <span className="block text-[10px] sm:text-[11px] font-mono tracking-widest text-neutral-500 uppercase leading-relaxed">
            AUTENTIŠKI PRODUKTAI
          </span>
        </div>
        <div className="space-y-1.5">
          <span className="block text-3xl sm:text-5xl font-extrabold text-white leading-none font-mono">LT</span>
          <span className="block text-[10px] sm:text-[11px] font-mono tracking-widest text-neutral-500 uppercase leading-relaxed">
            PRISTATYMAS
          </span>
        </div>
      </div>
    </section>
  );
}
