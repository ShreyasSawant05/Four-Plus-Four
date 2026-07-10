import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useOutfitStore } from '../store/useOutfitStore';

export default function ColorAnalysisModal() {
  const activeModal = useOutfitStore((s) => s.activeModal);
  const closeModal = useOutfitStore((s) => s.closeModal);
  const modalRef = useRef<HTMLDivElement>(null);

  const isOpen = activeModal === 'color';

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

  const palettes = [
    { name: 'Camel & Cream', color: '#c19a6b', desc: 'Base layers & outerwear' },
    { name: 'Terracotta', color: '#d27d59', desc: 'Knitwear & statement accessories' },
    { name: 'Rich Burgundy', color: '#800020', desc: 'Evening wear & leather' },
    { name: 'Moss & Forest', color: '#556b2f', desc: 'Tailoring & casual sets' },
    { name: 'Warm Gold', color: '#daa520', desc: 'Jewelry & hardware accent' },
  ];

  const avoidColors = ['Cool Pastels', 'Stark Black', 'Icy Silver', 'Neon Pink'];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto"
      style={{ opacity: 0 }}
      ref={modalRef}
    >
      <div className="fixed inset-0 bg-bg/95 backdrop-blur-2xl" onClick={closeModal} />

      <div className="relative z-10 w-full max-w-2xl bg-bg-card border border-border-medium rounded-3xl p-6 md:p-10 text-text-primary shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 border-b border-border-subtle pb-6">
          <div>
            <span className="text-xs font-semibold text-accent tracking-widest uppercase mb-1 block">
              Personal Color Analysis
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Warm Autumn <span className="italic font-normal text-text-secondary">— your season.</span>
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="w-9 h-9 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Overview */}
        <p className="text-text-secondary leading-relaxed mb-8">
          Grounded, golden and rich. Colors that make your skin glow and your features sing.
          Cool pastels and stark black wash out your natural warmth. Swap for camel, cream or burgundy.
        </p>

        {/* Color Swatches Grid */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary mb-4">
            Your Primary Palette
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {palettes.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-bg-elevated border border-border-subtle"
              >
                <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ backgroundColor: p.color }} />
                <div>
                  <h4 className="text-sm font-medium text-text-primary">{p.name}</h4>
                  <p className="text-xs text-text-tertiary">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guidelines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="p-5 rounded-2xl bg-bg-elevated border border-border-subtle">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
              ✦ Metals & Jewelry
            </h4>
            <ul className="text-xs text-text-secondary space-y-2">
              <li>• Warm gold, brass, brushed bronze</li>
              <li>• Amber, tigers-eye, carnelian</li>
              <li>• Skip silver and rose gold in main pieces</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-bg-elevated border border-border-subtle">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
              ✦ Beauty & Makeup
            </h4>
            <ul className="text-xs text-text-secondary space-y-2">
              <li>• Lips: Brick red, terracotta, warm nude</li>
              <li>• Eyes: Bronze, moss green, warm brown</li>
              <li>• Blush: Peach, warm apricot</li>
            </ul>
          </div>
        </div>

        {/* Avoid list */}
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/30 flex items-center justify-between">
          <span className="text-xs text-red-300/80 font-medium">Colors to swap out:</span>
          <div className="flex gap-2 flex-wrap">
            {avoidColors.map((c) => (
              <span key={c} className="text-[11px] px-2.5 py-1 rounded-full bg-red-900/30 text-red-200 line-through">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Styling Quote */}
        <div className="mt-8 pt-6 border-t border-border-subtle italic text-sm text-accent text-center">
          "Layer chestnut over cream and finish with a gold hoop — instantly elevated."
        </div>
      </div>
    </div>
  );
}
