import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0D14',
        surface: '#12151F',
        'surface-2': '#181D2E',
        'surface-3': '#1E2438',
        border: '#252D42',
        'text-primary': '#E8EDF8',
        'text-secondary': '#8B95B0',
        'text-muted': '#4B5570',
        accent: {
          DEFAULT: '#7C6FFF',
          light: '#A599FF',
          dark: '#6057CC',
          glow: 'rgba(124, 111, 255, 0.15)',
        },
        violet: '#9747FF',
        cyan: '#22D3EE',
        green: '#10B981',
        amber: '#F59E0B',
        red: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-card': 'linear-gradient(135deg, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'accent': '0 0 20px rgba(124, 111, 255, 0.2)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
