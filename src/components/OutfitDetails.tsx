import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useOutfitStore } from '../store/useOutfitStore';
import { outfits } from '../data/outfits';

const lookProducts: Record<number, { store: string; name: string; price: string; active?: boolean }[]> = {
  0: [
    { store: 'Zara', name: 'Shadow Drawcord Hoodie', price: '₹2,499', active: true },
    { store: 'Everlane', name: 'Technical Shell Vest', price: '₹2,999' },
  ],
  1: [
    { store: 'Zara', name: 'Ivory Linen Blazer', price: '₹3,499', active: true },
    { store: 'Reformation', name: 'Silk Camisole', price: '₹4,299' },
    { store: 'COS', name: 'Tailored Trousers', price: '₹3,999' },
    { store: 'Nordstrom', name: 'Leather Sandals', price: '₹4,999' },
  ],
  2: [
    { store: 'Zara', name: 'Neon Track Jacket', price: '₹2,799', active: true },
    { store: 'COS', name: 'Technical Track Pants', price: '₹3,299' },
  ],
  3: [
    { store: 'Levi\'s', name: 'Stone Wash Trucker Jacket', price: '₹2,799', active: true },
    { store: 'A.P.C.', name: 'Straight Japanese Denim', price: '₹3,499' },
  ],
  4: [
    { store: 'Saint Laurent', name: 'Midnight Silk Bomber', price: '₹6,999', active: true },
    { store: 'COS', name: 'Ribbed Cotton Tee', price: '₹1,299' },
    { store: 'Zara', name: 'Midnight Tailored Jogger', price: '₹999' },
  ],
};

export default function OutfitDetails() {
  const activeIndex = useOutfitStore((s) => s.activeOutfitIndex);
  const setTryOnActive = useOutfitStore((s) => s.setTryOnActive);
  const outfit = outfits[activeIndex];
  const containerRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 },
      );
    }
  }, []);

  const items = lookProducts[activeIndex] || [];

  return (
    <div
      ref={containerRef}
      className="w-full lg:w-[28%] h-auto lg:h-screen sticky lg:top-0 flex flex-col justify-center px-6 md:px-10 py-8 lg:py-16 bg-ivory"
      style={{ opacity: 0 }}
    >
      <div className="space-y-6">
        {/* Look Number Header */}
        <div className="flex items-center gap-3">
          <span className="font-display text-burgundy/45 text-xs tracking-[0.3em] uppercase font-bold">
            Look {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <div className="h-px flex-1 bg-burgundy/10 max-w-[60px]" />
          <span className="font-display text-burgundy/30 text-xs tracking-widest font-bold">
            / {String(outfits.length).padStart(2, '0')}
          </span>
        </div>

        {/* Outfit Name */}
        <h1
          id="outfit-name"
          className="font-display font-bold text-2xl md:text-3xl lg:text-4xl leading-tight text-burgundy tracking-tight"
        >
          {outfit.name}
        </h1>

        {/* Outfit Description */}
        <p
          id="outfit-description"
          className="text-burgundy/75 text-xs md:text-sm leading-relaxed max-w-sm"
        >
          {outfit.description}
        </p>

        {/* Product price list checklist */}
        <div className="space-y-2.5 my-6 border-t border-b border-hairline-border py-4">
          {items.map((prod, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-card-surface border border-hairline-border shadow-sm text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="text-burgundy font-bold">✓</span>
                <div className="min-w-0">
                  <span className="font-bold text-burgundy/50 mr-1">{prod.store}:</span>
                  <span className="text-burgundy font-medium truncate">{prod.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-burgundy">{prod.price}</span>
                {prod.active && (
                  <span className="bg-amber-gold text-burgundy text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border border-burgundy/10">
                    Active
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            id="btn-tryon"
            onClick={() => setTryOnActive(true)}
            className="btn-primary text-xs font-bold uppercase tracking-wider bg-burgundy text-ivory hover:bg-[#66050b]"
          >
            Virtual Try-On
          </button>
          <button
            type="button"
            id="btn-details"
            className="px-6 py-3 border border-hairline-border rounded-full text-burgundy/60 font-body font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:border-burgundy/30 hover:text-burgundy bg-card-surface"
          >
            Details
          </button>
        </div>
      </div>

      {/* Progress dots at bottom */}
      <div className="flex gap-2 mt-8">
        {outfits.map((_, i) => (
          <div
            key={_.id}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? 'w-6 bg-burgundy'
                : 'w-2 bg-burgundy/10'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
