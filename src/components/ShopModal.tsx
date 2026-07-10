import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useOutfitStore } from '../store/useOutfitStore';
import { outfits } from '../data/outfits';

export default function ShopModal() {
  const activeModal = useOutfitStore((s) => s.activeModal);
  const closeModal = useOutfitStore((s) => s.closeModal);
  const setActiveIndex = useOutfitStore((s) => s.setActiveOutfitIndex);
  const setTryOnActive = useOutfitStore((s) => s.setTryOnActive);
  const modalRef = useRef<HTMLDivElement>(null);

  const isOpen = activeModal === 'shop';

  useEffect(() => {
    if (!modalRef.current) return;
    if (isOpen) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto"
      style={{ opacity: 0 }}
      ref={modalRef}
    >
      <div className="fixed inset-0 bg-bg/95 backdrop-blur-2xl" onClick={closeModal} />

      <div className="relative z-10 w-full max-w-4xl bg-bg-card border border-border-medium rounded-3xl p-6 md:p-10 text-text-primary shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 border-b border-border-subtle pb-6">
          <div>
            <span className="text-xs font-semibold text-accent tracking-widest uppercase mb-1 block">
              Four Plus Four Shop & Partner Retailers
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Best prices, <span className="italic font-normal text-text-secondary">every look.</span>
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="w-9 h-9 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {outfits.map((item, index) => (
            <div
              key={item.id}
              className="glass-card p-4 flex flex-col justify-between group hover:border-accent/30"
            >
              <div>
                <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-neutral-surface flex flex-col items-center justify-center border border-hairline-border text-burgundy/30 relative">
                  <span className="text-3xl select-none">🧥</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-burgundy/50 mt-2">
                    Product Specimen
                  </span>
                </div>
                <h4 className="font-display text-base font-semibold text-text-primary mb-1">
                  {item.name}
                </h4>
                <p className="text-sm font-semibold text-accent mb-2">{item.price}</p>
                <p className="text-xs text-text-tertiary line-clamp-2 mb-4">{item.description}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setActiveIndex(index);
                    setTryOnActive(true);
                  }}
                  className="btn-secondary text-xs flex-1 py-2"
                >
                  Try On
                </button>
                <button
                  onClick={() => alert(`Redirecting to best price option for ${item.name} (${item.price})...`)}
                  className="btn-primary text-xs flex-1 py-2"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
