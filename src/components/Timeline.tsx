import { motion, useTransform } from 'framer-motion';
import { useTimelineScroll } from '../hooks/useTimelineScroll';
import TimelineProgress from './TimelineProgress';
import TimelineContent from './TimelineContent';

const steps = [
  { label: 'Inspiration', icon: '💡' },
  { label: 'Virtual Try-On', icon: '✨' },
  { label: 'Color Analysis', icon: '🎨' },
  { label: 'Accessories', icon: '👜' },
  { label: 'Shop the Look', icon: '🛒' },
];

export default function Timeline() {
  const { containerRef, smoothProgress, activeIndex } = useTimelineScroll();

  // Smoothly fade out navigation helper text as user scrolls
  const instructionOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[480vh] w-full bg-bg">
      {/* Sticky Fullscreen Section */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">
        
        {/* Apple-inspired Premium Subtle Ambient Glow Backgrounds */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Floating Pink Blur Ball */}
          <motion.div
            className="absolute top-[-5%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-[#FEA3DC]/10 to-transparent blur-[90px]"
            animate={{
              x: [0, 15, -10, 0],
              y: [0, -15, 10, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {/* Floating Amber Gold Blur Ball */}
          <motion.div
            className="absolute bottom-[-5%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-[#DF972B]/6 to-transparent blur-[90px]"
            animate={{
              x: [0, -15, 15, 0],
              y: [0, 15, -15, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Responsive Content Grid Container */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 lg:px-12 h-full flex flex-col justify-center select-none overflow-visible">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center w-full">
            
            {/* Left/Top Progress Tracker: vertical on desktop, horizontal on mobile */}
            <div className="col-span-1 md:col-span-3 lg:col-span-3 w-full flex items-center justify-center md:h-[500px] relative z-20">
              <TimelineProgress
                steps={steps}
                activeIndex={activeIndex}
                smoothProgress={smoothProgress}
                containerRef={containerRef}
              />
            </div>

            {/* Right Card Transitions Container */}
            <div className="col-span-1 md:col-span-9 lg:col-span-9 w-full overflow-visible relative z-10">
              <TimelineContent
                activeIndex={activeIndex}
                smoothProgress={smoothProgress}
                totalSteps={steps.length}
              />
            </div>

          </div>
        </div>

        {/* Scroll Instruction indicator */}
        <motion.div
          style={{ opacity: instructionOpacity }}
          className="absolute bottom-8 left-0 right-0 mx-auto text-center flex flex-col items-center gap-2 pointer-events-none z-20"
        >
          {/* Mouse SVG */}
          <div className="w-5 h-8 rounded-full border-2 border-burgundy/30 flex justify-center p-1 relative">
            <motion.div 
              className="w-1 h-2 bg-burgundy/60 rounded-full"
              animate={{
                y: [0, 4, 0],
                opacity: [1, 0.4, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </div>
          <span className="font-body text-[9px] font-bold text-subtle-label/60 tracking-widest uppercase">
            Scroll to navigate your personalized style journey
          </span>
        </motion.div>

      </div>
    </div>
  );
}
