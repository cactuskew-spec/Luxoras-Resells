import { MessageSquare, Search, CreditCard, Package } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'SUSISIEK',
      description: 'Rask mus Discord arba TikTok. Paklausk apie turimus produktus arba pateik savo pageidavimus.',
      icon: MessageSquare,
      highlight: false,
    },
    {
      number: '02',
      title: 'PASIRINK',
      description: 'Peržiūrėk aktualius drops su nuotraukomis, dydžiais ir kainomis. Visi produktai patikrinti.',
      icon: Search,
      highlight: false,
    },
    {
      number: '03',
      title: 'APMOKĖK',
      description: 'Saugi transakcija. Priimame bank transfer ir kitus mokėjimo būdus. Gavęs – patvirtinu.',
      icon: CreditCard,
      highlight: true, // This card is bright yellow in the screenshot
    },
    {
      number: '04',
      title: 'GAUNI',
      description: 'Greitas siuntimas visoje Lietuvoje. Tracking number suteikiamas iš karto. 100% autentiškas produktas.',
      icon: Package,
      highlight: false,
    },
  ];

  return (
    <section id="process" className="py-24 bg-black border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Meta Header */}
        <div className="flex items-center gap-3 font-mono text-[10px] font-black tracking-[0.3em] text-neutral-400 mb-6">
          <span className="text-[#F3ED1D]">— 003 —————</span>
          <span>PROCESAS</span>
        </div>

        {/* Section Title */}
        <div className="mb-16">
          <h2 className="text-6xl sm:text-7xl font-black tracking-tight text-white leading-none uppercase">
            KAIP
          </h2>
          <h2 className="text-6xl sm:text-7xl font-black tracking-tight text-[#F3ED1D] leading-none uppercase">
            VEIKIA
          </h2>
        </div>

        {/* Steps Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="steps-grid">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.number}
                className={`p-8 relative flex flex-col justify-between min-h-[220px] transition-transform duration-300 hover:-translate-y-1 ${
                  step.highlight
                    ? 'bg-[#F3ED1D] text-black border border-[#F3ED1D]'
                    : 'bg-[#0a0a0a] text-white border border-neutral-900'
                }`}
              >
                {/* Step Number Watermark */}
                <span
                  className={`absolute right-6 top-6 text-5xl font-black font-mono leading-none select-none ${
                    step.highlight ? 'text-black/10' : 'text-neutral-900/40'
                  }`}
                >
                  {step.number}
                </span>

                {/* Step Icon */}
                <div className="mb-8">
                  <IconComponent className={`w-6 h-6 ${step.highlight ? 'text-black' : 'text-[#F3ED1D]'}`} />
                </div>

                {/* Step Copy */}
                <div>
                  <h3 className="font-sans text-lg font-extrabold tracking-wide uppercase mb-3">
                    {step.title}
                  </h3>
                  <p
                    className={`text-xs leading-relaxed font-light ${
                      step.highlight ? 'text-black/85' : 'text-neutral-400'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
