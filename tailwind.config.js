/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,mdx}"],
  theme: { extend: {} },
  // typography: styles the `prose` classes used on guides and articles
  plugins: [require("@tailwindcss/typography")],
};
