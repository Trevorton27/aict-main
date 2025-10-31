// apps/web/tailwind.config.ts

import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Next-gen IDE theme colors (dark mode)
        ide: {
          bg: '#111418',
          panel: '#14161A',
          editor: '#0D0F11',
          header: '#181B20',
          elevated: '#1C1F24',
        },
        // Modern light theme palette
        light: {
          bg: '#F8FAFB',
          panel: '#FFFFFF',
          card: '#FFFFFF',
          border: '#E2E6EA',
          'header-start': '#FFFFFF',
          'header-end': '#F3F5F7',
        },
        accent: {
          green: '#00FF99',
          'green-light': '#00C47A',
          'green-glow': '#00FF99',
          purple: '#9B5CF6',
          'purple-light': '#7B5AF0',
          'purple-glow': '#9B5CF6',
          indigo: '#6366F1',
          lavender: '#F2EDFF',
          mint: '#00C47A',
        },
        text: {
          primary: '#E9ECF1',
          secondary: '#C8CCD2',
          muted: '#8B9199',
          'light-heading': '#1E1E1E',
          'light-body': '#50565E',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          850: '#1a2332',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Monaco', 'Courier New', 'monospace'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out',
        'slideIn': 'slideIn 0.2s ease-out',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'card-lift': 'cardLift 0.2s ease-out',
        'fade-slide-in': 'fadeSlideIn 0.15s ease-out',
        'progress-line': 'progressLine 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(155, 92, 246, 0.5)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 30px rgba(155, 92, 246, 0.8)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        cardLift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-4px)' },
        },
        fadeSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        progressLine: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(0, 255, 153, 0.3)',
        'glow-purple': '0 0 20px rgba(155, 92, 246, 0.3)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'card-light': '0 1px 4px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
        'subtle': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'inset': 'inset 0 1px 2px rgba(0, 0, 0, 0.06)',
        'button-light': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'glow-green-light': '0 0 16px rgba(0, 196, 122, 0.3)',
        'glow-purple-light': '0 0 16px rgba(123, 90, 240, 0.4)',
      },
      backdropBlur: {
        'frosted': '12px',
      },
    },
  },
  plugins: [],
};

export default config;