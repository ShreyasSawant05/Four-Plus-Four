import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import TimelineSection from './components/TimelineSection';
import StyleDNASection from './components/StyleDNASection';
import AboutUsSection from './components/AboutUsSection';
import ShopSection from './components/ShopSection';
import FeedSection from './components/FeedSection';
import StylistSection from './components/StylistSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

// Modals
import TryOnModal from './components/TryOnModal';
import ColorAnalysisModal from './components/ColorAnalysisModal';
import BodyAnalysisModal from './components/BodyAnalysisModal';
import StyleLabModal from './components/StyleLabModal';
import StylistModal from './components/StylistModal';
import StyleQuizModal from './components/StyleQuizModal';
import ShopModal from './components/ShopModal';

function App() {
  return (
    <div className="relative min-h-screen bg-bg">
      <Navbar />

      <main>
        {/* 1. Header/Nav (rendered outside main) */}
        
        {/* 2. Hero Banner */}
        <HeroSection />

        <div className="section-wrapper"><div className="divider" /></div>
        
        {/* 3. What we do (Travel Timeline) */}
        <TimelineSection />

        <div className="section-wrapper"><div className="divider" /></div>
        
        {/* 4. Quiz (Style DNA Section) */}
        <StyleDNASection />

        <div className="section-wrapper"><div className="divider" /></div>
        
        {/* 5. Red Patch (About Us) */}
        <AboutUsSection />

        <div className="section-wrapper"><div className="divider" /></div>
        
        {/* 6. Comparison / Horizontal Scroll */}
        <ShopSection />

        <div className="section-wrapper"><div className="divider" /></div>
        
        {/* 7. Pick your universe (Aesthetics Grid) */}
        <FeedSection />

        <div className="section-wrapper"><div className="divider" /></div>
        
        {/* 8. AI Stylist (Chat Section) */}
        <StylistSection />

        <div className="section-wrapper"><div className="divider" /></div>
        
        {/* 9. Testimonials Section */}
        <TestimonialsSection />

        <div className="section-wrapper"><div className="divider" /></div>
        
        {/* 10. FAQs (Accordion) */}
        <FAQSection />

        <div className="section-wrapper"><div className="divider" /></div>
        
        {/* 11. Contact (Form/Info) */}
        <ContactSection />
      </main>

      {/* 12. Footer */}
      <Footer />

      {/* All Feature Modals */}
      <TryOnModal />
      <ColorAnalysisModal />
      <BodyAnalysisModal />
      <StyleLabModal />
      <StylistModal />
      <StyleQuizModal />
      <ShopModal />
    </div>
  );
}

export default App;
