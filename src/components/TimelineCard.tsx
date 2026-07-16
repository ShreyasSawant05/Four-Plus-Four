import { useEffect, useState } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface TimelineCardProps {
  index: number;
  activeIndex: number;
  smoothProgress: MotionValue<number>;
  totalSteps: number;
}

export default function TimelineCard({
  index,
  activeIndex,
  smoothProgress,
  totalSteps,
}: TimelineCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const isActive = activeIndex === index;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate the center scroll value for this card
  // With 5 steps: 0, 0.25, 0.50, 0.75, 1.00
  const centerValue = index / (totalSteps - 1);
  const stepSize = 1 / (totalSteps - 1);

  // Map scroll progress to animations
  // Input range: [far future, next card, active card, previous card, far past]
  const inputRange = [
    centerValue - stepSize * 2,
    centerValue - stepSize,
    centerValue,
    centerValue + stepSize,
    centerValue + stepSize * 2,
  ];

  // Responsive vertical offsets (translateY)
  const yRange = isMobile
    ? ['85vh', '42vh', '0vh', '-42vh', '-85vh']
    : ['110vh', '56vh', '0vh', '-56vh', '-110vh'];

  const y = useTransform(smoothProgress, inputRange, yRange);

  // Opacity: Inactive cards peek at 35%, fade off-screen
  const opacity = useTransform(smoothProgress, inputRange, [0, 0.35, 1, 0.35, 0]);

  // Scale: Active goes 0.92 -> 1, inactive is 90% (0.9)
  const scale = useTransform(smoothProgress, inputRange, [0.9, 0.9, 1, 0.9, 0.9]);



  // Framer Motion Animation Variants for internal card elements
  const containerVariants: Variants = {
    inactive: {},
    active: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const slideUpVariants: Variants = {
    inactive: { y: 25, opacity: 0 },
    active: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 90, damping: 18 },
    },
  };

  const drawArrowVariants: Variants = {
    inactive: { pathLength: 0, opacity: 0 },
    active: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeInOut', delay: 0.3 },
    },
  };

  // Render specific content inside card depending on step index
  const renderCardContent = () => {
    switch (index) {
      case 0: // Step 1: Inspiration
        return (
          <>
            {/* Left: Text details */}
            <motion.div className="flex-1 text-left space-y-3" variants={containerVariants}>
              <motion.span className="font-body text-xs font-bold text-amber-gold uppercase tracking-widest" variants={slideUpVariants}>
                Step 01
              </motion.span>
              <motion.h3 className="font-display text-2xl md:text-3xl text-burgundy font-bold leading-tight" variants={slideUpVariants}>
                Inspiration
              </motion.h3>
              <motion.div className="w-12 h-[2px] bg-amber-gold/55" variants={slideUpVariants} />
              <motion.p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-sm" variants={slideUpVariants}>
                Pinterest-worthy outfits, curated for you. Discover trends matching your aesthetic preferences.
              </motion.p>
            </motion.div>

            {/* Right: Visual details */}
            <div className="flex-1 w-full h-[170px] md:h-[260px] flex items-center gap-4 relative">
              <motion.div 
                className="w-3/5 h-full rounded-2xl overflow-hidden border border-hairline-border shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <img 
                  src="/fashion_model_blazer.png" 
                  alt="Inspiration outfit" 
                  className="w-full h-full object-cover" 
                />
              </motion.div>
              <motion.div 
                className="w-2/5 h-full rounded-2xl overflow-hidden border border-hairline-border shadow-sm"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={isActive ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.03 }}
              >
                <img 
                  src="/fashion_flatlay.png" 
                  alt="Outfit flatlay" 
                  className="w-full h-full object-cover" 
                />
              </motion.div>
            </div>
          </>
        );

      case 1: // Step 2: Virtual Try-On
        return (
          <>
            {/* Left: Text details */}
            <motion.div className="flex-1 text-left space-y-3" variants={containerVariants}>
              <motion.span className="font-body text-xs font-bold text-amber-gold uppercase tracking-widest" variants={slideUpVariants}>
                Step 02
              </motion.span>
              <motion.h3 className="font-display text-2xl md:text-3xl text-burgundy font-bold leading-tight" variants={slideUpVariants}>
                Virtual Try-On
              </motion.h3>
              <motion.div className="w-12 h-[2px] bg-amber-gold/55" variants={slideUpVariants} />
              <motion.p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-sm" variants={slideUpVariants}>
                See the look on yourself instantly. Upload your picture and check fit details virtually.
              </motion.p>
              <motion.div 
                className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-xl border border-dashed border-amber-gold/40 bg-amber-gold/5 text-burgundy text-xs font-semibold"
                variants={slideUpVariants}
              >
                AI-Powered Realistic Fit
              </motion.div>
            </motion.div>

            {/* Right: Visual details */}
            <div className="flex-1 w-full h-[170px] md:h-[260px] flex items-center justify-between gap-3 relative">
              {/* Before Model (Silhouette/Grayscale) */}
              <motion.div 
                className="w-[43%] h-full rounded-2xl overflow-hidden border border-hairline-border shadow-sm relative bg-[#EADCC2]/10"
                initial={{ x: -30, opacity: 0 }}
                animate={isActive ? { x: 0, opacity: 1 } : { x: -30, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.1 }}
              >
                <img 
                  src="/fashion_model_blazer.png" 
                  alt="Before" 
                  className="w-full h-full object-cover filter grayscale contrast-125 brightness-95" 
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-burgundy/80 text-ivory text-[9px] font-bold tracking-wider uppercase">
                  Before
                </div>
              </motion.div>

              {/* Arrow Connection */}
              <div className="w-[14%] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-burgundy">
                  <motion.path
                    d="M5 12H19M19 12L13 6M19 12L13 18"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={drawArrowVariants}
                  />
                </svg>
              </div>

              {/* After Model (Full Color with active badge) */}
              <motion.div 
                className="w-[43%] h-full rounded-2xl overflow-hidden border border-amber-gold/40 shadow-sm relative bg-[#EADCC2]/10"
                initial={{ x: 30, opacity: 0 }}
                animate={isActive ? { x: 0, opacity: 1 } : { x: 30, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.2 }}
                whileHover={{ scale: 1.03 }}
              >
                <img 
                  src="/fashion_model_blazer.png" 
                  alt="After" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-gold text-burgundy text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm">
                  <span>After</span>
                  <span>✓</span>
                </div>
              </motion.div>
            </div>
          </>
        );

      case 2: // Step 3: Color Analysis
        return (
          <>
            {/* Left: Text details */}
            <motion.div className="flex-1 text-left space-y-3" variants={containerVariants}>
              <motion.span className="font-body text-xs font-bold text-amber-gold uppercase tracking-widest" variants={slideUpVariants}>
                Step 03
              </motion.span>
              <motion.h3 className="font-display text-2xl md:text-3xl text-burgundy font-bold leading-tight" variants={slideUpVariants}>
                Color Analysis
              </motion.h3>
              <motion.div className="w-12 h-[2px] bg-amber-gold/55" variants={slideUpVariants} />
              <motion.p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-sm" variants={slideUpVariants}>
                Discover your best colors & undertones. Learn which palettes harmonize perfectly with your skin tone.
              </motion.p>
            </motion.div>

            {/* Right: Visual details */}
            <div className="flex-1 w-full h-[170px] md:h-[260px] flex flex-row items-center justify-center gap-4 md:gap-6 p-3 md:p-4 rounded-2xl bg-white/30 border border-hairline-border/40">
              {/* Rotating Color Wheel */}
              <motion.div 
                className="relative w-16 h-16 md:w-24 md:h-24 rounded-full border border-hairline-border flex items-center justify-center flex-shrink-0 shadow-sm"
                style={{
                  background: 'conic-gradient(#840B14 0deg 72deg, #DF972B 72deg 144deg, #7A5A1B 144deg 216deg, #F6E6B6 216deg 288deg, #FEA3DC 288deg 360deg)'
                }}
                animate={isActive ? { rotate: 360 } : { rotate: 0 }}
                transition={isActive ? { duration: 18, repeat: Infinity, ease: 'linear' } : { duration: 0 }}
              >
                <div className="w-7 h-7 md:w-10 md:h-10 bg-bg-card rounded-full border border-hairline-border/40" />
              </motion.div>

              {/* Analysis Palette */}
              <div className="text-left space-y-2 flex-1">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p className="text-[9px] uppercase tracking-wider text-burgundy/50 font-bold">Matched Undertone</p>
                  <h4 className="font-display text-base md:text-lg font-bold text-burgundy leading-tight">Warm Autumn</h4>
                </motion.div>
                
                {/* Color swatches appearing one by one */}
                <div className="flex gap-1 flex-wrap">
                  {['#840B14', '#9e522b', '#7A5A1B', '#F6E6B6', '#DF972B', '#b2353b'].map((c, i) => (
                    <motion.div
                      key={c}
                      className="w-5 h-5 md:w-7 md:h-7 rounded-full border border-white shadow-sm flex-shrink-0 cursor-pointer"
                      style={{ backgroundColor: c }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.3 + i * 0.08 }}
                      whileHover={{ scale: 1.15, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      case 3: // Step 4: Accessories
        return (
          <>
            {/* Left: Text details */}
            <motion.div className="flex-1 text-left space-y-3" variants={containerVariants}>
              <motion.span className="font-body text-xs font-bold text-amber-gold uppercase tracking-widest" variants={slideUpVariants}>
                Step 04
              </motion.span>
              <motion.h3 className="font-display text-2xl md:text-3xl text-burgundy font-bold leading-tight" variants={slideUpVariants}>
                Accessories
              </motion.h3>
              <motion.div className="w-12 h-[2px] bg-amber-gold/55" variants={slideUpVariants} />
              <motion.p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-sm" variants={slideUpVariants}>
                Complete your look with the right touches. Elevate items like jewelry, bags, and eyewear.
              </motion.p>
            </motion.div>

            {/* Right: Visual details */}
            <div className="flex-1 w-full h-[170px] md:h-[260px] grid grid-cols-2 gap-2.5">
              {[
                { label: 'Luxury Eyewear', icon: '🕶️' },
                { label: 'Leather Handbag', icon: '👜' },
                { label: 'Fine Jewelry', icon: '💍' },
                { label: 'Classic Watch', icon: '⌚' }
              ].map((acc, i) => (
                <motion.div
                  key={acc.label}
                  className="bg-white/60 border border-hairline-border rounded-2xl flex flex-col items-center justify-center p-2 md:p-3 shadow-sm hover:border-amber-gold/60 transition-colors duration-300"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.15 + i * 0.1 }}
                  whileHover={{ scale: 1.04, backgroundColor: 'rgba(255, 251, 236, 0.9)' }}
                >
                  <span className="text-xl md:text-3xl select-none mb-0.5 md:mb-1.5">{acc.icon}</span>
                  <span className="text-[10px] uppercase tracking-wider text-burgundy/60 font-bold mt-1 text-center truncate w-full">
                    {acc.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </>
        );

      case 4: // Step 5: Shop the Look
        return (
          <>
            {/* Left: Text details */}
            <motion.div className="flex-1 text-left space-y-3" variants={containerVariants}>
              <motion.span className="font-body text-xs font-bold text-amber-gold uppercase tracking-widest" variants={slideUpVariants}>
                Step 05
              </motion.span>
              <motion.h3 className="font-display text-2xl md:text-3xl text-burgundy font-bold leading-tight" variants={slideUpVariants}>
                Shop the Look
              </motion.h3>
              <motion.div className="w-12 h-[2px] bg-amber-gold/55" variants={slideUpVariants} />
              <motion.p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-sm mb-2" variants={slideUpVariants}>
                Find the best prices from trusted stores. Shop outfit pieces directly through verified retailers.
              </motion.p>
              <motion.button 
                className="btn-gold shadow-sm font-body px-5 py-2.5 rounded-full text-xs font-bold tracking-wider"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 15, delay: 0.4 }}
              >
                Shop Outfit Now
              </motion.button>
            </motion.div>

            {/* Right: Visual details */}
            <div className="flex-1 w-full h-[170px] md:h-[260px] grid grid-cols-3 gap-2 items-stretch py-1.5">
              {[
                { label: 'Blazer', price: '$129', icon: '🧥' },
                { label: 'Trousers', price: '$79', icon: '👖' },
                { label: 'Bag', price: '$199', icon: '👜' }
              ].map((prod, i) => (
                <motion.div
                  key={prod.label}
                  className="bg-white/80 border border-hairline-border rounded-2xl p-2 md:p-3 flex flex-col justify-between items-center shadow-sm h-full hover:border-amber-gold/40 transition-colors duration-300"
                  initial={{ y: 25, opacity: 0 }}
                  animate={isActive ? { y: 0, opacity: 1 } : { y: 25, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.15 + i * 0.1 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                >
                  <div className="w-full h-[65%] bg-[#EADCC2]/15 rounded-xl flex items-center justify-center text-3xl border border-hairline-border/30">
                    {prod.icon}
                  </div>
                  <div className="text-center w-full mt-1.5">
                    <p className="text-[9px] uppercase tracking-wider text-burgundy/40 font-bold truncate leading-none mb-0.5">{prod.label}</p>
                    <span className="text-xs font-bold text-amber-gold">{prod.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      style={{
        y,
        scale,
        opacity,
      }}
      className={`
        absolute inset-0 m-auto w-full max-w-[92%] md:max-w-2xl lg:max-w-[700px] h-[420px] md:h-[380px]
        bg-bg-card border rounded-[32px] p-5 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-10
        overflow-hidden select-none transition-all duration-500 ease-out
        ${isActive
          ? 'border-amber-gold/60 shadow-[0_0_30px_rgba(223,151,43,0.35),0_20px_60px_-20px_rgba(132,11,20,0.18)]'
          : 'border-hairline-border shadow-[0_4px_20px_rgba(132,11,20,0.04)]'}
      `}
    >
      {renderCardContent()}
    </motion.div>
  );
}
