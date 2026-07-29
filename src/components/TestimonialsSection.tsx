import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: 'It finally clicked what actually suits me. Every outfit feels intentional now.',
    author: 'Sarah M.',
    detail: 'Warm Autumn · Inverted Triangle',
  },
  {
    quote: 'The color analysis alone was worth it — my whole wardrobe looks richer.',
    author: 'Priya K.',
    detail: 'Deep Winter · Hourglass',
  },
  {
    quote: 'The try-on saves me from returns. It just… works.',
    author: 'Emma R.',
    detail: 'Light Summer · Rectangle',
  },
  {
    quote: 'The AI stylist recommendations matched my exact aesthetic perfectly.',
    author: 'Ananya S.',
    detail: 'Soft Autumn · Pear Shape',
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('.test-animate');
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
    <section ref={sectionRef} className="py-6 sm:py-10 md:py-32">
      <div className="section-wrapper">
        <h2 className="test-animate font-display text-section text-text-primary text-center mb-6 md:mb-14">
          Real style twins, <span className="italic">real transformations.</span>
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {testimonials.map((t) => (
            <div key={t.author} className="test-animate glass-card p-3.5 sm:p-5 md:p-8 flex flex-col justify-between">
              <div>
                {/* Quote mark */}
                <span className="text-accent text-2xl sm:text-3xl font-display leading-none mb-2 block">"</span>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                  {t.quote}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border-subtle">
                <p className="text-text-primary text-xs sm:text-sm font-medium">{t.author}</p>
                <p className="text-text-tertiary text-[10px] sm:text-xs mt-0.5">{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
