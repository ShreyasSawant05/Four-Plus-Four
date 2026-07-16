import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useOutfitStore } from '../store/useOutfitStore';

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

  if (!isOpen) return null;

  const stepsData = [
    {
      key: 'dressing' as keyof Answers,
      title: 'Who are you dressing?',
      options: ['Woman', 'Man', 'Non-binary', 'Prefer not to say'],
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
      options: ['Under $50', '$50–$150', '$150–$400', '$400+'],
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
      options: ['Old Money', 'Coquette', 'Y2K', 'Streetwear', 'Dark Academia', 'Cottagecore', 'Clean Girl', 'Korean Minimalist', 'Boho', 'Indie'],
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
      <div className="w-full max-w-3xl flex flex-col items-center">
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
        <div className="w-full bg-[#FFFBEC] rounded-[32px] border border-[#840B14]/12 p-6 md:p-12 shadow-[0_16px_40px_rgba(132,11,20,0.05)] flex flex-col justify-between min-h-[440px] relative overflow-hidden transition-all duration-300">
          
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
            <div className="flex-1 flex flex-col justify-between">
              <div className="text-center py-6">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#840B14]/10 text-[#840B14] mb-4 text-3xl">
                  ✨
                </span>
                <h2 className="font-display text-3xl md:text-4xl text-[#840B14] font-medium tracking-tight mb-3">
                  Your Style DNA is Ready!
                </h2>
                <p className="text-sm text-[#840B14]/70 max-w-md mx-auto mb-8">
                  We've calibrated your personal style twin based on your preferences.
                </p>

                {/* Profile Summary Card */}
                <div className="bg-[#FFFDF6] border border-[#ebd8b7] rounded-3xl p-6 md:p-8 max-w-xl mx-auto shadow-sm text-left space-y-4">
                  <div className="flex items-center justify-between border-b border-[#840B14]/10 pb-3">
                    <span className="text-[10px] font-bold tracking-widest text-[#DF972B] uppercase">Digital Twin Coordinates</span>
                    <span className="px-2 py-0.5 rounded bg-[#840B14]/5 text-[10px] font-bold text-[#840B14]">Active</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[10px] font-semibold text-[#840B14]/55 uppercase block">Dressing Profile</span>
                      <span className="font-medium text-[#840B14]">{answers.dressing || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-[#840B14]/55 uppercase block">Age Group</span>
                      <span className="font-medium text-[#840B14]">{answers.ageRange || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-[#840B14]/55 uppercase block">Height Dimension</span>
                      <span className="font-medium text-[#840B14]">{answers.height || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-[#840B14]/55 uppercase block">Body Alignment</span>
                      <span className="font-medium text-[#840B14]">{answers.bodyShape || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-[#840B14]/55 uppercase block">Harmonized Skin Tone</span>
                      <span className="font-medium text-[#840B14]">{answers.skinTone || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-[#840B14]/55 uppercase block">Comfort Budget</span>
                      <span className="font-medium text-[#840B14]">{answers.budget || 'Not specified'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] font-semibold text-[#840B14]/55 uppercase block">Fashion Goals</span>
                      <span className="font-medium text-[#840B14]">
                        {answers.fashionGoals.length > 0 ? answers.fashionGoals.join(', ') : 'Not specified'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] font-semibold text-[#840B14]/55 uppercase block">Favored Aesthetics</span>
                      <span className="font-medium text-[#840B14]">
                        {answers.aesthetics.length > 0 ? answers.aesthetics.join(', ') : 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 border-t border-[#840B14]/10 w-full mt-auto">
                <button
                  type="button"
                  onClick={() => {
                    // Reset to step 1
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
                  }}
                  className="w-full sm:w-auto text-xs font-bold uppercase tracking-wider text-[#840B14]/70 hover:text-[#840B14] py-3.5 px-6 rounded-full border border-[#ebd8b7] text-center transition-colors cursor-pointer"
                >
                  Restart Quiz
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full sm:w-auto bg-[#840B14] hover:bg-[#66050b] text-white text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-full text-center shadow-md transition-all hover:scale-[1.02]"
                >
                  Explore My Recommendations
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
