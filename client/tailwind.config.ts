import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0A0A0F',
          secondary: '#111118',
          tertiary: '#1A1A24',
        },
        surface: {
          DEFAULT: '#111118',
          elevated: '#1A1A24',
        },
        brand: {
          DEFAULT: '#7C3AED',
          hover: '#6D28D9',
          glow: 'rgba(124, 58, 237, 0.15)',
        },
        foreground: {
          DEFAULT: '#F8F8FF',
          secondary: '#A0A0B0',
          muted: '#606070',
        },
        border: 'rgba(255,255,255,0.08)',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(to top, #0A0A0F 0%, rgba(10,10,15,0.6) 50%, rgba(124,58,237,0.3) 100%)',
        'card-gradient':
          'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(17,17,24,0.9) 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
