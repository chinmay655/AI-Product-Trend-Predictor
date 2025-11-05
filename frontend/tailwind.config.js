module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
