import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useOutfitStore } from '../store/useOutfitStore';

gsap.registerPlugin(ScrollTrigger);

export default function StylistSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const setActiveModal = useOutfitStore((s) => s.setActiveModal);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('.stylist-animate');
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

  const messages = [
    { role: 'user' as const, text: 'I have a wedding next month — warm tones, outdoor, cocktail dress code.' },
    { role: 'ai' as const, text: 'Try a bias-cut midi in bronze or terracotta. Pair with gold strappy heels and your warm autumn palette. Want me to pull three options?' },
    { role: 'user' as const, text: 'Yes! Under ₹5,000 if possible.' },
  ];

  return (
    <section ref={sectionRef} id="stylist" className="py-24 md:py-32">
      <div className="section-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left text */}
          <div>
            <h2 className="stylist-animate font-display text-section text-text-primary">
              A stylist in your pocket, <span className="italic">24/7.</span>
            </h2>
            <p className="stylist-animate mt-5 text-text-secondary text-base md:text-lg leading-relaxed max-w-lg">
              Ask about occasions, colors, accessories or how to remix what's already
              in your closet. Four Plus Four thinks in outfits.
            </p>
            <button onClick={() => setActiveModal('stylist')} className="stylist-animate inline-flex mt-8 btn-primary text-sm">
              Chat with Four Plus Four
            </button>
          </div>

          {/* Right chat mockup */}
          <div className="stylist-animate cursor-pointer" onClick={() => setActiveModal('stylist')}>
            <div className="glass-card p-5 md:p-6 space-y-4 hover:border-accent/30 transition-all">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-text-primary text-bg rounded-br-md'
                        : 'bg-bg-elevated border border-border-subtle text-text-secondary rounded-bl-md'
                    }`}
                  >
                    {msg.role === 'ai' && (
                      <span className="block text-[10px] text-accent font-medium tracking-wider uppercase mb-1">
                        Four Plus Four
                      </span>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}
              <div className="flex justify-start">
                <div className="bg-bg-elevated border border-border-subtle rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-pulse-soft" />
                  <span className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-pulse-soft" style={{ animationDelay: '0.3s' }} />
                  <span className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-pulse-soft" style={{ animationDelay: '0.6s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
