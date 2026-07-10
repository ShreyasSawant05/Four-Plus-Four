import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TryOnSectionProps {
  onTryOnClick: () => void;
}

export default function TryOnSection({ onTryOnClick }: TryOnSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('.tryon-animate');
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
    <section ref={sectionRef} id="tryon" className="py-24 md:py-32 bg-burgundy text-ivory relative overflow-hidden">
      {/* Dynamic background glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 70% 50%, #FEA3DC 0%, transparent 60%)',
        }}
      />
      
      <div className="section-wrapper relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left image preview container */}
          <div className="tryon-animate order-2 lg:order-1">
            <div className="glass-card bg-white/5 border border-white/10 overflow-hidden shadow-soft rounded-3xl relative aspect-[4/3] flex flex-col items-center justify-center text-ivory/30">
              <span className="text-4xl mb-3">📸</span>
              <span className="font-display text-sm font-semibold tracking-wider uppercase text-ivory/50">Camera Preview</span>
              <span className="text-xs text-ivory/30 mt-1">Pose Detection Box</span>
            </div>
          </div>

          {/* Right text */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="tryon-animate inline-flex">
              <span className="bg-blush/20 text-blush font-body font-semibold text-xs tracking-wider uppercase px-3 py-1 rounded-full border border-blush/30">
                Interactive Web AR
              </span>
            </div>
            
            <h2 className="tryon-animate font-display text-section text-ivory font-bold leading-tight">
              Try it on before
              <br />
              <span className="gradient-text not-italic font-extrabold" style={{ backgroundImage: 'linear-gradient(135deg, #FEA3DC 0%, #DF972B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>you buy it.</span>
            </h2>
            <p className="tryon-animate text-ivory/80 text-base md:text-lg leading-relaxed max-w-lg">
              Position yourself in frame or open your webcam. Our real-time body tracking maps garments to your shape instantly.
            </p>

            <div className="tryon-animate flex flex-wrap gap-3 pt-4">
              <button
                type="button"
                onClick={onTryOnClick}
                className="btn-gold py-3 px-8 text-sm font-bold shadow-glow hover:scale-105 active:scale-95 transition-transform"
              >
                Open Camera Try-On
              </button>
              <a
                href="#feed"
                className="btn-secondary bg-white/5 border-white/10 text-ivory hover:bg-white/10 hover:border-white/20 transition-all text-sm font-bold py-3 px-8 rounded-full"
              >
                Browse Looks
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
