import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useOutfitStore } from '../store/useOutfitStore';
import { OUTFIT_IMAGES } from '../data/outfitImages';

gsap.registerPlugin(ScrollTrigger);

interface Answers {
  dressing: string;
  ageRange: string;
  height: string;
  bodyShape: string;
  skinTone: string;
  budget: string;
  fashionGoals: string[];
  aesthetics: string[];
}

const AESTHETIC_FOLDER_MAP: Record<string, string> = {
  'Old Money': 'Old Money',
  'Y2K': 'Y2K',
  'Streetwear': 'Streetwear',
  'Dark Academia': 'Dark Academia',
  'Cottagecore': 'Cottage Core',
  'Boho': 'Boho',
  'Coquette': 'Coquette',
  'Clean Girl': 'Clean Girl',
};

const SKIN_TONE_COLORS: Record<string, string> = {
  'Fair': '#FFE0D3',
  'Light': '#F2C5A8',
  'Medium': '#E3B18A',
  'Olive': '#C69068',
  'Tan': '#A16D47',
  'Deep': '#5C3A21',
};

const getFolderKey = (gender: string, aesthetic: string): string => {
  if (aesthetic === 'Coquette' || aesthetic === 'Clean Girl') {
    return aesthetic;
  }
  const folderPrefix = AESTHETIC_FOLDER_MAP[aesthetic] || aesthetic;
  const suffix = gender === 'Male' ? 'Men' : 'Women';
  return `${folderPrefix} ${suffix}`;
};

interface StyleDimension {
  name: string;
  percentage: number;
}

// Dynamic algorithm to calculate style dimensions based on quiz choices
function calculateStyleDimensions(answers: Answers): StyleDimension[] {
  const scores: Record<string, number> = {
    Minimalist: 30,
    'Quiet Luxury': 30,
    Techwear: 20,
    Coquette: 20,
    Streetwear: 25,
    'Dark Academia': 25,
    'Clean Girl': 25,
    Y2K: 20,
  };

  // 1. Aesthetics chosen in Step 8
  if (answers.aesthetics && answers.aesthetics.length > 0) {
    answers.aesthetics.forEach((aes) => {
      scores[aes] = (scores[aes] || 0) + 50;
    });
  }

  // 2. Fashion Goals chosen in Step 7
  if (answers.fashionGoals && answers.fashionGoals.length > 0) {
    answers.fashionGoals.forEach((goal) => {
      if (goal.includes('work') || goal.includes('put-together')) {
        scores['Quiet Luxury'] += 25;
        scores['Minimalist'] += 20;
      }
      if (goal.includes('Date-night') || goal.includes('Special occasions')) {
        scores['Quiet Luxury'] += 20;
        scores['Coquette'] += 25;
        scores['Clean Girl'] += 20;
      }
      if (goal.includes('Discover') || goal.includes('Rebuild')) {
        scores['Streetwear'] += 20;
        scores['Dark Academia'] += 20;
      }
    });
  }

  // 3. Comfort Budget in Step 6
  if (answers.budget) {
    if (answers.budget.includes('8,000') || answers.budget.includes('3,000')) {
      scores['Quiet Luxury'] += 25;
      scores['Minimalist'] += 15;
    } else {
      scores['Streetwear'] += 20;
      scores['Y2K'] += 15;
    }
  }

  // 4. Body Shape in Step 4
  if (answers.bodyShape) {
    if (answers.bodyShape === 'Hourglass' || answers.bodyShape === 'Pear') {
      scores['Coquette'] += 15;
      scores['Clean Girl'] += 15;
    } else if (answers.bodyShape === 'Rectangle' || answers.bodyShape === 'Inverted Triangle') {
      scores['Minimalist'] += 15;
      scores['Techwear'] += 15;
    }
  }

  // Pick top 4 dimensions
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const maxScore = sorted[0]?.[1] || 1;

  return sorted.map(([name, rawScore]) => {
    const pct = Math.min(88, Math.max(15, Math.round((rawScore / maxScore) * 82)));
    return { name, percentage: pct };
  });
}

// Preview slots for default card
const SLIDE_SLOTS = [
  { label: 'Boho',       womenKey: 'Boho Women',       menKey: 'Boho Men'       },
  { label: 'Old Money',  womenKey: 'Old Money Women',  menKey: 'Old Money Men'  },
  { label: 'Streetwear', womenKey: 'Streetwear Women', menKey: 'Streetwear Men' },
];

const DISPLAY_DURATION = 6000;
const FADE_MS = 800;

function getImageSrc(slot: typeof SLIDE_SLOTS[0], isMale: boolean, idx: number): string {
  const key = isMale ? slot.menKey : slot.womenKey;
  const images = OUTFIT_IMAGES[key] ?? [];
  return images.length > 0 ? images[idx % images.length] : '';
}

export default function StyleDNASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const activeModal = useOutfitStore((s) => s.activeModal);
  const setActiveModal = useOutfitStore((s) => s.setActiveModal);
  const closeModal = useOutfitStore((s) => s.closeModal);

  // Inline Quiz state
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>({
    dressing: '',
    ageRange: '',
    height: '',
    bodyShape: '',
    skinTone: '',
    budget: '',
    fashionGoals: [],
    aesthetics: [],
  });

  // Calculate dynamic dimensions based on answers
  const styleDimensions = useMemo(() => calculateStyleDimensions(answers), [answers]);

  // Results & Detail Lightbox state
  const [activeAestheticTab, setActiveAestheticTab] = useState<string | null>(null);
  const [selectedDetailImage, setSelectedDetailImage] = useState<string | null>(null);
  const [isTryOnSimulating, setIsTryOnSimulating] = useState(false);
  const [tryOnSuccess, setTryOnSuccess] = useState(false);
  const [tryOnStepText, setTryOnStepText] = useState('');

  // Preview Card Animation State
  const [layerA, setLayerA] = useState<string[]>(() =>
    SLIDE_SLOTS.map((slot) => getImageSrc(slot, false, 0))
  );
  const [layerB, setLayerB] = useState<string[]>(() => SLIDE_SLOTS.map(() => ''));
  const [opacityB, setOpacityB] = useState(0);
  const [isMale, setIsMale] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  // Catch external triggers (e.g. Hero button, Footer links) for 'quiz'
  useEffect(() => {
    if (activeModal === 'quiz') {
      setIsQuizActive(true);
      if (step === 1) setStep(1);
      closeModal();
      const el = document.getElementById('styledna');
      if (el) {
        const navOffset = 80;
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: Math.max(0, elementPosition - navOffset), behavior: 'smooth' });
      }
    }
  }, [activeModal, closeModal, step]);

  const crossFadeToNext = useCallback(() => {
    const nextMale = !isMale;
    const nextIndex = nextMale ? imgIndex : imgIndex + 1;
    const nextSrcs = SLIDE_SLOTS.map((slot) => getImageSrc(slot, nextMale, nextIndex));

    setLayerB(nextSrcs);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOpacityB(1);
        setTimeout(() => {
          setLayerA(nextSrcs);
          setLayerB(SLIDE_SLOTS.map(() => ''));
          setOpacityB(0);
          setIsMale(nextMale);
          if (!nextMale) setImgIndex((prev) => prev + 1);
        }, FADE_MS + 50);
      });
    });
  }, [isMale, imgIndex]);

  useEffect(() => {
    if (isQuizActive) return;
    const timer = setInterval(crossFadeToNext, DISPLAY_DURATION);
    return () => clearInterval(timer);
  }, [crossFadeToNext, isQuizActive]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('.dna-animate');
    els.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        },
      );
    });
  }, []);

  // Synchronize active tab when reaching step 9
  useEffect(() => {
    if (step === 9) {
      const selectedAesthetics = answers.aesthetics.length > 0
        ? answers.aesthetics
        : (answers.dressing === 'Male' ? ['Old Money', 'Streetwear', 'Dark Academia'] : ['Old Money', 'Clean Girl', 'Coquette']);
      setActiveAestheticTab(selectedAesthetics[0]);
    }
  }, [step, answers.aesthetics, answers.dressing]);

  // Quiz steps configuration
  const stepsData = [
    {
      key: 'dressing' as keyof Answers,
      title: 'Who are you dressing?',
      options: ['Female', 'Male'],
      percentage: 13,
      isMulti: false,
    },
    {
      key: 'ageRange' as keyof Answers,
      title: 'Your age range',
      options: ['16-20', '21-25', '26-30', '31-35', '36+'],
      percentage: 25,
      isMulti: false,
    },
    {
      key: 'height' as keyof Answers,
      title: 'Your height',
      options: ['< 5\'2"', '5\'2"–5\'5"', '5\'6"–5\'9"', '5\'10"–6\'0"', '6\'+'],
      percentage: 38,
      isMulti: false,
    },
    {
      key: 'bodyShape' as keyof Answers,
      title: 'Body shape you relate to',
      options: ['Hourglass', 'Pear', 'Apple', 'Rectangle', 'Inverted Triangle', 'Not sure — analyze me'],
      percentage: 50,
      isMulti: false,
    },
    {
      key: 'skinTone' as keyof Answers,
      title: 'Your skin tone',
      options: ['Fair', 'Light', 'Medium', 'Olive', 'Tan', 'Deep'],
      percentage: 63,
      isMulti: false,
    },
    {
      key: 'budget' as keyof Answers,
      title: 'Comfort budget per piece',
      options: ['₹2,000–₹3,000', '₹3,000–₹4,500', '₹4,500–₹6,000'],
      percentage: 75,
      isMulti: false,
    },
    {
      key: 'fashionGoals' as keyof Answers,
      title: 'Your fashion goals',
      subtitle: 'Pick as many as you like.',
      options: ['Discover my style', 'Look put-together daily', 'Elevate for work', 'Date-night confidence', 'Special occasions', 'Rebuild wardrobe'],
      percentage: 88,
      isMulti: true,
    },
    {
      key: 'aesthetics' as keyof Answers,
      title: 'Aesthetics that catch your eye',
      subtitle: 'Pick as many as you like.',
      options: answers.dressing === 'Male'
        ? ['Old Money', 'Y2K', 'Streetwear', 'Dark Academia', 'Cottagecore', 'Boho']
        : ['Old Money', 'Coquette', 'Y2K', 'Streetwear', 'Dark Academia', 'Cottagecore', 'Clean Girl', 'Boho'],
      percentage: 100,
      isMulti: true,
    },
  ];

  const currentStepData = step <= 8 ? stepsData[step - 1] : null;

  const handleSelect = (key: keyof Answers, val: string, isMulti?: boolean) => {
    if (isMulti) {
      setAnswers((prev) => {
        const currentArr = (prev[key] as string[]) || [];
        const updatedArr = currentArr.includes(val)
          ? currentArr.filter((x) => x !== val)
          : [...currentArr, val];
        return { ...prev, [key]: updatedArr };
      });
    } else {
      setSelectedOption(val);
      setAnswers((prev) => ({ ...prev, [key]: val }));
      setTimeout(() => {
        setSelectedOption(null);
        setStep((s) => s + 1);
      }, 300);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setSelectedOption(null);
    if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  const startQuiz = () => {
    setIsQuizActive(true);
    setStep(1);
    const el = document.getElementById('styledna');
    if (el) {
      const navOffset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, elementPosition - navOffset), behavior: 'smooth' });
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({
      dressing: '',
      ageRange: '',
      height: '',
      bodyShape: '',
      skinTone: '',
      budget: '',
      fashionGoals: [],
      aesthetics: [],
    });
    setActiveAestheticTab(null);
  };

  const exitQuizMode = () => {
    setIsQuizActive(false);
    setStep(1);
  };

  const progressPercentage = currentStepData ? currentStepData.percentage : 100;
  const selectedAesthetics = answers.aesthetics.length > 0
    ? answers.aesthetics
    : (answers.dressing === 'Male' ? ['Old Money', 'Streetwear', 'Dark Academia'] : ['Old Money', 'Clean Girl', 'Coquette']);

  return (
    <section ref={sectionRef} id="styledna" className="py-8 sm:py-12 md:py-24 bg-ivory scroll-mt-24">
      <div className="section-wrapper">
        
        {!isQuizActive ? (
          /* ─────────────────────────────────────────────────────────────
             DEFAULT VIEW: Intro Text + Live Twin Preview Card
             ───────────────────────────────────────────────────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="dna-animate inline-flex">
                <span className="text-burgundy/65 font-body font-bold text-xs tracking-widest uppercase">
                  Style DNA
                </span>
              </div>

              <h2 className="dna-animate font-display text-section text-burgundy font-bold tracking-tight">
                Discover your Style DNA
              </h2>
              <p className="dna-animate text-burgundy/80 text-base md:text-lg leading-relaxed">
                A custom mix of style dimensions, palette tones, and proportions that form your digital twin.
              </p>

              <div className="dna-animate mt-8 space-y-4">
                {[
                  { label: 'Custom color matching for skin, hair and eyes' },
                  { label: 'Fit optimization based on your body proportions' },
                  { label: 'Budget-aware recommendation logic' },
                  { label: 'Fresh wardrobe edits every week' },
                ].map((point, index) => (
                  <div key={index} className="flex items-center gap-3 text-left">
                    <span className="w-5 h-5 rounded-full bg-burgundy/10 flex items-center justify-center text-burgundy text-xs font-bold">✓</span>
                    <span className="text-burgundy/80 text-sm font-medium">{point.label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={startQuiz}
                className="dna-animate inline-flex items-center gap-2 btn-secondary mt-4 text-xs font-semibold uppercase tracking-wider bg-burgundy text-ivory border-none hover:bg-[#66050b] cursor-pointer shadow-sm transition-all hover:scale-[1.02]"
              >
                Take the quiz
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Right Dashboard Visual Card */}
            <div className="lg:col-span-6 dna-animate">
              <div
                className="glass-card p-6 md:p-8 bg-card-surface/90 border border-hairline-border rounded-3xl shadow-soft cursor-pointer hover:border-burgundy/30 transition-all duration-300 group"
                onClick={startQuiz}
              >
                <h3 className="font-display text-lg text-burgundy font-bold mb-5 flex items-center justify-between">
                  <span>Your Style Dimensions</span>
                  <span className="text-xs text-amber-gold font-body tracking-wider uppercase font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-gold animate-pulse" />
                    Live Twin
                  </span>
                </h3>

                {/* Dynamic Style dimension bars */}
                <div className="space-y-4 mb-8">
                  {styleDimensions.map((dim) => (
                    <div key={dim.name} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-burgundy">
                        <span>{dim.name}</span>
                        <span>{dim.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-neutral-surface/65 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-gold rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${dim.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Outfit slideshow preview */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-hairline-border">
                  {SLIDE_SLOTS.map((slot, i) => (
                    <div
                      key={slot.label}
                      style={{
                        position: 'relative',
                        width: '100%',
                        paddingBottom: '133%',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid rgba(0,0,0,0.08)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                        background: '#e8e0d0',
                      }}
                    >
                      {layerA[i] && (
                        <img
                          src={layerA[i]}
                          alt={`${slot.label} outfit`}
                          style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            width: '100%', height: '100%',
                            objectFit: 'cover', objectPosition: 'center top',
                            display: 'block',
                          }}
                        />
                      )}
                      {layerB[i] && (
                        <img
                          src={layerB[i]}
                          alt={`${slot.label} outfit`}
                          style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            width: '100%', height: '100%',
                            objectFit: 'cover', objectPosition: 'center top',
                            display: 'block',
                            opacity: opacityB,
                            transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                          }}
                        />
                      )}
                      <div
                        style={{
                          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 45%, transparent 75%)',
                          display: 'flex', alignItems: 'flex-end', padding: '8px 10px',
                          pointerEvents: 'none', zIndex: 10,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <span style={{ color: '#fff', fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            {slot.label}
                          </span>
                          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px' }}>
                            {isMale ? '♂' : '♀'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* ─────────────────────────────────────────────────────────────
             INLINE QUIZ VIEW: Embedded Stepper (Steps 1–8) or Results (Step 9)
             ───────────────────────────────────────────────────────────── */
          <div className="w-full flex flex-col items-center animate-fade-in transition-all duration-300">
            
            {/* Top Bar for Quiz Mode */}
            <div className="w-full max-w-4xl flex items-center justify-end mb-6">
              <button
                onClick={exitQuizMode}
                className="text-xs font-semibold text-burgundy/70 hover:text-burgundy px-3 py-1.5 rounded-full border border-hairline-border hover:bg-white/80 transition-colors flex items-center gap-1 cursor-pointer"
              >
                ✕ Close Quiz
              </button>
            </div>

            {/* Step Progress Tracker (Steps 1–8) */}
            {step <= 8 && (
              <div className="w-full max-w-3xl px-2 mb-6">
                <div className="flex justify-between text-xs md:text-sm font-semibold text-burgundy/70 mb-2">
                  <span>Step {step} of 8</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-surface/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-gold transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Quiz Container Card */}
            <div className={`w-full ${step === 9 ? 'max-w-6xl' : 'max-w-3xl'} bg-[#FFFBEC] rounded-[24px] md:rounded-[32px] border border-hairline-border p-5 sm:p-8 md:p-10 shadow-soft flex flex-col justify-between min-h-[420px] relative overflow-hidden transition-all duration-300`}>
              
              {step <= 8 && currentStepData ? (
                /* Step Question Screen */
                <>
                  <div className="flex-1 flex flex-col">
                    <div className="mb-6 text-left">
                      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-burgundy font-medium tracking-tight leading-tight">
                        {currentStepData.title}
                      </h2>
                      {currentStepData.subtitle && (
                        <p className="text-xs md:text-sm text-burgundy/70 mt-2 font-medium">
                          {currentStepData.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6">
                      {currentStepData.options.map((opt) => {
                        const isSelected = currentStepData.isMulti
                          ? (answers[currentStepData.key] as string[]).includes(opt)
                          : selectedOption === opt || answers[currentStepData.key] === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelect(currentStepData.key, opt, currentStepData.isMulti)}
                            className={`w-full text-left font-body text-sm sm:text-base py-3.5 px-5 sm:px-6 rounded-2xl sm:rounded-full border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                              isSelected
                                ? 'bg-burgundy/10 border-burgundy border-2 font-semibold text-burgundy shadow-sm'
                                : 'bg-white border-hairline-border text-burgundy hover:bg-[#FFFBEC] hover:border-burgundy/40 shadow-xs'
                            }`}
                          >
                            <span>{opt}</span>
                            {isSelected && (
                              <span className="w-2.5 h-2.5 rounded-full bg-burgundy" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step Navigation Controls */}
                  <div className="flex items-center justify-between gap-3 pt-5 border-t border-hairline-border mt-auto">
                    <button
                      type="button"
                      onClick={handleBack}
                      style={{ visibility: step > 1 ? 'visible' : 'hidden' }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-burgundy/70 hover:text-burgundy transition-colors cursor-pointer"
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-burgundy hover:bg-[#66050b] text-ivory text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-full flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      {currentStepData.isMulti ? (step === 8 ? 'Finish & Generate' : 'Continue') : 'Skip →'}
                    </button>
                  </div>
                </>
              ) : (
                /* Step 9: Results Screen */
                <div className="flex-1 flex flex-col w-full">
                  <div className="text-center py-2 mb-6">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-burgundy/10 text-burgundy mb-3 text-xl font-bold">
                      ✓
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl text-burgundy font-bold tracking-tight mb-2">
                      Your Style DNA is Ready!
                    </h2>
                    <p className="text-xs sm:text-sm text-burgundy/80 max-w-xl mx-auto font-body">
                      We've calibrated your digital twin profile and calculated your exact style dimensions.
                    </p>
                  </div>

                  {/* Results Main Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
                    
                    {/* Left Column: Style Twin Card & Dimensions */}
                    <div className="lg:col-span-4 flex flex-col bg-white border border-hairline-border rounded-2xl p-5 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-hairline-border pb-3">
                        <div>
                          <h3 className="font-display text-base text-burgundy font-bold">Style Twin Profile</h3>
                          <p className="text-[10px] font-semibold text-burgundy/60 tracking-wider uppercase mt-0.5">Calibrated coordinates</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-burgundy/10 text-[9px] font-bold text-burgundy uppercase tracking-wider">Active</span>
                      </div>

                      {/* Calibrated Style Dimensions Bar Breakdown */}
                      <div className="space-y-3 pb-3 border-b border-hairline-border">
                        <span className="text-[10px] font-semibold text-burgundy/60 uppercase tracking-wider block">Calculated Style Dimensions</span>
                        {styleDimensions.map((dim) => (
                          <div key={dim.name} className="space-y-1">
                            <div className="flex justify-between text-[11px] font-semibold text-burgundy">
                              <span>{dim.name}</span>
                              <span>{dim.percentage}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-neutral-surface/65 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-gold rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${dim.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2.5 font-body text-xs">
                        <div>
                          <span className="text-[10px] font-semibold text-burgundy/55 uppercase tracking-wider block mb-0.5">Dressing</span>
                          <span className="font-medium text-burgundy">{answers.dressing === 'Male' ? 'Male' : 'Female'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-burgundy/55 uppercase tracking-wider block mb-0.5">Age Range</span>
                          <span className="font-medium text-burgundy">{answers.ageRange || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-burgundy/55 uppercase tracking-wider block mb-0.5">Height</span>
                          <span className="font-medium text-burgundy">{answers.height || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-burgundy/55 uppercase tracking-wider block mb-0.5">Body Shape</span>
                          <span className="font-medium text-burgundy">{answers.bodyShape || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-burgundy/55 uppercase tracking-wider block mb-0.5">Skin Tone Match</span>
                          <div className="flex items-center gap-2">
                            {answers.skinTone && SKIN_TONE_COLORS[answers.skinTone] && (
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-burgundy/20 shadow-xs"
                                style={{ backgroundColor: SKIN_TONE_COLORS[answers.skinTone] }}
                              />
                            )}
                            <span className="font-medium text-burgundy">{answers.skinTone || 'Not specified'}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-burgundy/55 uppercase tracking-wider block mb-0.5">Budget</span>
                          <span className="font-medium text-burgundy">{answers.budget || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-burgundy/55 uppercase tracking-wider block mb-0.5">Goals</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {answers.fashionGoals.length > 0 ? (
                              answers.fashionGoals.map((g) => (
                                <span key={g} className="text-[10px] px-2 py-0.5 rounded bg-ivory border border-hairline-border text-burgundy/80 font-medium">
                                  {g}
                                </span>
                              ))
                            ) : (
                              <span className="text-burgundy/50">None selected</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-hairline-border flex items-center justify-between text-[10px] text-burgundy/60 font-medium">
                        <span>Generated today</span>
                        <span className="font-bold text-amber-gold tracking-widest uppercase">VERIFIED</span>
                      </div>
                    </div>

                    {/* Right Column: Aesthetic Tabs & Curated Outfit Grid */}
                    <div className="lg:col-span-8 space-y-4">
                      {/* Aesthetic Tabs */}
                      <div className="flex gap-2 border-b border-hairline-border pb-3 overflow-x-auto no-scrollbar sm:flex-wrap">
                        {selectedAesthetics.map((aes) => {
                          const isActive = activeAestheticTab === aes;
                          return (
                            <button
                              key={aes}
                              type="button"
                              onClick={() => setActiveAestheticTab(aes)}
                              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap flex-shrink-0 ${
                                isActive
                                  ? 'bg-burgundy text-ivory shadow-sm'
                                  : 'bg-white border border-hairline-border text-burgundy/70 hover:text-burgundy'
                              }`}
                            >
                              {aes}
                            </button>
                          );
                        })}
                      </div>

                      {/* Outfit Cards */}
                      <div>
                        {activeAestheticTab && (
                          (() => {
                            const folderName = getFolderKey(answers.dressing, activeAestheticTab);
                            const clothes = OUTFIT_IMAGES[folderName] || [];

                            if (clothes.length === 0) {
                              return (
                                <div className="text-center py-10 text-burgundy/50 font-body text-xs">
                                  No recommendations found for this combination.
                                </div>
                              );
                            }

                            return (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {clothes.map((imgSrc, idx) => (
                                  <div
                                    key={imgSrc}
                                    onClick={() => {
                                      setSelectedDetailImage(imgSrc);
                                      setIsTryOnSimulating(false);
                                      setTryOnSuccess(false);
                                    }}
                                    className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-hairline-border bg-white cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02] transition-all duration-300"
                                  >
                                    <img
                                      src={imgSrc}
                                      alt={`${activeAestheticTab} look ${idx + 1}`}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-burgundy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                      <span className="text-xs font-semibold text-white uppercase">Look {idx + 1}</span>
                                      <span className="text-[10px] text-white/80 mt-0.5">Click for AI Try-On</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })()
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Actions Footer */}
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-hairline-border w-full mt-6">
                    <button
                      type="button"
                      onClick={resetQuiz}
                      className="w-full sm:w-auto text-xs font-bold uppercase tracking-wider text-burgundy/70 hover:text-burgundy py-3 px-6 rounded-full border border-hairline-border text-center transition-colors cursor-pointer bg-white"
                    >
                      Restart Quiz
                    </button>
                    <button
                      type="button"
                      onClick={exitQuizMode}
                      className="w-full sm:w-auto bg-burgundy hover:bg-[#66050b] text-ivory text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-full text-center shadow-xs transition-all cursor-pointer"
                    >
                      Back to Overview
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Outfit Lightbox Overlay for Virtual Try-On */}
      {selectedDetailImage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-burgundy/40 backdrop-blur-md animate-fade-in">
          <div className="absolute inset-0 cursor-default" onClick={() => setSelectedDetailImage(null)} />
          
          <div className="relative z-10 w-full max-w-4xl bg-[#FFFBEC] border border-hairline-border rounded-[24px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            <button
              onClick={() => setSelectedDetailImage(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-burgundy flex items-center justify-center border border-hairline-border transition-colors shadow-xs cursor-pointer"
            >
              ✕
            </button>

            {/* Left side: Look preview & Scanner overlay */}
            <div className="w-full md:w-1/2 bg-white flex items-center justify-center relative min-h-[260px] md:min-h-0 overflow-hidden">
              <img
                src={selectedDetailImage}
                alt="Selected look"
                className="w-full h-full object-cover max-h-[45vh] md:max-h-none"
              />
              
              {isTryOnSimulating && (
                <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-amber-gold to-transparent shadow-[0_0_12px_#DF972B] animate-scanner z-10" />
              )}
              
              {isTryOnSimulating && (
                <div className="absolute inset-0 bg-burgundy/30 flex flex-col items-center justify-center text-white p-6 z-20">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 flex flex-col items-center text-center shadow-lg w-full max-w-[260px]">
                    <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin mb-3" />
                    <span className="text-xs font-semibold tracking-wider uppercase animate-pulse mb-1">AI Fitting Engine</span>
                    <span className="text-[10px] text-white/80">{tryOnStepText}</span>
                  </div>
                </div>
              )}

              {tryOnSuccess && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-4 z-20">
                  <button
                    onClick={() => setTryOnSuccess(false)}
                    className="absolute top-4 left-4 text-xs font-semibold uppercase tracking-wider bg-burgundy hover:bg-[#66050b] text-white px-3 py-1.5 rounded-full shadow-md cursor-pointer transition-colors"
                  >
                    View Original
                  </button>
                  <img
                    src="/outfits/tryon-preview.png"
                    alt="AI Virtual Try On Preview"
                    className="w-full h-full object-cover object-top animate-fade-in"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 text-burgundy border border-hairline-border shadow-lg">
                    <h4 className="font-display font-bold text-sm">Virtual Try-On Complete</h4>
                    <p className="text-[11px] text-burgundy/75 mt-0.5 leading-relaxed font-body">
                      Successfully projected onto your profile. Perfect drape alignment detected.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right side: Look details & CTA */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <span className="text-[10px] font-bold text-amber-gold uppercase tracking-widest block mb-1">
                  Curation Details
                </span>
                <h3 className="font-display text-2xl text-burgundy font-bold leading-tight mb-3">
                  {activeAestheticTab} Capsule Look
                </h3>
                
                <p className="text-xs sm:text-sm text-burgundy/80 leading-relaxed font-body mb-5">
                  Hand-selected to match your <strong>{answers.skinTone || 'custom'}</strong> skin tone and compliment a <strong>{answers.bodyShape || 'tailored'}</strong> silhouette.
                </p>

                <div className="space-y-3 border-t border-hairline-border pt-4 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center text-xs font-bold">✓</span>
                    <span className="font-medium text-burgundy/80">Custom style parameters verified</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center text-xs font-bold">✓</span>
                    <span className="font-medium text-burgundy/80">Proportion & fit optimization</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center text-xs font-bold">✓</span>
                    <span className="font-medium text-burgundy/80">Matched to comfort budget</span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  disabled={isTryOnSimulating}
                  onClick={() => {
                    setIsTryOnSimulating(true);
                    setTryOnSuccess(false);
                    const steps = [
                      "Calibrating webcam lens...",
                      "Extracting torso silhouette...",
                      "Aligning shoulder seams...",
                      "Processing fabric physics...",
                      "Finalizing digital twin fit..."
                    ];
                    let curStep = 0;
                    setTryOnStepText(steps[0]);
                    const interval = setInterval(() => {
                      curStep++;
                      if (curStep < steps.length) {
                        setTryOnStepText(steps[curStep]);
                      } else {
                        clearInterval(interval);
                        setIsTryOnSimulating(false);
                        setTryOnSuccess(true);
                      }
                    }, 500);
                  }}
                  className="w-full bg-burgundy hover:bg-[#66050b] disabled:opacity-50 text-ivory font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-full shadow-xs text-center cursor-pointer transition-colors"
                >
                  {isTryOnSimulating ? "Processing fitting..." : "Virtual Try-On (AI)"}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDetailImage(null);
                    setActiveModal('shop');
                  }}
                  className="w-full bg-white hover:bg-ivory border border-hairline-border text-burgundy font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-full text-center cursor-pointer transition-colors"
                >
                  Shop Similar Styles
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
