import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const INSTAGRAM_HANDLE = '4_plus_.4';

export default function InstagramSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('.insta-animate');
    els.forEach((el, i) => {
      gsap.fromTo(
        el,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: i * 0.05, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } },
      );
    });
  }, []);

  return (
    <section ref={sectionRef} id="instagram" className="py-5 sm:py-10 md:py-32 bg-ivory">
      <div className="section-wrapper">

        {/* Header */}
        <div className="insta-animate flex flex-col items-center text-center mb-5 md:mb-10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center shadow-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.8" fill="white" stroke="none"/>
            </svg>
          </div>
          <h2 className="font-display text-section text-burgundy font-bold tracking-tight">
            Follow <span className="italic">our journey</span>
          </h2>
          <a
            href={`https://www.instagram.com/${INSTAGRAM_HANDLE}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-burgundy/60 font-body text-sm hover:text-burgundy transition-colors duration-200 font-medium"
          >
            @{INSTAGRAM_HANDLE}
          </a>
        </div>

        {/* Live Elfsight Feed */}
        <div className="insta-animate">
          <div className="elfsight-app-3c8785ef-fe2f-45bb-8565-555d12d0ec18" data-elfsight-app-lazy />
        </div>

      </div>
    </section>
  );
}
