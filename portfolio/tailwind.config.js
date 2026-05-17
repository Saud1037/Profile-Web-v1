/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          primary: '#080c14',
          secondary: '#0d1117',
          tertiary: '#111827',
        },
        surface: {
          DEFAULT: '#0f1923',
          2: '#162030',
          3: '#1c2a3a',
        },
        border: {
          DEFAULT: '#1e3a4a',
          2: '#2a4a60',
        },
        cyan: {
          DEFAULT: '#00d4ff',
          2: '#00a8cc',
          glow: 'rgba(0,212,255,0.15)',
        },
        neon: {
          green: '#00ff88',
          purple: '#a855f7',
        },
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s step-end infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        glow: {
          from: { boxShadow: '0 0 10px rgba(0,212,255,0.3)' },
          to: { boxShadow: '0 0 25px rgba(0,212,255,0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
