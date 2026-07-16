import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useOutfitStore } from '../store/useOutfitStore';

export default function BodyAnalysisModal() {
  const activeModal = useOutfitStore((s) => s.activeModal);
  const closeModal = useOutfitStore((s) => s.closeModal);
  const modalRef = useRef<HTMLDivElement>(null);

  const isOpen = activeModal === 'body';

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

  const recommendations = [
    { title: 'Wide-Leg Trousers', tag: 'Must Have', desc: 'Adds balance to broader shoulders, creating an hourglass illusion.' },
    { title: 'V-Neck & Scoop Tops', tag: 'Flattering', desc: 'Draws eyes vertically down to soften wide shoulder lines.' },
    { title: 'Structured Blazers', tag: 'Key Staple', desc: 'Single-breasted cuts that taper gently at the natural waistline.' },
    { title: 'A-Line & Bias Skirts', tag: 'Essential', desc: 'Creates movement and volume in the lower body.' },
  ];

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
              Personal Silhouette Guide
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Inverted Triangle <span className="italic font-normal text-text-secondary">— proportion breakdown.</span>
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="w-9 h-9 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Proportions metrics */}
        <div className="grid grid-cols-3 gap-3 mb-8 text-center">
          <div className="p-4 rounded-2xl bg-bg-elevated border border-border-subtle">
            <span className="text-xs text-text-tertiary uppercase block mb-1">Shoulders</span>
            <span className="text-lg font-semibold text-text-primary">Broad</span>
          </div>
          <div className="p-4 rounded-2xl bg-bg-elevated border border-border-subtle">
            <span className="text-xs text-text-tertiary uppercase block mb-1">Waist</span>
            <span className="text-lg font-semibold text-accent">Defined</span>
          </div>
          <div className="p-4 rounded-2xl bg-bg-elevated border border-border-subtle">
            <span className="text-xs text-text-tertiary uppercase block mb-1">Hips</span>
            <span className="text-lg font-semibold text-text-primary">Slim</span>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">
            Tailored Recommendations
          </h3>
          {recommendations.map((item) => (
            <div
              key={item.title}
              className="p-4 rounded-2xl bg-bg-elevated border border-border-subtle flex items-start justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-text-primary">{item.title}</h4>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-accent/20 text-accent">
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Styling Advice */}
        <div className="p-5 rounded-2xl bg-accent-muted border border-accent-border text-center">
          <p className="text-xs text-accent font-medium leading-relaxed">
            Stylist Rule: Pair darker, fitted tops with lighter or voluminous bottoms to easily balance your upper frame.
          </p>
        </div>
      </div>
    </div>
  );
}
