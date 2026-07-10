import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useOutfitStore } from '../store/useOutfitStore';

export default function StylistModal() {
  const activeModal = useOutfitStore((s) => s.activeModal);
  const closeModal = useOutfitStore((s) => s.closeModal);
  const modalRef = useRef<HTMLDivElement>(null);

  const isOpen = activeModal === 'stylist';

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'm Four Plus Four, your AI Stylist. Tell me about your upcoming occasion, aesthetic goals, or ask how to pair items in your closet!" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

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

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMsgs = [...messages, { role: 'user', text: query }];
    setMessages(newMsgs);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let responseText = "That's a great choice! For that look, I recommend pairing tailored high-waisted wide-leg trousers with a structured blazer and subtle warm gold jewelry.";
      if (query.toLowerCase().includes('wedding')) {
        responseText = "For an outdoor wedding, a bias-cut bronze silk midi dress paired with cream block heels and gold drop earrings is effortlessly chic while staying in your Warm Autumn palette.";
      } else if (query.toLowerCase().includes('cargo') || query.toLowerCase().includes('casual')) {
        responseText = "Match your cream cargo set with an oversized black hoodie or a fitted ribbed crop top. Complete with minimal white sneakers.";
      }

      setMessages([...newMsgs, { role: 'ai', text: responseText }]);
      setIsTyping(false);
    }, 1200);
  };

  const prompts = [
    'Style me for a summer wedding',
    'What goes with cream cargo pants?',
    'Find my color palette',
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto"
      style={{ opacity: 0 }}
      ref={modalRef}
    >
      <div className="fixed inset-0 bg-bg/95 backdrop-blur-2xl" onClick={closeModal} />

      <div className="relative z-10 w-full max-w-2xl bg-bg-card border border-border-medium rounded-3xl p-6 md:p-8 text-text-primary shadow-2xl flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-muted flex items-center justify-center text-accent font-bold text-xs">
              ✦
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">Four Plus Four AI Stylist</h2>
              <span className="text-xs text-text-tertiary">Personalized fashion recommendations 24/7</span>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary"
          >
            ✕
          </button>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-text-primary text-bg rounded-br-md'
                    : 'bg-bg-elevated border border-border-subtle text-text-secondary rounded-bl-md'
                }`}
              >
                {msg.role === 'ai' && (
                  <span className="block text-[10px] text-accent font-medium uppercase tracking-wider mb-1">
                    Four Plus Four
                  </span>
                )}
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-bg-elevated border border-border-subtle rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-pulse-soft" />
                <span className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-pulse-soft" style={{ animationDelay: '0.3s' }} />
                <span className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-pulse-soft" style={{ animationDelay: '0.6s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 border-t border-border-subtle flex-shrink-0">
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              className="text-xs text-text-secondary bg-bg-elevated border border-border-subtle hover:border-accent/40 rounded-full px-3 py-1.5 flex-shrink-0 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-2 flex gap-2 flex-shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about outfits, colors, occasions..."
            className="flex-1 bg-bg-elevated border border-border-subtle rounded-full px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50"
          />
          <button type="submit" className="btn-primary text-xs px-5">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
