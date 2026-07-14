import { MotionValue } from 'framer-motion';
import TimelineCard from './TimelineCard';

interface TimelineContentProps {
  activeIndex: number;
  smoothProgress: MotionValue<number>;
  totalSteps: number;
}

export default function TimelineContent({
  activeIndex,
  smoothProgress,
  totalSteps,
}: TimelineContentProps) {
  return (
    <div className="relative w-full h-[500px] md:h-[420px] flex items-center justify-center overflow-visible">
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <TimelineCard
          key={idx}
          index={idx}
          activeIndex={activeIndex}
          smoothProgress={smoothProgress}
          totalSteps={totalSteps}
        />
      ))}
    </div>
  );
}
