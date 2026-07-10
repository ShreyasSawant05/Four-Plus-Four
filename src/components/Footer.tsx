import { useOutfitStore } from '../store/useOutfitStore';

export default function Footer() {
  const setActiveModal = useOutfitStore((s) => s.setActiveModal);

  const handleLinkClick = (name: string) => {
    const key = name.toLowerCase();
    if (key.includes('try-on')) setActiveModal('try-on');
    else if (key.includes('color')) setActiveModal('color');
    else if (key.includes('body')) setActiveModal('body');
    else if (key.includes('style dna')) setActiveModal('quiz');
    else if (key.includes('feed') || key.includes('trending') || key.includes('aesthetics')) {
      const el = document.getElementById('feed');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveModal('shop');
    }
  };

  const footerLinks = {
    Discover: ['Feed', 'Trending', 'Aesthetics', 'Editorials'],
    'AI Studio': ['Style DNA', 'Try-On', 'Color Analysis', 'Body Analysis'],
    Company: ['About', 'Careers', 'Press', 'Contact'],
  };

  return (
    <footer className="bg-burgundy text-ivory border-t border-white/10 py-16 md:py-20">
      <div className="section-wrapper">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand column */}
          <div>
            <a href="#" className="hover:opacity-85 transition-opacity flex items-center gap-2 mb-3">
              <img src="/Logo for 4+4.png" alt="Four plus Four" className="h-8 object-contain" />
            </a>
            <p className="mt-3 text-ivory/60 text-xs leading-relaxed max-w-xs">
              Four plus Four (4+4) — Your AI Fashion Twin. Discover, analyze, style, try on, and shop — all in one place.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-ivory/40 tracking-wider uppercase mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="text-xs text-ivory/80 hover:text-ivory transition-colors duration-200 text-left"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom divider and copyright */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ivory/40">
            © {new Date().getFullYear()} Four plus Four. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-xs text-ivory/40 hover:text-ivory/60 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-xs text-ivory/40 hover:text-ivory/60 transition-colors">
              Terms
            </a>
            <a href="#" className="text-xs text-ivory/40 hover:text-ivory/60 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
