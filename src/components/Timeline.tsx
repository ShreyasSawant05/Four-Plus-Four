import { useRef, useState, useEffect } from 'react';
import { motion, useTransform, useScroll, useSpring } from 'framer-motion';
import { useTimelineScroll } from '../hooks/useTimelineScroll';
import TimelineProgress from './TimelineProgress';
import TimelineContent from './TimelineContent';

const steps = [
  { label: 'Inspiration' },
  { label: 'Virtual Try-On' },
  { label: 'Color Analysis' },
  { label: 'Accessories' },
  { label: 'Shop the Look' },
];

interface MobileTimelineItemProps {
  item: {
    num: string;
    title: string;
    stepTag: string;
    cardTitle: string;
    desc: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
  };
  index: number;
  totalSteps: number;
  smoothProgress: any;
}

function MobileTimelineItem({ item, index, totalSteps, smoothProgress }: MobileTimelineItemProps) {
  const stepThreshold = index / Math.max(1, totalSteps - 1);
  const isReached = useTransform(smoothProgress, (v: number) => v >= stepThreshold - 0.08);

  const [active, setActive] = useState(index === 0);

  useEffect(() => {
    return isReached.on('change', (val) => {
      setActive(val);
    });
  }, [isReached]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col gap-2 relative z-10"
    >
      {/* Top Node Header Row */}
      <div className="flex items-center gap-3">
        {/* Number Circle Node */}
        <motion.div
          animate={{
            scale: active ? 1.1 : 1,
            backgroundColor: active ? '#DF972B' : '#FFFDF4',
            borderColor: active ? '#DF972B' : 'rgba(132, 11, 20, 0.2)',
            color: active ? '#840B14' : 'rgba(132, 11, 20, 0.7)',
            boxShadow: active ? '0 0 16px rgba(223, 151, 43, 0.7)' : '0 2px 6px rgba(0,0,0,0.04)',
          }}
          transition={{ duration: 0.35 }}
          className="w-9 h-9 rounded-full flex items-center justify-center font-display text-xs font-bold border-2 z-10 transition-all"
        >
          {item.num}
        </motion.div>

        {/* Step Title Next to Node */}
        <span className={`font-display font-bold text-xs tracking-widest uppercase transition-colors duration-300 ${
          active ? 'text-burgundy' : 'text-burgundy/60'
        }`}>
          {item.title}
        </span>
      </div>

      {/* Step Card (Indented below node) */}
      <div className="pl-11">
        <motion.div
          animate={{
            borderColor: active ? 'rgba(223, 151, 43, 0.6)' : 'rgba(132, 11, 20, 0.14)',
            boxShadow: active ? '0 12px 30px -10px rgba(223, 151, 43, 0.25)' : '0 4px 15px rgba(0,0,0,0.03)',
          }}
          transition={{ duration: 0.4 }}
          className="bg-[#FFFDF4]/95 border rounded-3xl p-5 transition-all duration-300"
        >
          {/* Header inside card */}
          <div className="flex items-center justify-between">
            <span className="font-body text-[10px] font-bold text-amber-gold uppercase tracking-widest">
              {item.stepTag}
            </span>
            {item.icon && <div>{item.icon}</div>}
          </div>

          <h3 className="font-display text-xl text-burgundy font-bold mt-1 leading-tight">
            {item.cardTitle}
          </h3>
          <div className="w-8 h-[2px] bg-amber-gold/80 my-2" />

          <p className="text-burgundy/80 text-xs leading-relaxed max-w-xs">
            {item.desc}
          </p>

          {item.content}
        </motion.div>
      </div>
    </motion.div>
  );
}

function MobileTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 80%"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 20,
    restDelta: 0.001
  });

  const stepsData = [
    {
      num: '01',
      title: 'INSPIRATION',
      stepTag: 'STEP 01',
      cardTitle: 'Inspiration',
      desc: 'Pinterest-worthy outfits, curated for you. Discover trends matching your aesthetic preferences.',
      content: (
        <div className="flex gap-2.5 mt-3">
          <div className="w-1/2 aspect-[4/5] rounded-2xl overflow-hidden border border-hairline-border/60 shadow-sm relative group">
            <img src="/fashion_model_blazer.png" alt="Inspiration model" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase">
              Model Look
            </div>
          </div>
          <div className="w-1/2 aspect-[4/5] rounded-2xl overflow-hidden border border-hairline-border/60 shadow-sm relative group">
            <img src="/fashion_flatlay.png" alt="Inspiration flatlay" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase">
              Flatlay Details
            </div>
          </div>
        </div>
      ),
    },
    {
      num: '02',
      title: 'VIRTUAL TRY-ON',
      stepTag: 'STEP 02',
      cardTitle: 'Virtual Try-On',
      icon: (
        <div className="w-5 h-7 rounded-full border-2 border-burgundy/30 flex justify-center p-0.5 relative">
          <div className="w-1 h-2 bg-burgundy/60 rounded-full animate-bounce" />
        </div>
      ),
      desc: 'See how looks fit you with our personalized style journey.',
      content: (
        <div className="flex items-center justify-between gap-2.5 mt-3 pt-2 border-t border-hairline-border/40">
          <div className="w-[44%] aspect-[4/5] rounded-2xl overflow-hidden border border-hairline-border shadow-sm relative bg-[#EADCC2]/10">
            <img src="/fashion_model_blazer.png" alt="Before Try-On" className="w-full h-full object-cover filter grayscale contrast-125 brightness-95" />
            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-burgundy/80 text-ivory text-[8px] font-bold uppercase">
              Before
            </div>
          </div>

          <div className="w-[12%] flex justify-center text-burgundy font-bold">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>

          <div className="w-[44%] aspect-[4/5] rounded-2xl overflow-hidden border border-amber-gold/50 shadow-sm relative">
            <img src="/fashion_model_blazer.png" alt="After Try-On" className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-gold text-burgundy text-[8px] font-bold uppercase shadow-sm">
              ✓ After
            </div>
          </div>
        </div>
      ),
    },
    {
      num: '03',
      title: 'COLOR ANALYSIS',
      stepTag: 'STEP 03',
      cardTitle: 'Color Analysis',
      icon: (
        <div className="w-6 h-6 rounded-full border border-burgundy/30 flex items-center justify-center bg-burgundy/5 text-burgundy text-[10px] font-bold">
          ★
        </div>
      ),
      desc: 'Find your perfect shades using AI-powered color insights.',
      content: (
        <div className="mt-3 p-3 rounded-2xl bg-white/40 border border-hairline-border/50 flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full border border-hairline-border flex-shrink-0 flex items-center justify-center shadow-sm"
            style={{
              background: 'conic-gradient(#840B14 0deg 72deg, #DF972B 72deg 144deg, #7A5A1B 144deg 216deg, #F6E6B6 216deg 288deg, #FEA3DC 288deg 360deg)',
            }}
          >
            <div className="w-5 h-5 bg-[#FFFDF4] rounded-full border border-hairline-border" />
          </div>

          <div className="flex-1">
            <span className="text-[9px] uppercase tracking-wider text-burgundy/50 font-bold block">Matched Palette</span>
            <span className="font-display text-xs font-bold text-burgundy">Warm Autumn Tone</span>
            <div className="flex gap-1 mt-1.5">
              {['#840B14', '#9E522B', '#7A5A1B', '#F6E6B6', '#DF972B', '#B2353B'].map((color) => (
                <div
                  key={color}
                  className="w-4 h-4 rounded-full border border-white shadow-xs"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      num: '04',
      title: 'ACCESSORIES',
      stepTag: 'STEP 04',
      cardTitle: 'Accessories',
      icon: (
        <svg className="w-5 h-5 text-burgundy/60" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
      ),
      desc: 'Complete your look with handpicked accessories that match you.',
      content: (
        <div className="grid grid-cols-2 gap-2 mt-3">
          {[
            { label: 'Eyewear', icon: '🕶️' },
            { label: 'Handbag', icon: '👜' },
            { label: 'Jewelry', icon: '✨' },
            { label: 'Watch', icon: '⌚' },
          ].map((acc) => (
            <div key={acc.label} className="p-2 rounded-xl bg-white/50 border border-hairline-border flex items-center gap-2">
              <span className="text-base">{acc.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy/70 truncate">{acc.label}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      num: '05',
      title: 'SHOP THE LOOK',
      stepTag: 'STEP 05',
      cardTitle: 'Shop the Look',
      icon: (
        <svg className="w-5 h-5 text-burgundy/60" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
      ),
      desc: 'Shop your favorite looks in just a few taps.',
      content: (
        <div className="mt-3 space-y-2">
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { item: 'Blazer', price: '₹9,999' },
              { item: 'Trousers', price: '₹5,999' },
              { item: 'Bag', price: '₹14,999' },
            ].map((p) => (
              <div key={p.item} className="p-2 rounded-xl bg-white/60 border border-hairline-border text-center">
                <span className="text-[9px] uppercase font-bold text-burgundy/50 block truncate">{p.item}</span>
                <span className="text-xs font-bold text-amber-gold">{p.price}</span>
              </div>
            ))}
          </div>
          <button type="button" className="w-full mt-2 btn-gold py-2 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
            Shop Outfit Now
          </button>
        </div>
      ),
    },
  ];

  return (
    <div ref={containerRef} className="relative px-4 py-10 bg-ivory block md:hidden overflow-hidden">
      {/* Background Track Line */}
      <div className="absolute left-[31px] sm:left-[33px] top-14 bottom-14 w-[3.5px] bg-burgundy/15 rounded-full z-0 pointer-events-none" />

      {/* Vibrant Yellow Progress Bar Fill Line traveling with scroll */}
      <div className="absolute left-[31px] sm:left-[33px] top-14 bottom-14 w-[3.5px] rounded-full z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="w-full bg-[#DF972B] shadow-[0_0_12px_rgba(223,151,43,0.9)] origin-top rounded-full"
          style={{
            height: '100%',
            scaleY: smoothProgress,
          }}
        />
      </div>

      <div className="relative z-10 space-y-8">
        {stepsData.map((item, idx) => (
          <MobileTimelineItem
            key={item.num}
            item={item}
            index={idx}
            totalSteps={stepsData.length}
            smoothProgress={smoothProgress}
          />
        ))}
      </div>
    </div>
  );
}

export default function Timeline() {
  const { containerRef, smoothProgress, activeIndex } = useTimelineScroll();

  // Smoothly fade out navigation helper text as user scrolls
  const instructionOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);

  return (
    <>
      {/* Mobile View: Animated Vertical Scroll-Driven Timeline */}
      <MobileTimeline />

      {/* Desktop View: Sticky Scroll-Driven Timeline Showcase */}
      <div
        ref={containerRef}
        className="hidden md:block relative h-[480vh] w-full bg-bg"
      >
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-center items-center">
          
          {/* Ambient Glows */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
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

          {/* Desktop Content Grid Container */}
          <div className="relative z-10 w-full max-w-6xl mx-auto px-8 lg:px-12 h-full flex flex-col justify-center select-none overflow-visible">
            <div className="grid grid-cols-12 gap-8 items-center w-full">
              
              {/* Progress Tracker */}
              <div className="col-span-3 lg:col-span-3 w-full flex items-center justify-center h-[500px] relative z-20">
                <TimelineProgress
                  steps={steps}
                  activeIndex={activeIndex}
                  smoothProgress={smoothProgress}
                  containerRef={containerRef}
                />
              </div>

              {/* Right Card Transitions Container */}
              <div className="col-span-9 lg:col-span-9 w-full overflow-visible relative z-10">
                <TimelineContent
                  activeIndex={activeIndex}
                  smoothProgress={smoothProgress}
                  totalSteps={steps.length}
                />
              </div>

            </div>
          </div>

          {/* Desktop Scroll Instruction indicator */}
          <motion.div
            style={{ opacity: instructionOpacity }}
            className="absolute bottom-8 left-0 right-0 mx-auto text-center flex flex-col items-center gap-2 pointer-events-none z-20 px-4"
          >
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
    </>
  );
}
