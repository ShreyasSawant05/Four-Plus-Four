import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useOutfitStore } from '../store/useOutfitStore';

export function useTextTransition() {
  const textRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef<number>(0);

  useEffect(() => {
    const unsubscribe = useOutfitStore.subscribe(
      (state) => {
        const newIndex = state.activeOutfitIndex;
        if (newIndex === prevIndexRef.current) return;

        const el = textRef.current;
        if (!el) return;

        const direction = newIndex > prevIndexRef.current ? 1 : -1;
        prevIndexRef.current = newIndex;

        // Timeline: slide out old content, then slide in new content
        const tl = gsap.timeline();

        tl.to(el, {
          y: -20 * direction,
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in',
        }).fromTo(
          el,
          {
            y: 20 * direction,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.35,
            ease: 'power2.out',
          },
        );
      },
    );

    return unsubscribe;
  }, []);

  return { textRef };
}
