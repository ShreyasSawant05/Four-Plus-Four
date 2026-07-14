import { useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
import { useRef, useState } from 'react';

export function useTimelineScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the parent container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Apply spring physics for ultra-smooth scrolling
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    mass: 0.5,
  });

  const [activeIndex, setActiveIndex] = useState(0);

  // Subscribe to changes in the smooth progress to determine which step is active
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    // 5 steps mapping:
    // Step 0 center: 0.0
    // Step 1 center: 0.25
    // Step 2 center: 0.50
    // Step 3 center: 0.75
    // Step 4 center: 1.00
    let index = 0;
    if (latest < 0.125) {
      index = 0;
    } else if (latest < 0.375) {
      index = 1;
    } else if (latest < 0.625) {
      index = 2;
    } else if (latest < 0.875) {
      index = 3;
    } else {
      index = 4;
    }
    
    setActiveIndex(index);
  });

  return {
    containerRef,
    scrollYProgress,
    smoothProgress,
    activeIndex,
  };
}
