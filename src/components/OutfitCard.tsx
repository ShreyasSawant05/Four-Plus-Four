import type { Outfit } from '../data/outfits';

interface OutfitCardProps {
  outfit: Outfit;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

export default function OutfitCard({ outfit, index, isActive, onClick }: OutfitCardProps) {
  return (
    <div
      className={`outfit-card flex-shrink-0 w-[240px] md:w-[280px] cursor-pointer group transition-all duration-300 ${
        isActive ? 'scale-[1.02]' : 'scale-100'
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      id={`outfit-card-${index}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
    >
      <div
        className={`relative rounded-3xl overflow-hidden border transition-all duration-300 bg-card-surface ${
          isActive
            ? 'border-amber-gold shadow-md'
            : 'border-hairline-border hover:border-burgundy/25'
        }`}
      >
        {/* Card Image */}
        <div className="aspect-[3/4] overflow-hidden bg-neutral-surface flex items-center justify-center relative">
          <img 
            src={outfit.cardImage} 
            alt={outfit.name} 
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          {/* Active highlight corner dot */}
          {isActive && (
            <div className="absolute top-3 left-3 bg-amber-gold text-burgundy font-body font-bold text-[9px] px-2 py-0.5 rounded-full uppercase border border-burgundy/10 shadow-sm z-10">
              Selected
            </div>
          )}
        </div>

        {/* Info card text footer */}
        <div className="p-4 border-t border-hairline-border">
          <div className="flex items-end justify-between">
            <div className="min-w-0 flex-1">
              <p className="font-display text-[9px] text-burgundy/45 tracking-widest uppercase mb-0.5">
                Look {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="font-display font-bold text-xs text-burgundy leading-tight truncate pr-1">
                {outfit.name}
              </h3>
            </div>
            <span className="font-display text-sm font-bold text-amber-gold whitespace-nowrap">
              {outfit.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
