/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1173D4',
        'primary-dark': '#0B5AA8',
        'primary-light': '#2E93F7',
        navy: '#0B2C5F',
        'navy-dark': '#061B3B',
        'navy-darker': '#0E1B33',
        'light-blue': '#EDF4FD',
        'light-gray': '#E3E9F2',
        'text-primary': '#000000',
        'text-secondary': '#1A1A1A',
        'text-tertiary': '#333333',
        'text-muted': '#666666',
        border: '#D5DFEC',
        'accent-blue': '#123C7E',
        'accent-gold': '#F2B705',
      },
      borderRadius: {
        button: '10px',
        card: '10px',
        lg: '12px',
      },
      boxShadow: {
        light: 'rgba(6, 27, 59, 0.3) 0px 12px 38px 0px',
        medium: 'rgba(0, 0, 0, 0.5) 0px 4px 18px 0px',
        deep: 'rgba(6, 27, 59, 0.3) 0px 12px 38px 0px',
        'shadow-lg': 'rgba(0, 38, 96, 0.22) 0px 16px 36px 0px',
        'shadow-xl': 'rgba(6, 27, 59, 0.16) 0px 18px 48px 0px',
      },
      spacing: {
        'section-xs': '40px',
        'section-sm': '60px',
        'section-md': '80px',
        'section-lg': '100px',
      },
      fontSize: {
        'h1': ['40px', { lineHeight: '1.15', fontWeight: '700', letterSpacing: '-0.4px', fontFamily: 'Poppins' }],
        'h2': ['28px', { lineHeight: '1.25', fontWeight: '800', letterSpacing: '-0.2px', fontFamily: 'Poppins' }],
        'h3': ['19px', { lineHeight: '1.4', fontWeight: '700', fontFamily: 'Poppins' }],
        'h4': ['16px', { lineHeight: '1.3', fontWeight: '700', fontFamily: 'Poppins' }],
        'body': ['15px', { lineHeight: '1.6', fontWeight: '400', fontFamily: 'Barlow' }],
        'body-sm': ['13px', { lineHeight: '1.5', fontWeight: '400', fontFamily: 'Barlow' }],
        'small': ['12px', { lineHeight: '1.5', fontWeight: '400', fontFamily: 'Barlow' }],
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        barlow: ['Barlow', 'sans-serif'],
        sans: ['Barlow', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
