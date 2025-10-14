/** @type {import('tailwindcss').Config} */
module.exports = {
  ...require('@dsu/tailwind-config'),
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [
    ...require('@dsu/tailwind-config').plugins,
    require('tailwindcss-animate'),
  ],
};
