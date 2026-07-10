import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { outfits } from '../data/outfits';
import { useOutfitStore } from '../store/useOutfitStore';
import OutfitCard from './OutfitCard';

interface OutfitCarouselProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export default function OutfitCarousel({ scrollContainerRef }: OutfitCarouselProps) {
  const activeIndex = useOutfitStore((s) => s.activeOutfitIndex);
  const setActiveIndex = useOutfitStore((s) => s.setActiveOutfitIndex);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Stagger entrance animation for cards
  useEffect(() => {
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.outfit-card');
      gsap.fromTo(
        cards,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
          delay: 0.8,
        },
      );
    }
  }, []);

  const handleCardClick = (index: number) => {
    setActiveIndex(index);

    // Scroll the card into view
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('.outfit-card');
    const targetCard = cards[index] as HTMLElement;
    if (!targetCard) return;

    const containerWidth = container.clientWidth;
    const cardLeft = targetCard.offsetLeft;
    const cardWidth = targetCard.offsetWidth;
    const scrollTarget = cardLeft - containerWidth / 2 + cardWidth / 2;

    gsap.to(container, {
      scrollLeft: scrollTarget,
      duration: 0.6,
      ease: 'power2.inOut',
    });
  };

  return (
    <div className="w-full lg:w-[32%] h-screen sticky top-0 flex flex-col justify-center relative bg-ivory">
      {/* Section label */}
      <div className="px-6 mb-6">
        <p className="font-display text-xs tracking-[0.3em] uppercase text-burgundy/45 font-bold">
          Looks Catalog
        </p>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={(el) => {
          // Assign to both refs
          if (scrollContainerRef && 'current' in scrollContainerRef) {
            (scrollContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }
          if (cardsRef && 'current' in cardsRef) {
            (cardsRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }
        }}
        className="flex gap-6 overflow-x-auto no-scrollbar px-6 pb-6"
        id="outfit-carousel"
      >
        {outfits.map((outfit, i) => (
          <OutfitCard
            key={outfit.id}
            outfit={outfit}
            index={i}
            isActive={i === activeIndex}
            onClick={() => handleCardClick(i)}
          />
        ))}

        {/* Spacer at end for scroll room */}
        <div className="flex-shrink-0 w-16" />
      </div>

      {/* Scroll hint */}
      <div className="px-6 mt-4 flex items-center gap-2">
        <div className="h-px flex-1 bg-burgundy/10" />
        <span className="text-xs text-burgundy/30 font-display tracking-widest font-bold">
          SWIPE OR SCROLL →
        </span>
        <div className="h-px flex-1 bg-burgundy/10" />
      </div>

      {/* Gradient overlays for scroll edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-ivory to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-ivory to-transparent pointer-events-none z-10" />
    </div>
  );
}
