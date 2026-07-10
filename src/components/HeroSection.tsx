import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useOutfitStore } from '../store/useOutfitStore';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const setActiveModal = useOutfitStore((s) => s.setActiveModal);

  // Typewriter placeholder animation
  const placeholders = [
    "I want an Old Money outfit under ₹3000",
    "Korean streetwear for college",
    "Vacation outfits for Goa",
    "Date night look in black",
    "Office wear with sneakers",
  ];
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");

  useEffect(() => {
    let timer: number;
    let text = "";
    let deleting = false;
    let index = 0;

    const tick = () => {
      const fullText = placeholders[index];
      
      if (!deleting) {
        if (text.length < fullText.length) {
          text = fullText.slice(0, text.length + 1);
          setCurrentPlaceholder(text);
          timer = window.setTimeout(tick, 120); // Slower typing speed
        } else {
          timer = window.setTimeout(() => {
            deleting = true;
            tick();
          }, 4000); // 4s pause when fully typed
        }
      } else {
        if (text.length > 0) {
          text = text.slice(0, -1);
          setCurrentPlaceholder(text);
          timer = window.setTimeout(tick, 60); // Deleting speed
        } else {
          deleting = false;
          index = (index + 1) % placeholders.length;
          timer = window.setTimeout(tick, 1000); // 1s pause when empty
        }
      }
    };

    timer = window.setTimeout(tick, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('.hero-animate');
    gsap.fromTo(
      els,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12, delay: 0.2 }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-ivory"
    >
      {/* Background radial highlight */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-multiply"
        style={{
          background: 'radial-gradient(circle at 60% 30%, #FEA3DC 0%, transparent 60%)',
        }}
      />

      <div className="section-wrapper relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column (Text & Inputs) */}
        <div className="lg:col-span-7 flex flex-col text-left space-y-6">
          <div className="hero-animate inline-flex">
            <span className="text-burgundy/65 font-body font-bold text-xs tracking-widest uppercase">
              Style DNA Wardrobe Finder
            </span>
          </div>

          <h1 className="hero-animate font-display text-[42px] md:text-[56px] lg:text-[68px] leading-[1.05] text-burgundy font-bold tracking-tight">
            I'll finally know what suits me.
          </h1>

          <p className="hero-animate text-burgundy/80 text-base md:text-lg leading-relaxed max-w-xl">
            No more guessing. Find flattering colors, perfect fits, and Pinterest-worthy looks curated uniquely for you.
          </p>

          {/* Search/Generator Input */}
          <div className="hero-animate flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl md:rounded-full bg-white/70 border border-hairline-border shadow-soft w-full max-w-lg">
            <div className="flex-1 w-full flex items-center gap-2 px-3">
              <span className="text-burgundy/40 text-lg">✨</span>
              <input
                type="text"
                placeholder={currentPlaceholder}
                className="w-full bg-transparent border-none outline-none font-body text-sm text-burgundy placeholder-burgundy/40"
              />
            </div>
            <button
              onClick={() => setActiveModal('quiz')}
              className="btn-primary w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap bg-burgundy text-ivory hover:bg-[#66050b] transition-colors"
            >
              Generate Look
            </button>
          </div>

          {/* Demo links list */}
          <div className="hero-animate flex flex-wrap items-center gap-2 text-xs text-burgundy/70">
            <span>Try demo searches:</span>
            {['🌸 Spring Knit', '👜 Clean Girl Blazer', '🧣 Cozy Scarf Look'].map((demo) => (
              <button
                key={demo}
                onClick={() => setActiveModal('shop')}
                className="px-2.5 py-1 rounded-full bg-white/40 border border-hairline-border hover:bg-white/60 transition-colors"
              >
                {demo}
              </button>
            ))}
          </div>

          {/* Reviews Rating Block */}
          <div className="hero-animate flex items-center gap-3 pt-4">
            <div className="flex -space-x-2">
              {[
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80'
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Reviewer Avatar"
                  className="w-8 h-8 rounded-full border border-hairline-border object-cover"
                />
              ))}
            </div>
            <div className="flex flex-col text-xs">
              <div className="flex text-amber-gold">★ ★ ★ ★ ★</div>
              <span className="text-burgundy/60 font-semibold mt-0.5">4.8/5 (2,400+ style reviews)</span>
            </div>
          </div>
        </div>

        {/* Right Column (Minimalist Stock Lookbook Card) */}
        <div className="lg:col-span-5 relative w-full aspect-[4/5] max-w-[380px] mx-auto flex items-center justify-center lg:justify-end hero-animate">
          <div className="w-[90%] aspect-[3/4] rounded-3xl bg-neutral-surface/30 border border-hairline-border/80 relative flex flex-col items-center justify-center text-burgundy/40 overflow-hidden shadow-soft group">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80" 
              alt="Studio Lookbook" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[1200ms]"
            />
            {/* Elegant glassmorphic gradient and branding tags */}
            <div className="absolute inset-0 bg-gradient-to-t from-burgundy/80 via-transparent to-black/30 pointer-events-none" />
            <div className="absolute top-4 left-4 text-[9px] font-bold uppercase tracking-widest text-white/70 z-10">
              Studio Lookbook
            </div>
            <div className="absolute bottom-4 right-4 text-[9px] font-bold uppercase tracking-widest text-white/70 z-10">
              4+4 Studio // 2026
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
