/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FFF3D1',
        burgundy: '#840B14',
        'amber-gold': '#DF972B',
        blush: '#FEA3DC',
        'fashion-red': '#D51927',
        'card-surface': '#FFFBEC',
        'neutral-surface': '#F6E6B6',
        'subtle-label': '#7A5A1B',
        'focus-outline': '#DF972B',
        'hairline-border': 'rgba(132, 11, 20, 0.14)',

        // Unified Design Tokens mapped to the strict palette
        bg: '#FFF3D1',
        'bg-card': '#FFFBEC',
        'bg-elevated': '#F6E6B6',
        'bg-glass': 'rgba(255, 255, 255, 0.55)',
        'border-subtle': 'rgba(132, 11, 20, 0.14)',
        'border-medium': 'rgba(132, 11, 20, 0.28)',
        'text-primary': '#840B14',
        'text-secondary': 'rgba(132, 11, 20, 0.75)',
        'text-tertiary': 'rgba(132, 11, 20, 0.55)',
        accent: '#840B14',
        'accent-hover': '#66050b',
        'accent-muted': 'rgba(132, 11, 20, 0.06)',
        'accent-border': 'rgba(132, 11, 20, 0.2)',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 60px -20px rgba(132, 11, 20, 0.18)',
        glow: '0 30px 80px -30px rgba(223, 151, 43, 0.55)',
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'section': ['clamp(1.75rem, 3.5vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
