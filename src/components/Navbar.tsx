import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useOutfitStore, type ModalType } from '../store/useOutfitStore';

export default function Navbar() {
  const setActiveModal = useOutfitStore((s) => s.setActiveModal);
  const navRef = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { label: string; modal?: ModalType; targetId?: string }[] = [
    { label: 'Discover', targetId: 'feed' },
    { label: 'Virtual Try-On', modal: 'try-on' },
    { label: 'Color Match', modal: 'color' },
    { label: 'Body Insights', modal: 'body' },
    { label: 'Style Lab', modal: 'style-lab' },
    { label: 'Shop Looks', targetId: 'shop' },
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
    if (item.modal) {
      setActiveModal(item.modal);
    } else if (item.targetId) {
      const el = document.getElementById(item.targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white/55 backdrop-blur-xl border-b border-hairline-border"
      style={{ opacity: 0 }}
    >
      <div className="section-wrapper flex items-center justify-between h-16">
        {/* Brand Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          id="nav-brand"
          className="hover:opacity-85 transition-opacity flex items-center gap-2"
        >
          <img src="/Logo for 4+4.png" alt="Four plus Four" className="h-8 object-contain" />
        </button>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleClick(item)}
              className="text-[13px] font-medium text-burgundy hover:text-[#d51927] transition-colors duration-200 tracking-wide"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-5 h-px bg-burgundy transition-transform duration-300 ${mobileOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
          <span className={`w-5 h-px bg-burgundy transition-opacity duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-px bg-burgundy transition-transform duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="lg:hidden bg-card-surface/95 backdrop-blur-xl border-t border-hairline-border px-5 py-4 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleClick(item)}
              className="block w-full text-left text-sm text-burgundy hover:text-[#d51927] transition-colors py-2"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
