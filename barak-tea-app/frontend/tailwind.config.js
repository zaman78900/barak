/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'barak': {
          'bg': '#0D0905',
          'surface': '#1A110A',
          'card': '#221508',
          'border': '#3A2415',
          'gold': '#C8922A',
          'gold-light': '#E8B84B',
          'gold-dim': '#8A6118',
          'cream': '#FAF3E0',
          'muted': '#9E8C78',
          'success': '#2D7A4F',
          'error': '#C0392B',
          'warning': '#D4870A',
          'info': '#2563EB',
          'whatsapp': '#25D366',
        }
      },
      backdropBlur: {
        'glass': '12px',
      },
      fontFamily: {
        'inter':      ['Inter', 'sans-serif'],
        'playfair':   ['Playfair Display', 'Georgia', 'serif'],
        'bebas':      ['Bebas Neue', 'Impact', 'sans-serif'],
        'dmsans':     ['DM Sans', 'sans-serif'],
        'cormorant':  ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      fontSize: {
        'display': ['clamp(64px, 12vw, 120px)', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        'h1': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(250, 243, 224, 0.1)',
        'glass-hover': '0 12px 48px rgba(200, 146, 42, 0.15), inset 0 1px 0 rgba(250, 243, 224, 0.15)',
      },
      borderRadius: {
        'glass': '16px',
        'pill': '24px',
      },
      animation: {
        'fadeUp': 'fadeUp 0.6s ease-out forwards',
        'slideIn': 'slideIn 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'scroll-indicator': 'bounce 2s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      transitionDuration: {
        '350': '350ms',
      },
      spacing: {
        'gutter': '24px',
      },
      maxWidth: {
        'screen-xl': '1440px',
      },
    },
  },
  plugins: [],
}
