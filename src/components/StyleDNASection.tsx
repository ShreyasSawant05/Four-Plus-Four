import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useOutfitStore } from '../store/useOutfitStore';

gsap.registerPlugin(ScrollTrigger);

export default function StyleDNASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const setActiveModal = useOutfitStore((s) => s.setActiveModal);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('.dna-animate');
    els.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        },
      );
    });
  }, []);


  return (
    <section ref={sectionRef} id="styledna" className="py-24 md:py-32 bg-ivory">
      <div className="section-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="dna-animate inline-flex">
              <span className="text-burgundy/65 font-body font-bold text-xs tracking-widest uppercase">
                Style DNA
              </span>
            </div>

            <h2 className="dna-animate font-display text-section text-burgundy font-bold tracking-tight">
              Discover your Style DNA
            </h2>
            <p className="dna-animate text-burgundy/80 text-base md:text-lg leading-relaxed">
              A custom mix of style dimensions, palette tones, and proportions that form your digital twin.
            </p>

            <div className="dna-animate mt-8 space-y-4">
              {[
                { label: 'Custom color matching for skin, hair and eyes' },
                { label: 'Fit optimization based on your body proportions' },
                { label: 'Budget-aware recommendation logic' },
                { label: 'Fresh wardrobe edits every week' },
              ].map((point, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <span className="w-5 h-5 rounded-full bg-burgundy/10 flex items-center justify-center text-burgundy text-xs font-bold">✓</span>
                  <span className="text-burgundy/80 text-sm font-medium">{point.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveModal('quiz')}
              className="dna-animate inline-flex items-center gap-2 btn-secondary mt-4 text-xs font-semibold uppercase tracking-wider bg-burgundy text-ivory border-none hover:bg-[#66050b]"
            >
              Take the quiz
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Right Dashboard Visual */}
          <div className="lg:col-span-6 dna-animate">
            <div
              className="glass-card p-6 md:p-8 bg-card-surface/90 border border-hairline-border rounded-3xl shadow-soft cursor-pointer hover:border-burgundy/25 transition-all duration-300"
              onClick={() => setActiveModal('quiz')}
            >
              <h3 className="font-display text-lg text-burgundy font-bold mb-5 flex items-center justify-between">
                <span>Your Style Dimensions</span>
                <span className="text-xs text-amber-gold font-body tracking-wider uppercase font-semibold">Live Twin</span>
              </h3>

              <div className="space-y-4 mb-8">
                {[
                  { name: 'Minimalist', percentage: 75 },
                  { name: 'Techwear', percentage: 15 },
                  { name: 'Coquette', percentage: 10 },
                  { name: 'Quiet Luxury', percentage: 75 },
                ].map((dim) => (
                  <div key={dim.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-burgundy">
                      <span>{dim.name}</span>
                      <span>{dim.percentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-neutral-surface/65 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-gold rounded-full"
                        style={{ width: `${dim.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendation thumbnail stack */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-hairline-border">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="aspect-[3/4] bg-neutral-surface rounded-xl flex items-center justify-center border border-hairline-border text-[10px] text-burgundy/40 font-semibold uppercase tracking-wider">
                    Item {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
