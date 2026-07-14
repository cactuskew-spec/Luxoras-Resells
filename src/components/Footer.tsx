import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onScrollToTop: () => void;
  onNavClick: (sectionId: string) => void;
  onAdminClick: () => void;
}

export default function Footer({ onScrollToTop, onNavClick, onAdminClick }: FooterProps) {
  return (
    <footer className="relative bg-[#020202] pt-24 pb-12 border-t border-neutral-900 overflow-hidden font-mono text-xs">
      
      {/* Giant Typography Background Watermark "LUXORA" */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none select-none flex justify-center items-end opacity-[0.02] z-0 overflow-hidden">
        <span className="text-[25vw] font-black tracking-widest text-white leading-none">
          LUXORA
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-neutral-400 mb-16">
          
          {/* Left Block */}
          <div className="md:col-span-5 space-y-6">
            <h3 className="text-[#F3ED1D] text-xl font-black uppercase tracking-widest">
              LUXORA RESELLS
            </h3>
            <p className="text-neutral-500 font-sans leading-relaxed text-xs max-w-sm">
              Premium drabužių reselling komunija. Patikrinti produktai, greitas pristatymas, pilnas skaidrumas.
            </p>
            
            {/* Active Indicator status */}
            <div className="flex items-center gap-2.5 text-neutral-400 text-xs font-mono">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              <span>Aktyvūs — atsakome greitai</span>
            </div>
          </div>

          {/* Right Columns Grid */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Column 1: Naršymas */}
            <div className="space-y-4">
              <h4 className="text-white text-xs font-bold tracking-widest uppercase">
                NARŠYMAS
              </h4>
              <ul className="space-y-2 text-neutral-500">
                <li>
                  <button onClick={() => onNavClick('catalog')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Produktai
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavClick('catalog')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Brendai
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavClick('process')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Kaip veikia
                  </button>
                </li>
                <li>
                  <button onClick={onAdminClick} className="hover:text-yellow-400 font-bold transition-colors cursor-pointer text-left uppercase text-[10px] tracking-wider text-neutral-400">
                    🔒 VALDYMAS
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Socialiniai */}
            <div className="space-y-4">
              <h4 className="text-white text-xs font-bold tracking-widest uppercase">
                SOCIALINIAI
              </h4>
              <ul className="space-y-2 text-neutral-500">
                <li>
                  <a
                    href="https://discord.gg/s8DfbyZBX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tiktok.com/@luxoraresells"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    TikTok
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Informacija */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h4 className="text-white text-xs font-bold tracking-widest uppercase">
                INFORMACIJA
              </h4>
              <ul className="space-y-2 text-neutral-500">
                <li>100% Autentiška</li>
                <li>DS & VNDS</li>
                <li>LT Pristatymas</li>
              </ul>
            </div>

          </div>

        </div>

        {/* Footer Base bar */}
        <div className="border-t border-neutral-900/60 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-neutral-600 text-[10px]">
          <span>© 2026 LUXORA RESELLS. VISOS TEISĖS SAUGOMOS.</span>
          
          <button
            onClick={onScrollToTop}
            className="p-3 bg-[#0a0a0a] border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors rounded-full cursor-pointer"
            title="Į viršų"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
