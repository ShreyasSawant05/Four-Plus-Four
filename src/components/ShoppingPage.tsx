import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutfitStore } from '../store/useOutfitStore';
import { ALL_OUTFITS, shuffleOutfits, type OutfitItem } from '../data/allOutfitsData';

export default function ShoppingPage() {
  const setCurrentView = useOutfitStore((s) => s.setCurrentView);
  const selectedGender = useOutfitStore((s) => s.selectedGender);
  const setSelectedGender = useOutfitStore((s) => s.setSelectedGender);
  const selectedCategory = useOutfitStore((s) => s.selectedCategory);
  const setSelectedCategory = useOutfitStore((s) => s.setSelectedCategory);
  const setTryOnActive = useOutfitStore((s) => s.setTryOnActive);
  const setCustomTryOnImage = useOutfitStore((s) => s.setCustomTryOnImage);

  const [searchQuery, setSearchQuery] = useState('');
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [selectedOutfitModal, setSelectedOutfitModal] = useState<OutfitItem | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Categories list per gender
  const categoriesForGender = useMemo(() => {
    if (selectedGender === 'men') {
      return ['All', 'Boho', 'Cottage Core', 'Dark Academia', 'Old Money', 'Streetwear', 'Y2K'];
    } else if (selectedGender === 'women') {
      return ['All', 'Boho', 'Clean Girl', 'Coquette', 'Cottage Core', 'Dark Academia', 'Old Money', 'Streetwear', 'Y2K'];
    }
    return ['All', 'Boho', 'Clean Girl', 'Coquette', 'Cottage Core', 'Dark Academia', 'Old Money', 'Streetwear', 'Y2K'];
  }, [selectedGender]);

  // Filter & randomize outfits
  const filteredAndShuffledOutfits = useMemo(() => {
    let list = ALL_OUTFITS;

    // Filter by gender
    if (selectedGender === 'men') {
      list = list.filter((item) => item.gender === 'men');
    } else if (selectedGender === 'women') {
      list = list.filter((item) => item.gender === 'women');
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'All') {
      list = list.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Shuffle outfits non-sequentially
    return shuffleOutfits(list);
  }, [selectedGender, selectedCategory, searchQuery, shuffleSeed]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTryOn = (outfit: OutfitItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCustomTryOnImage(outfit.image);
    setTryOnActive(true);
  };

  const menCount = useMemo(() => ALL_OUTFITS.filter((i) => i.gender === 'men').length, []);
  const womenCount = useMemo(() => ALL_OUTFITS.filter((i) => i.gender === 'women').length, []);

  // Sample hero images for Men and Women cards
  const menHeroImages = [
    "/outfits/Old Money Men/WhatsApp Image 2026-07-16 at 9.10.29 PM.jpeg",
    "/outfits/Streetwear Men/WhatsApp Image 2026-07-16 at 10.25.25 PM.jpeg",
    "/outfits/Y2K Men/WhatsApp Image 2026-07-16 at 9.18.17 PM.jpeg",
    "/outfits/Dark Academia Men/WhatsApp Image 2026-07-16 at 10.03.39 PM.jpeg"
  ];

  const womenHeroImages = [
    "/outfits/Clean Girl/WhatsApp Image 2026-07-16 at 10.03.57 PM.jpeg",
    "/outfits/Coquette/WhatsApp Image 2026-07-16 at 10.24.35 PM.jpeg",
    "/outfits/Old Money Women/WhatsApp Image 2026-07-16 at 9.10.09 PM.jpeg",
    "/outfits/Boho Women/WhatsApp Image 2026-07-16 at 10.04.12 PM.jpeg"
  ];

  return (
    <div className="min-h-screen bg-[#FFF3D1] text-burgundy pt-24 pb-20 font-body selection:bg-blush selection:text-burgundy">
      {/* Top Sticky Header Bar */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-[#FFF3D1]/85 backdrop-blur-xl border-b border-hairline-border px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 text-xs uppercase tracking-widest font-body font-medium text-burgundy/80 hover:text-fashion-red transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Home
            </button>
            <span className="text-burgundy/20">|</span>
            <span className="text-xs font-body font-semibold uppercase tracking-wider text-burgundy bg-card-surface px-3 py-1 rounded-full border border-hairline-border shadow-xs">
              {selectedGender ? `${selectedGender.toUpperCase()} COLLECTION` : 'SELECT COLLECTION'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {selectedGender && (
              <button
                onClick={() => setSelectedGender(null)}
                className="text-xs font-body font-medium text-burgundy hover:text-fashion-red underline underline-offset-4 flex items-center gap-1.5 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Switch Collection
              </button>
            )}
            <span className="text-xs font-body font-medium text-burgundy/60 hidden sm:inline">
              {filteredAndShuffledOutfits.length} Fits Loaded
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* STEP 1: GENDER SELECTION VIEW (Men vs Women Cards) */}
        {!selectedGender ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="py-6 sm:py-10"
          >
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <span className="text-xs font-body font-bold tracking-[0.25em] uppercase text-subtle-label">
                CURATED AESTHETICS STUDIO
              </span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-burgundy">
                Shop The <span className="italic font-normal text-fashion-red">Looks</span>
              </h1>
              <p className="font-body text-burgundy/75 text-sm sm:text-base leading-relaxed">
                Explore randomized outfits tailored across Old Money, Y2K, Streetwear, Boho, Dark Academia, Cottage Core & more.
              </p>
            </div>

            {/* Men & Women Interactive Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* MEN SELECTION CARD */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => {
                  setSelectedGender('men');
                  setSelectedCategory('all');
                }}
                className="group relative rounded-3xl overflow-hidden bg-card-surface border border-hairline-border hover:border-burgundy/40 cursor-pointer shadow-soft hover:shadow-xl transition-all duration-500"
              >
                {/* Image Grid Background */}
                <div className="absolute inset-0 grid grid-cols-2 gap-1.5 opacity-60 group-hover:opacity-75 transition-opacity duration-500 scale-105 group-hover:scale-100">
                  {menHeroImages.map((img, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden bg-neutral-surface">
                      <img src={img} alt="Men Fit" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#FFFBEC] via-[#FFFBEC]/80 to-transparent" />

                {/* Card Content */}
                <div className="relative p-8 sm:p-10 flex flex-col justify-end min-h-[460px] z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-burgundy/10 backdrop-blur-md text-burgundy text-xs font-body font-semibold tracking-wider rounded-full border border-hairline-border uppercase">
                      {menCount} Curated Outfits
                    </span>
                    <span className="px-3 py-1 bg-amber-gold/20 backdrop-blur-md text-burgundy text-xs font-body font-medium rounded-full">
                      6 Aesthetics
                    </span>
                  </div>

                  <div>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-burgundy group-hover:text-fashion-red transition-colors">
                      Men's Collection
                    </h2>
                    <p className="font-body text-burgundy/75 text-xs sm:text-sm mt-2 leading-relaxed">
                      Boho, Cottage Core, Dark Academia, Old Money, Streetwear & Y2K Men outfits.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button className="btn-primary w-full py-4 uppercase tracking-wider text-xs font-semibold rounded-2xl shadow-md flex items-center justify-center gap-2 group-hover:shadow-lg">
                      Explore Men's Looks
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* WOMEN SELECTION CARD */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                onClick={() => {
                  setSelectedGender('women');
                  setSelectedCategory('all');
                }}
                className="group relative rounded-3xl overflow-hidden bg-card-surface border border-hairline-border hover:border-burgundy/40 cursor-pointer shadow-soft hover:shadow-xl transition-all duration-500"
              >
                {/* Image Grid Background */}
                <div className="absolute inset-0 grid grid-cols-2 gap-1.5 opacity-60 group-hover:opacity-75 transition-opacity duration-500 scale-105 group-hover:scale-100">
                  {womenHeroImages.map((img, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden bg-neutral-surface">
                      <img src={img} alt="Women Fit" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#FFFBEC] via-[#FFFBEC]/80 to-transparent" />

                {/* Card Content */}
                <div className="relative p-8 sm:p-10 flex flex-col justify-end min-h-[460px] z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-burgundy/10 backdrop-blur-md text-burgundy text-xs font-body font-semibold tracking-wider rounded-full border border-hairline-border uppercase">
                      {womenCount} Curated Outfits
                    </span>
                    <span className="px-3 py-1 bg-amber-gold/20 backdrop-blur-md text-burgundy text-xs font-body font-medium rounded-full">
                      8 Aesthetics
                    </span>
                  </div>

                  <div>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-burgundy group-hover:text-fashion-red transition-colors">
                      Women's Collection
                    </h2>
                    <p className="font-body text-burgundy/75 text-xs sm:text-sm mt-2 leading-relaxed">
                      Clean Girl, Coquette, Boho, Cottage Core, Dark Academia, Old Money, Streetwear & Y2K.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button className="btn-primary w-full py-4 uppercase tracking-wider text-xs font-semibold rounded-2xl shadow-md flex items-center justify-center gap-2 group-hover:shadow-lg">
                      Explore Women's Looks
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* STEP 2: RANDOMIZED OUTFITS STREAM VIEW */
          <div className="space-y-8">
            {/* Header & Controls Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card-surface border border-hairline-border rounded-2xl p-5 sm:p-7 shadow-soft space-y-5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-burgundy capitalize flex items-center gap-3">
                    {selectedGender === 'all' ? 'All Outfits' : `${selectedGender}'s Looks`}
                    <span className="font-body text-xs font-semibold text-burgundy bg-ivory border border-hairline-border px-3 py-1 rounded-full">
                      Randomized Stream
                    </span>
                  </h1>
                  <p className="font-body text-xs sm:text-sm text-burgundy/70 mt-1">
                    Discover non-sequential outfit combinations. Filter by aesthetic or hit Randomize for new styles!
                  </p>
                </div>

                {/* Gender Toggle Tabs & Randomize Fits Button */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-[#FFF3D1] p-1 rounded-full border border-hairline-border flex items-center">
                    {(['men', 'women', 'all'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGender(g)}
                        className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold uppercase tracking-wider transition-all ${
                          selectedGender === g
                            ? 'bg-burgundy text-ivory shadow-sm'
                            : 'text-burgundy/80 hover:text-fashion-red'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShuffleSeed((s) => s + 1)}
                    className="btn-gold py-2 px-4 text-xs flex items-center gap-2"
                    title="Reshuffle outfit cards"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M4.5 12c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3-3m-3 3l3 3m12-3l-3-3m3 3l-3 3" />
                    </svg>
                    Randomize Fits
                  </button>
                </div>
              </div>

              {/* Aesthetic Filter Pills & Search Input */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-hairline-border">
                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {categoriesForGender.map((cat) => {
                    const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-body font-medium whitespace-nowrap transition-all ${
                          isActive
                            ? 'bg-burgundy text-ivory font-semibold shadow-sm'
                            : 'bg-card-surface text-burgundy/80 hover:bg-white hover:text-burgundy border border-hairline-border'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Search Bar */}
                <div className="relative w-full lg:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search style or look..."
                    className="w-full bg-[#FFF3D1]/80 border border-hairline-border rounded-full pl-9 pr-4 py-2 text-xs font-body text-burgundy placeholder:text-burgundy/40 focus:outline-none focus:border-burgundy transition-colors"
                  />
                  <svg
                    className="w-4 h-4 text-burgundy/40 absolute left-3 top-2.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2 text-xs text-burgundy/50 hover:text-burgundy"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Outfits Grid with Scroll Animations */}
            {filteredAndShuffledOutfits.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-card-surface border border-hairline-border rounded-2xl">
                <div className="text-4xl">🔍</div>
                <h3 className="font-display text-xl font-semibold text-burgundy">No outfits match your search</h3>
                <p className="font-body text-burgundy/70 text-sm">Try resetting filters or search terms.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="btn-secondary text-xs py-2 px-5"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredAndShuffledOutfits.map((outfit, index) => (
                    <motion.div
                      key={outfit.id}
                      initial={{ opacity: 0, y: 35, scale: 0.96 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.5, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ y: -6 }}
                      className="glass-card bg-card-surface border border-hairline-border rounded-2xl overflow-hidden shadow-soft flex flex-col justify-between group hover:border-burgundy/30 transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedOutfitModal(outfit)}
                    >
                      {/* Image Frame */}
                      <div>
                        <div className="aspect-[3/4] relative overflow-hidden bg-neutral-surface">
                          <img
                            src={outfit.image}
                            alt={outfit.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-burgundy/60 via-transparent to-transparent opacity-30 group-hover:opacity-10 transition-opacity" />

                          {/* Top Pill Badges */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                            <span className="px-2.5 py-1 bg-[#FFF3D1]/90 backdrop-blur-md text-burgundy font-body font-bold text-[10px] tracking-wider uppercase rounded-full border border-hairline-border shadow-xs">
                              {outfit.category}
                            </span>
                            <button
                              onClick={(e) => toggleFavorite(outfit.id, e)}
                              className="w-8 h-8 rounded-full bg-[#FFF3D1]/90 backdrop-blur-md flex items-center justify-center text-burgundy hover:text-fashion-red transition-colors shadow-xs"
                            >
                              <svg
                                className="w-4 h-4"
                                fill={favorites[outfit.id] ? '#D51927' : 'none'}
                                stroke={favorites[outfit.id] ? '#D51927' : 'currentColor'}
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                              </svg>
                            </button>
                          </div>

                          {/* Gender Tag Bottom Left */}
                          <div className="absolute bottom-3 left-3 z-10">
                            <span className="text-[10px] font-body font-semibold uppercase tracking-wider text-burgundy bg-card-surface/90 backdrop-blur-md px-2 py-0.5 rounded border border-hairline-border">
                              {outfit.gender}
                            </span>
                          </div>
                        </div>

                        {/* Text Content */}
                        <div className="p-4 space-y-1.5">
                          <div className="flex items-baseline justify-between gap-2">
                            <h3 className="font-display font-semibold text-base text-burgundy group-hover:text-fashion-red transition-colors line-clamp-1">
                              {outfit.title}
                            </h3>
                            <span className="font-body font-bold text-sm text-fashion-red flex-shrink-0">
                              {outfit.price}
                            </span>
                          </div>
                          <p className="font-body text-xs text-burgundy/70 line-clamp-2 leading-relaxed">
                            {outfit.description}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="p-4 pt-0 grid grid-cols-2 gap-2 mt-2">
                        <button
                          onClick={(e) => handleTryOn(outfit, e)}
                          className="btn-primary text-[11px] py-2 px-2.5 rounded-xl font-body font-semibold"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          Try On
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOutfitModal(outfit);
                          }}
                          className="btn-secondary text-[11px] py-2 px-2.5 rounded-xl font-body font-semibold text-center"
                        >
                          View Fit
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>

      {/* QUICK VIEW OUTFIT DETAIL MODAL */}
      <AnimatePresence>
        {selectedOutfitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOutfitModal(null)}
              className="absolute inset-0 bg-burgundy/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-card-surface border border-hairline-border rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl text-burgundy flex flex-col md:flex-row max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedOutfitModal(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-ivory border border-hairline-border text-burgundy hover:text-fashion-red flex items-center justify-center shadow-sm"
              >
                ✕
              </button>

              <div className="w-full md:w-1/2 aspect-[3/4] relative bg-neutral-surface">
                <img
                  src={selectedOutfitModal.image}
                  alt={selectedOutfitModal.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-body uppercase font-bold tracking-widest px-3 py-1 bg-ivory text-burgundy rounded-full border border-hairline-border">
                      {selectedOutfitModal.category}
                    </span>
                    <span className="text-[10px] font-body uppercase font-semibold px-2 py-0.5 bg-burgundy/10 text-burgundy rounded">
                      {selectedOutfitModal.gender}
                    </span>
                  </div>

                  <h2 className="text-2xl font-display font-bold text-burgundy mb-1">
                    {selectedOutfitModal.title}
                  </h2>
                  <p className="text-xl font-body font-bold text-fashion-red mb-3">
                    {selectedOutfitModal.price}
                  </p>
                  <p className="text-xs font-body text-burgundy/80 leading-relaxed mb-4">
                    {selectedOutfitModal.description}
                  </p>

                  <div className="space-y-2">
                    <span className="text-[11px] font-body font-semibold text-subtle-label uppercase tracking-wider block">
                      Style Tags:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedOutfitModal.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] font-body bg-ivory border border-hairline-border px-2 py-1 rounded text-burgundy">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-hairline-border">
                  <button
                    onClick={() => {
                      const outfit = selectedOutfitModal;
                      setSelectedOutfitModal(null);
                      handleTryOn(outfit);
                    }}
                    className="btn-primary w-full py-3 text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    Virtual Try-On This Fit
                  </button>

                  <button
                    onClick={() => {
                      alert(`Proceeding to buy ${selectedOutfitModal.title} for ${selectedOutfitModal.price}...`);
                    }}
                    className="btn-secondary w-full py-3 text-xs uppercase tracking-wider font-semibold rounded-xl text-center"
                  >
                    Buy Complete Look
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
