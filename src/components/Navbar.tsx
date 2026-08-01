import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { AnimatePresence, motion } from 'framer-motion';
import { useOutfitStore, type ModalType } from '../store/useOutfitStore';

export default function Navbar() {
  const setActiveModal = useOutfitStore((s) => s.setActiveModal);
  const closeModal = useOutfitStore((s) => s.closeModal);
  const currentView = useOutfitStore((s) => s.currentView);
  const setCurrentView = useOutfitStore((s) => s.setCurrentView);

  const navRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { label: string; modal?: ModalType; targetId?: string; isShop?: boolean }[] = [
    { label: 'Discover', targetId: 'feed' },
    { label: 'Style DNA', targetId: 'styledna' },
    { label: 'Virtual Try-On', modal: 'try-on' },
    { label: 'Color Match', modal: 'color' },
    { label: 'Body Insights', modal: 'body' },
    { label: 'Style Lab', modal: 'style-lab' },
    { label: 'Shop Looks', isShop: true },
  ];

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.1 }
      );
    }
  }, []);

  const handleClick = (item: typeof navItems[0]) => {
    setMobileOpen(false);
    closeModal();

    if (item.isShop) {
      setCurrentView('shop');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.targetId) {
      if (currentView !== 'home') {
        setCurrentView('home');
      }
      setTimeout(() => {
        const el = document.getElementById(item.targetId!);
        if (el) {
          const navOffset = 80;
          const elementPosition = el.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - navOffset;

          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth',
          });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else if (item.modal) {
      setActiveModal(item.modal);
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-hairline-border"
      style={{ opacity: 0 }}
    >
      <div className="section-wrapper flex items-center justify-between h-20">
        {/* Brand Logo */}
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          id="nav-brand"
          className="hover:opacity-85 transition-opacity flex items-center gap-2"
        >
          <img src="/logo.png" alt="Four plus Four" className="h-14 object-contain" />
        </button>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => {
            const isActive = item.isShop ? currentView === 'shop' : currentView === 'home' && false;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleClick(item)}
                className={`text-[13px] font-medium transition-all duration-200 tracking-wide ${
                  item.isShop
                    ? 'bg-burgundy text-white px-3.5 py-1.5 rounded-full shadow-sm hover:bg-[#d51927]'
                    : isActive
                    ? 'text-[#d51927] font-semibold'
                    : 'text-burgundy hover:text-[#d51927]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="lg:hidden flex flex-col gap-1.5 p-2 justify-center items-center h-10 w-10 relative"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-5 h-px bg-burgundy transition-all duration-300 ${mobileOpen ? 'rotate-45 absolute' : ''}`} />
          <span className={`w-5 h-px bg-burgundy transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-px bg-burgundy transition-all duration-300 ${mobileOpen ? '-rotate-45 absolute' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden bg-card-surface/95 backdrop-blur-xl border-t border-hairline-border px-5 py-4 space-y-2.5 overflow-hidden"
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleClick(item)}
                className="block w-full text-left text-sm font-medium text-burgundy hover:text-[#d51927] transition-colors py-2"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
