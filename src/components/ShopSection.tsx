import { useRef } from 'react';
import { useScrollCrossfade } from '../hooks/useScrollCrossfade';
import OutfitDetails from './OutfitDetails';
import ModelShowcase from './ModelShowcase';
import OutfitCarousel from './OutfitCarousel';

export default function ShopSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollContainerRef, modelWrapperRef } = useScrollCrossfade();

  return (
    <section ref={sectionRef} id="shop" className="relative bg-ivory border-t border-b border-hairline-border overflow-hidden">
      {/* Scrollable Container wrapper */}
      <div className="flex flex-col lg:flex-row w-full max-w-[1440px] mx-auto relative min-h-screen">
        {/* Left Dynamic Text (Sticky) */}
        <OutfitDetails />

        {/* Center Mannequin Showcase (Sticky) */}
        <ModelShowcase modelWrapperRef={modelWrapperRef} />

        {/* Right Product List Scroll Track */}
        <OutfitCarousel scrollContainerRef={scrollContainerRef} />
      </div>
    </section>
  );
}
