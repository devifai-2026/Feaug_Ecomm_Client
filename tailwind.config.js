/** @type {import('tailwindcss').Config} */
export default {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
         'passenger': ['Passenger Display', 'sans-serif'],
          'poppins': ['Poppins', 'sans-serif'],
    },
  },
  },
  plugins: [],
}

