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
        'text-primary': '#0B2C5F',
        'text-secondary': '#4A5A73',
        'text-tertiary': '#667085',
        'text-muted': '#767676',
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
        'h1': ['34px', { lineHeight: '1.14', fontWeight: '700', letterSpacing: '-0.4px', fontFamily: 'Poppins' }],
        'h2': ['21px', { lineHeight: '1.25', fontWeight: '800', letterSpacing: '-0.2px', fontFamily: 'Poppins' }],
        'h3': ['15px', { lineHeight: '1.4', fontWeight: '800', fontFamily: 'Poppins' }],
        'h4': ['14px', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }],
        'body': ['14px', { lineHeight: '1.6', fontWeight: '400', fontFamily: 'Barlow' }],
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
