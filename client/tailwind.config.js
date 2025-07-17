/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enables dark mode support
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      xs: ['12px', '16px'],
      sm: ['14px', '20px'],
      base: ['16px', '24px'],
      lg: ['18px', '26px'],
      xl: ['20px', '28px'],
      '2xl': ['24px', '32px'],
      '3xl': ['30px', '40px'],
      '4xl': ['36px', '48px'],
      '5xl': ['48px', '60px'],
    },
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: "#1E293B", // Dark Blue Gray
        secondary: "#64748B", // Soft Gray Blue
        accent: "#14B8A6", // Teal for highlights
        background: "#0F172A", // Dark background
        foreground: "#F1F5F9", // Light foreground text
        card: "#1E293B", // Darker card backgrounds
        "muted-gray": "#94A3B8", // Muted text
      },
      boxShadow: {
        xl: "0 10px 25px rgba(0, 0, 0, 0.2)",
        "inner-md": "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
      },
      backgroundImage: {
        "hero-pattern": "url('/assets/bg-pattern.svg')",
      },
      screens: {
        "3xl": "1600px",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
