import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useOutfitStore } from '../store/useOutfitStore';
import { OUTFIT_IMAGES } from '../data/outfitImages';

gsap.registerPlugin(ScrollTrigger);

// The 3 style slots — women shown first, men on alternate cycle
const SLIDE_SLOTS = [
  { label: 'Boho',       womenKey: 'Boho Women',       menKey: 'Boho Men'       },
  { label: 'Old Money',  womenKey: 'Old Money Women',  menKey: 'Old Money Men'  },
  { label: 'Streetwear', womenKey: 'Streetwear Women', menKey: 'Streetwear Men' },
];

// How long each outfit set is displayed before cross-fading (ms)
const DISPLAY_DURATION = 6000;
// Cross-fade dissolve duration (ms)
const FADE_MS = 800;

function getImageSrc(slot: typeof SLIDE_SLOTS[0], isMale: boolean, idx: number): string {
  const key = isMale ? slot.menKey : slot.womenKey;
  const images = OUTFIT_IMAGES[key] ?? [];
  return images.length > 0 ? images[idx % images.length] : '';
}

export default function StyleDNASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const setActiveModal = useOutfitStore((s) => s.setActiveModal);

  // Layer A: Base image currently displayed (bottom)
  const [layerA, setLayerA] = useState<string[]>(() =>
    SLIDE_SLOTS.map((slot) => getImageSrc(slot, false, 0))
  );
  // Layer B: Incoming image that fades in directly over Layer A (top)
  const [layerB, setLayerB] = useState<string[]>(() =>
    SLIDE_SLOTS.map(() => '')
  );
  // Opacity of Layer B (0 to 1)
  const [opacityB, setOpacityB] = useState(0);
  // Current gender state
  const [isMale, setIsMale] = useState(false);
  // Image cycle index — advances each time we return to Women outfits
  const [imgIndex, setImgIndex] = useState(0);

  const crossFadeToNext = useCallback(() => {
    const nextMale = !isMale;
    const nextIndex = nextMale ? imgIndex : imgIndex + 1;
    const nextSrcs = SLIDE_SLOTS.map((slot) => getImageSrc(slot, nextMale, nextIndex));

    // 1. Prepare Layer B with the incoming images while transparent
    setLayerB(nextSrcs);

    // 2. Trigger opacity fade-in for Layer B over Layer A
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOpacityB(1);

        // 3. Once cross-fade completes, swap Layer B -> Layer A and reset Layer B
        setTimeout(() => {
          setLayerA(nextSrcs);
          setLayerB(SLIDE_SLOTS.map(() => ''));
          setOpacityB(0);
          setIsMale(nextMale);
          if (!nextMale) setImgIndex((prev) => prev + 1);
        }, FADE_MS + 50);
      });
    });
  }, [isMale, imgIndex]);

  useEffect(() => {
    const timer = setInterval(crossFadeToNext, DISPLAY_DURATION);
    return () => clearInterval(timer);
  }, [crossFadeToNext]);

  // GSAP scroll entrance animations
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
    <section ref={sectionRef} id="styledna" className="py-5 sm:py-10 md:py-32 bg-ivory">
      <div className="section-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-16 items-center">

          {/* ── Left Text Column ── */}
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

          {/* ── Right Dashboard Visual ── */}
          <div className="lg:col-span-6 dna-animate">
            <div
              className="glass-card p-6 md:p-8 bg-card-surface/90 border border-hairline-border rounded-3xl shadow-soft cursor-pointer hover:border-burgundy/25 transition-all duration-300"
              onClick={() => setActiveModal('quiz')}
            >
              <h3 className="font-display text-lg text-burgundy font-bold mb-5 flex items-center justify-between">
                <span>Your Style Dimensions</span>
                <span className="text-xs text-amber-gold font-body tracking-wider uppercase font-semibold">Live Twin</span>
              </h3>

              {/* Style dimension bars */}
              <div className="space-y-4 mb-8">
                {[
                  { name: 'Minimalist',   percentage: 75 },
                  { name: 'Techwear',     percentage: 15 },
                  { name: 'Coquette',     percentage: 10 },
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

              {/* ── Outfit cards with smooth cross-fade transition ── */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-hairline-border">
                {SLIDE_SLOTS.map((slot, i) => (
                  <div
                    key={slot.label}
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '133%', // 3:4 portrait ratio
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                      background: '#e8e0d0',
                    }}
                  >
                    {/* Layer A (Base Image) */}
                    {layerA[i] && (
                      <img
                        src={layerA[i]}
                        alt={`${slot.label} outfit`}
                        style={{
                          position: 'absolute',
                          top: 0, left: 0, right: 0, bottom: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center top',
                          display: 'block',
                        }}
                      />
                    )}

                    {/* Layer B (Incoming Image — Cross-fades directly over Layer A) */}
                    {layerB[i] && (
                      <img
                        src={layerB[i]}
                        alt={`${slot.label} outfit`}
                        style={{
                          position: 'absolute',
                          top: 0, left: 0, right: 0, bottom: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center top',
                          display: 'block',
                          opacity: opacityB,
                          transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                        }}
                      />
                    )}

                    {/* Gradient overlay + label badge — stays fixed on top */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 45%, transparent 75%)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '8px 10px',
                        pointerEvents: 'none',
                        zIndex: 10,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span style={{
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: 600,
                          letterSpacing: '0.06em',
                          lineHeight: 1,
                          textTransform: 'uppercase',
                        }}>
                          {slot.label}
                        </span>
                        <span style={{
                          color: 'rgba(255,255,255,0.9)',
                          fontSize: '13px',
                          lineHeight: 1,
                          transition: `opacity ${FADE_MS}ms ease`,
                        }}>
                          {isMale ? '♂' : '♀'}
                        </span>
                      </div>
                    </div>
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
