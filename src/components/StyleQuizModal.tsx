import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useOutfitStore } from '../store/useOutfitStore';

export default function StyleQuizModal() {
  const activeModal = useOutfitStore((s) => s.activeModal);
  const closeModal = useOutfitStore((s) => s.closeModal);
  const modalRef = useRef<HTMLDivElement>(null);

  const isOpen = activeModal === 'quiz';
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    skinTone: '',
    silhouette: '',
    aesthetic: '',
  });

  useEffect(() => {
    if (!modalRef.current) return;
    if (isOpen) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (key: keyof typeof answers, val: string) => {
    setAnswers({ ...answers, [key]: val });
    if (step < 3) {
      setStep(step + 1);
    } else {
      setStep(4); // Results
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto"
      style={{ opacity: 0 }}
      ref={modalRef}
    >
      <div className="fixed inset-0 bg-bg/95 backdrop-blur-2xl" onClick={closeModal} />

      <div className="relative z-10 w-full max-w-xl bg-bg-card border border-border-medium rounded-3xl p-6 md:p-10 text-text-primary shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-border-subtle mb-6">
          <div>
            <span className="text-xs font-semibold text-accent tracking-widest uppercase mb-1 block">
              Style DNA Quiz {step <= 3 ? `· Step ${step} of 3` : '· Complete'}
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-semibold">
              {step === 1 && 'What is your natural skin undertone?'}
              {step === 2 && 'How would you describe your shoulder ratio?'}
              {step === 3 && 'Which aesthetic calls to you most?'}
              {step === 4 && 'Your Style DNA is Ready!'}
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary"
          >
            ✕
          </button>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="grid grid-cols-1 gap-3">
            {[
              { title: 'Golden / Warm Undertone', desc: 'Veins look green, gold jewelry shines on you' },
              { title: 'Cool / Blue Undertone', desc: 'Veins look blue, silver jewelry pops' },
              { title: 'Neutral Balance', desc: 'Both gold and silver flatter you equally' },
            ].map((opt) => (
              <button
                key={opt.title}
                onClick={() => handleSelect('skinTone', opt.title)}
                className="p-4 rounded-2xl bg-bg-elevated border border-border-subtle hover:border-accent text-left transition-all"
              >
                <h4 className="text-sm font-semibold text-text-primary">{opt.title}</h4>
                <p className="text-xs text-text-tertiary mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="grid grid-cols-1 gap-3">
            {[
              { title: 'Broader than hips', desc: 'Inverted Triangle alignment' },
              { title: 'Balanced with hips', desc: 'Hourglass or Rectangle profile' },
              { title: 'Narrower than hips', desc: 'Pear silhouette' },
            ].map((opt) => (
              <button
                key={opt.title}
                onClick={() => handleSelect('silhouette', opt.title)}
                className="p-4 rounded-2xl bg-bg-elevated border border-border-subtle hover:border-accent text-left transition-all"
              >
                <h4 className="text-sm font-semibold text-text-primary">{opt.title}</h4>
                <p className="text-xs text-text-tertiary mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="grid grid-cols-1 gap-3">
            {[
              { title: 'Old Money / Minimalist', desc: 'Cashmere, blazers, neutral tailors' },
              { title: 'Urban Techwear & Streetwear', desc: 'Cargo sets, oversized hoodies, utility details' },
              { title: 'Coquette & Romantic', desc: 'Silk, bias cuts, soft lace' },
            ].map((opt) => (
              <button
                key={opt.title}
                onClick={() => handleSelect('aesthetic', opt.title)}
                className="p-4 rounded-2xl bg-bg-elevated border border-border-subtle hover:border-accent text-left transition-all"
              >
                <h4 className="text-sm font-semibold text-text-primary">{opt.title}</h4>
                <p className="text-xs text-text-tertiary mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-accent-muted border border-accent-border text-center">
              <span className="text-xs text-accent uppercase font-semibold tracking-wider block mb-1">Generated Profile</span>
              <h3 className="font-display text-2xl text-text-primary font-semibold mb-3">
                {answers.aesthetic || 'Old Money'} Capsule
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Matched Season: <strong className="text-accent">Warm Autumn</strong> · Silhouette: <strong className="text-accent">Inverted Triangle</strong>
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button onClick={closeModal} className="btn-primary text-xs">
                Explore My Recommendations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
