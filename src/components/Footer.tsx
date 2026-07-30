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
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    } else {
      const el = document.getElementById('shop');
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      } else {
        setActiveModal('shop');
      }
    }
  };

  const footerLinks = {
    Discover: ['Feed', 'Trending', 'Aesthetics', 'Editorials'],
    'AI Studio': ['Style DNA', 'Try-On', 'Color Analysis', 'Body Analysis'],
    Company: ['About', 'Careers', 'Press', 'Contact'],
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white text-burgundy border-t border-hairline-border py-10 sm:py-14 md:py-20">
      <div className="section-wrapper">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="hover:opacity-85 transition-opacity inline-flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="Four plus Four" className="h-16 sm:h-20 object-contain" />
            </a>
            <p className="mt-3 text-burgundy/70 text-xs leading-relaxed max-w-xs font-body">
              Four plus Four (4+4) — Your AI Fashion Twin. Discover, analyze, style, try on, and shop — all in one place.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[11px] sm:text-xs font-bold text-burgundy/50 tracking-wider uppercase mb-3 sm:mb-4">
                {title}
              </h4>
              <ul className="space-y-2 sm:space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="text-xs text-burgundy/85 hover:text-[#d51927] transition-colors duration-200 text-left font-medium cursor-pointer"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom divider, copyright & back to top */}
        <div className="mt-8 sm:mt-10 pt-4 sm:pt-5 border-t border-hairline-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-burgundy/50 font-body">
            © {new Date().getFullYear()} Four plus Four. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-5">
              <a href="#" className="text-xs text-burgundy/50 hover:text-burgundy transition-colors">
                Privacy
              </a>
              <a href="#" className="text-xs text-burgundy/50 hover:text-burgundy transition-colors">
                Terms
              </a>
              <a href="#" className="text-xs text-burgundy/50 hover:text-burgundy transition-colors">
                Cookies
              </a>
            </div>

            {/* Back to top button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-hairline-border bg-white text-burgundy hover:bg-burgundy hover:text-ivory text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer group"
            >
              <span>Back to top</span>
              <span className="transform transition-transform group-hover:-translate-y-0.5 font-bold">↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
