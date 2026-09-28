/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0052CC',
        'primary-dark': '#0041A3',
        navy: '#0A1F3C',
        'navy-dark': '#001A38',
        'light-blue': '#F8FAFC',
        'light-gray': '#F0F4F8',
        'text-primary': '#1A2B4A',
        'text-secondary': '#5A6B7D',
        'text-tertiary': '#7A8A9D',
        border: '#D8DFE8',
        'accent-blue': '#0066FF',
      },
      borderRadius: {
        button: '8px',
        card: '8px',
        lg: '12px',
      },
      boxShadow: {
        light: '0 2px 8px rgba(0, 0, 0, 0.08)',
        medium: '0 4px 12px rgba(0, 0, 0, 0.12)',
        deep: '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
      spacing: {
        'section-xs': '40px',
        'section-sm': '60px',
        'section-md': '80px',
        'section-lg': '100px',
      },
      fontSize: {
        'h1': ['56px', { lineHeight: '1.1', fontWeight: '800', letterSpacing: '-0.02em' }],
        'h2': ['40px', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['20px', { lineHeight: '1.2', fontWeight: '600' }],
        'h4': ['14px', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
