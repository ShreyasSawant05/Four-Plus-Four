import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement[]>([]);
  const nodesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const progressLine = progressLineRef.current;
    if (!section || !progressLine) return;

    // 1. Traveling progress line animation mapping to section scroll
    const progressTl = gsap.fromTo(
      progressLine,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 35%',
          end: 'bottom 65%',
          scrub: true,
        }
      }
    );

    // 2. Individual row ScrollTriggers for entrance and node highlights
    const triggers: ScrollTrigger[] = [];

    rowsRef.current.forEach((row, index) => {
      if (!row) return;

      // Card entrance animation
      const card = row.querySelector('.timeline-card');
      if (card) {
        gsap.fromTo(
          card,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 75%',
              once: true
            }
          }
        );
      }

      // Node highlight ScrollTrigger
      const trigger = ScrollTrigger.create({
        trigger: row,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          const node = nodesRef.current[index];
          if (!node) return;
          if (self.isActive) {
            node.classList.add('bg-burgundy', 'text-ivory', 'border-burgundy', 'scale-110');
            node.classList.remove('bg-ivory', 'text-burgundy', 'border-blush/60');
          } else {
            node.classList.remove('bg-burgundy', 'text-ivory', 'border-burgundy', 'scale-110');
            node.classList.add('bg-ivory', 'text-burgundy', 'border-blush/60');
          }
        }
      });

      triggers.push(trigger);
    });

    return () => {
      progressTl.scrollTrigger?.kill();
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} id="whatwedo" className="py-24 bg-ivory border-t border-hairline-border relative">
      <div className="section-wrapper max-w-4xl">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-xl mx-auto">
          <span className="text-burgundy/65 font-body font-bold text-xs tracking-widest uppercase">
            What We Do
          </span>
          <h2 className="font-display text-section text-burgundy font-bold mt-2 leading-tight">
            How Four plus Four works
          </h2>
          <p className="text-burgundy/80 text-sm md:text-base mt-3 leading-relaxed">
            Your personal digital style companion, taking you from style discovery to seamless virtual fittings and smart shopping.
          </p>
        </div>

        {/* Timeline Row Container */}
        <div className="relative pl-12 md:pl-16 space-y-16">
          
          {/* Continuous Dotted Background Track Line */}
          <div className="absolute left-[15px] md:left-[19px] top-6 bottom-6 w-[2px] border-l-2 border-dashed border-[#FEA3DC] pointer-events-none" />
          
          {/* Traveling Progress Line */}
          <div 
            ref={progressLineRef}
            className="absolute left-[15px] md:left-[19px] top-6 bottom-6 w-[2px] bg-burgundy origin-top scale-y-0 pointer-events-none"
          />

          {/* Step 1 */}
          <div
            ref={(el) => { if (el) rowsRef.current[0] = el; }}
            className="relative flex flex-col md:flex-row scroll-mt-24"
          >
            {/* Timeline node */}
            <div
              ref={(el) => { if (el) nodesRef.current[0] = el; }}
              className="absolute -left-[30px] md:-left-[38px] top-6 z-10 w-8 h-8 rounded-full border border-blush/60 bg-ivory text-burgundy text-xs font-bold flex items-center justify-center transition-all duration-300 shadow-sm"
            >
              1
            </div>

            {/* Feature Card */}
            <div className="timeline-card w-full lg:h-[240px] bg-card-surface border border-hairline-border rounded-3xl p-6 shadow-soft hover:border-burgundy/25 transition-colors flex flex-col justify-center">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left Text details */}
                <div className="lg:col-span-5 text-left space-y-2">
                  <div className="w-6 h-6 rounded-full bg-blush/30 text-burgundy flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="font-display text-xl font-bold text-burgundy leading-tight">
                    Inspiration
                  </h3>
                  <p className="text-burgundy/80 text-xs md:text-sm leading-relaxed">
                    Pinterest-worthy outfits, curated for you
                  </p>
                </div>
                {/* Right Visual Details */}
                <div className="lg:col-span-7 grid grid-cols-12 gap-3 h-36 items-stretch">
                  {/* Model illustration placeholder */}
                  <div className="col-span-7 rounded-2xl bg-[#EADCC2]/40 border border-hairline-border flex flex-col items-center justify-center text-burgundy/30 p-2">
                    <div className="w-8 h-18 border border-dashed border-burgundy/20 rounded-full flex items-center justify-center flex-col">
                      <span className="text-2xl">👗</span>
                    </div>
                  </div>
                  {/* Capsule pieces column */}
                  <div className="col-span-5 flex flex-col gap-1.5 justify-between">
                    <div className="flex-1 rounded-xl bg-white/60 border border-hairline-border flex items-center justify-center text-base shadow-sm">
                      🧥
                    </div>
                    <div className="flex-1 rounded-xl bg-white/60 border border-hairline-border flex items-center justify-center text-base shadow-sm">
                      👖
                    </div>
                    <div className="flex-1 rounded-xl bg-white/60 border border-hairline-border flex items-center justify-center text-base shadow-sm">
                      👜
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div
            ref={(el) => { if (el) rowsRef.current[1] = el; }}
            className="relative flex flex-col md:flex-row scroll-mt-24"
          >
            {/* Timeline node */}
            <div
              ref={(el) => { if (el) nodesRef.current[1] = el; }}
              className="absolute -left-[30px] md:-left-[38px] top-6 z-10 w-8 h-8 rounded-full border border-blush/60 bg-ivory text-burgundy text-xs font-bold flex items-center justify-center transition-all duration-300 shadow-sm"
            >
              2
            </div>

            {/* Feature Card */}
            <div className="timeline-card w-full lg:h-[240px] bg-card-surface border border-hairline-border rounded-3xl p-6 shadow-soft hover:border-burgundy/25 transition-colors flex flex-col justify-center">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left Text details */}
                <div className="lg:col-span-5 text-left space-y-2">
                  <div className="w-6 h-6 rounded-full bg-blush/30 text-burgundy flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h3 className="font-display text-xl font-bold text-burgundy leading-tight">
                    Virtual Try-On
                  </h3>
                  <p className="text-burgundy/80 text-xs md:text-sm leading-relaxed">
                    See the look on yourself instantly
                  </p>
                </div>
                {/* Right Visual Details */}
                <div className="lg:col-span-7 flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/40 border border-hairline-border/60 h-36">
                  <div className="w-[42%] h-full rounded-xl bg-neutral-surface flex flex-col items-center justify-center text-xl border border-hairline-border shadow-sm">
                    👤
                  </div>
                  <div className="text-burgundy/50 text-2xl font-bold animate-pulse text-center">
                    →
                  </div>
                  <div className="w-[42%] h-full rounded-xl bg-burgundy/10 flex flex-col items-center justify-center text-xl border border-burgundy/30 shadow-sm">
                    🧥✨
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div
            ref={(el) => { if (el) rowsRef.current[2] = el; }}
            className="relative flex flex-col md:flex-row scroll-mt-24"
          >
            {/* Timeline node */}
            <div
              ref={(el) => { if (el) nodesRef.current[2] = el; }}
              className="absolute -left-[30px] md:-left-[38px] top-6 z-10 w-8 h-8 rounded-full border border-blush/60 bg-ivory text-burgundy text-xs font-bold flex items-center justify-center transition-all duration-300 shadow-sm"
            >
              3
            </div>

            {/* Feature Card */}
            <div className="timeline-card w-full lg:h-[240px] bg-card-surface border border-hairline-border rounded-3xl p-6 shadow-soft hover:border-burgundy/25 transition-colors flex flex-col justify-center">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left Text details */}
                <div className="lg:col-span-5 text-left space-y-2">
                  <div className="w-6 h-6 rounded-full bg-blush/30 text-burgundy flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h3 className="font-display text-xl font-bold text-burgundy leading-tight">
                    Your Analysis
                  </h3>
                  <p className="text-burgundy/80 text-xs md:text-sm leading-relaxed">
                    Discover your best colors & undertones
                  </p>
                </div>
                {/* Right Visual Details */}
                <div className="lg:col-span-7 flex flex-col md:flex-row items-center gap-4 p-3 bg-white/40 border border-hairline-border/60 rounded-2xl w-full h-36">
                  {/* Conic donut color wheel */}
                  <div className="relative w-16 h-16 rounded-full border border-hairline-border flex items-center justify-center flex-shrink-0 shadow-sm"
                       style={{
                         background: 'conic-gradient(#840B14 0deg 72deg, #DF972B 72deg 144deg, #7A5A1B 144deg 216deg, #d4c5a0 216deg 288deg, #FEA3DC 288deg 360deg)'
                       }}>
                    <div className="w-7 h-7 bg-card-surface rounded-full border border-hairline-border/40" />
                  </div>
                  {/* Analysis values */}
                  <div className="text-left space-y-1.5 flex-1">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-burgundy/40 font-bold">Matched Palette</p>
                      <h4 className="font-display text-sm font-bold text-burgundy leading-tight">Warm Autumn</h4>
                    </div>
                    {/* Color dot swatches */}
                    <div className="flex gap-1 flex-wrap">
                      {['#840B14', '#9e522b', '#7A5A1B', '#EADCC2', '#DF972B', '#b2353b'].map((c) => (
                        <div key={c} className="w-5.5 h-5.5 rounded-full border border-white shadow-sm flex-shrink-0" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div
            ref={(el) => { if (el) rowsRef.current[3] = el; }}
            className="relative flex flex-col md:flex-row scroll-mt-24"
          >
            {/* Timeline node */}
            <div
              ref={(el) => { if (el) nodesRef.current[3] = el; }}
              className="absolute -left-[30px] md:-left-[38px] top-6 z-10 w-8 h-8 rounded-full border border-blush/60 bg-ivory text-burgundy text-xs font-bold flex items-center justify-center transition-all duration-300 shadow-sm"
            >
              4
            </div>

            {/* Feature Card */}
            <div className="timeline-card w-full lg:h-[240px] bg-card-surface border border-hairline-border rounded-3xl p-6 shadow-soft hover:border-burgundy/25 transition-colors flex flex-col justify-center">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left Text details */}
                <div className="lg:col-span-5 text-left space-y-2">
                  <div className="w-6 h-6 rounded-full bg-blush/30 text-burgundy flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h3 className="font-display text-xl font-bold text-burgundy leading-tight">
                    Perfect Accessories
                  </h3>
                  <p className="text-burgundy/80 text-xs md:text-sm leading-relaxed">
                    Complete your look with the right touches
                  </p>
                </div>
                {/* Right Visual Details */}
                <div className="lg:col-span-7 grid grid-cols-5 gap-2 w-full h-36">
                  {[
                    { label: 'Necklace', icon: '📿' },
                    { label: 'Earrings', icon: '✨' },
                    { label: 'Bag', icon: '👜' },
                    { label: 'Watch', icon: '⌚' },
                    { label: 'Glasses', icon: '🕶️' }
                  ].map((acc) => (
                    <div key={acc.label} className="h-full bg-white/60 border border-hairline-border rounded-xl flex flex-col items-center justify-center shadow-sm p-1">
                      <span className="text-xl select-none">{acc.icon}</span>
                      <span className="text-[8px] uppercase tracking-wider text-burgundy/40 font-bold mt-1 text-center truncate w-full">
                        {acc.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div
            ref={(el) => { if (el) rowsRef.current[4] = el; }}
            className="relative flex flex-col md:flex-row scroll-mt-24"
          >
            {/* Timeline node */}
            <div
              ref={(el) => { if (el) nodesRef.current[4] = el; }}
              className="absolute -left-[30px] md:-left-[38px] top-6 z-10 w-8 h-8 rounded-full border border-blush/60 bg-ivory text-burgundy text-xs font-bold flex items-center justify-center transition-all duration-300 shadow-sm"
            >
              5
            </div>

            {/* Feature Card */}
            <div className="timeline-card w-full lg:h-[240px] bg-card-surface border border-hairline-border rounded-3xl p-6 shadow-soft hover:border-burgundy/25 transition-colors flex flex-col justify-center">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left Text details */}
                <div className="lg:col-span-5 text-left space-y-2">
                  <div className="w-6 h-6 rounded-full bg-blush/30 text-burgundy flex items-center justify-center font-bold text-xs">
                    5
                  </div>
                  <h3 className="font-display text-xl font-bold text-burgundy leading-tight">
                    Shop the Look
                  </h3>
                  <p className="text-burgundy/80 text-xs md:text-sm leading-relaxed">
                    Find the best prices from trusted stores
                  </p>
                </div>
                {/* Right Visual Details */}
                <div className="lg:col-span-7 grid grid-cols-4 gap-2 w-full h-36">
                  {[
                    { label: 'Blazer', price: '₹2,499', icon: '🧥' },
                    { label: 'Pants', price: '₹1,799', icon: '👖' },
                    { label: 'Bag', price: '₹1,299', icon: '👜' },
                    { label: 'Sneakers', price: '₹1,999', icon: '👟' }
                  ].map((prod, idx) => (
                    <div key={idx} className="bg-white/80 border border-hairline-border rounded-xl p-1.5 flex flex-col justify-between items-center shadow-sm h-full">
                      <div className="w-full h-[60%] bg-[#EADCC2]/20 rounded-lg flex items-center justify-center text-base border border-hairline-border/30">
                        {prod.icon}
                      </div>
                      <span className="text-[9px] font-bold text-amber-gold">{prod.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
