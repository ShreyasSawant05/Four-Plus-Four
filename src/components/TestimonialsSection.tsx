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
    <section ref={sectionRef} className="py-24 md:py-32">
      <div className="section-wrapper">
        <h2 className="test-animate font-display text-section text-text-primary text-center mb-14">
          Real style twins, <span className="italic">real transformations.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.author} className="test-animate glass-card p-6 md:p-8 flex flex-col">
              {/* Quote mark */}
              <span className="text-accent text-3xl font-display leading-none mb-4">"</span>
              <p className="text-text-secondary text-sm leading-relaxed flex-1">
                {t.quote}
              </p>
              <div className="mt-6 pt-4 border-t border-border-subtle">
                <p className="text-text-primary text-sm font-medium">{t.author}</p>
                <p className="text-text-tertiary text-xs mt-0.5">{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
