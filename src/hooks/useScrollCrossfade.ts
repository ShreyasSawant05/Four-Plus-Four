import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useOutfitStore } from '../store/useOutfitStore';
import { outfits } from '../data/outfits';

gsap.registerPlugin(ScrollTrigger);

export function useScrollCrossfade() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const modelWrapperRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const setupScrollTrigger = useCallback(() => {
    const container = scrollContainerRef.current;
    const wrapper = modelWrapperRef.current;
    if (!container || !wrapper) return;

    // Clean up previous triggers
    triggersRef.current.forEach((t) => t.kill());
    triggersRef.current = [];

    const images = wrapper.querySelectorAll<HTMLDivElement>('.model-image');
    if (images.length === 0) return;

    // Set initial state: first image visible, rest hidden
    images.forEach((img, i) => {
      gsap.set(img, { opacity: i === 0 ? 1 : 0 });
    });

    const cards = container.querySelectorAll<HTMLDivElement>('.outfit-card');
    if (cards.length === 0) return;

    cards.forEach((card, i) => {
      if (i === 0) return; // First card = first outfit, already visible

      const trigger = ScrollTrigger.create({
        trigger: card,
        scroller: container,
        horizontal: true,
        start: 'left center',
        end: 'right center',
        onEnter: () => {
          // Crossfade: fade out previous, fade in current
          gsap.to(images[i - 1], { opacity: 0, duration: 0.5, ease: 'power2.inOut' });
          gsap.to(images[i], { opacity: 1, duration: 0.5, ease: 'power2.inOut' });
          useOutfitStore.getState().setActiveOutfitIndex(i);
        },
        onEnterBack: () => {
          // Reverse crossfade
          gsap.to(images[i], { opacity: 0, duration: 0.5, ease: 'power2.inOut' });
          gsap.to(images[i - 1], { opacity: 1, duration: 0.5, ease: 'power2.inOut' });
          useOutfitStore.getState().setActiveOutfitIndex(i - 1);
        },
      });

      triggersRef.current.push(trigger);
    });
  }, []);

  useEffect(() => {
    // Small delay to ensure DOM is rendered
    const timer = setTimeout(() => {
      setupScrollTrigger();
    }, 100);

    return () => {
      clearTimeout(timer);
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, [setupScrollTrigger]);

  // Expose a refresh function for when layout changes
  const refresh = useCallback(() => {
    ScrollTrigger.refresh();
  }, []);

  return {
    scrollContainerRef,
    modelWrapperRef,
    refresh,
    outfitCount: outfits.length,
  };
}
