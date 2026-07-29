import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const founders = [
  { name: 'Riya', photo: '/riya.jpeg' },
  { name: 'Kanan', photo: '/kanan.jpeg' },
  { name: 'Awni', photo: '/awni.jpeg' },
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
      className="py-5 sm:py-10 md:py-32 bg-burgundy text-ivory relative overflow-hidden border-t border-b border-white/10"
    >
      {/* Background soft blush radial light */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 50%, #FEA3DC 0%, transparent 60%)',
        }}
      />

      <div className="section-wrapper relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-center">
          
          {/* Story Column */}
          <div className="lg:col-span-5 space-y-6 text-left lg:pt-6">
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

          {/* Founders Column — tall portrait cards */}
          <div className="lg:col-span-7 grid grid-cols-3 gap-2 sm:gap-3 md:gap-6 justify-items-center">
            {founders.map((founder) => (
              <div
                key={founder.name}
                className="about-animate group relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl"
              >
                <img
                  src={founder.photo}
                  alt={founder.name}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                />
                {/* Dark gradient overlay at bottom for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                {/* Name pinned to bottom */}
                <div className="absolute bottom-0 inset-x-0 p-2 sm:p-4">
                  <h3 className="text-[11px] sm:text-sm md:text-base font-display font-bold text-white tracking-wide leading-none">
                    {founder.name}
                  </h3>
                  <span className="mt-1 block sm:mt-1.5 w-4 sm:w-6 h-px bg-amber-gold/80" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
