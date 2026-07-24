import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    
    const items = el.querySelectorAll('.contact-animate');
    gsap.fromTo(
      items,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      }
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section ref={sectionRef} id="contact" className="py-24 md:py-32 bg-ivory border-t border-hairline-border">
      <div className="section-wrapper max-w-xl mx-auto text-center">
        <span className="contact-animate text-burgundy/65 font-body font-bold text-xs tracking-widest uppercase mb-1 block">
          Get in touch
        </span>
        
        <h2 className="contact-animate font-display text-section text-burgundy font-bold mt-2">
          Contact our team
        </h2>
        
        <p className="contact-animate mt-3 text-burgundy/80 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
          Questions about sizing, fit profiles, or order details? Send us a message and we'll get right back.
        </p>

        {submitted ? (
          <div className="contact-animate mt-8 p-6 bg-amber-gold/10 border border-amber-gold/30 rounded-2xl text-center">
            <div className="flex justify-center mb-3">
              <svg className="w-8 h-8 text-burgundy" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-burgundy text-sm uppercase tracking-wider">Message Sent</h3>
            <p className="text-xs text-burgundy/80 mt-1">Thank you! We'll reply within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-animate mt-8 space-y-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-burgundy/60" htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-card-surface border border-hairline-border text-burgundy text-xs focus:outline-none focus:border-burgundy/40"
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-burgundy/60" htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-card-surface border border-hairline-border text-burgundy text-xs focus:outline-none focus:border-burgundy/40"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-burgundy/60" htmlFor="contact-msg">Message</label>
              <textarea
                id="contact-msg"
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-card-surface border border-hairline-border text-burgundy text-xs focus:outline-none focus:border-burgundy/40 resize-none"
                placeholder="How can we help you today?"
              />
            </div>
            
            <button type="submit" className="w-full btn-primary text-xs font-bold uppercase tracking-wider bg-burgundy text-ivory hover:bg-[#66050b] py-3.5 rounded-full">
              Send Message
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
