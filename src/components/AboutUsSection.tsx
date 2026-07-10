import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const founders = [
  { name: 'Riya', role: 'Creative Director & Co-Founder', initial: 'R', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
  { name: 'Kanan', role: 'Technical Lead & Co-Founder', initial: 'K', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
  { name: 'Awni', role: 'Product Lead & Co-Founder', initial: 'A', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' }
];

export default function AboutUsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const items = el.querySelectorAll('.about-animate');
    gsap.fromTo(
      items,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          once: true
        }
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-24 md:py-32 bg-burgundy text-ivory relative overflow-hidden border-t border-b border-white/10"
    >
      {/* Background soft blush radial light */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 50%, #FEA3DC 0%, transparent 60%)',
        }}
      />

      <div className="section-wrapper relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Story Column */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="about-animate text-blush/80 font-body font-bold text-xs tracking-widest uppercase">
              About Us
            </span>
            
            <h2 className="about-animate font-display text-section leading-tight text-white">
              The Vision Behind
              <br />
              Four plus Four
            </h2>
            
            <p className="about-animate text-ivory/80 text-sm md:text-base leading-relaxed max-w-xl">
              We started 4+4 with a simple belief: fashion should be self-discovery, not a guessing game. By combining structural geometry and seasonal color palettes, we help you translate Pinterest inspiration boards into real outfits that are guaranteed to fit your profile.
            </p>
            
            <p className="about-animate text-ivory/70 text-xs md:text-sm italic border-l-2 border-amber-gold pl-4">
              "No more sizing guesswork. Know what suits you before it ever arrives at your doorstep."
            </p>
          </div>

          {/* Founders Column */}
          <div className="lg:col-span-6 flex flex-col md:flex-row justify-center lg:justify-end gap-6 md:gap-8">
            {founders.map((founder) => (
              <div
                key={founder.name}
                className="about-animate glass-card p-6 flex flex-col items-center text-center bg-white/5 border border-white/10 rounded-2xl w-full md:w-44 shadow-soft hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                {/* Founder Avatar headshot */}
                <img 
                  src={founder.avatar} 
                  alt={founder.name}
                  className="w-16 h-16 rounded-full object-cover border border-white/10 mb-4 shadow-sm select-none"
                />
                
                <h3 className="text-base font-display font-bold text-white">
                  {founder.name}
                </h3>
                
                <p className="text-[10px] text-ivory/60 uppercase tracking-widest font-semibold mt-1">
                  {founder.role}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
