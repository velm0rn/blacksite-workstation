/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      colors: {
        void: '#050709',
        panel: '#0a0e13',
        panelAlt: '#0e141b',
        neon: '#00ff88',
        cyanIntel: '#00d4ff',
        amberWarn: '#ffb020',
        crimsonAlert: '#ff3355',
      },
    },
  },
  plugins: [],
};