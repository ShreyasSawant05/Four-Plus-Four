import { motion, MotionValue } from 'framer-motion';
import TimelineItem from './TimelineItem';

interface TimelineProgressProps {
  steps: { label: string }[];
  activeIndex: number;
  smoothProgress: MotionValue<number>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isMobile?: boolean;
  onMobileSelect?: (index: number) => void;
}

export default function TimelineProgress({
  steps,
  activeIndex,
  smoothProgress,
  containerRef,
  isMobile,
  onMobileSelect,
}: TimelineProgressProps) {
  // Handle click to scroll to specific step on desktop
  const handleStepClick = (index: number) => {
    if (isMobile) {
      onMobileSelect?.(index);
      return;
    }

    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerTop = container.offsetTop;
    const containerHeight = container.clientHeight;
    const viewportHeight = window.innerHeight;
    
    const totalScrollable = Math.max(1, containerHeight - viewportHeight);
    const targetScroll = containerTop + (index / (steps.length - 1)) * totalScrollable;
    
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative flex flex-col justify-between items-center w-full h-full md:py-8 py-1 px-0">
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

      {/* 2. Track & Progress Lines (Mobile - Horizontal Interactive Step Chips) */}
      <div className="flex md:hidden items-center gap-1.5 overflow-x-auto no-scrollbar w-full py-1 justify-center sm:justify-between">
        {steps.map((step, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleStepClick(idx)}
            className={`px-2.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeIndex === idx
                ? 'bg-burgundy text-ivory shadow-sm'
                : 'bg-white/60 text-burgundy/80 border border-hairline-border hover:bg-white/80'
            }`}
          >
            <span className={`w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center font-bold ${
              activeIndex === idx ? 'bg-amber-gold text-burgundy' : 'bg-burgundy/15 text-burgundy'
            }`}>
              {idx + 1}
            </span>
            <span>{step.label}</span>
          </button>
        ))}
      </div>

      {/* 3. Step Nodes (Desktop - Vertical) */}
      <div className="hidden md:flex flex-col justify-between items-center w-full h-full relative z-10">
        {steps.map((step, idx) => (
          <TimelineItem
            key={idx}
            index={idx}
            label={step.label}
            isActive={activeIndex === idx}
            isCompleted={activeIndex > idx}
            onClick={() => handleStepClick(idx)}
          />
        ))}
      </div>
    </div>
  );
}
