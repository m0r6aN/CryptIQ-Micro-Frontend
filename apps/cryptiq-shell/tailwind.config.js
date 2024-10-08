/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/cryptiq-shell/**/*.{js,jsx,ts,tsx}',  // Scan all JS and TS files inside cryptiq-shell for Tailwind classes
    './apps/cryptiq-shell/features/**/*.{js,jsx,ts,tsx}',  // Include new feature directories
    './apps/cryptiq-shell/shared/**/*.{js,jsx,ts,tsx}',  // Include shared components
    './apps/cryptiq-shell/app/**/*.{js,jsx,ts,tsx}',  // Include Next.js pages, layout, etc.
  ],
  theme: {
    extend: {
      // Extend your theme here if you have any custom styles (optional)
    },
  },
  plugins: [
    // Add Tailwind plugins here if needed (like forms, typography, etc.)
  ],
};

/*
Example of Extending the Theme (Optional)
theme: {
  extend: {
    colors: {
      primary: '#1D4ED8', // Custom primary blue color
      secondary: '#9333EA', // Custom secondary purple color
    },
  },
},

Installing Plugins (Optional)
If you want to use plugins like forms or typography, install them first:

npm install @tailwindcss/forms @tailwindcss/typography

Then add them to your config:

plugins: [
  require('@tailwindcss/forms'),
  require('@tailwindcss/typography'),
],

*/