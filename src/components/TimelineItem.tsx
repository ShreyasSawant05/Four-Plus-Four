import { motion } from 'framer-motion';

interface TimelineItemProps {
  index: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
  onClick?: () => void;
}

export default function TimelineItem({
  index,
  label,
  isActive,
  isCompleted,
  onClick,
}: TimelineItemProps) {
  const stepNumber = String(index + 1).padStart(2, '0');

  return (
    <div
      onClick={onClick}
      className="flex flex-row items-center gap-4 cursor-pointer group select-none relative z-10 py-1.5 w-auto md:w-full transition-all duration-300"
    >
      {/* Badge Ring/Circle */}
      <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
        {isActive && (
          // Pulsing Glow Outer Ring
          <motion.div
            className="absolute inset-0 rounded-full bg-amber-gold/30 blur-md"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
        
        <motion.div
          className={`
            w-10 h-10 rounded-full flex items-center justify-center font-display text-sm font-semibold border-2 transition-all duration-300
            ${isActive 
              ? 'bg-gradient-to-br from-amber-gold to-[#f0a93c] border-amber-gold text-burgundy shadow-[0_0_15px_rgba(223,151,43,0.5)] z-20'
              : isCompleted
                ? 'bg-amber-gold border-amber-gold text-burgundy shadow-sm'
                : 'bg-card-surface border-hairline-border text-subtle-label/70 hover:border-burgundy/40 hover:text-burgundy'
            }
          `}
          animate={{ scale: isActive ? 1.15 : 1.0 }}
          whileHover={{ scale: isActive ? 1.18 : 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          {stepNumber}
        </motion.div>
      </div>

      {/* Step Label: Clean sidebar look on desktop */}
      <div className="md:flex hidden items-center text-left flex-shrink-0">
        <span 
          className={`
            font-body text-xs tracking-widest uppercase font-bold transition-colors duration-300 whitespace-nowrap
            ${isActive 
              ? 'text-burgundy font-extrabold' 
              : isCompleted 
                ? 'text-subtle-label font-bold' 
                : 'text-subtle-label/50 group-hover:text-subtle-label/85'
            }
          `}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
