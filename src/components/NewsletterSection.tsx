import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function NewsletterSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('.nl-animate');
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
      <div className="section-wrapper max-w-2xl text-center">
        <h3 className="nl-animate font-display text-2xl md:text-3xl text-text-primary">
          Weekly style edits, straight to your inbox
        </h3>
        <p className="nl-animate mt-4 text-text-secondary text-sm md:text-base">
          Trend forecasts, curated capsules, and members-only drops.
        </p>

        <form
          className="nl-animate mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-5 py-3.5 rounded-full bg-bg-card border border-border-subtle text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:border-border-medium transition-colors"
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
