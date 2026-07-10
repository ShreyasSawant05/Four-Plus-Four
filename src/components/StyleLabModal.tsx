import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useOutfitStore } from '../store/useOutfitStore';

export default function StyleLabModal() {
  const activeModal = useOutfitStore((s) => s.activeModal);
  const closeModal = useOutfitStore((s) => s.closeModal);
  const modalRef = useRef<HTMLDivElement>(null);

  const isOpen = activeModal === 'style-lab';
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

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

  const handleUploadSim = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
    }, 1500);
  };

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
              Style Lab — Vision Engine
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Turn inspiration <span className="italic font-normal text-text-secondary">into your style.</span>
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="w-9 h-9 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-text-secondary leading-relaxed mb-6">
          Drop your Pinterest, Instagram screenshots or mood boards. Four Plus Four decodes the aesthetic and shops it for you.
        </p>

        {/* Upload Box */}
        {!analyzed ? (
          <div
            onClick={handleUploadSim}
            className="border-2 border-dashed border-border-medium hover:border-accent/50 rounded-2xl p-8 text-center cursor-pointer bg-bg-elevated/50 transition-all mb-8 group"
          >
            {isAnalyzing ? (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-3" />
                <span className="text-sm font-medium text-text-primary">Decoding aesthetic vector & color tones…</span>
              </div>
            ) : (
              <div>
                <div className="w-12 h-12 rounded-full bg-accent-muted text-accent flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  ✦
                </div>
                <p className="text-sm font-medium text-text-primary mb-1">
                  Click to import mood board images
                </p>
                <p className="text-xs text-text-tertiary">
                  Pinterest, IG, mood boards · up to 20 images
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 mb-8">
            <div className="p-5 rounded-2xl bg-bg-elevated border border-border-subtle">
              <span className="text-xs text-text-tertiary uppercase tracking-wider block mb-2">Aesthetic Breakdown</span>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-display font-semibold text-accent">70% Old Money</span>
                <span className="text-sm text-text-secondary">· 20% Coquette · 10% Clean Girl</span>
              </div>
              <div className="w-full h-2 rounded-full bg-bg-card overflow-hidden flex">
                <div className="h-full bg-accent w-[70%]" />
                <div className="h-full bg-pink-400 w-[20%]" />
                <div className="h-full bg-emerald-400 w-[10%]" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-bg-elevated border border-border-subtle">
              <span className="text-xs text-text-tertiary uppercase tracking-wider block mb-3">Shop the Look Match</span>
              <ul className="space-y-2.5 text-xs text-text-secondary">
                <li className="flex justify-between">
                  <span>• Cream cashmere V-neck</span>
                  <span className="text-text-primary font-medium">Aritzia ($148)</span>
                </li>
                <li className="flex justify-between">
                  <span>• Bias-cut midi in bronze</span>
                  <span className="text-text-primary font-medium">Reformation ($198)</span>
                </li>
                <li className="flex justify-between">
                  <span>• Leather ballet flats</span>
                  <span className="text-text-primary font-medium">Sam Edelman ($128)</span>
                </li>
                <li className="flex justify-between">
                  <span>• Pearl drop earrings</span>
                  <span className="text-text-primary font-medium">Mejuri ($88)</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end gap-3">
          <button onClick={closeModal} className="btn-secondary text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
