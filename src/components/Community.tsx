import { Users, Play, ArrowRight } from 'lucide-react';

export default function Community() {
  return (
    <section id="community" className="py-24 bg-black border-t border-neutral-900 text-center">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Meta Header */}
        <div className="flex items-center justify-center gap-3 font-mono text-[10px] font-black tracking-[0.3em] text-neutral-400 mb-6">
          <span className="text-[#F3ED1D]">— 005 —————</span>
          <span>KOMUNIJA</span>
        </div>

        {/* Section Title */}
        <div className="space-y-1 mb-6">
          <h2 className="text-6xl sm:text-7xl font-black tracking-tight text-white uppercase">
            PRISIJUNK
          </h2>
          <h2 className="text-6xl sm:text-7xl font-black tracking-tight text-[#F3ED1D] uppercase">
            PRIE MŪSŲ
          </h2>
        </div>

        {/* Subtitle description */}
        <p className="text-neutral-400 text-sm max-w-2xl mx-auto leading-relaxed font-light mb-16">
          Luxora Resells — tai ne tik parduotuvė. Tai komunija, kur mokomasi resellinti, dalijamasi žiniomis ir randami patikimi partneriai. Prisijunk nemokamai.
        </p>

        {/* Grid of 2 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-12">
          
          {/* Discord Card */}
          <div className="bg-[#070707] border border-neutral-900/80 p-8 flex flex-col justify-between min-h-[220px] group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-[#5865F2] flex items-center justify-center text-white">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-neutral-600 group-hover:text-white transition-colors font-mono text-sm">→</span>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-white text-lg font-extrabold uppercase tracking-wider">DISCORD</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Naujausi drops pranešimai, išskirtiniai rūbai ir patarimai. Greita pagalba gyvai.
              </p>
              <div className="inline-block bg-[#111] hover:bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-mono text-xs px-4 py-2 transition-all">
                discord.gg/s8DfbyZBX
              </div>
            </div>
          </div>

          {/* TikTok Card */}
          <div className="bg-[#070707] border border-neutral-900/80 p-8 flex flex-col justify-between min-h-[220px] group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-black border border-neutral-800 flex items-center justify-center text-white">
                <Play className="w-5 h-5 fill-white" />
              </div>
              <span className="text-neutral-600 group-hover:text-white transition-colors font-mono text-sm">→</span>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-white text-lg font-extrabold uppercase tracking-wider">TIKTOK</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Drops unboxing, resell patarimai, produktų apžvalgos. Sek mūsų TikTok.
              </p>
              <div className="inline-block bg-[#111] hover:bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-mono text-xs px-4 py-2 transition-all">
                @luxoraresells
              </div>
            </div>
          </div>

        </div>

        {/* Yellow Central Button */}
        <a
          href="https://discord.gg/s8DfbyZBX"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex bg-[#F3ED1D] hover:bg-[#d6cf12] text-black font-mono font-black text-xs uppercase tracking-[0.15em] px-8 py-4.5 items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          PRISIJUNGTI NEMOKAMAI <ArrowRight className="w-4 h-4" />
        </a>

      </div>
    </section>
  );
}
