import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useOutfitStore } from '../store/useOutfitStore';
import { OUTFIT_IMAGES } from '../data/outfitImages';

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

export default function StyleQuizModal() {
  const activeModal = useOutfitStore((s) => s.activeModal);
  const closeModal = useOutfitStore((s) => s.closeModal);
  const modalRef = useRef<HTMLDivElement>(null);

  const isOpen = activeModal === 'quiz';
  const [step, setStep] = useState(1);
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

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Results and detail state
  const [activeAestheticTab, setActiveAestheticTab] = useState<string | null>(null);
  const [selectedDetailImage, setSelectedDetailImage] = useState<string | null>(null);
  const [isTryOnSimulating, setIsTryOnSimulating] = useState(false);
  const [tryOnSuccess, setTryOnSuccess] = useState(false);
  const [tryOnStepText, setTryOnStepText] = useState('');

  useEffect(() => {
    if (!modalRef.current) return;
    if (isOpen) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [isOpen]);

  // Synchronize the active tab when hitting the results page (step 9)
  useEffect(() => {
    if (step === 9) {
      const selectedAesthetics = answers.aesthetics.length > 0
        ? answers.aesthetics
        : (answers.dressing === 'Male' ? ['Old Money', 'Streetwear', 'Dark Academia'] : ['Old Money', 'Clean Girl', 'Coquette']);
      setActiveAestheticTab(selectedAesthetics[0]);
    }
  }, [step, answers.aesthetics, answers.dressing]);

  // Entrance GSAP animation for Results Screen (Step 9)
  useEffect(() => {
    if (step === 9) {
      setTimeout(() => {
        gsap.killTweensOf('.style-dna-header, .style-dna-card, .style-dna-tabs, .style-dna-grid-item');
        
        gsap.fromTo('.style-dna-header',
          { opacity: 0, y: -25 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        );
        
        gsap.fromTo('.style-dna-card',
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 0.7, delay: 0.15, ease: 'power2.out' }
        );
        
        gsap.fromTo('.style-dna-tabs',
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.25, ease: 'power2.out' }
        );
        
        gsap.fromTo('.style-dna-grid-item',
          { opacity: 0, y: 35, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.35, stagger: 0.05, ease: 'back.out(1.15)' }
        );
      }, 50);
    }
  }, [step]);

  // Tab switch stagger animation
  useEffect(() => {
    if (step === 9 && activeAestheticTab) {
      setTimeout(() => {
        gsap.killTweensOf('.style-dna-grid-item');
        gsap.fromTo('.style-dna-grid-item',
          { opacity: 0, y: 25, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out' }
        );
      }, 30);
    }
  }, [activeAestheticTab, step]);

  if (!isOpen) return null;

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
      options: ['Under ₹1,000', '₹1,000–₹3,000', '₹3,000–₹8,000', '₹8,000+'],
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

      // Soft visual delay before moving to the next step
      setTimeout(() => {
        setSelectedOption(null);
        setStep((s) => s + 1);
      }, 350);
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

  const progressPercentage = currentStepData ? currentStepData.percentage : 100;

  const selectedAesthetics = answers.aesthetics.length > 0
    ? answers.aesthetics
    : (answers.dressing === 'Male' ? ['Old Money', 'Streetwear', 'Dark Academia'] : ['Old Money', 'Clean Girl', 'Coquette']);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[100] bg-[#FFF9F2] text-[#840B14] overflow-y-auto flex flex-col justify-start items-center p-4 md:p-6 pb-12 font-body"
      style={{ opacity: 0 }}
    >
      {/* 1. Brand Floating Header */}
      <header className="w-full max-w-6xl bg-white border border-[#840B14]/10 rounded-full py-3 px-6 md:px-8 shadow-sm flex items-center justify-between mt-2 mb-8 md:mb-12">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={closeModal}>
          <div className="w-8 h-8 rounded-full bg-[#840B14] flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.5 7.5H22l-6.2 4.5 2.4 7.5-6.2-4.5-6.2 4.5 2.4-7.5-6.2-4.5h7.5z" />
            </svg>
          </div>
          <span className="font-display text-xl font-bold text-[#840B14] tracking-tight">Muse.</span>
        </div>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {['Discover', 'Try-On', 'Color', 'Body', 'Style Lab', 'Shop'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={closeModal}
              className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
                item === 'Body' ? 'text-[#840B14] border-b border-[#840B14] pb-0.5' : 'text-[#840B14]/65 hover:text-[#840B14]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Search Icon */}
          <button className="text-[#840B14]/65 hover:text-[#840B14] p-1.5 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* AI Stylist Gold Button */}
          <button className="bg-[#DF972B] hover:bg-[#c68223] text-white text-[11px] font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-all duration-200 hover:scale-[1.02]">
            <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 24 24">
              <path d="M12 2l2.5 7.5H22l-6.2 4.5 2.4 7.5-6.2-4.5-6.2 4.5 2.4-7.5-6.2-4.5h7.5z" />
            </svg>
            AI Stylist
          </button>

          {/* Heart Icon */}
          <button className="text-[#840B14]/65 hover:text-[#840B14] p-1.5 transition-colors hidden sm:block">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Bell Icon */}
          <button className="text-[#840B14]/65 hover:text-[#840B14] p-1.5 transition-colors hidden sm:block">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* Profile Badge */}
          <div className="w-8 h-8 rounded-full bg-[#840B14] flex items-center justify-center shadow-inner cursor-pointer hover:opacity-90">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </header>

      {/* 2. Main Center Body Wrapper */}
      <div className={`w-full ${step === 9 ? 'max-w-6xl' : 'max-w-3xl'} flex flex-col items-center transition-all duration-500`}>
        {/* Progress Tracker (Only visible during steps 1-8) */}
        {step <= 8 && (
          <div className="w-full px-2 mb-6">
            <div className="flex justify-between text-xs md:text-sm font-semibold text-[#840B14]/65 mb-2.5">
              <span>Step {step} of 8</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full h-1 bg-[#F6E6B6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#DF972B] transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* 3. The Quiz Card */}
        <div className="w-full bg-[#FFFBEC] rounded-[32px] border border-[#840B14]/12 p-6 md:p-8 lg:p-12 shadow-[0_16px_40px_rgba(132,11,20,0.05)] flex flex-col justify-between min-h-[440px] relative overflow-hidden transition-all duration-300">
          
          {step <= 8 && currentStepData ? (
            <>
              {/* Question Screen */}
              <div className="flex-1 flex flex-col">
                {/* Question title */}
                <div className="mb-8 text-left">
                  <h2 className="font-display text-2xl md:text-4xl text-[#840B14] font-medium tracking-tight leading-tight">
                    {currentStepData.title}
                  </h2>
                  {currentStepData.subtitle && (
                    <p className="text-xs md:text-sm text-[#840B14]/65 mt-2 font-medium">
                      {currentStepData.subtitle}
                    </p>
                  )}
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {currentStepData.options.map((opt) => {
                    const isSelected = currentStepData.isMulti
                      ? (answers[currentStepData.key] as string[]).includes(opt)
                      : selectedOption === opt || answers[currentStepData.key] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelect(currentStepData.key, opt, currentStepData.isMulti)}
                        className={`w-full text-left font-body text-base py-4 px-8 rounded-full border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#840B14]/5 border-[#840B14] border-2 font-semibold text-[#840B14] shadow-sm'
                            : 'bg-white border-[#ebd8b7] text-[#840B14] hover:bg-[#FFFBEC] hover:border-[#840B14]/40 shadow-[0_2px_4px_rgba(132,11,20,0.02)]'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#840B14]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-[#840B14]/10 mt-auto">
                <button
                  type="button"
                  onClick={handleBack}
                  style={{ visibility: step > 1 ? 'visible' : 'hidden' }}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#840B14]/65 hover:text-[#840B14] transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#D51927] hover:bg-[#b0121e] text-white text-sm font-semibold py-3.5 px-7 rounded-full flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  {currentStepData.isMulti ? (step === 8 ? 'Finish' : 'Continue') : 'Skip'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            /* Results Screen (Step 9) */
            <div className="flex-1 flex flex-col w-full">
              {/* Header */}
              <div className="text-center py-4 mb-8 style-dna-header">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#840B14]/10 text-[#840B14] mb-3 text-2xl animate-pulse-soft">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                <h2 className="font-display text-3xl md:text-5xl text-[#840B14] font-medium tracking-tight mb-2">
                  Your Style DNA is Ready!
                </h2>
                <p className="text-sm text-[#840B14]/75 max-w-xl mx-auto font-body">
                  We've calibrated your digital style profile and curated personalized wardrobe recommendations.
                </p>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
                
                {/* Left Column: Style DNA Card */}
                <div className="lg:col-span-4 flex flex-col bg-white border border-[#840B14]/12 rounded-3xl p-6 shadow-[0_4px_20px_rgba(132,11,20,0.02)] space-y-5 style-dna-card">
                  <div className="flex items-center justify-between border-b border-[#840B14]/10 pb-3">
                    <div>
                      <h3 className="font-display text-lg text-[#840B14] font-semibold">Style Twin Profile</h3>
                      <p className="text-[10px] font-semibold text-[#840B14]/55 tracking-wider uppercase mt-0.5">Calibrated coordinates</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#840B14]/5 text-[10px] font-bold text-[#840B14] uppercase tracking-wider">Active</span>
                  </div>

                  <div className="space-y-4 font-body text-sm">
                    {/* Dressing */}
                    <div>
                      <span className="text-[10px] font-semibold text-[#840B14]/55 uppercase tracking-wider block mb-0.5">Who You are Dressing</span>
                      <span className="font-medium text-[#840B14] flex items-center gap-1.5">
                        {answers.dressing === 'Male' ? 'Male' : 'Female'}
                      </span>
                    </div>

                    {/* Age Group */}
                    <div>
                      <span className="text-[10px] font-semibold text-[#840B14]/55 uppercase tracking-wider block mb-0.5">Age Range</span>
                      <span className="font-medium text-[#840B14]">{answers.ageRange || 'Not specified'}</span>
                    </div>

                    {/* Height */}
                    <div>
                      <span className="text-[10px] font-semibold text-[#840B14]/55 uppercase tracking-wider block mb-0.5">Height</span>
                      <span className="font-medium text-[#840B14]">{answers.height || 'Not specified'}</span>
                    </div>

                    {/* Body Shape */}
                    <div>
                      <span className="text-[10px] font-semibold text-[#840B14]/55 uppercase tracking-wider block mb-0.5">Body Shape</span>
                      <span className="font-medium text-[#840B14]">{answers.bodyShape || 'Not specified'}</span>
                    </div>

                    {/* Skin Tone */}
                    <div>
                      <span className="text-[10px] font-semibold text-[#840B14]/55 uppercase tracking-wider block mb-1">Skin Tone Match</span>
                      <div className="flex items-center gap-2">
                        {answers.skinTone && SKIN_TONE_COLORS[answers.skinTone] && (
                          <span
                            className="w-4 h-4 rounded-full border border-[#840B14]/20 shadow-sm"
                            style={{ backgroundColor: SKIN_TONE_COLORS[answers.skinTone] }}
                          />
                        )}
                        <span className="font-medium text-[#840B14]">{answers.skinTone || 'Not specified'}</span>
                      </div>
                    </div>

                    {/* Budget */}
                    <div>
                      <span className="text-[10px] font-semibold text-[#840B14]/55 uppercase tracking-wider block mb-0.5">Comfort Budget</span>
                      <span className="font-medium text-[#840B14]">{answers.budget || 'Not specified'}</span>
                    </div>

                    {/* Goals */}
                    <div>
                      <span className="text-[10px] font-semibold text-[#840B14]/55 uppercase tracking-wider block mb-0.5">Primary Style Goals</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {answers.fashionGoals.length > 0 ? (
                          answers.fashionGoals.map((goal) => (
                            <span key={goal} className="text-[11px] px-2 py-0.5 rounded bg-[#FFFDF6] border border-[#ebd8b7] text-[#840B14]/80 font-medium">
                              {goal}
                            </span>
                          ))
                        ) : (
                          <span className="text-[#840B14]/55 font-medium">None selected</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stamp Seal */}
                  <div className="pt-4 border-t border-[#840B14]/10 flex items-center justify-between text-[11px] text-[#840B14]/55 font-medium">
                    <span>Generated on {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="font-bold text-[#DF972B] tracking-widest uppercase">MUSE VERIFIED</span>
                  </div>
                </div>

                {/* Right Column: Curated Closet Showcase */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Aesthetics Tabs */}
                  <div className="flex flex-wrap gap-2 border-b border-[#840B14]/10 pb-3 style-dna-tabs">
                    {selectedAesthetics.map((aes) => {
                      const isActive = activeAestheticTab === aes;
                      return (
                        <button
                          key={aes}
                          type="button"
                          onClick={() => setActiveAestheticTab(aes)}
                          className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                            isActive
                              ? 'bg-[#840B14] text-white shadow-md'
                              : 'bg-white border border-[#ebd8b7] text-[#840B14]/70 hover:text-[#840B14] hover:border-[#840B14]'
                          }`}
                        >
                          {aes}
                        </button>
                      );
                    })}
                  </div>

                  {/* Outfit Clothes Grid */}
                  <div>
                    {activeAestheticTab && (
                      (() => {
                        const folderName = getFolderKey(answers.dressing, activeAestheticTab);
                        const clothes = OUTFIT_IMAGES[folderName] || [];

                        if (clothes.length === 0) {
                          return (
                            <div className="text-center py-12 text-[#840B14]/50 font-body text-sm">
                              No recommendations found for this combination.
                            </div>
                          );
                        }

                        return (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {clothes.map((imgSrc, idx) => (
                              <div
                                key={imgSrc}
                                onClick={() => {
                                  setSelectedDetailImage(imgSrc);
                                  setIsTryOnSimulating(false);
                                  setTryOnSuccess(false);
                                }}
                                className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#840B14]/15 bg-white cursor-pointer shadow-[0_4px_12px_rgba(132,11,20,0.02)] hover:shadow-[0_12px_24px_rgba(132,11,20,0.08)] hover:scale-[1.03] hover:border-[#840B14]/30 transition-all duration-300 style-dna-grid-item"
                              >
                                <img
                                  src={imgSrc}
                                  alt={`${activeAestheticTab} curation ${idx + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  loading="lazy"
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#840B14]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                  <span className="text-xs font-semibold text-white uppercase tracking-wider">Look {idx + 1}</span>
                                  <span className="text-[10px] text-white/80 font-medium mt-0.5">Click to view detail</span>
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

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-[#840B14]/10 w-full mt-10">
                <button
                  type="button"
                  onClick={() => {
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
                  }}
                  className="w-full sm:w-auto text-xs font-bold uppercase tracking-wider text-[#840B14]/70 hover:text-[#840B14] py-3.5 px-6 rounded-full border border-[#ebd8b7] text-center transition-colors cursor-pointer bg-white"
                >
                  Restart Quiz
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full sm:w-auto bg-[#840B14] hover:bg-[#66050b] text-white text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-full text-center shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                >
                  Save DNA & Exit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Outfit Detail Lightbox Overlay */}
      {selectedDetailImage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#840B14]/40 backdrop-blur-md transition-opacity duration-300 animate-fade-in">
          {/* Backdrop click close */}
          <div className="absolute inset-0 cursor-default" onClick={() => setSelectedDetailImage(null)} />
          
          <div className="relative z-10 w-full max-w-4xl bg-[#FFFBEC] border border-[#840B14]/20 rounded-[32px] overflow-hidden shadow-[0_24px_50px_rgba(132,11,20,0.15)] flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedDetailImage(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#840B14] flex items-center justify-center border border-[#840B14]/10 transition-colors shadow-sm cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left side: Image View */}
            <div className="w-full md:w-1/2 bg-white flex items-center justify-center relative min-h-[300px] md:min-h-0 overflow-hidden">
              <img
                src={selectedDetailImage}
                alt="Selected curation look"
                className="w-full h-full object-cover object-center max-h-[45vh] md:max-h-none"
              />
              
              {/* Laser scanning beam overlay */}
              {isTryOnSimulating && (
                <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#DF972B] to-transparent shadow-[0_0_10px_#DF972B,0_0_20px_#DF972B] animate-scanner z-10" />
              )}
              
              {isTryOnSimulating && (
                <div className="absolute inset-0 bg-[#840B14]/30 flex flex-col items-center justify-center text-white px-6 z-20">
                  {/* Glassmorphic card */}
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg w-full max-w-[280px] animate-fade-in">
                    <div className="relative w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin mb-4" />
                    <span className="text-xs font-semibold tracking-wider uppercase animate-pulse mb-1">AI Fitting Engine</span>
                    <span className="text-[10px] text-white/80">{tryOnStepText}</span>
                  </div>
                </div>
              )}

              {tryOnSuccess && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-4 z-20">
                  {/* Close tryon view button */}
                  <button
                    onClick={() => setTryOnSuccess(false)}
                    className="absolute top-4 left-4 text-xs font-semibold uppercase tracking-wider bg-[#840B14] hover:bg-[#66050b] text-white px-3 py-1.5 rounded-full shadow-md cursor-pointer transition-colors"
                  >
                    View Original
                  </button>
                  <img
                    src="/outfits/tryon-preview.png"
                    alt="AI Virtual Try On Twin Preview"
                    className="w-full h-full object-cover object-top animate-fade-in"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 text-[#840B14] border border-[#840B14]/15 shadow-lg">
                    <h4 className="font-display font-bold text-sm">Virtual Try-On Complete</h4>
                    <p className="text-[11px] text-[#840B14]/75 mt-0.5 leading-relaxed font-body">
                      Successfully projected onto your profile. Perfect drape alignment detected.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right side: Look details & actions */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between overflow-y-auto">
              <div>
                <span className="text-[10px] font-bold text-[#DF972B] uppercase tracking-widest block mb-1">
                  Curation Details
                </span>
                <h3 className="font-display text-2xl md:text-3xl text-[#840B14] font-medium leading-tight mb-4">
                  {activeAestheticTab} Capsule Look
                </h3>
                
                <p className="text-sm text-[#840B14]/80 leading-relaxed font-body mb-6">
                  This outfit has been digitally selected to match your <strong>{answers.skinTone}</strong> skin tone and compliment a <strong>{answers.bodyShape}</strong> shape. The tailoring is optimized for your {answers.height} height profile.
                </p>

                <div className="space-y-4 border-t border-[#840B14]/10 pt-5">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#840B14]/5 text-[#840B14] flex items-center justify-center text-xs font-bold font-body">✓</span>
                    <span className="text-xs font-medium text-[#840B14]/75">Handpicked premium style matches</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#840B14]/5 text-[#840B14] flex items-center justify-center text-xs font-bold font-body">✓</span>
                    <span className="text-xs font-medium text-[#840B14]/75">Drapes mapped for {answers.bodyShape} body shapes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#840B14]/5 text-[#840B14] flex items-center justify-center text-xs font-bold font-body">✓</span>
                    <span className="text-xs font-medium text-[#840B14]/75">Sourced within your comfort budget</span>
                  </div>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="mt-8 space-y-3">
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
                  className="w-full bg-[#840B14] hover:bg-[#66050b] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-full shadow-md text-center cursor-pointer transition-colors"
                >
                  {isTryOnSimulating ? "Processing fitting..." : "Virtual Try-On (AI)"}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDetailImage(null);
                    closeModal();
                    // Go to shop section by triggering shop modal
                    useOutfitStore.getState().setActiveModal('shop');
                  }}
                  className="w-full bg-white hover:bg-[#FFFDF6] border border-[#ebd8b7] text-[#840B14] font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-full text-center cursor-pointer transition-colors"
                >
                  Shop Similar Styles
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
