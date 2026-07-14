import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useOutfitStore } from '../store/useOutfitStore';
import { outfits } from '../data/outfits';
import { usePoseDetection } from '../hooks/usePoseDetection';
import GarmentOverlay from './GarmentOverlay';

export default function TryOnModal() {
  const tryOnActive = useOutfitStore((s) => s.tryOnActive);
  const setTryOnActive = useOutfitStore((s) => s.setTryOnActive);
  const activeIndex = useOutfitStore((s) => s.activeOutfitIndex);
  const setActiveIndex = useOutfitStore((s) => s.setActiveOutfitIndex);

  const overlayRef = useRef<HTMLDivElement>(null);
  const { videoRef, poseData, isModelLoading, error, isSimulating } = usePoseDetection(tryOnActive);

  const currentOutfit = outfits[activeIndex];

  useEffect(() => {
    if (!overlayRef.current) return;
    if (tryOnActive) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' },
      );
    }
  }, [tryOnActive]);

  const handleClose = () => {
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setTryOnActive(false),
      });
    } else {
      setTryOnActive(false);
    }
  };

  if (!tryOnActive) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg/95 backdrop-blur-2xl"
        onClick={handleClose}
        role="presentation"
      />

      {/* Modal content */}
      <div className="relative z-10 w-full max-w-4xl mx-4 flex flex-col items-center max-h-[95vh] overflow-y-auto no-scrollbar px-2 py-1">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">
              Virtual Try-On
            </h2>
            <p className="text-text-secondary text-sm mt-1">
              Position yourself in frame — the garment will map to your body
            </p>
          </div>
          <button
            type="button"
            id="tryon-close"
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-card border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-medium transition-all"
            aria-label="Close try-on"
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M1 1L17 17M1 17L17 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Video container */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border-subtle bg-bg-card">
          {/* Loading state */}
          {isModelLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-bg-card">
              <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-4" />
              <p className="text-sm text-text-secondary">
                Initializing pose detection…
              </p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-bg-card">
              <div className="text-red-400/60 mb-3">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              <p className="text-sm text-red-400/70 text-center max-w-xs">{error}</p>
              <button type="button" onClick={handleClose} className="btn-secondary mt-4 text-xs">
                Close
              </button>
            </div>
          )}

          {/* Webcam video (mirrored) */}
          {!isSimulating ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
              playsInline
              muted
            />
          ) : (
            <div className="absolute inset-0 bg-burgundy/5 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <span className="text-5xl animate-pulse select-none filter drop-shadow-md">👤</span>
              <p className="text-burgundy font-bold text-sm">Simulated Body Tracking Space</p>
              <p className="text-burgundy/60 text-xs max-w-xs mx-auto leading-relaxed">
                Webcam access denied or unavailable. Moving mannequin mock coordinates to test overlay projection.
              </p>
            </div>
          )}

          {/* Garment overlay canvas */}
          <GarmentOverlay
            poseData={{
              ...poseData,
              isSimulated: isSimulating
            } as any}
            garmentImage={currentOutfit.garmentImage}
            videoWidth={640}
            videoHeight={480}
          />

          {/* Pose detection indicator */}
          <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
            <div className={`w-2.5 h-2.5 rounded-full ${poseData.isDetected ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-xs font-semibold text-burgundy">
              {isSimulating ? 'Simulated Torso Active' : poseData.isDetected ? 'Tracking' : 'No pose detected'}
            </span>
          </div>

          {/* Corner frame guides */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-accent/30 rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-accent/30 rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-accent/30 rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-accent/30 rounded-br-lg" />
        </div>

        {/* Bottom outfit selector */}
        <div className="w-full mt-6">
          <p className="text-xs text-text-tertiary tracking-wider uppercase mb-3">
            Change outfit
          </p>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {outfits.map((outfit, i) => (
              <button
                key={outfit.id}
                type="button"
                id={`tryon-outfit-${i}`}
                onClick={() => setActiveIndex(i)}
                className={`flex-shrink-0 w-14 h-18 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  i === activeIndex
                    ? 'border-accent scale-105'
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <div className="w-full h-full bg-neutral-surface flex items-center justify-center text-sm border border-hairline-border">
                  🧥
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
