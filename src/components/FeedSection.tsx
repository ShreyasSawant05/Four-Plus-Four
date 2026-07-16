import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useOutfitStore } from '../store/useOutfitStore';

gsap.registerPlugin(ScrollTrigger);

export default function FeedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const setActiveModal = useOutfitStore((s) => s.setActiveModal);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('.feed-animate');
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
    <section ref={sectionRef} id="feed" className="py-24 md:py-32 bg-ivory">
      <div className="section-wrapper">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 space-y-4 md:space-y-0">
          <div>
            <div className="feed-animate inline-flex mb-1">
              <span className="text-burgundy/65 font-body font-bold text-xs tracking-widest uppercase">
                Inspire
              </span>
            </div>
            <h2 className="feed-animate font-display text-section text-burgundy font-bold tracking-tight">
              Pick your universe
            </h2>
          </div>
          <button onClick={() => setActiveModal('shop')} className="feed-animate btn-link text-xs font-bold uppercase tracking-wider text-burgundy hover:text-[#66050b] group hidden md:inline-flex">
            Open full feed
            <span className="inline-block transform transition-transform group-hover:translate-x-1 ml-1">→</span>
          </button>
        </div>

        {/* Category filter chips */}
        <div className="feed-animate flex flex-wrap gap-2 mb-8 text-xs font-semibold">
          {['All', 'Coquette', 'Grunge', 'Minimalist', 'Quiet Luxury', 'Techwear', 'Clean Girl', 'Dark Academy'].map((tag, idx) => (
            <button
              key={tag}
              className={`px-4 py-2 rounded-full border transition-all ${
                idx === 0
                  ? 'bg-burgundy text-ivory border-burgundy'
                  : 'bg-white/40 text-burgundy/80 border-hairline-border hover:bg-white/70'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Outfit grid (8 items) */}
        <div className="feed-animate grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { aesthetic: 'Coquette', color: '#FEA3DC', tag: 'Ribbon Trim', img: 'https://images.unsplash.com/photo-1576188973526-0e5d70b7dd0e?w=500&auto=format&fit=crop&q=80' },
            { aesthetic: 'Minimalist', color: '#F6E6B6', tag: 'Clean Cuffs', img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&auto=format&fit=crop&q=80' },
            { aesthetic: 'Quiet Luxury', color: '#FFFBEC', tag: 'Tailored Silk', img: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=500&auto=format&fit=crop&q=80' },
            { aesthetic: 'Techwear', color: '#7A5A1B', tag: 'Cargo Shell', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=80' },
            { aesthetic: 'Clean Girl', color: '#DF972B', tag: 'Linen Vest', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=80' },
            { aesthetic: 'Dark Academy', color: '#840B14', tag: 'Tweed Blazer', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=80' },
            { aesthetic: 'Grunge', color: '#6b6b6b', tag: 'Torn Knits', img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80' },
            { aesthetic: 'Streetwear', color: '#d4c5a0', tag: 'Oversized Hoodie', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=80' },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => setActiveModal('shop')}
              className="group cursor-pointer glass-card overflow-hidden bg-card-surface border border-hairline-border rounded-2xl shadow-soft hover:shadow-md transition-all duration-300"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-neutral-surface flex flex-col items-center justify-center text-burgundy/30">
                {/* Beautiful fashion photo background */}
                <img 
                  src={item.img} 
                  alt={item.aesthetic} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Simulated Image background color overlay */}
                <div
                  className="absolute inset-0 opacity-20 mix-blend-multiply"
                  style={{ backgroundColor: item.color }}
                />
                {/* Gradient shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy/90 via-transparent to-black/20 pointer-events-none" />
                
                {/* Aesthetic label inside image container */}
                <span className="font-display text-base font-bold text-white relative z-10">{item.aesthetic}</span>
                <span className="text-[9px] uppercase tracking-wider text-blush relative z-10 font-bold mt-1">Look Card</span>

                {/* Heart wishlist top-right */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-fashion-red border border-hairline-border shadow-sm transition-transform active:scale-95"
                >
                  ♥
                </button>

                {/* Tag overlay bottom-left */}
                <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-bold text-burgundy border border-hairline-border">
                  {item.tag}
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-burgundy">{item.aesthetic} Set</p>
                  <p className="text-[10px] text-burgundy/50 mt-0.5">Verified Retailers</p>
                </div>
                <span className="text-xs font-bold text-amber-gold">Shop →</span>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setActiveModal('shop')} className="feed-animate btn-link text-xs font-bold uppercase tracking-wider text-burgundy hover:text-[#66050b] md:hidden mt-8 inline-flex">
          Open full feed →
        </button>
      </div>
    </section>
  );
}
