import { motion, MotionValue } from 'framer-motion';
import TimelineItem from './TimelineItem';

interface TimelineProgressProps {
  steps: { label: string; icon: string }[];
  activeIndex: number;
  smoothProgress: MotionValue<number>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function TimelineProgress({
  steps,
  activeIndex,
  smoothProgress,
  containerRef,
}: TimelineProgressProps) {
  // Handle click to scroll to specific step
  const handleStepClick = (index: number) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerTop = container.offsetTop;
    const containerHeight = container.clientHeight;
    const viewportHeight = window.innerHeight;
    
    // The total scrollable distance within the section is containerHeight - viewportHeight
    const totalScrollable = containerHeight - viewportHeight;
    
    // Calculate the target scroll top for the step index (spaced evenly from 0 to 1)
    const targetScroll = containerTop + (index / (steps.length - 1)) * totalScrollable;
    
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative flex md:flex-col justify-between items-center w-full h-full md:py-8 py-3 px-4 md:px-0">
      {/* 1. Track & Progress Lines (Desktop - Vertical) */}
      <div className="absolute left-[24px] top-[56px] bottom-[56px] w-[2px] bg-burgundy/20 md:block hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 right-0 bg-amber-gold rounded-full origin-top"
          style={{
            height: '100%',
            scaleY: smoothProgress,
          }}
        />
      </div>

      {/* 2. Track & Progress Lines (Mobile - Horizontal) */}
      <div className="absolute left-10 right-10 top-[28px] h-[2px] bg-hairline-border md:hidden block pointer-events-none">
        <motion.div
          className="absolute left-0 top-0 bottom-0 bg-amber-gold rounded-full origin-left"
          style={{
            width: '100%',
            scaleX: smoothProgress,
          }}
        />
      </div>

      {/* 3. Step Nodes */}
      <div className="flex md:flex-col justify-between items-center w-full h-full relative z-10 gap-2 md:gap-0">
        {steps.map((step, idx) => (
          <TimelineItem
            key={idx}
            index={idx}
            label={step.label}
            icon={step.icon}
            isActive={activeIndex === idx}
            isCompleted={activeIndex > idx}
            onClick={() => handleStepClick(idx)}
          />
        ))}
      </div>
    </div>
  );
}
