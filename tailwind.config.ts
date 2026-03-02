import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0F1117',
        surface: '#1C1C1C',
        'surface-2': '#242424',
        'surface-3': '#2C2C2C',
        border: '#2D2D2D',
        'text-primary': '#F0F0F0',
        'text-secondary': '#9B9B9B',
        'text-muted': '#555555',
        accent: {
          DEFAULT: '#3ECF8E',
          light: '#5DDBA0',
          dark: '#2EAF73',
          glow: 'rgba(62, 207, 142, 0.15)',
        },
        violet: '#9747FF',
        cyan: '#22D3EE',
        green: '#3ECF8E',
        amber: '#F59E0B',
        red: '#F04438',
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
        'accent': '0 0 20px rgba(62, 207, 142, 0.2)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.5)',
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
