import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: 'Is Four Plus Four free?',
    answer:
      'Yes — Style DNA, feed, and basic try-on are free. Premium unlocks unlimited try-ons and downloadable reports.',
  },
  {
    question: 'How does the virtual try-on work?',
    answer:
      'Upload a photo or use your camera. Our AI maps garments to your body with size and color recommendations.',
  },
  {
    question: 'Where do the products come from?',
    answer:
      "We aggregate from Four Plus Four's own line and 300+ trusted retailers, always surfacing the best-priced option.",
  },
  {
    question: 'Is my data safe?',
    answer:
      'Yes. Your photos and analysis reports are encrypted and never sold.',
  },
];

export default function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('.faq-animate');
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
      <div className="section-wrapper max-w-3xl">
        <h2 className="faq-animate font-display text-section text-text-primary text-center mb-14">
          Everything you might wonder.
        </h2>

        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="faq-animate border-b border-border-subtle"
            >
              <button
                type="button"
                className="w-full flex items-center justify-between py-5 text-left group"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-text-primary text-sm md:text-base font-medium pr-4 group-hover:text-accent transition-colors">
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full border border-border-medium flex items-center justify-center transition-transform duration-300 ${
                    openIndex === i ? 'rotate-45 border-accent' : ''
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 2v8M2 6h8"
                      stroke={openIndex === i ? '#c8a97e' : 'currentColor'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  openIndex === i ? 'max-h-40 pb-5' : 'max-h-0'
                }`}
              >
                <p className="text-text-secondary text-sm leading-relaxed pr-10">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
