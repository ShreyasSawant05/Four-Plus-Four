import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useOutfitStore } from '../store/useOutfitStore';

gsap.registerPlugin(ScrollTrigger);

export default function AnalysisSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const setActiveModal = useOutfitStore((s) => s.setActiveModal);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('.analysis-animate');
    els.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        },
      );
    });
  }, []);

  return (
    <section ref={sectionRef} id="color" className="py-24 md:py-32">
      <div className="section-wrapper">
        <div className="text-center mb-14">
          <h2 className="analysis-animate font-display text-section text-text-primary">
            Beyond trends — <span className="italic">true understanding.</span>
          </h2>
          <p className="analysis-animate mt-5 text-text-secondary text-base md:text-lg max-w-xl mx-auto">
            Two dashboards designed by stylists and colorists, powered by AI vision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Color Analysis Card — More than a Palette */}
          <div
            onClick={() => setActiveModal('color')}
            className="analysis-animate glass-card p-6 md:p-8 bg-card-surface/90 border border-hairline-border rounded-3xl shadow-soft cursor-pointer hover:border-burgundy/25 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="bg-blush text-burgundy font-body font-semibold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full">
                Color Analysis
              </span>
              <span className="text-xs text-burgundy/60 font-body uppercase tracking-wider font-semibold">More than a Palette</span>
            </div>
            
            <p className="text-burgundy/80 text-sm leading-relaxed mb-6">
              Identify your seasonal palette. We analyze your skin, hair, and eye undertones to map colors that make you glow.
            </p>

            <div className="flex gap-2.5 mb-6">
              {['#840B14', '#D51927', '#DF972B', '#FEA3DC', '#7A5A1B', '#FFF3D1'].map((c) => (
                <div
                  key={c}
                  className="w-10 h-10 rounded-full border border-hairline-border/30 shadow-sm"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 border-t border-hairline-border pt-4 text-xs font-semibold text-burgundy/70">
              <div>
                <p className="text-[10px] uppercase text-burgundy/40 mb-1">Eyes</p>
                <p className="text-burgundy">Light Soft Warm (Hazel)</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-burgundy/40 mb-1">Skin</p>
                <p className="text-burgundy">Peach warm undertones</p>
              </div>
            </div>

            <button className="btn-link text-xs font-bold uppercase tracking-wider text-burgundy hover:text-[#66050b] group">
              Explore Palettes
              <span className="inline-block transform transition-transform group-hover:translate-x-1 ml-1">→</span>
            </button>
          </div>

          {/* Size & Fit Card — Baseline */}
          <div
            id="body"
            onClick={() => setActiveModal('body')}
            className="analysis-animate glass-card p-6 md:p-8 bg-card-surface/90 border border-hairline-border rounded-3xl shadow-soft cursor-pointer hover:border-burgundy/25 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="bg-blush text-burgundy font-body font-semibold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full">
                Fit Profile
              </span>
              <span className="text-xs text-burgundy/60 font-body uppercase tracking-wider font-semibold">Baseline</span>
            </div>

            <p className="text-burgundy/80 text-sm leading-relaxed mb-6">
              Understand your body dimensions and proportions. AI vision recommendations mapped to your personal shape.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-6 text-xs text-burgundy">
              {[
                { name: 'Shoulders', val: '95.3cm' },
                { name: 'Bust', val: '90.7cm' },
                { name: 'Waist', val: '72.4cm' },
                { name: 'Hips', val: '98.1cm' },
                { name: 'Height', val: '172.5cm' },
                { name: 'Inseam', val: '81.2cm' },
              ].map((m) => (
                <div key={m.name} className="bg-neutral-surface/40 border border-hairline-border/50 rounded-xl p-2.5">
                  <p className="text-[9px] uppercase text-burgundy/40">{m.name}</p>
                  <p className="font-bold text-xs mt-0.5">{m.val}</p>
                </div>
              ))}
            </div>

            {/* Three product placeholder boxes */}
            <div className="grid grid-cols-3 gap-3 mb-6 pt-4 border-t border-hairline-border">
              {[1, 2, 3].map((id) => (
                <div key={id} className="aspect-[4/3] bg-neutral-surface rounded-xl flex items-center justify-center border border-hairline-border text-[9px] text-burgundy/40 uppercase tracking-wider font-bold">
                  Fit Box {id}
                </div>
              ))}
            </div>

            <button className="btn-link text-xs font-bold uppercase tracking-wider text-burgundy hover:text-[#66050b] group">
              Manage Proportions
              <span className="inline-block transform transition-transform group-hover:translate-x-1 ml-1">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
