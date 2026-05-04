import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0E1116',
        surface: '#16191F',
        'surface-2': '#1E222A',
        'surface-3': '#262B36',
        line: '#2A3040',
        'line-soft': '#1F242E',
        ink: '#F5F2E8',
        'ink-soft': '#C7C3B6',
        muted: '#7A7E8C',
        accent: '#FF5722',
        'accent-soft': 'rgba(255, 87, 34, 0.12)',
        gold: '#E8B547',
        'gold-soft': 'rgba(232, 181, 71, 0.15)',
        'green-q': '#6FBF73',
        'green-soft': 'rgba(111, 191, 115, 0.15)',
        'blue-q': '#6BA4D8',
        'blue-soft': 'rgba(107, 164, 216, 0.15)',
      },
      fontFamily: {
        korean: ['var(--font-pretendard)', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      animation: {
        'bar-grow': 'barGrow 1.2s cubic-bezier(0.34, 1.2, 0.64, 1) forwards',
        'view-fade': 'viewFade 0.3s ease-out',
        'bubble-in': 'bubbleIn 0.3s cubic-bezier(0.34, 1.2, 0.64, 1)',
        'dot-pulse': 'dotPulse 1s infinite',
        'dot-bounce': 'dotBounce 1.2s infinite',
      },
      keyframes: {
        barGrow: {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        viewFade: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        bubbleIn: {
          from: { opacity: '0', transform: 'translateY(6px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        dotPulse: {
          '0%, 60%, 100%': { opacity: '0.3' },
          '30%': { opacity: '1' },
        },
        dotBounce: {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-4px)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
