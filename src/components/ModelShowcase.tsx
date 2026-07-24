import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { outfits } from '../data/outfits';
import { useOutfitStore } from '../store/useOutfitStore';

interface ModelShowcaseProps {
  modelWrapperRef: React.RefObject<HTMLDivElement | null>;
}

export default function ModelShowcase({ modelWrapperRef }: ModelShowcaseProps) {
  const activeIndex = useOutfitStore((s) => s.activeOutfitIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeOutfit = outfits[activeIndex];

  // Entrance animation
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 },
      );
    }
  }, []);

  // Reactive Crossfade Sync
  useEffect(() => {
    const wrapper = modelWrapperRef.current;
    if (!wrapper) return;
    const images = wrapper.querySelectorAll('.model-image');
    images.forEach((img, idx) => {
      gsap.to(img, {
        opacity: idx === activeIndex ? 1 : 0,
        duration: 0.5,
        ease: 'power2.inOut',
      });
    });
  }, [activeIndex, modelWrapperRef]);

  return (
    <div
      ref={containerRef}
      className="hidden lg:flex w-[40%] h-screen sticky top-0 items-center justify-center overflow-hidden bg-card-surface/30 border-l border-r border-hairline-border"
      style={{ opacity: 0 }}
    >
      {/* Dynamic background glow based on the active outfit theme */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${activeOutfit.accentGlow} 0%, transparent 70%)`,
        }}
      />

      {/* Centerpiece: Sticky container holding absolutely stacked divs (inset-0) */}
      <div
        ref={modelWrapperRef}
        className="absolute inset-8 rounded-3xl overflow-hidden border border-hairline-border"
      >
        {outfits.map((outfit, i) => (
          <div
            key={outfit.id}
            className="model-image absolute inset-0 flex flex-col items-center justify-center bg-neutral-surface border border-hairline-border transition-all duration-500 overflow-hidden group"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {/* Model Image background */}
            <img 
              src={outfit.modelImage} 
              alt={outfit.name} 
              className="absolute inset-0 w-full h-full object-cover object-center opacity-70 group-hover:scale-105 transition-transform duration-[1200ms]"
            />
            {/* Color overlay layer */}
            <div
              className="absolute inset-0 opacity-40 mix-blend-color pointer-events-none"
              style={{ backgroundColor: outfit.accentColor }}
            />
            {/* Dark gradient overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-burgundy/90 via-burgundy/30 to-black/40 pointer-events-none" />
            
            {/* Brand Specimen Label */}
            <div className="absolute top-6 left-6 text-[9px] font-bold tracking-widest uppercase text-ivory/60 select-none z-10">
              4+4 Twin Model // Specimen {String(outfit.id).padStart(2, '0')}
            </div>

            {/* Torso icon / specs */}
            <div className="flex flex-col items-center justify-center relative z-10 space-y-4 h-full pb-20 justify-end">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-ivory/30 flex items-center justify-center bg-white/10 select-none backdrop-blur-sm">
                <svg className="w-6 h-6 text-ivory/80" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a3 3 0 00-3 3v.75M12 3a3 3 0 013 3v.75m-6 0h6m-7.5 1.5l7.5-3 7.5 3v11.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15.75V5.25z" />
                </svg>
              </div>
              
              <div className="text-center">
                <h3 className="font-display text-xl md:text-2xl font-bold text-ivory tracking-tight px-6 leading-tight">
                  {outfit.name}
                </h3>
                <p className="text-[9px] font-body text-blush uppercase tracking-widest mt-1 font-bold">
                  Digital Twin Preview
                </p>
              </div>
            </div>

            {/* Bottom Color Swatch Tag */}
            <div className="absolute bottom-6 left-6 right-6 bg-burgundy text-ivory border border-white/10 rounded-xl p-3 flex justify-between items-center z-10 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: outfit.accentColor }} />
                <span className="text-[10px] font-bold text-blush uppercase tracking-wider">
                  Color Spec
                </span>
              </div>
              <span className="text-[10px] font-bold text-ivory">{outfit.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edge gradient borders to soften layout */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-ivory to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-ivory to-transparent pointer-events-none" />
    </div>
  );
}
